import Typography from "@mui/material/Typography";
import useSignup from "./useSignup";
import Progressbar from "../../common/component/ProgressBar";
import TextInput from "../../common/ui/TextInput";
import PrimaryButton from "../../common/ui/PrimaryButton";
import logo from "../../common/assets/logo.png";
import styles from "./styles/Signup.module.css";
import ReplayIcon from "@mui/icons-material/Replay";
import { Alert, Snackbar } from "@mui/material";

const Signup = () => {
  const {
    tenantEmail,
    setTenantEmail,
    password,
    setPassword,
    repeatPassword,
    setRepeatPassword,
    tenantPhone,
    setTenantPhone,
    tenantPhoneCountryCode,
    setTenantPhoneCountryCode,
    captcha,
    setCaptcha,
    validation,
    captchaText,
    handleSubmit,
    activeStep,
    generateCaptcha,
    showPassword,
    showRepeatPassword,
    successMessages,
    snackbar,
    setSnackbar,
  } = useSignup();

  return (
    <div className={styles.createAccounContainer}>
      {/* Header Section */}
      <div className={styles.headerContainer}>
        <div className={styles.progressHeader}>
          <div className={styles.signupLogo}>
            <img src={logo} alt="Panacea Infosec" />
            <Typography>
              <span className={styles.logoText}>
                Panacea <strong className={styles.infosec}>INFOSEC</strong>
              </span>
            </Typography>
          </div>
          <div className={styles.progressbar}>
            <Progressbar activeStep={activeStep} />
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <main className={styles.mainContent}>
        <div className={styles.formCard}>
          <div className={styles.formText}>
            <h3>Create your Digital Audit account</h3>
            <p>to continue to PanaceaInfosec Digital Audit product</p>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Username <span className={styles.required}>*</span>
              <TextInput
                type="email"
                value={tenantEmail}
                placeholder="Enter your business email here"
                onChange={(e) => setTenantEmail(e.target.value)}
                required
                error={!validation.tenantEmail}
              />
              {!validation.tenantEmail && (
                <p className={styles.errorMessage}>
                  Please enter a valid business email address. Free email
                  services (like Gmail, Outlook, etc.) are not allowed.
                </p>
              )}
              {successMessages.email && (
                <p className={styles.successMessage}>
                  This is your username for login credentials.
                </p>
              )}
            </label>

            <label>
              Password <span className={styles.required}>*</span>
              <TextInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter 8-14 characters password"
                required
                error={!validation.password}
              />
              {!validation.password && (
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
              Repeat Password <span className={styles.required}>*</span>
              <TextInput
                type={showRepeatPassword ? "text" : "password"}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                error={!validation.repeatPassword}
              />
              {!validation.repeatPassword && (
                <p className={styles.errorMessage}>Passwords do not match.</p>
              )}
            </label>

            <label>
              Phone number <span className={styles.required}>*</span>
              <div className={styles.phoneInput}>
                <select
                  className={styles.phoneInputSelect}
                  value={tenantPhoneCountryCode}
                  onChange={(e) => setTenantPhoneCountryCode(e.target.value)}
                  required
                >
                  <option value="91">+91</option>
                  <option value="1">+1</option>
                </select>
                <TextInput
                  type="text"
                  value={tenantPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); // remove non-digits
                    if (val.length <= 10) {
                      setTenantPhone(val);
                    }
                  }}
                  placeholder="Enter your 10-digit number"
                  required
                />
              </div>
              {!validation.tenantPhone && (
                <p className={styles.errorMessage}>
                  Enter a valid 10-digit phone number.
                </p>
              )}
            </label>

            <label style={{ width: "65%" }}>
              Enter Captcha <span className={styles.required}>*</span>
              <div className={styles.captchaContainer}>
                <TextInput
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  placeholder="Enter Captcha"
                  required
                />

                <div
                  className={styles.captchaText}
                  onCopy={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {captchaText}
                </div>

                <button
                  type="button"
                  onClick={generateCaptcha}
                  className={styles.refreshCaptcha}
                >
                  <ReplayIcon sx={{ fontSize: "medium" }} />
                </button>
              </div>
              {!validation.captcha && (
                <p className={styles.errorMessage}>
                  Please complete the Captcha correctly to verify you are not a
                  robot.
                </p>
              )}
            </label>

            <PrimaryButton type="submit">Create Account</PrimaryButton>
          </form>

          {/* Sign-in Link */}
          <p className={styles.signInLink}>
            Already have an account? <a href="/">Sign-in</a>
          </p>
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
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
