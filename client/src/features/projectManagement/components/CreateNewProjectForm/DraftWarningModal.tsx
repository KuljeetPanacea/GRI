import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../../../../common/ui/PrimaryButton";

interface DraftWarningModalProps {
  open: boolean;
  onClose: () => void; // For the X button
  onOk: () => void;    // For the OK button
  message: string;
}

const DraftWarningModal: React.FC<DraftWarningModalProps> = ({ open, onClose, onOk, message }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="draft-warning-title"
    aria-describedby="draft-warning-description"
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(2px)",
    }}
  >
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 340,
        maxWidth: "90vw",
        textAlign: "center",
        position: "relative",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography id="draft-warning-title" variant="body1" gutterBottom>
        {message}
      </Typography>
      <PrimaryButton onClick={onOk}>OK</PrimaryButton>
    </Box>
  </Modal>
);

export default DraftWarningModal;