
import style from '../components/Styles/Assessor.module.css'
import SearchBar from '../../../common/ui/SearchBar'
import {  FormControl } from '@mui/material';
import SelectDropdown from '../../../common/ui/SelectDropdown';
import useAssessor from '../useAssessor';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setSearchFilter } from '../../../redux/projectManagementSlice';
import { useCallback, useState } from 'react';
import { createDebounce } from '../../../common/hooks/useDebouncedValue';

const AssessorHeader = () => {
     const {handleComplianceChange, handleClearFilters, complianceType} = useAssessor();
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

     const handleClearAllFilters = () => {
       setLocalSearchValue("");
       handleClearFilters();
     };

  return (
     <div className={style.container}>
         <div className={style.PLHeader}>
    <div>
    <h1 className={style.PLHeading}>My Projects</h1>
    </div>
    <div className={style.PLSearch}> 
        <SearchBar value={localSearchValue} onChange={handleSearchChange} />
    </div>


    </div>
      {/* Header Section */}
      <div className={style.header}>
        <FormControl className={style.dropdown}>
        <SelectDropdown
       title='Compliance Type'
          options={[
            { value: "PCIDSS V4.0", label: "PCI DSS" },
            { value: "ISO27001", label: "ISO 27001" },
            { value: "HIPAA", label: "HIPAA" }]}
          value={complianceType}
          onChange={handleComplianceChange}
        />
        </FormControl>
        
        <button onClick={handleClearAllFilters} className={style.clearButton}>
        X Clear All
        </button>

      </div>
   
      </div>
  )
}

export default AssessorHeader