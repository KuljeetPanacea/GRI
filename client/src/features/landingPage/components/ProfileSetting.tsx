import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from '../styles/LPHeader.module.css';
import { useLPHeader } from '../hooks/useLPHeader';
import LogOut from './LogOut';
import useProfileSetting from './useProfileSetting';


const ProfileSetting: React.FC = () => {
  const { username } = useLPHeader();
  const {toggleDropdown, dropdownVisible, setDropdownVisible, handleMenuOpen, handleMenuClose, handleLogout, isLogoutModalOpen  } = useProfileSetting();
  

  return (
    <div className={styles.profileSettingContainer}>
      <h1
        className={styles.profileAvatar}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={dropdownVisible ? "true" : "false"}
      >
        {username?.charAt(0).toUpperCase() || 'U'}
      </h1>
      <span
        className={styles.profileName}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={dropdownVisible ? "true" : "false"}
      >
        {username}
      </span>
      <KeyboardArrowDownIcon
        sx={{ color: '#4B4B4B', height: '24px', width: '24px' }}
        onClick={toggleDropdown}
      />
      {dropdownVisible && (
        <div className={styles.dropdownMenu}>
          <ul>
            <li onClick={() => { console.log('Profile clicked'); setDropdownVisible(false); }}>Profile</li>
            <li onClick={() => { console.log('Settings clicked'); setDropdownVisible(false); }}>Settings</li>
            <li onClick={handleMenuOpen}>Logout</li>
          </ul>
        </div>
      )}
      <LogOut open={isLogoutModalOpen} onClose={handleMenuClose} onLogout={handleLogout} />
    </div>
  );
};

export default ProfileSetting;
