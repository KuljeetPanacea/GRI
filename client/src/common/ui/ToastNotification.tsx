import { Snackbar, Alert } from "@mui/material";

const ToastNotification = ({ open, onClose, message, severity }: { open: boolean; onClose: () => void; message: string; severity: "success" | "error" | "warning" | "info" }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
    <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default ToastNotification;