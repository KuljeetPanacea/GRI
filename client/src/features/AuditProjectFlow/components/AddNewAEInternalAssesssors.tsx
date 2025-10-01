import { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import SelectDropdown from "../../../common/ui/SelectDropdown";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import TextInput from "../../../common/ui/TextInput";
import styles from "../styles/AddNewAEInternalAssesssors.module.css";
import { RootState, useAppSelector } from "../../../redux/store";
import { updateProject } from "../../../api/project";
import useAxios from "../../../api/useAxios";
import usePVHeader from "../hooks/useAuditProjectHeader";
import { updateSelectedProjectAssessors } from "../../../redux/projectViewSlice";
import { useDispatch } from "react-redux";
import { validateEmail } from "../../userManagement/utils/validateEmail";

interface AddNewAEInternalAssesssorsProps {
  open: boolean;
  onClose: () => void;
}

const AddNewAEInternalAssesssors = ({
  open,
  onClose,
}: AddNewAEInternalAssesssorsProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const project = useAppSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const axiosInstance = useAxios();
  const dispatch = useDispatch();
  const { showSnackbarMessage } = usePVHeader();

  const  handleAddStakeholder = async () => {
      if (!fullName.trim() || !email.trim() || !role.trim() || !department.trim() || !mobileNumber.trim()) {
    showSnackbarMessage("All fields are required.", "error");
    return;
  }
  if (!validateEmail(email)) {
    showSnackbarMessage("Please enter a valid email address.", "error");
    return;
  }
  if (mobileNumber.length !== 10) {
    setPhoneError(true);
    showSnackbarMessage("Please enter a valid 10-digit phone number.", "error");
    return;
  }
    // Create an object for the new assessor
    const newAssessor = {
      name: fullName,
      email,
      role,
      department,
      mobileNumber,
    };
  
    try {
      
      const response = await updateProject(axiosInstance, project?._id || "", {
        aeInternalAssessors: [newAssessor],
        __v: 0,
      });
      
      if (response.data.message) {
        dispatch(updateSelectedProjectAssessors([newAssessor]));
        onClose();
        showSnackbarMessage(response.data.message || "Stakeholder added successfully", "info");
      }
    } catch (error) {
      showSnackbarMessage("Failed to add stakeholder", "error");
      return error;
    }
  };
  useEffect(() => {
    
    if (open) {
      setFullName("");
      setEmail("");
      setRole("");
      setDepartment("");
      setPhoneError(false);
      setMobileNumber("");
      // setDevice("");
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        sx={{ "& .MuiDialog-paper": { borderRadius: "8px" } }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ padding: 4 }} onKeyDown={(event)=> {if(event.key ==='Enter'){handleAddStakeholder()}}}>
          <Typography variant="h3" sx={{ marginBottom: 4, marginTop:4 }}>
            Add New AE Internal Assessor
          </Typography>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Typography variant="h4" sx={{ marginBottom: 1 }}>
                Full Name
              </Typography>
              <TextInput
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className={styles.formField}>
              <Typography variant="h4" sx={{ marginBottom: 1 }}>
                Email
              </Typography>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!email && !validateEmail(email)}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Typography variant="h4" sx={{ marginBottom: 1 }}>
                Role
              </Typography>
              <TextInput
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className={styles.formField}>
              <Typography variant="h4" sx={{ marginBottom: 1 }}>
                Department
              </Typography>
              <TextInput
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.AEformRow}>
            <Typography variant="h4" sx={{ marginTop: 2 }}>
              Phone No.
            </Typography>
            <TextInput
              value={mobileNumber}
              onChange={(e) => {
                 const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) {
                    setMobileNumber(val);
                  }
                  setPhoneError(false);
                }}
            />
            {phoneError && (
              <Typography variant="body2" className={styles.phoneErrorText}>
                Please enter a valid 10-digit phone number.
              </Typography>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <PrimaryButton
              className={styles.addButton}
              onClick={handleAddStakeholder}
              type="submit"
            >
              Add
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewAEInternalAssesssors;
