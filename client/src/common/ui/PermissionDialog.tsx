import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";

interface PermissionDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const PermissionDialog = ({ open, onClose, message }: PermissionDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Permission Denied</DialogTitle>
    <DialogContent>
      <p>{message}</p>
      <Button onClick={onClose} variant="contained" sx={{ mt: 2 ,backgroundColor: "#DB1F42",color: "white"}}>
        Close
      </Button>
    </DialogContent>
  </Dialog>
);

export default PermissionDialog;
