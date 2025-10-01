import styles from "../UserManagement.module.css";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import SearchBar from "../../../common/ui/SearchBar";
import useUserManagement from "../useUserManagement";
import { useSelector, useDispatch } from "react-redux";
import { setSearchFilter } from "../../../redux/userManagementSlice";
import { RootState } from "../../../redux/store";
import AddNewUser from "./AddNewUser";
import EditUser from "./EditUser";
import { useCallback, useState } from "react";
import { createDebounce } from "../../../common/hooks/useDebouncedValue";

const UserManagementHeader = () => {
  const dispatch = useDispatch();
  const search = useSelector((state: RootState) => state.userManagement.search);
  const { handleAddNewUserClick } = useUserManagement();
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

    // Trigger debounced search - will only execute after 1 second of no typing
    debouncedSearch(value);
  };

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerText}>User Management</div>

        <div className={styles.buttonContainer}>
          <PrimaryButton
            className={styles.primaryButton}
            onClick={handleAddNewUserClick}
          >
            + Add New User
          </PrimaryButton>

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
      <AddNewUser />
      <EditUser /> {/* Add the modal */}
    </div>
  );
};

export default UserManagementHeader;
