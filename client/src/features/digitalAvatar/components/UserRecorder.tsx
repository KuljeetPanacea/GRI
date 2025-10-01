import axios from "axios";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { setSelectedAvatar } from "../../../redux/DigitalAvatarSlice";
import useDigitalAvatar from "../useDigitalAvatar";
interface UserRecorderProps {
  onTextCaptured?: (text: string) => void;
  isRecording?: boolean;
}
const UserRecorder = forwardRef<
  { startRecording: () => Promise<void>; stopRecording: () => void },
  UserRecorderProps
>(({ onTextCaptured = () => {}, isRecording = false }, ref) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCurrentlyRecording, setIsCurrentlyRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const ttsFrequencySignature = [500, 1000, 1500]; // Example frequencies of TTS output
  const threshold = 150;
  const { dispatch } = useDigitalAvatar();
  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
  }));
  const validateAudioBuffer = async (audioBlob: Blob): Promise<boolean> => {
    const audioContext = new (window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const sumSquares = channelData.reduce(
      (sum, sample) => sum + sample * sample,
      0
    );
    const rms = Math.sqrt(sumSquares / channelData.length);
    audioContext.close();
    const minRmsThreshold = 0.02;
    return rms > minRmsThreshold;
  };
  const processAudioData = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    // Check if audio matches TTS signature
    const isTTSDetected = ttsFrequencySignature.some((freq) => {
      const index = Math.round(
        (freq / (audioContextRef.current?.sampleRate || 44100)) * bufferLength
      );
      return dataArray[index] > threshold;
    });
    // Check for silence
    const isSilent = dataArray.every((value) => value < threshold - 50);
    if (isTTSDetected) {
      // console.log("TTS audio detected, ignoring microphone input.");
    } else if (!isSilent) {
      clearTimeout(silenceTimeoutRef.current!);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "inactive"
      ) {
        audioChunksRef.current = [];
        // console.log("Starting recording");
        mediaRecorderRef.current.start();
      }
    } else if (
      isSilent &&
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      silenceTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
      }, 1000);
    }
    // Continue monitoring audio
    animationFrameRef.current = requestAnimationFrame(processAudioData);
  };
  const startRecording = useCallback(async () => {
    // Prevent multiple simultaneous recordings
    if (isCurrentlyRecording) {
      console.log("Already recording, skipping start request");
      return;
    }
    try {
      console.log("Starting recording...");
      setIsCurrentlyRecording(true);
      isRecordingRef.current = true;

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });
      streamRef.current = audioStream;
      // Create audio context and analyzer
      audioContextRef.current = new (window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      // Connect audio source
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(audioStream);
      sourceRef.current.connect(analyserRef.current);
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(audioStream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunksRef.current = [];
      // Set up data handler
      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log("Data available event triggered, size:", event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      // Set up stop handler
      mediaRecorderRef.current.onstop = async () => {
        console.log(
          "MediaRecorder stopped, chunks:",
          audioChunksRef.current.length
        );
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          try {
            const isValidAudio = await validateAudioBuffer(audioBlob);
            if (!isValidAudio) {
              console.log("Audio validation failed, discarding");
              audioChunksRef.current = [];
              return;
            }
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.wav");

            const response = await axios.post(
              "/python-model/speech-to-text",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            audioChunksRef.current = [];
            if (response.data) {
              onTextCaptured(response.data);
            }
          } catch (error) {
            console.error("Error uploading audio:", error);
          }
        }
      };
      // Start monitoring audio
      animationFrameRef.current = requestAnimationFrame(processAudioData);
    } catch (error) {
      setIsCurrentlyRecording(false);
      isRecordingRef.current = false;
      if (error instanceof Error) handleAudioError(error);
    }
  }, [isCurrentlyRecording, onTextCaptured]);
  const handleAudioError = (error: Error) => {
    console.error("Audio error:", error);
    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      setErrorMessage(
        "Microphone access denied. Please allow microphone permissions to use this feature."
      );
    } else if (error.name === "NotFoundError") {
      setErrorMessage("No microphone found. Please check your hardware.");
    } else {
      setErrorMessage(
        "An error occurred during audio processing: " + error.message
      );
    }
  };
  const stopRecording = useCallback(() => {
    if (!isCurrentlyRecording) {
      console.log("Not currently recording, skipping stop request");
      return;
    }
    console.log("Stopping recording...");
    setIsCurrentlyRecording(false);
    isRecordingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [isCurrentlyRecording]);
  // Effect: handle `isRecording` prop
  useEffect(() => {
    if (isRecording && !isCurrentlyRecording) {
      startRecording();
    } else if (!isRecording && isCurrentlyRecording) {
      stopRecording();
    }
  }, [isRecording, isCurrentlyRecording]);
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(setSelectedAvatar("manual"));
      if (isRecordingRef.current) {
        isRecordingRef.current = false;
      }
      
      // Clean up all resources
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      
      // Clear audio chunks
      audioChunksRef.current = [];
    };
  }, [dispatch]);
  if (errorMessage) {
    alert(errorMessage);
  }
  return null;
});
export default UserRecorder;
