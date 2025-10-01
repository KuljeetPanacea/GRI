import styles from "../styles/ClientManagement.module.css";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import SearchBar from "../../../common/ui/SearchBar";
import AddNewClient from "./AddNewClient";
import { useDispatch, useSelector } from "react-redux";
import useClientManagement from "../useClientManagement";
import { RootState } from "../../../redux/store";
import { setSearchFilter } from "../../../redux/clientManagementSlice";
// import EditClient from "./EditClient";
import { useState, useCallback } from "react";
import { createDebounce } from "../../../common/hooks/useDebouncedValue";

const ClientManagementHeader = () => {
  const dispatch = useDispatch();
  const search = useSelector(
    (state: RootState) => state.clientManagement.search
  );
  const { handleAddNewClientClick } = useClientManagement();

  const [localSearchValue, setLocalSearchValue] = useState(search);

  const debouncedSearch = useCallback(
    createDebounce((...args: unknown[]) => {
      const value = args[0] as string;
      dispatch(setSearchFilter(value));
    }, 1000),
    [dispatch]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchValue(value);

    // Trigger debounced search - will only execute after 1 second of no typing
    debouncedSearch(value);
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerText}>Client Management</div>

      {/* PrimaryButton */}
      <div className={styles.buttonContainer}>
        <PrimaryButton
          className={styles.primaryButton}
          onClick={handleAddNewClientClick}
        >
          + Add New Client
        </PrimaryButton>

        {/* SearchBar with Debouncing */}
        <div className={styles.searchBar}>
          <SearchBar
            className={styles.searchBar}
            value={localSearchValue}
            onChange={handleSearchChange}
         
          />
        </div>
      </div>

      {/* Modals */}
      <AddNewClient />
      {/* <EditClient /> */}
    </div>
  );
};

export default ClientManagementHeader;
