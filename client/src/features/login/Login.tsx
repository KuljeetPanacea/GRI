import { Alert, Snackbar, Typography ,TextField,IconButton, InputAdornment} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Sign_in_image from "../../common/assets/Sign_in_image.png";
import useLogin from "./useLogin";
import PrimaryButtonLogin from "../../common/ui/PrimaryButtonLogin";
const Login = () => {
  const { username, password,showPassword, handleCredentials, handleSubmit,snackbar,setSnackbar,handleTogglePassword} = useLogin();
  return (
    <div className={styles.signInContainer}>
      <div className={styles.leftContainer}>
      <img src={Sign_in_image} alt="Secure login illustration" className={styles.backgroundImage} />
      <div className={styles.overlayFormCard}>
      <Typography variant="h3" fontWeight="600" gutterBottom>
         Login to your PI Digital Audit account
       </Typography>
       <Typography variant="body2" mb={2} color="#555">
        to continue with the audit flow
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
          <Typography variant="subtitle2" >
              Password*
            </Typography>
            <TextField
              type={showPassword ? "password":"text"}
              value={password}
              onChange={handleCredentials}
              placeholder="Enter your password here"
              name="password"
              id="password"
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            </div>
            <PrimaryButtonLogin
              type="submit"
              children={"Login"}
            />
            <div className={styles.formFooter}>
              <a href="/reset-password/" className={styles.forgotPassword}>
                Forgot password?
              </a>
              <p>
              Don't have an account yet?{" "}
              <a href="/Signup">
              <strong style={{ color: "#DB1F42" }}>
                <u>Sign-up</u>
              </strong>
              </a>
              </p>
            </div> 
          </form>
          </div>
      </div>
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

export default Login;
