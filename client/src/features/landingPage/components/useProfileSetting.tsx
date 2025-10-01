import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useAxios from '../../../api/useAxios';
import { logout } from '../../../api/auth';

const useProfileSetting = () => {
      const navigate = useNavigate();
      const axiosInstance = useAxios();

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(prevState => !prevState);
      };
    
      const handleMenuOpen = () => {
        setIsLogoutModalOpen(true);
        setDropdownVisible(true);
      };
    
      const handleMenuClose = () => {
        setIsLogoutModalOpen(false);
        setDropdownVisible(false);
      };
    
      const handleLogout = async() => {
        console.log('Logging out...');
        try{
            const response = await logout(axiosInstance);

            if (response.data.message === 'Logged out successfully') {
              localStorage.removeItem('persist:root');
                navigate('/');
        }
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            handleMenuClose(); // Close the modal regardless of success/failure
        }
    
        handleMenuClose();
      };

  return {
    dropdownVisible,
    setDropdownVisible,
    toggleDropdown,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    isLogoutModalOpen,
  }
}

export default useProfileSetting;
