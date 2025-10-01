import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../api/useAxios";
import { register } from "../../api/auth";

interface ValidationState {
  tenantName: boolean;
  tenantEmail: boolean;
  password: boolean;
  repeatPassword: boolean;
  tenantPhone: boolean;
  tenantPhoneCountryCode: boolean;
  captcha: boolean;
}

interface SuccessMessages {
  email: boolean;
  password: boolean;
}

const useSignup = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  // Form state
  const [tenantEmail, setTenantEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [tenantPhoneCountryCode, setTenantPhoneCountryCode] = useState("91");
  const [tenantPhone, setTenantPhone] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success messages state
  const [successMessages, setSuccessMessages] = useState<SuccessMessages>({
    email: false,
    password: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  

  // Validation state
  const [validation, setValidation] = useState<ValidationState>({
    tenantName: true,
    tenantEmail: true,
    password: true,
    repeatPassword: true,
    tenantPhone: true,
    tenantPhoneCountryCode: true,
    captcha: true,
  });

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const personalDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "aol.com",
      "protonmail.com",
      "icloud.com",
      "zoho.com"
    ];
  
    if (!emailRegex.test(email)) return false;
  
    const domain = email.split("@")[1].toLowerCase();
    return !personalDomains.includes(domain);
  };
  

  const validatePassword = (pass: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pass);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Generate captcha
  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(captcha);
  };

  // Initialize captcha
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Handle email change
  const handleEmailChange = (value: string) => {
    setTenantEmail(value);
    const isValid = validateEmail(value);
    setValidation(prev => ({
      ...prev,
      tenantEmail: isValid
    }));
    setSuccessMessages(prev => ({
      ...prev,
      email: isValid
    }));
  };

  // Handle password change
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const isValid = validatePassword(value);
    setValidation(prev => ({
      ...prev,
      password: isValid,
      repeatPassword: value === repeatPassword
    }));
    setSuccessMessages(prev => ({
      ...prev,
      password: isValid
    }));
  };

  // Handle repeat password change
  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);
    setValidation(prev => ({
      ...prev,
      repeatPassword: value === password
    }));
  };

  // Handle phone change
  const handlePhoneChange = (value: string) => {
    setTenantPhone(value);
    setValidation(prev => ({
      ...prev,
      tenantPhone: validatePhone(value)
    }));
  };

  // Handle captcha change
  const handleCaptchaChange = (value: string) => {
    setCaptcha(value);
    setValidation(prev => ({
      ...prev,
      captcha: value === captchaText
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate all fields
    const isEmailValid = validateEmail(tenantEmail);
    const isPasswordValid = validatePassword(password);
    const isPhoneValid = validatePhone(tenantPhone);
    const isCaptchaValid = captcha === captchaText;
    const isRepeatPasswordValid = password === repeatPassword;

    setValidation({
      tenantEmail: isEmailValid,
      password: isPasswordValid,
      repeatPassword: isRepeatPasswordValid,
      tenantPhone: isPhoneValid,
      captcha: isCaptchaValid,
      tenantName: true,
      tenantPhoneCountryCode: true
    });

    if (!isEmailValid || !isPasswordValid || !isPhoneValid || !isCaptchaValid || !isRepeatPasswordValid) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Please fix the validation errors before submitting.",
        severity: "error",
      });
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const registrationData = {
        tenantName: tenantEmail.split('@')[0],
        tenantEmail: tenantEmail,
        password: password,
        tenantPhone: Number(tenantPhone),
        tenantPhoneCountryCode: Number(tenantPhoneCountryCode),

      };

      const response = await register(axiosInstance, registrationData);
      localStorage.setItem('tenantId', JSON.stringify(response.data.tenantId));
      
      if (response.data.message === "OTP sent to registered email and phone.") {
        setActiveStep(1);
        setSnackbar({
          open: true,
          message: "OTP sent successfully!",
          severity: "success",
        });
        navigate("/verify-otp");
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setSnackbar({
          open: true,
          message: "Bad Request: Please check the information you provided.",
          severity: "error",
        });
        setError('Bad Request: Please check the information you provided.');
      } else if (error.response?.status === 409) {
        setSnackbar({
          open: true,
          message: "User already exists.",
          severity: "error",
        });
        setError('User already exists.');
      } else {
        setSnackbar({
          open: true,
          message: "An unknown error occurred. Please try again later.",
          severity: "error",
        });
        setError('An unknown error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    // Form state
    tenantEmail,
    setTenantEmail: handleEmailChange,
    password,
    setPassword: handlePasswordChange,
    repeatPassword,
    setRepeatPassword: handleRepeatPasswordChange,
    tenantPhoneCountryCode,
    setTenantPhoneCountryCode,
    tenantPhone,
    setTenantPhone: handlePhoneChange,
    captcha,
    setCaptcha: handleCaptchaChange,
    captchaText,
    showPassword,
    setShowPassword,
    showRepeatPassword,
    setShowRepeatPassword,
    activeStep,
    loading,
    error,
    validation,
    successMessages,
    setActiveStep,
    
    // Handlers
    handleSubmit,
    generateCaptcha,
    snackbar,
    setSnackbar,
  };
};

export default useSignup;