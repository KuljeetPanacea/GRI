import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import styles from "../DigitalAvatar.module.css";
import MicIcon from "@mui/icons-material/Mic";
import UserRecorder from "./UserRecorder";
import { useEffect} from "react";
import useDigitalAvatar from "../useDigitalAvatar";
import ChatIcon from "@mui/icons-material/Chat";
import QuestionSection from "./QuestionSection";
const ApiResponseSection = () => {
  const {
    userSpeech,
    setUserSpeech,
    chatGptResponse,
    OpenAiResponse,
    isChatOpen,
    mobileView,
    isMobile,
    setMobileView,
    toggleChatWindow,
    recorderRef,
    handlePlayPauseClick,
    isRecording,
    selectedQSTNR
  } = useDigitalAvatar();

 
  useEffect(() => {
    if (userSpeech !== "") {
      OpenAiResponse();
    }
  }, [userSpeech]);

  useEffect(() => {
    setMobileView(isMobile);
  }, [isMobile]);


  
  return (
    <div className={styles.apiResponseSectionContainer}>
      {/* Top Section */}
      <div className={styles.apiResponsetopSection}>
        <div className={styles.imageContainer}>
          <div className={isRecording ? styles.circleEffect2 : ""}></div>
          <div className={isRecording ? styles.circleEffect3 : ""}></div>
          <div className={isRecording ? styles.circleEffect4 : ""}></div>
          <img
            width={"70%"}
            src="/Images/DaIcon.png"
            alt="dscs"
            className={styles.daIcon}
          />
        </div>
      <div
  className={`${styles.playButton} ${
    selectedQSTNR?.isCompletedAllQuestions ? styles.disabledPlayButton : ""
  }`}
  onClick={
    selectedQSTNR?.isCompletedAllQuestions ? undefined : handlePlayPauseClick
  }
>
  {isRecording ? <PauseIcon /> : <PlayArrowIcon />}
</div>

        {!mobileView && (
          <p className={styles.apiResponseText}>
          {chatGptResponse || "Chatgpt's response..."}
        </p>
        )
        }

        {
          mobileView &&(
            
      <div className={styles.questionSection}><QuestionSection  /></div>
          )
}
      </div>
        

      {/* Bottom Section */}
      <div className={styles.apiResponsebottomSection}>
        <p className={styles.userResponseText}>
          {userSpeech || "Your speech will appear here..."}
        </p>
        <div className={styles.micButtonContainer}>
          {isRecording && (
            <>
              <div className={styles.animatedCircle}></div>
              <div className={styles.animatedCircle1}></div>
            </>
          )}
          <UserRecorder 
            onTextCaptured={setUserSpeech} 
            ref={recorderRef} 
            isRecording={isRecording}
          />
          <button className={styles.micButton}>
            <MicIcon className={styles.micIcon} />
          </button>
        </div>
      </div>

      <div className={styles.chatIconWrapper} onClick={toggleChatWindow}>
        <ChatIcon className={styles.chatIcon} />
      </div>
      {isChatOpen && (
        <div className={styles.ChatWindow} style={{}}>
          <div className={styles.chatHeader}>
            <h5 style={{ margin: 0 }}>Chat Transcript</h5>
          </div>
          <div>
            <div className={styles.chatBody}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiResponseSection;
