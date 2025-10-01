import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrimaryButton from "../ui/PrimaryButton";
import styles from './ThankYouPage.module.css';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <CheckCircleIcon className={styles.icon} />
      <h2 className={styles.title}>Thank You!</h2>
      <p className={styles.message}>
        Thank you for completing the assessment and submitting the required details.
        Your contribution is vital in identifying and addressing compliance gaps.
        We appreciate your effort!
      </p>
      <PrimaryButton className={styles.button} onClick={() => navigate('/landing/project-assessor')}>
        Go to Dashboard
      </PrimaryButton>
    </div>
  );
};

export default ThankYouPage;
