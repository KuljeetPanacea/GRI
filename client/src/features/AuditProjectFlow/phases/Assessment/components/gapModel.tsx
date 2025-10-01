// components/GapDescriptionModal.tsx
import React from "react";
import { Modal, Box, Typography, Button, TextareaAutosize } from "@mui/material";
import style from "./AssessmentComponents.module.css";

interface GapDescriptionModalProps {
  open: boolean;
  description: string;
  onChange: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const GapDescriptionModal: React.FC<GapDescriptionModalProps> = ({
  open,
  description,
  onChange,
  onClose,
  onSave,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={style.modalBox}>
        <Typography variant="h6" mb={2}>
          Add gap description here
        </Typography>
        <TextareaAutosize
          value={description}
          onChange={(e) => onChange(e.target.value)}
          minRows={6}
          className={style.modalTextarea}
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onSave} variant="contained" sx={{ bgcolor: "#d32f2f", color: "white", px: 4 }}>
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default GapDescriptionModal;
