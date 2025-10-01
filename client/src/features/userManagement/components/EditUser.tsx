import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../../redux/store";
import { closeEditUserModal } from "../../../redux/EditUserSlice";
import TextInput from "../../../common/ui/TextInput";
import { updateUsers } from "../../../api/user";
import useAxios from "../../../api/useAxios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { validateEmail } from "../utils/validateEmail";
import { validatePhone } from "../utils/validatePhone";
import styles from "./EditUser.module.css";
import { fetchUsers, showSnackbar } from "../../../redux/userManagementSlice";
import { AppDispatch } from "../../../redux/store";

const EditUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const axiosInstance = useAxios();
  const open = useSelector(
    (state: RootState) => state.editUser.isEditUserModalOpen
  );
  const editingUser = useSelector(
    (state: RootState) => state.userManagement.editingUser
  );
  const [editUserID, setEditUserID] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roles: [""],
    status: "",
    countryCode: 1,
    mobileNumber: Number(0),
    __v: 0,
  });
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const { currentPage } = useAppSelector(
    (state: RootState) => state.userManagement
  );
  const { search, status, usersOnboarded, roles } = useSelector(
    (state: RootState) => state.userManagement
  );

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        roles: editingUser.roles,
        status: editingUser.status,
        countryCode: editingUser.countryCode,
        mobileNumber: editingUser.mobileNumber,
        __v: editingUser.__v,
      });
      setEditUserID(editingUser.id);
    }
  }, [editingUser]);
  const handleUpdateUser = async () => {
    let hasError = false;
    if (!validateEmail(formData.email)) {
      setEmailError(true);
      hasError = true;
    }
    if (!validatePhone(formData.mobileNumber.toString())) {
      setPhoneError(true);
      hasError = true;
    }
    if (hasError) return;
    const updatedUser = { name: formData.name, email: formData.email, countryCode: formData.countryCode, mobileNumber: formData.mobileNumber, __v: formData.__v };
    console.log("Updating user:", formData);
    await updateUsers(axiosInstance, updatedUser, editUserID);

    // Show snackbar on success
    dispatch(
      showSnackbar({
        message: "User updated successfully.",
        severity: "success",
      })
    );

    // Optionally re-fetch the users list to reflect changes
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
    );
    dispatch(closeEditUserModal());
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      sx={{ "& .MuiDialog-paper": { borderRadius: "20px" } }}
    >
      <IconButton
        aria-label="close"
        onClick={() => dispatch(closeEditUserModal())}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ padding: 5 }}>
        <Typography variant="h3" sx={{ marginTop: 2, mb: 4 }}>
          Edit User
        </Typography>

        <Typography variant="h4" sx={{ marginTop: 2 }}>
          User name<span style={{ color: "red" }}>*</span>
        </Typography>
        <TextInput
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div style={{ width: "50%" }}>
            <Typography variant="h4" sx={{ marginTop: 2 }}>
              User email<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextInput
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setEmailError(false);
              }}
            />
            {emailError && (
              <Typography variant="body2" className={styles.emailErrorText}>
                Please enter a valid business email address.
              </Typography>
            )}
          </div>
          <div style={{ width: "50%" }}>
            <Typography variant="h4" sx={{ marginTop: 2 }}>
              Phone no.<span style={{ color: "red" }}>*</span>
            </Typography>
            <TextInput
              value={formData.mobileNumber}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  mobileNumber: Number(e.target.value),
                });
                setPhoneError(false);
              }}
            />
            {phoneError && (
              <Typography variant="body2" className={styles.phoneErrorText}>
                Please enter a valid 10-digit phone number.
              </Typography>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <Box className={styles.roleBoxWrapper}>
            <Box className={styles.roleBox}>
              <Typography>Role: {formData.roles}</Typography>
              <KeyboardArrowUpIcon fontSize="small" sx={{ color: "#DB1F42" }} />
            </Box>

            <Box className={styles.statusBox}>
              <Typography>Status: {formData.status}</Typography>
              <KeyboardArrowUpIcon fontSize="small" sx={{ color: "#DB1F42" }} />
            </Box>
          </Box>
        </div>

        <PrimaryButton onClick={handleUpdateUser}>Update</PrimaryButton>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
