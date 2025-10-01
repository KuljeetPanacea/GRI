import {
    Grid,
    Card,
    Typography,
    IconButton,
    CardActions,
    Box,
    Menu,
    MenuItem,
    CircularProgress,
    Divider,
} from "@mui/material";
import { MoreVert as  Edit, Delete, MoreHoriz } from "@mui/icons-material";
import { RootState, AppDispatch } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  setEditingUser,
  // deleteUser,
  fetchUsers,
  deleteUser,
} from "../../../redux/userManagementSlice";
import { openEditUserModal } from "../../../redux/EditUserSlice";
import DeleteUserModal from "./DeleteUserModal";
import {
  closeDeleteModal,
  openDeleteModal,
} from "../../../redux/DeleteUserModalSlice";
import { useUserManagementTable } from "../hooks/useUserManagementTable";
import useAxios from "../../../api/useAxios";
import styles from "./UserManagementGridView.module.css";
import {User} from "../../../redux/userManagementSlice";
import PermissionDialog from "../../../common/ui/PermissionDialog";
import { usePermissions } from "../hooks/usePermissions";
import { closeSnackbar } from "../../../redux/userManagementSlice";
import FeedbackSnackbar from "../../../common/ui/FeedbackSnackbar";
const UserManagementGridView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const snackbar = useSelector((state: RootState) => state.userManagement.snackbar);
  const axiosInstance = useAxios();
  const { currentPage, users } = useUserManagementTable();
  const isDeleteModalOpen = useSelector(
    (state: RootState) => state.userDeleteModal.isDeleteModalOpen
  );
  const loading = useSelector(
    (state: RootState) => state.userManagement.loading
  );
  const error = useSelector((state: RootState) => state.userManagement.error);
  const { search, status, usersOnboarded, roles } = useSelector(
    (state: RootState) => state.userManagement
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const currentUser = useSelector((state: RootState) => state.login.user); // Adjust based on your actual auth slice
  const isCurrentUserSuperAdmin = currentUser?.roles?.includes("SuperAdmin");
  const { canEditUser, canDeleteUser } = usePermissions();

  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');



  useEffect(() => {
    dispatch(fetchUsers({axiosInstance, page:currentPage, limit:5,filters: {search, status, usersOnboarded, roles: Array.isArray(roles) ? roles.join(',') : roles}}));
  }, [dispatch, axiosInstance, currentPage]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status ? user.status === status : true;
    const canViewUser = isCurrentUserSuperAdmin || !user.roles.includes("SuperAdmin");
    return matchesSearch && matchesStatus && canViewUser;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    if (selectedUser && !canEditUser(selectedUser)) {
      setDialogMessage("You are not allowed to edit this user.");
      setPermissionDialogOpen(true);
      handleMenuClose();
      return;
    }
  
    if (selectedUser) {
      dispatch(setEditingUser(selectedUser));
      dispatch(openEditUserModal());
    }
    handleMenuClose();
  };

  const handleDeleteUser = (userId: string) => {
    if (selectedUser && !canDeleteUser(selectedUser)) {
      setDialogMessage("You are not allowed to delete this user.");
      setPermissionDialogOpen(true);
      handleMenuClose();
      return;
    }
    setSelectedUserId(userId);
    dispatch(openDeleteModal(true));
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} className={styles.gridContainer}>
      {filteredUsers.map((user) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
          <Card className={styles.gridCard}>
            <div className={styles.headerContainer}>
              <div className={styles.contentContainer}>
                <Typography variant="h4">{user.name}</Typography>
                <Typography variant="body2" className={styles.roleContainer}>
                  {user.roles.join(", ")}
                </Typography>
              </div>

              <Divider />
              <div className={styles.dataContainer}>
                <Box className={styles.leftgridData}>
                  <Typography variant="body2">Contact</Typography>
                  <Typography variant="body2">Email</Typography>
                </Box>
                <Box className={styles.gridData}>
                  <Typography variant="body2">
                    +{user.countryCode} - {user.mobileNumber}
                  </Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
              </div>
            </div>
            <Divider />
            <CardActions className={styles.cardActions}>
              <div
                className={
                  user.status === "Inactive"
                    ? styles.inactiveStatusGrid
                    : styles.activeStatusGrid
                }
              >
                {user.status === "Inactive" ? "Inactive" : "Active"}
              </div>
              <IconButton onClick={(event) => handleMenuOpen(event, user)}>
                <MoreHoriz />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditUser}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        
        {selectedUser?.roles.includes("SuperAdmin") ? null : (
          <MenuItem
          onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
          >
            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}

      </Menu>

      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={() => dispatch(closeDeleteModal())}
        userId={selectedUserId?.toString() ?? ''}
        onDelete={() => {
          if (selectedUserId) {
            dispatch(deleteUser(selectedUserId));
            dispatch(closeDeleteModal());
          }
        }}
        onDeleteSuccess={() => dispatch(fetchUsers({axiosInstance, page:currentPage, limit:5,filters: {search, status, usersOnboarded, roles: Array.isArray(roles) ? roles.join(',') : roles}}))}
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

    </Grid>
  );
};

export default UserManagementGridView;
