import { useState, useEffect, useRef } from "react";
import useAxios from "../../api/useAxios";
import {
  addResponse,
  chatgptResponse,
  evaluateQstnrThunk,
  NextQuestion,
  removeResponse,
  setQuestion,
  setResponses,
  setSelectedAvatar,
  toggleRecording,
} from "../../redux/DigitalAvatarSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../redux/store";
import { useMediaQuery } from "@mui/material";
import { getSignedUrlAPI, storeUserResponse } from "../../api/project";
import axios from "axios";
import { selectAssessmentId } from "../../redux/assessmentSlice";
import { useDecDocuments } from "../AuditProjectFlow/phases/Scoping/useDceDocuments";
import { uploadEvidence } from "../../api/digitalAvatar";
import { useNavigate } from "react-router-dom";

const useDigitalAvatar = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const axiosInstance = useAxios();
  const { onFileChange } = useDecDocuments();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [userSpeech, setUserSpeech] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [pendingNextQuestion, setPendingNextQuestion] =
    useState<boolean>(false);
  const [currentIntent, setCurrentIntent] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const [readOnlyQuestions, setReadOnlyQuestions] = useState<NextQuestion[]>([]);
  const selectedQSTNR = useAppSelector(
    (state: RootState) => state.projectManagement.selectedQstnr
  );
  const selectedTask = useSelector(
    (state: RootState) => state.projectManagement.selectedTask
  );
  // Reference to the UserRecorder instance
  const recorderRef = useRef<{
    startRecording: () => Promise<void>;
    stopRecording: () => void;
  } | null>(null);
  const userLogin = useSelector(
    (state: RootState) => state.login.user?.roles[0]
  );
  const currentQuestion = useSelector(
    (state: RootState) => state.digitalAvatar
  );
  const currentResponses = useSelector(
    (state: RootState) => state.digitalAvatar.currentResponses
  );
  const questionnaireId = useSelector(
    (state: RootState) => state.digitalAvatar.questionnaireId
  );
  const chatGptResponse = useSelector(
    (state: RootState) => state.digitalAvatar.chatgptResponse
  );
  const assessmentId = useSelector(selectAssessmentId);
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const questionsCompleted = useSelector(
    (state: RootState) => state.digitalAvatar.questionsCompleted
  );
  const isRecording = useSelector(
    (state: RootState) => state.digitalAvatar.isRecording
  );
  const selectedAvatar = useSelector(
    (state: RootState) => state.digitalAvatar.selectedAvatar
  );

  // Effect to handle pending next question after responses are updated
  useEffect(() => {
    if (pendingNextQuestion && currentIntent === "Good Response") {
      setTimeout(() => {
        fetchNextQuestion();
        setPendingNextQuestion(false);
      }, 1000);
    }
  }, [currentResponses, pendingNextQuestion]);

  const isMobile = useMediaQuery("(max-width:768px)");
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    setMobileView(isMobile);
  }, [isMobile]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const OpenAiResponse = async () => {
    try {
      if (userSpeech !== "") {
        const requestdata = {
          question: currentQuestion.text,
          responsetype: currentQuestion.type,
          possible_responses: currentQuestion.choices.map((item) => item.value),
          user_comment: userSpeech,
          additional_knowledge: "",
          question_explaination: "",
          chatHistory: [],
        };

        const data = await classifyIntent(requestdata);
        const chatgptContent = data.response[1].content;
        const intent = data.response[0].intent;
        dispatch(chatgptResponse(chatgptContent));

        if (chatgptContent) {
          handleIntent(intent, chatgptContent);
        }
        setUserSpeech("");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const classifyIntent = async (requestData: object) => {
    try {
      const response = await fetch(`/python-model/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  };

  const handleIntent = async (intent: string, chatgptContent: string) => {
    setCurrentIntent(intent);

    switch (intent) {
      case "Good Response":
        // Set flag to fetch next question after responses are updated
        setPendingNextQuestion(true);
        break;
      case "Clarifying Question":
        speakQuestion(chatgptContent);
        break;
      case "Irrelevant to the question":
        speakQuestion(chatgptContent);
        break;
      case "ACTION":
        speakQuestion("Could you please elaborate more?");
        break;
      default:
        console.warn("Unhandled intent:", intent);
        break;
    }
  };

  const fetchNextQuestion = async () => {
    if (!userLogin) {
      console.error("User login is undefined");
      return;
    }

    if (
      (currentQuestion?.alwaysGoTo === "" ||
        currentQuestion?.alwaysGoTo === null) &&
      (currentQuestion?.branchingLogic === null ||
        currentQuestion?.branchingLogic?.length === 0)
    ) {
      navigate("/landing/pending-evidences-assessor");
    }
    // Normalize choiceValue based on question type
    let choiceValue: string[] = [];
    setPreviewUrl(null);
    if (currentQuestion.type === "multiple_choice") {
      if (chatGptResponse) {
        choiceValue = chatGptResponse.split(",").map((option) => option.trim());
      } else if (currentResponses) {
        choiceValue = currentResponses;
      }
    } else if (
      currentQuestion.type === "single_choice" ||
      currentQuestion.type === "short_text" ||
      currentQuestion.type === "long_text" ||
      currentQuestion.type === "file_type"
    ) {
      if (chatGptResponse) {
        choiceValue = [chatGptResponse];
      } else if (currentResponses) {
        choiceValue = currentResponses;
      }
    }

    // Store response only for supported types
    const supportedTypes = [
      "single_choice",
      "short_text",
      "long_text",
      "multiple_choice",
      "file_type",
    ];
    if (supportedTypes.includes(currentQuestion.type)) {
      const userResponseToStore = {
        questionId: currentQuestion._id,
        choiceValue,
        assessmentId,
      };

      await storeUserResponse(userLogin, axiosInstance, userResponseToStore);
    }

    // Prepare and dispatch evaluation
    const payload = {
      questionnaireId,
      currentQuestionId: currentQuestion._id,
      responses: {
        [currentQuestion._id]: currentResponses ?? [],
      } as Record<string, string[]>,
      assesmentId: assessmentId,
      projectId: selectedProject?._id || "",
    };

    dispatch(evaluateQstnrThunk({ payload, axiosInstance }));
    dispatch(setResponses([]));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (currentQuestion.type !== "multiple_choice") {
      dispatch(setResponses([value]));
    }
  };

  const handleMultipleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    if (currentResponses?.includes(selectedValue)) {
      dispatch(removeResponse(selectedValue));
    } else {
      dispatch(addResponse(selectedValue));
    }
  };

  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };

  const speakQuestion = async (text: string) => {
    try {
      // Properly clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        // Release the old object URL to prevent memory leaks
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }

      const response = await axios.post(
        `/python-model/text-to-speech`,
        { text: text },
        {
          responseType: "blob", // Specify that we expect a blob response
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to generate TTS audio");
      }

      const audioBlob = response.data; // Axios automatically handles the blob conversion
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Add event listener to clean up URL object when audio finishes
      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(audioUrl);
      });

      audioRef.current = audio;
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
    }
  };

  // Handle play/pause button click
  const handlePlayPauseClick = () => {
    // Toggle between avatar and manual modes
    dispatch(toggleRecording());
  };

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);

      // Show preview for image types
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null); // or show PDF/doc icon etc.
      }

      if (
        currentQuestion.requirements !== null ||
        currentQuestion.requirements !== undefined
      ) {
        console.log("currentQuestion.requirements", selectedTask);
        const handleUpload = async (file: File) => {
          try {
            const response = await getSignedUrlAPI(
              axiosInstance,
              file.name,
              file.type,
              selectedProject?._id || ""
            );

            const signedUrl = response.data?.signedUrl;
            const uploadedUrl = response.data?.fileUrl;

            if (!signedUrl || !uploadedUrl) {
              throw new Error("Missing signed URL or file URL from response.");
            }

            const uploadResponse = await fetch(signedUrl, {
              method: "PUT",
              headers: { "Content-Type": file.type },
              body: file,
            });

            if (!uploadResponse.ok) {
              throw new Error(
                `Failed to upload file to S3: ${uploadResponse.statusText}`
              );
            }

            const evidenceCategory = currentQuestion.evidenceReference;

            const newEvidence = {
              name: file.name,
              type: file.type,
              url: uploadedUrl,
              questionId: currentQuestion._id,
              qstnrId: currentQuestion.questionnaireId,
              evidenceCategory,
              refName: "",
              testingProcedure: currentQuestion.testingProcedure,
            };
            dispatch(setResponses([newEvidence.url]));
            await uploadEvidence(
              axiosInstance,
              selectedTask?._id || "",
              newEvidence
            );
          } catch (error) {
            console.error("Upload failed:", error);
          }
        };
        handleUpload(file);
      } else {
        await onFileChange(event);
      }
      // Reset input so same file can be re-selected later if needed
      event.target.value = "";
    }
  };

 
  const handlePreviousQuestion = () => {
    if (isReadOnlyMode && readOnlyQuestions.length > 0) {
      const newIndex = Math.max(0, currentQuestionIndex - 1);
      setCurrentQuestionIndex(newIndex);
      dispatch(setQuestion(readOnlyQuestions[newIndex]));
    }
    // Add any other previous question logic for normal mode here
  };

  const fetchQuestion = async () => {
    try {
      const questions = selectedQSTNR?.questions;
      const currentQuestionTracker = selectedQSTNR?.currentQuestionTracker;

      if (questions && questions.length > 0) {
        let question;

        if (currentQuestionTracker) {
          question = questions.find((q) => q._id === currentQuestionTracker);
        }

        if (!question) {
          question = questions[0];
        }

        dispatch(setQuestion(question));
        speakQuestion(question.text);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };
  const handleNextQuestion = () => {
    if (isReadOnlyMode && readOnlyQuestions.length > 0) {
      const newIndex = Math.min(
        readOnlyQuestions.length - 1,
        currentQuestionIndex + 1
      );
      setCurrentQuestionIndex(newIndex);
      dispatch(setQuestion(readOnlyQuestions[newIndex]));
    } else {
      fetchNextQuestion();
    }
  };

  const handleAvatarClick = () => {
    if (!isReadOnlyMode) {
      dispatch(setSelectedAvatar("avatar"));
    }
  };

  const handleManualClick = () => {
    dispatch(setSelectedAvatar("manual"));
  };

  return {
    currentQuestion,
    questionsCompleted,
    value: currentResponses,
    dispatch,
    setResponses,
    toggleChatWindow,
    fetchNextQuestion,
    handleChange,
    isChatOpen,
    setIsChatOpen,
    userSpeech,
    handleIntent,
    chatGptResponse,
    setUserSpeech,
    OpenAiResponse,
    handleMultipleChange,
    classifyIntent,
    speakQuestion,
    mobileView,
    setMobileView,
    isMobile,
    recorderRef,
    handlePlayPauseClick,
    previewUrl,
    setPreviewUrl,
    fileName,
    setFileName,
    onFileUpload,
    isSubmitted,
    setIsSubmitted,
    navigate,
    selectedAvatar,
    isRecording,
    handlePreviousQuestion,
    fetchQuestion,
    selectedQSTNR,
    setReadOnlyQuestions,
    setIsReadOnlyMode,
    isReadOnlyMode,
    readOnlyQuestions,
    setCurrentQuestionIndex,
    currentQuestionIndex,
    handleNextQuestion,
    handleAvatarClick,
    handleManualClick,
  };
};

export default useDigitalAvatar;
