import {
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import styles from "../Login.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Sign_in_image from "../../../common/assets/Sign_in_image.png";
import PrimaryButtonLogin from "../../../common/ui/PrimaryButtonLogin";
import useResetLogin from "../useResetLogin";

const UpdatePassword = () => {
  const {
    password,
    confirmPassword,
    showPassword,
    snackbar,
    handleTogglePassword,
    handleCredentials,
    handleSubmit,
    setSnackbar
  } = useResetLogin();

  return (
    <div className={styles.signInContainer}>
      <div className={styles.leftContainer}>
        <img
          src={Sign_in_image}
          alt="Secure login illustration"
          className={styles.backgroundImage}
        />
        <div className={styles.overlayFormCard}>
          <Typography variant="h3" fontWeight="600" gutterBottom>
            Update Password
          </Typography>
          <Typography variant="body2" mb={2} color="#555">
            Reset your new password here to access PI Digital Audit Platform
          </Typography>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.credentialsGroup}>
              <Typography variant="subtitle2">New Password*</Typography>
              <TextField
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleCredentials}
                placeholder="Enter your password here"
                name="password"
                id="password"
                required
                fullWidth
                variant="outlined"
              />
              <Typography variant="subtitle2">Confirm Password*</Typography>
              <TextField
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleCredentials}
                placeholder="Confirm your password"
                name="confirmPassword"
                id="confirmPassword"
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
              children={"Update Password"}
              className={styles.loginButton}
            />
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

export default UpdatePassword;
