import React from 'react';
import { useSelector } from 'react-redux';
import PLHeader from './PLHeader';
import PLFilters from './PLFilters';
import PLListView from './PLListView';
import PLGridView from './PLGridView';
import ToggleView from './components/ToggleView';
import style from './styles/PLHeader.module.css';
import { RootState } from '../../redux/store';

const PLQSA: React.FC = () => {
  const currentView = useSelector((state: RootState) => state.view.currentView);

  return (
    <>
      <PLHeader />
      <div className={style.filterRow}>
        <PLFilters />
        <ToggleView />
      </div>
      {currentView === 'list' ? <PLListView /> : <PLGridView />}
    </>
  );
};

export default PLQSA;