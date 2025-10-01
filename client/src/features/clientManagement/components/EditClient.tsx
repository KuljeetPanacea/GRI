import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { closeEditClientModal } from '../../../redux/EditClientSlice';
// import { editClient } from '../../../redux/clientManagementSlice';
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, DialogContent, Typography, TextField } from '@mui/material';
import PrimaryButton from '../../../common/ui/PrimaryButton';
import SelectDropdown from '../../../common/ui/SelectDropdown';
import style from '../styles/ClientManagement.module.css'

const EditClient = () => {

    const dispatch = useDispatch();
    const open = useSelector(
        (state: RootState) => state.editClient.isEditClientModalOpen
    );

    const [formData, setFormData] = useState({
        id: 0,
        clientName: "",
        clientEmail: "",
        clientRole: "",
        clientStatus: "",
        clientDateJoined: "",
        clientLastLogin: "",
        clientPhone: "",
        clientAddress: "",
        clientDescription: "",
        pocName: "",
        pocContactNumber: "",
        pocEmailId: "",
        leadershipName: "",
        leadershipContactNo: "",
        leadershipEmailId: ""
    });

    const handleUpdateClient = () => {
        if (
            !formData.clientName ||
            !formData.clientEmail ||
            !formData.clientRole ||
            !formData.clientStatus
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        dispatch(closeEditClientModal());
    };

    return (
        <Dialog open={open} fullWidth maxWidth="md">
            <IconButton
                aria-label="close"
                onClick={() => dispatch(closeEditClientModal())}
                className={style.closeButton}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers sx={{ padding: 5 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Edit User
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Full Name"
                    margin="dense"
                    value={formData.clientName}
                    onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                    }
                />
                <TextField
                    fullWidth
                    placeholder="Email"
                    margin="dense"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                />
                <SelectDropdown
                    options={["Admin", "User", "Manager"]}
                    title="Role"
                    value={formData.clientRole}
                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                    isMultiple={true}
                />
                <SelectDropdown
                    options={["Active", "Inactive"]}
                    title="Status"
                    value={formData.clientStatus}
                    onChange={(e) => setFormData({ ...formData, clientStatus: e.target.value })}
                    isMultiple={false}
                />
                <TextField
                    fullWidth
                    placeholder="Description"
                    multiline
                    rows={3}
                    margin="dense"
                    value={formData.clientDescription}
                    onChange={(e) =>
                        setFormData({ ...formData, clientDescription: e.target.value })
                    }
                />
                <TextField
                    fullWidth
                    placeholder="POC Name"
                    margin="dense"
                    value={formData.pocName}
                    onChange={(e) => setFormData({ ...formData, pocName: e.target.value })}
                />
                  <TextField
                    fullWidth
                    placeholder="POC Contact Number"
                    margin="dense"
                    value={formData.pocContactNumber}
                    onChange={(e) => setFormData({ ...formData, pocContactNumber: e.target.value })}
                />
                  <TextField
                    fullWidth
                    placeholder="POC Email"
                    margin="dense"
                    value={formData.pocEmailId}
                    onChange={(e) => setFormData({ ...formData, pocEmailId: e.target.value })}
                />

                <TextField
                    fullWidth
                    placeholder="Leadership Name"
                    margin="dense"
                    value={formData.leadershipName}
                    onChange={(e) => setFormData({ ...formData, leadershipName: e.target.value })}
                />
                <TextField
                    fullWidth
                    placeholder="Leadership Contact Number"
                    margin="dense"
                    value={formData.leadershipContactNo}
                    onChange={(e) => setFormData({ ...formData, leadershipContactNo: e.target.value })}
                />
                <TextField
                    fullWidth
                    placeholder="Leadership Email"
                    margin="dense"
                    value={formData.leadershipEmailId}
                    onChange={(e) => setFormData({ ...formData, leadershipEmailId: e.target.value })}
                />


                <PrimaryButton onClick={handleUpdateClient}>Update</PrimaryButton>
            </DialogContent>
        </Dialog>
    );
};

export default EditClient
