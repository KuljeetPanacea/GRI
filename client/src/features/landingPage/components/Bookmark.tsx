import React from 'react'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import styles from '../styles/LPHeader.module.css';
const Bookmark: React.FC = () => {
  return (
    <div>
        <BookmarkAddIcon className={styles.lpHeaderIcon}/>
    </div>
  )
}

export default Bookmark