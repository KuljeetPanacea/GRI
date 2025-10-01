import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ValidationState {
  password: boolean;
  repeatPassword: boolean;
}

interface SuccessMessagesState {
  password: boolean;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

interface UseAEPocLoginReturn {
  email: string;
  password: string;
  repeatPassword: string;
  showPassword: boolean;
  showRepeatPassword: boolean;
  activeStep: number;
  validation: ValidationState;
  successMessages: SuccessMessagesState;
  snackbar: SnackbarState;
  
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setRepeatPassword: (repeatPassword: string) => void;
  setSnackbar: (snackbar: SnackbarState) => void;
  
  // Functions
  togglePasswordVisibility: (field: 'password' | 'repeatPassword') => void;
  handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRepeatPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}


const useAEPocLogin = (): UseAEPocLoginReturn => {
  // States
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [validation, setValidation] = useState<ValidationState>({
    password: true,
    repeatPassword: true
  });
  const [successMessages, setSuccessMessages] = useState<SuccessMessagesState>({
    password: false
  });
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success"
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from URL or localStorage on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailParam = urlParams.get("username");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      const savedEmail = localStorage.getItem("userEmail");
      if (savedEmail) setEmail(savedEmail);
    }
  }, [location]);

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'password' | 'repeatPassword'): void => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'repeatPassword') {
      setShowRepeatPassword(!showRepeatPassword);
    }
  };

  // Validate password against requirements
  const validatePassword = (pwd: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/;
    return regex.test(pwd);
  };

  // Handle password change with validation
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    const isValid = validatePassword(newPassword);
    setValidation({
      ...validation,
      password: isValid || newPassword.length === 0
    });
    
    setSuccessMessages({
      ...successMessages,
      password: isValid && newPassword.length > 0
    });

    // Check if repeat password matches when both are filled
    if (repeatPassword) {
      setValidation({
        ...validation,
        repeatPassword: newPassword === repeatPassword || repeatPassword.length === 0,
        password: isValid || newPassword.length === 0
      });
    }
  };

  // Handle repeat password change with validation
  const handleRepeatPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newRepeatPassword = e.target.value;
    setRepeatPassword(newRepeatPassword);
    
    setValidation({
      ...validation,
      repeatPassword: password === newRepeatPassword || newRepeatPassword.length === 0
    });
  };

  // Process form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Final validation before submission
    const passwordValid = validatePassword(password);
    const passwordsMatch = password === repeatPassword;
    
    setValidation({
      password: passwordValid,
      repeatPassword: passwordsMatch
    });
    
    if (passwordValid && passwordsMatch) {
      // Success case - proceed to next step
      setSnackbar({
        open: true,
        message: "Login successful! Proceeding to verification...",
        severity: "success"
      });
      
      // Move to next step (OTP verification)
      setTimeout(() => {
        setActiveStep(1);
        navigate('../aepoc-otp')
        // In a real implementation, you would:
        // 1. Call your authentication API
        // 2. Store any returned tokens/session info
        // 3. Navigate to OTP verification
        // window.location.href = "/verify-otp?email=" + encodeURIComponent(email);
      }, 2000);
    } else {
      // Show error for invalid form
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form",
        severity: "error"
      });
    }
  };

  return {
    // State values
    email,
    password,
    repeatPassword,
    showPassword,
    showRepeatPassword,
    activeStep,
    validation,
    successMessages,
    snackbar,
    
    // State setters
    setEmail,
    setPassword,
    setRepeatPassword,
    setSnackbar,
    
    // Functions
    togglePasswordVisibility,
    handlePasswordChange,
    handleRepeatPasswordChange,
    handleSubmit
  };
};

export default useAEPocLogin;