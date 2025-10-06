import React, { useState, useEffect } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import EnhancedTable from "../../../../common/ui/EnhancedTable";
import { Tooltip, IconButton } from "@mui/material";
import { useSalesScoping } from "./useSalesScoping";
import SalesScopingAddEdit from "./SalesScopingAddEdit";
import {
  setViewMode,
  selectViewMode,
  setAddEditMode,
} from "../../../../redux/salesScopingSlice";
import { useDispatch, useSelector } from "react-redux";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { scopingQSTRNR } from "../../../../redux/projectManagementSlice";
import useAxios from "../../../../api/useAxios";
import { getUserById } from "../../../../api/user";
import { getScopingQstnr } from "../../../../api/qstnr";

const SalesScopingView: React.FC = () => {
  const { handleSend } = useSalesScoping(5);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const viewMode = useSelector(selectViewMode);
  const dispatch = useDispatch();
  const axiosInstance = useAxios();
  const [scopingData, setScopingData] = useState<scopingQSTRNR[]>([]);

  // Fetch scoping questionnaires and then user names for createdBy
  useEffect(() => {
    const fetchScopingAndUsers = async () => {
      try {
        // Fetch scoping questionnaires
        const response = await getScopingQstnr(axiosInstance);
        // Expecting response to be an array of questionnaires
        const questionnaires: scopingQSTRNR[] = Array.isArray(response) ? response : (response?.data ?? []);
        setScopingData(questionnaires);

        // Fetch user display names for createdBy mapping
        const uniqueUserIds = Array.from(
          new Set((questionnaires || []).map((q: scopingQSTRNR) => q.createdBy).filter(Boolean))
        );
        const userPromises = uniqueUserIds.map(async (id) => {
          if (!id) {
            return { id: "", name: "Unknown" } as { id: string; name: string };
          }
          try {
            const user = await getUserById(axiosInstance, id as string);
            return { id, name: user || "Unknown" };
          } catch {
            return { id, name: "Unknown" };
          }
        });
        const users = await Promise.all(userPromises);
        const map: Record<string, string> = {};
        users.forEach(({ id, name }) => {
          if (id !== undefined) {
            map[id] = name;
          }
        });
        setUserMap(map);
      } catch {
        // Silently ignore for now; UI will show empty table
        setScopingData([]);
      }
    };

    fetchScopingAndUsers();
  }, [axiosInstance]);

  const columns = [
    {
      key: "title",
      header: "Name (Scoping Questionnaire)",
    },
    {
      key: "createDtTime",
      header: "Date Published",
      render: (_: number, row: scopingQSTRNR) =>
        row.createDtTime?.split("T")[0] ?? "",
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (_: number, row: scopingQSTRNR) =>
        row.createDtTime?.split("T")[0] ?? "",
    },
    {
      key: "createdBy",
      header: "Created By",
      render: (_: number, row: scopingQSTRNR) =>
        row.createdBy ? userMap[row.createdBy] || "Loading..." : "Unknown",
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
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
        </>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "1rem" }}>
      {viewMode === "VIEW" && (
        <div>
          <EnhancedTable
            columns={columns}
            data={scopingData || []}
            showCheckbox={false}
            selectedRows={selectedRows}
            onRowSelect={setSelectedRows}
            idField="id"
          />
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <div
              style={{ color: "#DB1F42", marginTop: "1rem", cursor: "pointer" }}
              onClick={() => {
                dispatch(setViewMode("ADD_EDIT"));
                dispatch(setAddEditMode("ADD_EXISTING"));
              }}
            >
              + Add/Edit
            </div>
            <PrimaryButton onClick={handleSend} children="Send" />
          </div>
        </div>
      )}
      {viewMode === "ADD_EDIT" && (
        <div>
          <SalesScopingAddEdit />
        </div>
      )}
    </div>
  );
};

export default SalesScopingView;
