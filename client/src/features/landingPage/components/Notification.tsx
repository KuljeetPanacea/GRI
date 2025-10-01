import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from '../styles/LPHeader.module.css';

const Notification: React.FC = () => {
  return (
    <div className={styles.notificationContainer}>
        <NotificationsIcon className={styles.lpHeaderIcon}/>
        <div className={styles.notificationNumber}>
          1
        </div>
    </div>
  )
}

export default Notification