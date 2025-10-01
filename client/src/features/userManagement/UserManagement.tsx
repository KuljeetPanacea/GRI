import React from "react";
import styles from "./UserManagement.module.css";
import UserManagementListView from "./components/UserManagementListView";
import UserFilter from "./components/UserFilter";
import UserManagementHeader from "./components/UserManagementHeader";
import UserManagementGridView from "./components/UserManagementGridView";
import { useUserManagement } from "./useUserManagement";

const UserManagement : React.FC = () => {
  const { viewMode } = useUserManagement();
  return (
    <div className={styles.mainContainer}>
      <UserManagementHeader />

      <div className={styles.bodyContainer}>
        <UserFilter />
        <div className={styles.scrollableArea}>
          <div className={styles.gridContainer}></div>
          {viewMode === "list" ? (
            <UserManagementListView />
          ) : (
            <UserManagementGridView />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
