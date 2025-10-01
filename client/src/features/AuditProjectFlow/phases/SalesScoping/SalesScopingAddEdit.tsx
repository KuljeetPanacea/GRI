import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./SalesScoping.module.css";
import {
  setAddEditMode,
  selectAddEditMode,
  toggleSelection,
  // toggleDefaultStatus,
  setViewMode,
} from "../../../../redux/salesScopingSlice";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import EnhancedTable from "../../../../common/ui/EnhancedTable";
import { Tooltip, IconButton, Snackbar, Alert } from "@mui/material";
// import {  Switch } from "@mui/material";
// import { styled } from "@mui/material/styles";
import SSCreateNew from "./SSCreateNew";
import {
  fetchProjectById,
  PaginatedProjectResponse,
  scopingQSTRNR,
} from "../../../../redux/projectManagementSlice";
import useAxios from "../../../../api/useAxios";
import { getScopingQstnr } from "../../../../api/qstnr";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import store, { RootState, AppDispatch } from "../../../../redux/store";
import { updateProject } from "../../../../api/project";
import { setSelectedProject } from "../../../../redux/projectViewSlice";
import { getUserById } from "../../../../api/user";

// const IOSSwitch = styled(Switch)(() => ({
//   marginLeft: 2,
//   width: 34,
//   height: 20,
//   padding: 0,
//   "& .MuiSwitch-switchBase": {
//     padding: 0,
//     margin: -0.5,
//     transitionDuration: "300ms",
//     "&.Mui-checked": {
//       transform: "translateX(16px)",
//     marginY:0.5,
//     marginLeft:-2,
//       color: "#fff",
//       "& + .MuiSwitch-track": {
//         backgroundColor: "#65C466",
//         opacity: 1,
//       },
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     width: 14,
//     height: 14,
//     margin: "3px",
//   },
//   "& .MuiSwitch-track": {
//     borderRadius: 13,
//     backgroundColor: "#E9E9EA",
//     opacity: 1,
//   },
// }));

const SalesScopingAddEdit: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const axiosInstance = useAxios();

  const [allQstnr, setAllQstnr] = useState<scopingQSTRNR[]>([]);

  React.useEffect(() => {
    const fetchQuestionnaires = async () => {
      const data = await getScopingQstnr(axiosInstance);
      setAllQstnr(data);
    };
    console.log(allQstnr);
    fetchQuestionnaires();
  }, [axiosInstance]);
  const loginUser = useSelector((state: RootState) => state.login.user);

  const [selectedRows, setSelectedRows] = useState<string[]>(
    allQstnr.filter((q) => q.id !== undefined).map((q) => q.id as string)
  );
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const project = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const selectedQuestionnaireIds = project?.scopingQSTRNRData?.map((q) => q.id);

  const allQuestionnaires = allQstnr.map((q) => ({
    ...q,
    isSelected: selectedQuestionnaireIds?.includes(q.id),
  }));

  React.useEffect(() => {
    const initialSelected = allQuestionnaires
      .filter((q) => q.id !== undefined && q.isSelected)
      .map((q) => q.id as string);
    setSelectedRows(initialSelected);
  }, [allQstnr]);

  React.useEffect(() => {
  const fetchQuestionnairesAndUsers = async () => {
    const data = await getScopingQstnr(axiosInstance);
    setAllQstnr(data);

    // Get unique user IDs from the questionnaires
    const userIds = Array.from(new Set(data.map((q: scopingQSTRNR) => q.createdBy))).filter(
      (id): id is string => typeof id === "string"
    );

    // Fetch users in parallel
    const userPromises = userIds.map(async (id: string) => {
      try {
        const user = await getUserById(axiosInstance, id);
        return { id, name: user || "Unknown" };
      } catch {
        return { id, name: "Unknown" };
      }
    });

    const users = await Promise.all(userPromises);

    // Build a userId -> name map
    const userMap: Record<string, string> = {};
    users.forEach(({ id, name }) => {
      userMap[String(id)] = name;
    });

    setUserMap(userMap);
  };

  fetchQuestionnairesAndUsers();
}, [axiosInstance]);


  const handleRowSelect = (selectedIds: string[]) => {
    const addedRows = selectedIds.filter((id) => !selectedRows.includes(id));
    const removedRows = selectedRows.filter((id) => !selectedIds.includes(id));

    if (addedRows.length > 0) {
      setSnackbarMessage("Questionnaire Added");
      setSnackbarSeverity("success"); // Green color
    } else if (removedRows.length > 0) {
      setSnackbarMessage("Questionnaire Removed");
      setSnackbarSeverity("error"); // Red color
    }

    setOpenSnackbar(true);
    setSelectedRows(selectedIds);
    dispatch(toggleSelection(selectedIds));

    setTimeout(() => setOpenSnackbar(false), 1000); // Hide after 1 sec
  };

  const handleSaveChanges = async () => {
    if (!project?._id) return;
    try {
      await updateProject(axiosInstance, project._id, {
        scopingQSTRNR: selectedRows,
        __v: 1,
      });
      const updatedProjects: PaginatedProjectResponse = await dispatch(
        fetchProjectById({
          axiosInstance,
          userId: loginUser?.id || "",
          role: loginUser?.roles || [],
          page: 1,
          limit: 5,
        })
      ).unwrap();

      const updatedProject = updatedProjects.projects.find(
        (p) => p._id === project._id
      );

      if (updatedProject) {
        const updatedSelectedProject = {
          ...project,
          scopingQSTRNRData: updatedProject.scopingQSTRNRData,
        };
        dispatch(setSelectedProject(updatedSelectedProject));
      }
      setSnackbarMessage("Project updated successfully");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to update project");
      setSnackbarSeverity("error");
      throw Error(error instanceof Error ? error.message : String(error));
    }
    console.log(
      "This is the updated Project",
      store.getState().projectView.selectedProject
    );
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 1500);
  };

  const columns = [
    {
      key: "name",
      header: "Name (Scoping Questionnaire)",
      render: (_: number, row: scopingQSTRNR) => row.title,
    },
    {
      key: "createDtTime",
      header: "Date Published",
      render: (_: number, row: scopingQSTRNR) =>
        row.createDtTime?.split("T")[0],
    },
    {
      key: "updateDtTime",
      header: "Last Updated",
      render: (_: number, row: scopingQSTRNR) =>
        row.updateDtTime?.split("T")[0],
    },
    {
  key: "createdBy",
  header: "Created By",
  render: (_: number, row: scopingQSTRNR) =>
    row.createdBy ? userMap[row.createdBy] || "Loading..." : row.createdByName,
},
    {
      key: "actions",
      header: "Actions",
      render: (
        // _: number, row: scopingQSTRNR
      ) => (
        <>
          <Tooltip title="Play">
            <IconButton size="small">
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Comment">
            <IconButton size="small">
              <InsertCommentIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Default">
            <IconButton
              size="small"
              sx={{
                bgcolor: "#EAFFF3",
                borderRadius: "25px",
                paddingY: "8px",
                paddingX: "8px",
                color: "#207D48",
                marginLeft: "16px",
                fontSize: "12px"
              }}
            >
              Default{" "}
              <IOSSwitch
                checked={row.default}
                onChange={() => dispatch(toggleDefaultStatus(row.id || ""))}
              />
            </IconButton>
          </Tooltip> */}
        </>
      ),
    },
  ];

  const activeTab = useSelector(selectAddEditMode);
  const handleTabClick = (tab: "ADD_EXISTING" | "CREATE_NEW") => {
    dispatch(setAddEditMode(tab));
  };

  return (
    <>
      {/* Tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "ADD_EXISTING" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabClick("ADD_EXISTING")}
        >
          Add Existing
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "CREATE_NEW" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabClick("CREATE_NEW")}
        >
          Create New
        </button>
      </div>

      {/* -----------------Add Existing Table-------------------------- */}

      {activeTab === "ADD_EXISTING" ? (
        <div>
          <div style={{ marginTop: "1rem" }}>
            <EnhancedTable
              columns={columns}
              data={allQstnr}
              showCheckbox={true}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              idField="id"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <div
              style={{ color: "#DB1F42", cursor: "pointer" }}
              onClick={() => dispatch(setViewMode("VIEW"))}
            >
              ← Go Back
            </div>
            <PrimaryButton
              children={"Save Changes"}
              onClick={handleSaveChanges}
            />
          </div>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={1500}
            onClose={() => setOpenSnackbar(false)}
            sx={{ ml: "50px" }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity={snackbarSeverity}
              sx={{
                width: "100%",
                backgroundColor:
                  snackbarSeverity === "success" ? "#65c466" : "#DB1F42",
                "& .MuiAlert-icon": {
                  color: "white",
                },
                color: "#fff",
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      ) : (
        <SSCreateNew />
      )}
    </>
  );
};

export default SalesScopingAddEdit;
