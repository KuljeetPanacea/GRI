import React from "react";
import styles from "./styles/ClientManagement.module.css";
import ClientManagementHeader from "./components/ClientManagementHeader";
import ClientFilter from "./components/ClientFilter";
import ClientManagementGridView from "./components/ClientManagementGridView";
import ClientManagementListView from "./components/ClientManagementListView";
import useClientManagement from "./useClientManagement";

const ClientManagement: React.FC = () => {
  const { viewMode } = useClientManagement();
  return (
    <div className={styles.mainContainer}>
      <ClientManagementHeader />

      <div className={styles.bodyContainer}>
        <ClientFilter />

        <div className={styles.scrollableArea}>
          <div className={styles.gridContainer}></div>
          {viewMode === "list" ? (
            <ClientManagementListView />
          ) : (
            <ClientManagementGridView />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
