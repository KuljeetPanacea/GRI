import { useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassowrd } from "../../api/auth";
import useAxios from "../../api/useAxios";

const useResetLogin = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const axiosInstance = useAxios();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";


  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCredentials = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!password || !confirmPassword || password !== confirmPassword) {
      return setSnackbar({
        open: true,
        message: !password || !confirmPassword
          ? "Please fill out all fields"
          : "Passwords do not match",
        severity: "error",
      });
    }
  
    try {
      const response = await resetPassowrd(axiosInstance, userId, password);
      console.log("response check", response);
  
      setSnackbar({
        open: true,
        message: "Password updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
      console.error("Error updating password:", error);
    }
  };
  

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    password,
    confirmPassword,
    showPassword,
    snackbar,
    handleCredentials,
    handleTogglePassword,
    handleSubmit,
    closeSnackbar,
    setSnackbar,
    userId
  };
};

export default useResetLogin;
