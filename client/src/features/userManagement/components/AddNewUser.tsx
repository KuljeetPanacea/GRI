import { useEffect } from "react";
import { Dialog, DialogContent, Typography, IconButton } from "@mui/material";
import SelectDropdown from "../../../common/ui/SelectDropdown";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import styles from "./AddNewUser.module.css";
import useUserManagement from "../useUserManagement";
import useAxios from "../../../api/useAxios";
import TextInput from "../../../common/ui/TextInput";

const AddNewUser = () => {
  const axiosInstance = useAxios();

  const {
    open,
    name,
    setEmail,
    email,
    setName,
    roles,
    setRole,
    mobileNumber,
    setMobileNumber,
    handleCreateUser,
    handleAddNewUserClose,
    fetchRoles,
    roleError,
    setRoleError,
    emailError,
    setEmailError,
    phoneError,
    setPhoneError,
    emailErrorMessage,
    setEmailErrorMessage,
    createUserRoles,
    
  } = useUserManagement();

  useEffect(() => {
    fetchRoles(axiosInstance);
  }, []);

  return (
    <div className={styles.mainContainer}>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        sx={{ "& .MuiDialog-paper": { borderRadius: "20px" } }}
      >
        <IconButton
          aria-label="close"
          onClick={handleAddNewUserClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ padding: 5 }}>
          <Typography variant="h3" sx={{ marginTop: 2, mb: 4 }}>
            Add New User
          </Typography>
          <Typography variant="h4" sx={{ marginTop: 2 }}>
            Name <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />

          <div className={styles.inputEmailAndPhoneContainer}>
            <div style={{ width: "50%" }}>
              <Typography variant="h4" sx={{ marginTop: 2 }}>
                User Email <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextInput
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                  setEmailErrorMessage("");
                }}
              />
              {emailError && (
                <Typography variant="body2" className={styles.emailErrorText}>
                  {emailErrorMessage ||
                    "Please enter a valid business email address."}
                </Typography>
              )}
            </div>
            <div style={{ width: "50%" }}>
              <Typography variant="h4" sx={{ marginTop: 2 }}>
                Phone No. <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextInput
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
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

          <div>
            <SelectDropdown
              isMultiple={true}
              options={createUserRoles}
              title="Role"
              value={roles}
              onChange={(e) => {
                const selectedValues = Array.isArray(e.target.value)
                  ? e.target.value
                  : [e.target.value];

                setRole(selectedValues);
                if (selectedValues.length > 0) {
                  setRoleError(false);
                }
              }}
              className={styles.selectRoleDropdown}
            />
            {roleError && (
              <Typography variant="body2" className={styles.roleErrorText}>
                Please select at least one role.
              </Typography>
            )}
          </div>

          <PrimaryButton
            className={styles.modalCreateUserbutton}
            onClick={handleCreateUser}
          >
            Add
          </PrimaryButton>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewUser;
