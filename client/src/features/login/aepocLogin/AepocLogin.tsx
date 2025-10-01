import Typography from "@mui/material/Typography";
import TextInput from "../../../common/ui/TextInput";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import logo from "../../../common/assets/logo.png";
import styles from "../../signUp/styles/Signup.module.css";
import { Alert, Snackbar, AlertColor } from "@mui/material";
import useAEPocLogin from "./useAEPocLogin";
import ProgressBar from "../../../common/component/ProgressBar";
import { FC } from "react";

/**
 * AEPocLogin Component - Login form for AE POC
 */
const AEPocLogin: FC = () => {
  const {
    email,
    password,
    repeatPassword,
    showPassword,
    showRepeatPassword,
    activeStep,
    validation,
    successMessages,
    snackbar,
    handlePasswordChange,
    handleRepeatPasswordChange,
    handleSubmit,
    setSnackbar,
  } = useAEPocLogin();

  return (
    <div className={styles.aePocLoginContainer}>
      {/* Header Section */}
      <div className={styles.headerContainer}>
        <div className={styles.progressHeader}>
          <div className={styles.signupLogo}>
            <img src={logo} alt="Company Logo" />
            <Typography>
              <span className={styles.logoText}>
                Panacea <strong className={styles.infosec}>INFOSEC</strong>
              </span>
            </Typography>
          </div>
          <div className={styles.progressbar}>
            <ProgressBar activeStep={activeStep} />
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <main className={styles.mainContent}>
        <div className={styles.formCard}>
          <div className={styles.formText}>
            <h3>AE POC Login</h3>
            <p>Enter your credentials to access your account</p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              User ID / Email
              <TextInput
                type="email"
                value={email}
                readOnly
                className={styles.readOnlyInput}
              />
            </label>

            <label>
              Password <span className={styles.required}>*</span>
              <TextInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter 8-14 characters password"
                required
                error={!validation.password && password.length > 0}
              />
              {!validation.password && password.length > 0 && (
                <p className={styles.errorMessage}>
                  Password must contain uppercase, lowercase, numbers, and
                  special characters.
                </p>
              )}
              {successMessages.password && (
                <p className={styles.successMessage}>
                  Password meets the criteria of lowercase, uppercase, numbers
                  and special characters.
                </p>
              )}
            </label>

            <label>
              Confirm Password <span className={styles.required}>*</span>
              <TextInput
                type={showRepeatPassword ? "text" : "password"}
                value={repeatPassword}
                onChange={handleRepeatPasswordChange}
                placeholder="Re-enter your password"
                required
                error={!validation.repeatPassword && repeatPassword.length > 0}
              />
              {!validation.repeatPassword && repeatPassword.length > 0 && (
                <p className={styles.errorMessage}>Passwords do not match.</p>
              )}
            </label>

            <PrimaryButton type="submit">Login</PrimaryButton>
          </form>
        </div>
      </main>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as AlertColor}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AEPocLogin;