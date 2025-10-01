// UnsavedChangesModal.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface UnsavedChangesModalProps {
  open: boolean;
  onDiscard: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  open,
  onDiscard,
  onCancel,
  loading = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      
      <DialogContent>
        <Typography variant="body1">
          Your file has unsaved changes. Would you like to discard the changes?
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onCancel} 
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={onDiscard} 
          color="error"
          variant="outlined"
          disabled={loading}
        >
          Discard Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedChangesModal;