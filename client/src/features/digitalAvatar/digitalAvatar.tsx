import { useEffect } from "react";
import ApiResponseSection from "./components/ApiResponseSection";
import QuestionSection from "./components/QuestionSection";
import styles from "./DigitalAvatar.module.css";
import useDigitalAvatar from "./useDigitalAvatar";

const DigitalAvatar: React.FC = () => {
  const { isMobile, mobileView, setMobileView ,questionsCompleted,navigate} = useDigitalAvatar();

  useEffect(() => {
    setMobileView(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (questionsCompleted) {
      navigate("/landing/pending-evidences-assessor");
    }
  }, [questionsCompleted, navigate]);

  return (
    <div className={styles.digitalAvatarcontainer}>
      {!mobileView && (
        <div className={styles.questionSection}>
          <QuestionSection  />
        </div>
      )}
      <div className={styles.apiResponseSection}>
        <ApiResponseSection />
      </div>
    </div>
  );
};

export default DigitalAvatar;
