import EnhancedTable from "../../../common/ui/EnhancedTable";
import Pagination from "../../../common/ui/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setEditingUser,
  fetchUsers,
} from "../../../redux/userManagementSlice";
import { openEditUserModal } from "../../../redux/EditUserSlice";
import { useUserManagementTable } from "../hooks/useUserManagementTable";
import { Edit, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import useAxios from "../../../api/useAxios";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  closeDeleteModal,
  openDeleteModal,
} from "../../../redux/DeleteUserModalSlice";
import DeleteUserModal from "./DeleteUserModal";
import styles from "../UserManagement.module.css";
import { User } from "../../../redux/userManagementSlice";
import PermissionDialog from "../../../common/ui/PermissionDialog";
import { usePermissions } from "../hooks/usePermissions";
import { closeSnackbar } from "../../../redux/userManagementSlice";
import FeedbackSnackbar from "../../../common/ui/FeedbackSnackbar";

const UserManagementListView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const snackbar = useSelector(
    (state: RootState) => state.userManagement.snackbar
  );
  const axiosInstance = useAxios();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isDeleteModalOpen = useSelector(
    (state: RootState) => state.userDeleteModal.isDeleteModalOpen
  );
  const { search, status, usersOnboarded, roles } = useSelector(
    (state: RootState) => state.userManagement
  );
  const { totalPages, currentPage, rowsPerPage, totalCount, users } =
    useUserManagementTable();
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(""); 

  const { canEditUser, canDeleteUser } = usePermissions();

  const currentUser = useSelector((state: RootState) => state.login.user);
  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    if (validPage !== currentPage) {
      dispatch(setCurrentPage(validPage));
    }
  };
  useEffect(() => {
    const rolesString = Array.isArray(roles) ? roles.join(",") : roles;
    dispatch(
      fetchUsers({
        axiosInstance,
        page: currentPage,
        limit: 5,
        filters: { search, status, usersOnboarded, roles: rolesString },
      })
    );
  }, [
    dispatch,
    axiosInstance,
    currentPage,
    roles,
    status,
    search,
    usersOnboarded,
  ]);

  const handleEditUser = (user: User) => {
    if (!canEditUser(user)) {
      setDialogMessage("You are not allowed to edit this user.");
      setPermissionDialogOpen(true);
      return;
    }
    dispatch(setEditingUser(user));
    dispatch(openEditUserModal());
  };

  const handleDeleteUser = (userId: string, user: User) => {
    if (!canDeleteUser(user)) {
      setDialogMessage("You are not allowed to delete this user.");
      setPermissionDialogOpen(true);
      return;
    }
    setSelectedUserId(userId);
    dispatch(openDeleteModal(true));
  };

  const columns = [
    { key: "name", header: "User Name" },
    { key: "roles", header: "Role" },
    { key: "mobileNumber", header: "Contact Number" },
    { key: "email", header: "email" },
    {
      key: "status",
      header: "Status",
      render: (_: number, row: User) => (
        <div
          className={
            row.status === "inActive"
              ? styles.inactiveStatus
              : styles.activeStatus
          }
        >
          {row.status === "Inactive" ? "Inactive" : "Active"}
        </div>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      render: (_: number, row: User) => {
        // console.log("Row inside render function:", row);
        return (
          <>
            <IconButton
              onClick={() => {
                handleEditUser(row);
                console.log("Row when clicking Edit:", row);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            {/* if the role is SuperAdmin, do not show the delete button */}
            {!row.roles.includes("SuperAdmin") && (
              <IconButton
                onClick={() => {
                  handleDeleteUser(row.id, row);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <EnhancedTable
        columns={columns}
        data={
          currentUser?.roles.includes("SuperAdmin")
            ? users
            : users.filter((user) => !user.roles.includes("SuperAdmin"))
        }
        showCheckbox={false}
        idField="id"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={rowsPerPage}
        totalItems={totalCount}
        // onPageChange={(page) => dispatch(setCurrentPage(page))}
        onPageChange={handlePageChange}
      />
      {/* Delete Modal Component */}
      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={() => dispatch(closeDeleteModal())}
        userId={selectedUserId?.toString() ?? ""}
        onDelete={() => {
          dispatch(closeDeleteModal());
        }}
        onDeleteSuccess={() =>
          dispatch(
            fetchUsers({
              axiosInstance,
              page: currentPage,
              limit: 5,
              filters: {
                search,
                status,
                usersOnboarded,
                roles: Array.isArray(roles) ? roles.join(",") : roles,
              },
            })
          )
        }
      />
      <PermissionDialog
        open={permissionDialogOpen}
        onClose={() => setPermissionDialogOpen(false)}
        message={dialogMessage}
      />
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => dispatch(closeSnackbar())}
      />
    </div>
  );
};

export default UserManagementListView;
