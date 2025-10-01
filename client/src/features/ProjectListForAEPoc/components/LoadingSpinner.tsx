import styles from ".././styles/AssuranceReport.module.css";

const LoadingSpinner: React.FC = () => (
  <div className={styles.spinner}>
    <div className={styles.spinnerCircle}></div>
  </div>
);

export default LoadingSpinner;