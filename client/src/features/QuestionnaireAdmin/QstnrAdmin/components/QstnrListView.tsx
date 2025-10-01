import { Snackbar, Typography } from "@mui/material";
import { Edit, PlayArrow, Add, Delete } from "@mui/icons-material";
import { EnhancedTable } from "../../../../common/ui/EnhancedTable";
import Pagination from "../../../../common/ui/Pagination";
import { useQstnrAdmin } from "../useQstnrAdmin";
import styles from "../QstnrAdmin.module.css";
import { useState } from "react";
import QstnrActionModal from "./QstnrActionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addQstnrId,
  clearQstnr,
  getQstnrThunk,
  setQstnrPhase,
  setSelectedQstnrName,
} from "../../../../redux/defineQstnrSlice";
import { AppDispatch, RootState } from "../../../../redux/store";
import useAxios from "../../../../api/useAxios";
import { useNavigate } from "react-router-dom";
const QstnrListView = () => {
  const {
    qstnrList,
    handleEdit,
    handlePageChange,
    currentPage,
    selectedRows,
    setSelectedRows,
    handleDelete,
    handleDuplicate,
    totalPages,
    totalCount,
  } = useQstnrAdmin();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "duplicate">(
    "delete"
  );
  const [selectedQstnrId, setSelectedQstnrId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const axiosInstance = useAxios();
  const filtersState = useSelector((state: RootState) => state.filters);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const openModal = (type: "delete" | "duplicate", id: string) => {
    setSelectedQstnrId(id);
    setActionType(type);
    setModalOpen(true);
  };

const confirmAction = async () => {
  try {
    if (selectedQstnrId) {
      if (actionType === "delete") {
        await handleDelete(selectedQstnrId);
        setSnackbarMessage("Questionnaire deleted successfully");
      } else {
        await handleDuplicate(selectedQstnrId);
        setSnackbarMessage("Questionnaire duplicated successfully");
      }
    }

    setModalOpen(false);
    setSnackbarOpen(true);
    dispatch(clearQstnr());

    // Calculate new total count and pages
    const newTotalCount = totalCount - (actionType === "delete" ? 1 : 0);
    const newTotalPages = Math.ceil(newTotalCount / 5);

    const nextPage =
      currentPage > newTotalPages ? newTotalPages : currentPage || 1;

    // Fetch data with corrected page
    dispatch(
      getQstnrThunk({
        filters: filtersState,
        axiosInstance,
        currentPage: nextPage,
        limit: 5,
      })
    );
  } catch (error) {
    setSnackbarMessage(`Failed to ${actionType} questionnaire`);
    setSnackbarOpen(true);
    console.error(`Error performing ${actionType} action:`, error);
  }
};


  const columns = [
    {
      key: "title",
      header: "Name",
    },
    {
      key: "complianceType",
      header: "Compliance",
      render: (value: string) => (
        <Typography color="primary">{value}</Typography>
      ),
    },
    {
      key: "phase",
      header: "Questionnaire type",
    },
    {
      key: "createDtTime",
      header: "Date Published",
      render: (value: string) => {
        const date = new Date(value);
        const isValidDate = !isNaN(date.getTime());

        return (
          <Typography>
            {isValidDate
              ? date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"}{" "}
            {/* or "" or "N/A" */}
          </Typography>
        );
      },
    },
    {
      key: "updateDtTime",
      header: "Last Updated",
      render: (value: string) => {
        const date = new Date(value);
        const isValidDate = !isNaN(date.getTime());

        return (
          <Typography>
            {isValidDate
              ? date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </Typography>
        );
      },
    },
    {
      key: "status",
      header: "Status",
    },
    // { key: "__v", header: "Version" },
    {
      key: "actions",
      header: "Actions",
      render: (
        _: unknown,
        row: { id: string; phase: string; title: string }
      ) => (
        <>
          <Edit
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.id);
              dispatch(setSelectedQstnrName(row.title));
              dispatch(setQstnrPhase(row.phase));
            }}
            style={{ cursor: "pointer", marginRight: 8 }}
          />
          <PlayArrow
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addQstnrId(row.id));
              setTimeout(() => {
                navigate(`/landing/qstn-preview?questionnaireId=${row.id}`);
              }, 100);
            }}
            style={{ cursor: "pointer", marginRight: 8 }}
          />
          <Add
            onClick={() => {
              // e.stopPropagation();
              openModal("duplicate", row.id);
              console.log("Add clicked");
            }}
            style={{ cursor: "pointer", marginRight: 8 }}
          />
          <Delete
            color="error"
            onClick={() => {
              // e.stopPropagation();
              openModal("delete", row.id);
              // deleteQuestionnaire(row._id);
            }}
            style={{ cursor: "pointer" }}
          />
        </>
      ),
    },
  ];

  return (
    <div className={styles.qstnrListViewContainer}>
      <EnhancedTable
        columns={columns}
        data={qstnrList}
        selectedRows={selectedRows}
        onRowSelect={setSelectedRows}
        idField="id"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={5}
        totalItems={totalCount}
        onPageChange={handlePageChange}
      />
      <QstnrActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        actionType={actionType}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default QstnrListView;
