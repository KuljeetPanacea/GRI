import { Shield, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import styles from './ForbiddenErrorPage.module.css';

const ForbiddenErrorPage = () => {


  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/landing/dashboard';
  };

  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <div className={styles.iconContainer}>
          <Shield className={styles.shieldIcon} />
        </div>

        <div className={styles.errorCode}>403</div>

        <h1 className={styles.errorTitle}>Access Forbidden</h1>

        <p className={styles.errorMessage}>
          You don't have permission to access this resource. Please check your credentials or contact your administrator for access.
        </p>


        <div className={styles.buttonContainer}>
          <button onClick={handleGoBack} className={`${styles.button} ${styles.secondaryButton}`}>
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button onClick={handleGoHome} className={`${styles.button} ${styles.primaryButton}`}>
            <Home size={16} />
            Dashboard
          </button>

          <button onClick={handleRefresh} className={`${styles.button} ${styles.refreshButton}`}>
            <RefreshCw size={16} />
            Retry
          </button>
        </div>

        <p className={styles.helpText}>
          If you believe this is an error, please contact your system administrator or try logging in again with the appropriate credentials.
        </p>
      </div>
    </div>
  );
};

export default ForbiddenErrorPage;
