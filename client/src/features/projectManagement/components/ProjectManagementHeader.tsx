// import React from 'react'
import styles from "../ProjectManagement.module.css";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import SearchBar from "../../../common/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setSearchFilter } from "../../../redux/projectManagementSlice";
import { NavLink } from "react-router-dom";
import { resetProject } from "../../../redux/createNewProjectSlice";
import { useCallback, useState } from "react";
import { createDebounce } from "../../../common/hooks/useDebouncedValue";

const ProjectManagementHeader = () => {
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
    <div className={styles.headerContainer}>
      <div className={styles.headerText}>Project Management</div>

      {/* PrimaryButton */}
      <div className={styles.buttonContainer}>
        <NavLink to="/landing/createNewProject" className={styles.navlink}>
          <PrimaryButton
            children={"+ Create New Project"}
            onClick={() => {
              dispatch(resetProject());
            }}
          />
        </NavLink>

        {/* SearchBar */}
        <div className={styles.searchBar}>
          <SearchBar
            className={styles.searchBar}
            value={localSearchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementHeader;
