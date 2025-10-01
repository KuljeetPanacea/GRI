import styles from "./Device.module.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import EnhancedTable from "../../../../../common/ui/EnhancedTable";
import Pagination from "../../../../../common/ui/Pagination";
import { Tooltip, IconButton, Snackbar, Alert } from "@mui/material";
import SelectDropdown from "../../../../../common/ui/SelectDropdown";
import { useDeviceIdentification } from "../useDeviceIdentificationView";
import PrimaryButton from "../../../../../common/ui/PrimaryButton";
import { device } from "../../../../../redux/projectManagementSlice";
import Modal from "@mui/material/Modal";
import { useState } from "react";

const Device: React.FC = () => {
  const {
    handleCategoryChange,
    handleDeleteClick,
    deleteId,
    setDeleteId,
    confirmDelete,
    currentPage,
    setCurrentPage,
    devices,
    totalPages,
    totalCount,
    deviceOptions,
    filteredCategory,
    handleSendClick,
    snackbar,
    setSnackbar,
    handlePlayClick,
    openQstnModal,
    setOpenQstnModal,
    qstnList,
    qstnLoading,
    qstnError,
    qstnIndex,
    setQstnIndex,
    selectedProject,
  } = useDeviceIdentification();

  // State for send modal
  const [openSendModal, setOpenSendModal] = useState(false);

  const handleSendModalClick = (sendType: 'latest' | 'all') => {
    handleSendClick(sendType);
    setOpenSendModal(false);
  };

  const columns = [
    {
      key: "deviceType",
      header: (
        <div className={styles.inlineDropdown}>
          <SelectDropdown
            options={[{ label: "All", value: "All" }, ...deviceOptions]}
            title="Device Category"
            value={filteredCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={styles.noBorderDropdown}
          />
        </div>
      ),
    },
    { key: "deviceRefName", header: "Device Reference Name" },
    {
      key: "primaryAEStakeholderId",
      header: "Client Stakeholder Name",
      render: (stakeholders: string | null | undefined = "N/A") => {
        const getInitials = (name: string) => {
          const parts = name.trim().split(" ");
          return parts.length > 1
            ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
            : parts[0][0].toUpperCase();
        };
        const stakeholderList =
          typeof stakeholders === "string" && stakeholders.trim() !== ""
            ? stakeholders.split(",").map((s) => s.trim())
            : [];
        return (
          <div className={styles.stakeholders}>
            {stakeholderList.length > 0 ? (
              stakeholderList.map((name, index) => (
                <span key={index} className={styles.stakeholder}>
                  {getInitials(name)}
                </span>
              ))
            ) : (
              <span className={styles.stakeholder}>N/A</span>
            )}
            <PersonAddIcon className={styles.plusIcon} />
          </div>
        );
      },
    },
    {
      key: "updateDtTime",
      header: "Date Published",
      render: () => (
        <>
          <p>{selectedProject?.updateDtTime.split("T")[0]}</p>
        </>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: number, row: device) => (
        <>
          <Tooltip title="Play">
            <IconButton
              size="small"
              onClick={() => handlePlayClick(row.questionnaireId)}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(row.deviceRefName ?? "")}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <EnhancedTable
        columns={columns}
        data={devices ?? []}
        showCheckbox={false}
        selectedRows={[]}
        onRowSelect={() => {}}
        idField="id"
      />
      {totalCount > 4 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={4}
          totalItems={totalCount ?? 0}
          onPageChange={setCurrentPage}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this device?</p>
            <div className={styles.modalButtons}>
              <PrimaryButton children={"Delete"} onClick={confirmDelete} />
              <PrimaryButton
                children={"Cancel"}
                onClick={() => setDeleteId(null)}
                className={styles.cancelButton}
              />
            </div>
          </div>
        </div>
      )}

      {/* Single Send Button */}
      <div className={styles.sendButton}>
        <PrimaryButton
          children="Send"
          onClick={() => setOpenSendModal(true)}
        />
      </div>

      {/* Send Options Modal */}
      <Modal open={openSendModal} onClose={() => setOpenSendModal(false)}>
        <div className={styles.sendModalContent}>
          <div className={styles.sendModalHeader}>
            <h3>
              <SendIcon style={{ color: "#1976d2", marginRight: "8px" }} />
              Send Task Assigned
            </h3>
          </div>
          <div className={styles.sendModalBody}>
            <p className={styles.sendModalDescription}>
              Choose how you would like to send the questionnaire:
            </p>
            <div className={styles.sendOptionsContainer}>
              <div
                className={styles.sendOption}
                onClick={() => handleSendModalClick('latest')}
              >
                <div className={styles.sendOptionIcon}>
                  <PersonIcon />
                </div>
                <div className={styles.sendOptionContent}>
                  <h4>Send to Newly Added</h4>
                  <p>Send an email of the newly added tasks to the stakeholders</p>
                </div>
              </div>
              <div
                className={styles.sendOption}
                onClick={() => handleSendModalClick('all')}
              >
                <div className={styles.sendOptionIcon}>
                  <GroupIcon />
                </div>
                <div className={styles.sendOptionContent}>
                  <h4>Send to All</h4>
                  <p>Send an email of all tasks to the stakeholders</p>
                </div>
              </div>
            </div>
            <div className={styles.sendModalActions}>
              <PrimaryButton
                children="Cancel"
                onClick={() => setOpenSendModal(false)}
                className={styles.sendCancelButton}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Questionnaire Modal */}
      <Modal open={openQstnModal} onClose={() => setOpenQstnModal(false)}>
        <div className={styles.qstnModalContent}>
          <div className={styles.qstnModalHeader}>
            <h3>
              <PlayArrowIcon style={{ color: "#1976d2" }} />
              Questionnaire Flow
            </h3>
          </div>
          <div className={styles.qstnModalBody}>
            {qstnLoading ? (
              <div className={styles.qstnLoadingState}>
                <div className={styles.qstnLoadingSpinner}></div>
                <p>Loading questionnaire...</p>
              </div>
            ) : qstnError ? (
              <div className={styles.qstnErrorState}>
                <p>{qstnError}</p>
              </div>
            ) : qstnList.length > 0 ? (
              <div className={styles.qstnContent}>
                <div className={styles.qstnQuestion}>
                  <p className={styles.qstnQuestionText}>
                    <span className={styles.qstnQuestionNumber}>
                      Q{qstnIndex + 1}:
                    </span>{" "}
                    {qstnList[qstnIndex].text}
                  </p>
                  {/* Render choices if available */}
                  {qstnList[qstnIndex].choices &&
                    qstnList[qstnIndex].choices.length > 0 && (
                      <ul className={styles.qstnChoicesList}>
                        {qstnList[qstnIndex].choices.map(
                          (choice: { value: string }, idx: number) => (
                            <li key={idx} className={styles.qstnChoiceItem}>
                              {choice.value}
                            </li>
                          )
                        )}
                      </ul>
                    )}
                </div>
                <div className={styles.qstnNavigationControls}>
                  <button
                    className={`${styles.qstnNavButton} ${styles.secondary}`}
                    onClick={() => setQstnIndex((i) => Math.max(0, i - 1))}
                    disabled={qstnIndex === 0}
                  >
                    Previous
                  </button>
                  <div className={styles.qstnProgress}>
                    <span>
                      {qstnIndex + 1} of {qstnList.length}
                    </span>
                    <div className={styles.qstnProgressBar}>
                      <div
                        className={styles.qstnProgressFill}
                        style={{
                          width: `${
                            ((qstnIndex + 1) / qstnList.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <button
                    className={styles.qstnNavButton}
                    onClick={() =>
                      setQstnIndex((i) => Math.min(qstnList.length - 1, i + 1))
                    }
                    disabled={qstnIndex === qstnList.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.qstnEmptyState}>
                <p>No questions found in this questionnaire.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Device;