import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/loginSlice";
import { AppDispatch, RootState, useAppSelector } from "../../redux/store";
import useAxios from "../../api/useAxios";
import { useEffect, useState } from "react";

const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const logoutMessage =  useAppSelector((state:RootState) => state.login.message);
  const handleCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const action =
      name === "username" ? setUsername(value) : setPassword(value);
    console.log("action", action);
  };
  

 const handleTogglePassword = () => {
  setShowPassword((prev) => !prev);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setSnackbar({
        open: true,
        message: "Please fill out all fields",
        severity: "error",
      });
      console.log("Please fill out all fields");
      return;
    }
    const credentials = { userEmail: username, password };
    const resultAction = await dispatch(
      loginUser({ credentials, axiosInstance })
    );

    if (resultAction.type === "login/loginUser/fulfilled") {
      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });
      setPassword("");
      setUsername("");
      navigate("/landing/");
    }
    else {
      setSnackbar({
        open: true,
        message: "Login failed. Please check your credentials.",
        severity: "error",
      });
    }
  };

 useEffect((()=>{
  if(logoutMessage){
    setSnackbar({
      open:true,
      message: logoutMessage || "" ,
      severity:"error",
    })
  }
 }
 ), [logoutMessage])

  return {
    username,
    password,
    showPassword,
    handleCredentials,
    handleSubmit,
    snackbar,
    setSnackbar,
    handleTogglePassword,
  };
};

export default useLogin;
