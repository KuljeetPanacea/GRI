import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import TextInput from "../../../common/ui/TextInput";
import logo from "../../../common/assets/logo.png";
import styles from "../../signUp/styles/ConfirmPhone.module.css";
import Confirmation from "../../signUp/components/Confirmation";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProgressBar from "../../../common/component/ProgressBar";


const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isOtpComplete, setIsOtpComplete] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timer, setTimer] = useState<number>(120); // 2 minutes countdown
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpConfirmationModal, setOtpConfirmationModal] = useState<boolean>(false);
  
  // Add email state or get from props/context
  const email: string = "user@example.com"; // Replace with actual email source

  // OTP Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const value = e.target.value;

    // Only allow single digit numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Check if OTP is complete
    setIsOtpComplete(newOtp.every((digit) => digit !== ""));

    // Clear error when user types
    if (errorMessage) setErrorMessage("");

    // Auto focus to next input field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key down for backspace to move to previous input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = (): void => {
    if (isResendDisabled) return;

    // Reset timer
    setTimer(120);
    setIsResendDisabled(true);

    // Here you would call your API to resend the OTP
    // Example: api.resendOtp(email);
  };

  // Handle form submission
  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Validate OTP is complete
    if (!isOtpComplete) {
      setErrorMessage("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Example validation
      const otpValue = otp.join("");
      if (otpValue === "123456") {
        // Replace with actual validation
        setOtpConfirmationModal(true);
      } else {
        setErrorMessage("Invalid verification code. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleMenuClose = (): void => {
    setOtpConfirmationModal(false);
  };

  return (
    <div className={styles.confirmPhoneContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.progressHeader}>
          <div className={styles.confirmLogo}>
            <img src={logo} alt="Panacea Infosec" />
            <Typography>
              <span className={styles.logoText}>
                Panacea <strong className={styles.infosec}>INFOSEC</strong>
              </span>
            </Typography>
          </div>
          <div className={styles.progressbar}>
            <ProgressBar activeStep={1} />
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className={styles.mainContent}>
        <div className={styles.verificationCardContent}>
          <span
            onClick={() => navigate("/aepoc-login")}
            className={styles.backButton}
          >
            ← Back
          </span>
          <h4>Confirm your email</h4>
          <p>Enter the 6-digit code we just sent to</p>

          <p>{email}</p>

          {/* OTP Input */}
          <form onSubmit={handleVerifyOtp}>
            <div className={styles.otpVerifyContainer}>
              <div className={styles.otpInputs}>
                {otp.map((digit, index) => (
                  <div key={index} className={styles.otpInput}>
                    <TextInput
                      id={`otp-${index}`}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={styles.textInput}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.errorContainer}>
              {errorMessage && (
                <p className={styles.errorText}>{errorMessage}</p>
              )}
            </div>

            <div className={styles.timerContainer}>
              {timer > 0 ? (
                <Typography variant="body2" className={styles.timerText}>
                  Wait {timer} sec before requesting a new code.
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  className={styles.resendText}
                  onClick={handleResendOtp}
                >
                  Resend New Code
                </Typography>
              )}
            </div>

            <PrimaryButton
              type="submit"
              className={styles.verifyButton}
              disabled={!isOtpComplete || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </PrimaryButton>
          </form>
        </div>
      </div>

      {otpConfirmationModal && (
        <Confirmation
          open={otpConfirmationModal}
          onClose={handleMenuClose}
          onConfirm={() => {navigate("/"); handleMenuClose();}}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default OtpVerification;