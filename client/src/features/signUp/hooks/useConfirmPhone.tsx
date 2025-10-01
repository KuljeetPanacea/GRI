import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../../api/useAxios';

const useConfirmPhone = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [otpConfirmationModal, setOtpConfirmationModal] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tenantIdVerify, setTenantIdVerify] = useState('');

  useEffect(() => {
    setTenantIdVerify(JSON.parse(localStorage.getItem('tenantId') || 'null'));
  }, []);

  const handleMenuopen = () => {
    setOtpConfirmationModal(true);
  };

  const handleMenuClose = () => {
    setOtpConfirmationModal(false);
  };

  useEffect(() => {
    setIsResendDisabled(true);
    setTimer(60);
  }, []);

  useEffect(() => {
    setIsOtpComplete(otp.every((digit) => digit !== ''));
  }, [otp]);

  useEffect(() => {
    if (timer > 0 && isResendDisabled) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer, isResendDisabled]);

  useEffect(() => {
    if (attempts <= 0) {
      toast.error('Too many failed attempts. Redirecting to signup.');
      navigate('/');
    }
  }, [attempts, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !isOtpComplete) {
      toast.error('Please enter the full OTP.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/api/auth/verify-otp',
        { phoneOtp: otp.join(''), tenantId: tenantIdVerify },
        { withCredentials: true }
      );

      if (response.data.message === 'OTP verified, Check email for Login credentials.') {
        toast.success("OTP verified successfully.");
        handleMenuopen();
      } else {
        setErrorMessage('Incorrect OTP.');
        setAttempts(prev => prev - 1);
      }
    } catch (error) {
      toast.error('OTP is invalid or has expired');
      setErrorMessage('Failed to verify OTP');
      setAttempts(prev => prev - 1);
      console.error('Error verifying otp: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      console.log('Resending OTP...');
      const response = await axiosInstance.post('/api/auth/resend-otp',
        { tenantId: tenantIdVerify, resendFor: 'Mobile' },
        { withCredentials: true }
      );

      if (response.data.message === 'OTP resent succesfully') {
        toast.success('New OTP sent successfully!');
        setOtp(Array(6).fill(''));
        setIsResendDisabled(true);
        setTimer(60);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  return {
    otp,
    isOtpComplete,
    attempts,
    errorMessage,
    timer,
    isResendDisabled,
    isLoading,
    handleChange,
    handleKeyDown,
    handleVerifyOtp,
    handleResendOtp,
    handleMenuopen,
    handleMenuClose,
    otpConfirmationModal,
  };
};

export default useConfirmPhone;
