import { Typography ,TextField} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Login.module.css";
import Sign_in_image from "../../../common/assets/Sign_in_image.png";
import useLogin from "../useLogin";
import PrimaryButtonLogin from "../../../common/ui/PrimaryButtonLogin";
const ResetPassword = () => {
    const { username, handleCredentials, handleSubmit} = useLogin();
    return (
      <div className={styles.signInContainer}>
        <div className={styles.leftContainer}>
        <img src={Sign_in_image} alt="Secure login illustration" className={styles.backgroundImage} />
        <div className={styles.overlayFormCard}>
        <Typography variant="h3" fontWeight="600" gutterBottom>
           Reset Password
         </Typography>
         <Typography variant="body2" mb={2} color="#555">
          Enter the email address associated with your account and we will send you a link to reset your password.
         </Typography>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.credentialsGroup}>
            <Typography variant="subtitle2" >
                Company Email*
              </Typography>
            <TextField
              type="text"
              value={username}
              onChange={handleCredentials}
              placeholder="Enter your business email here"
              name="username"
              id="username"
              required
              fullWidth
             variant="outlined"
            />
            </div>
            <PrimaryButtonLogin
                type="submit"
                children={"Send Reset Link"}
                className={styles.loginButton}
            />
            </form>
            </div>
        </div>
      </div>
    );
  };
  
  export default ResetPassword;
  