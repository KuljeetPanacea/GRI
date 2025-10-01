import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import SearchBar from '../../common/ui/SearchBar'
import style from './styles/PLHeader.module.css'
import { RootState } from '../../redux/store';
import { createDebounce } from '../../common/hooks/useDebouncedValue';
import { setSearchFilter } from '../../redux/projectManagementSlice';

const PLHeader: React.FC = () => {
  const dispatch = useDispatch();
  const search = useSelector(
    (state: RootState) => state.projectManagement.search
  );
  const [localSearchValue, setLocalSearchValue] = useState(search);
  
  const debouncedSearch = useCallback(
    createDebounce((...args: unknown[]) => {
      const value = args[0] as string;
      dispatch(setSearchFilter(value));
    }, 1000),
    [dispatch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className={style.PLHeader}>
      <div>
        <h1 className={style.PLHeading}>My Projects</h1>
        <p className={style.PLDesc}>Overview of new and ongoing audit projects</p>
      </div>
      <div className={style.PLSearch}> 
        <SearchBar 
          value={localSearchValue} 
          onChange={handleSearchChange} 
        />
      </div>
    </div>
  )
}

export default PLHeader