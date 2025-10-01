import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewIcon from '@mui/icons-material/GridView';
import { setView } from '../../../redux/viewSlice';
import styles from '../styles/PLHeader.module.css';
import { RootState } from '../../../redux/store';

const ToggleView: React.FC = () => {
  const dispatch = useDispatch();
  const currentView = useSelector((state: RootState) => state.view.currentView);

  const handleViewChange = (view: 'list' | 'grid') => {
    dispatch(setView(view));
  };

  return (
    <div className={styles.toggleContainer}>
      <button
        onClick={() => handleViewChange('list')}
        className={`${styles.toggleButton} ${styles.leftButton} ${
          currentView === 'list' ? styles.active : ''
        }`}
        aria-label="List view"
      >
        <TableRowsIcon className={styles.icon} />
      </button>
      <button
        onClick={() => handleViewChange('grid')}
        className={`${styles.toggleButton} ${styles.rightButton} ${
          currentView === 'grid' ? styles.active : ''
        }`}
        aria-label="Grid view"
      >
        <GridViewIcon className={styles.icon} />
      </button>
    </div>
  );
};

export default ToggleView;