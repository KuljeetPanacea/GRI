import React from 'react'
import logo from '../../common/assets/LPlogo.png';
// import Bookmark from "./components/Bookmark";
// import Notification from "./components/Notification";
import ProfileSetting from "./components/ProfileSetting";
import styles from './styles/LPHeader.module.css';

const LPHeader: React.FC = () => {
  return (
    <div className={styles.lpHeaderContainer}>
        <div className={styles.lpHeaderLogo}>
        <img src={logo} alt='logo' />
        </div>
        <div className={styles.lpHeaderIcons}>
          {/* <Bookmark />
          <Notification /> */}
          <ProfileSetting />
        </div>
    </div>
  )
}

export default LPHeader