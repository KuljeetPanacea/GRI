import React from "react";
import { Dialog, DialogContent, IconButton, CircularProgress, Typography, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styles from "./AISummaryDialog.module.css";
import { useAISummaryDialog } from "./useAISummaryDialog";

const AISummaryDialog: React.FC = () => {
  const { open, loading, error, formattedSummaryHtml, handleClose } = useAISummaryDialog();

  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      maxWidth="md" 
      fullWidth
      PaperProps={{
        className:styles.paper
        }
      }
    >
      {/* Header with title and close button */}
      <Box className={styles.headerBox} >
        <Typography variant="h3"className={styles.title}>
          AI Response
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          className={styles.closeBtn}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Scrollable content area */}
      <DialogContent className={styles.dialogContent}>
        {loading ? (
          <Box className={styles.loadingBox}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Generating summary...
            </Typography>
          </Box>
        ) : error ? (
          <Box className={styles.errorBox}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Box
            className={styles.scrollArea}
          >
            <div 
               className={styles.contentWrapper}
              dangerouslySetInnerHTML={{ __html: formattedSummaryHtml }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AISummaryDialog;