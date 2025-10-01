import { Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../../../common/assets/logo.png";
import useConfirmPhone from "../hooks/useConfirmPhone";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import TextInput from "../../../common/ui/TextInput";
import ProgressBar from "../../../common/component/ProgressBar";
import Confirmation from "./Confirmation";
import styles from "../styles/ConfirmPhone.module.css";

const ConfirmPhone = () => {
  const navigate = useNavigate();

  const {
    otp,
    isOtpComplete,
    errorMessage,
    timer,
    isResendDisabled,
    isLoading,
    handleChange,
    handleKeyDown,
    handleVerifyOtp,
    handleResendOtp,
    handleMenuClose,
    otpConfirmationModal,
  } = useConfirmPhone();

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

      <main className={styles.mainContent}>
        <div className={styles.verificationCardContent}>
          <span
            onClick={() => navigate("/Signup")}
            className={styles.backButton}
          >
            ← Back
          </span>
          <h2>Confirm your phone number</h2>
          <p>Enter the 6-digit code we just sent to +91 **********</p>
          <div className={styles.otpVerifyContainer}>
            <div className={styles.otpInputs}>
              {otp.map((digit, index) => (
                <div className={styles.otpInput} key={index}>
                  <TextInput
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={styles.textInput}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
            <div>
              <PrimaryButton
                onClick={handleVerifyOtp}
                disabled={!isOtpComplete || isLoading}
                children={isLoading ? "Verifying..." : "Verify now"}
              />
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
          </div>
          <div className={styles.verificationCardFooter}>
            <div className={styles.resendSubcontainer}>
              <p className={styles.resendInfo}>
                Wait {timer} sec before requesting a new code.
              </p>
              <button
                className={styles.resendButton}
                onClick={handleResendOtp}
                disabled={isResendDisabled || isLoading}
              >
                Resend New Code
              </button>
            </div>
          </div>
        </div>
      </main>
      {otpConfirmationModal && (
        <div className={styles.modalOverlay}>
          <ToastContainer />
          <Confirmation
            open={otpConfirmationModal}
            onClose={handleMenuClose}
            onConfirm={() => {navigate("/"); handleMenuClose();}}
          />
        </div>
      )}
    </div>
  );
};

export default ConfirmPhone;