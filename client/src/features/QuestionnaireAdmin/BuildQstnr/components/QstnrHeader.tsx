import { Snackbar, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import styles from "../BuildQstnr.module.css";
import { Box, ButtonGroup } from "@mui/material";
import { ContentCopy, Delete } from "@mui/icons-material";
import DefineQstnForQstnr from "./DefineQstnForQstnr";
import useBuildQstnr from "../useBuildQstnr";
import { useNavigate } from "react-router-dom";
import QstnrActionModal from "../../QstnrAdmin/components/QstnrActionModal";
import { useState } from "react";
import {
  fetchQstnrQuestionsThunk,
  setPublishedStatus,
} from "../../../../redux/qstnrQuestion";
import useAxios from "../../../../api/useAxios";
import { useDispatch, useSelector } from "react-redux";
import  { AppDispatch, RootState } from "../../../../redux/store";

const QstnrHeader = () => {
  const { handlePublish, handleQstnDelete, handleQstnDuplicate } = useBuildQstnr();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "duplicate" | null>(
    null
  );
  const axiosInstance = useAxios();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const qstnrId = useSelector(
    (state: RootState) => state.defineQstnr.qstnr?.questionnaireId
  );
  const isPublished = useSelector(
    (state: RootState) => state.qstnrQuestion.isPublished
  );
  

  const selectedQuestionnaireName = useSelector(
    (state: RootState) => state.defineQstnr.selectedQuestionnaire
  );

  const handleOpenModal = (type: "delete" | "duplicate") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (modalType === "delete") {
        await handleQstnDelete();
        setSnackbarMessage("Question deleted successfully");
      } else if (modalType === "duplicate") {
        await handleQstnDuplicate();
        setSnackbarMessage("Question duplicated successfully");
      }
      setModalOpen(false);
      setSnackbarOpen(true);
      dispatch(
        fetchQstnrQuestionsThunk({ qstnrId: qstnrId as string, axiosInstance })
      );
    } catch (error) {
      setSnackbarMessage(`Failed to ${modalType} question`);
      setSnackbarOpen(true);
      console.error(`Error performing ${modalType} action:`, error);
    }
  };

  const handlePublishAndUpdate = async () => {
    await handlePublish();
    dispatch(setPublishedStatus(true));
  };

  return (
    <>
      <div className={styles.QstnrHeader}>
        <div className={styles.titleSection}>
          <Typography variant="h2">{selectedQuestionnaireName}</Typography>
          <SettingsIcon className={styles.settingsIcon} />
        </div>

        <div className={styles.headerActions}>
          <PlayCircleFilledIcon
            className={styles.playIcon}
            onClick={() => {
              navigate("/landing/qstn-preview");
            }}
          />
          <PrimaryButton
            onClick={handlePublishAndUpdate}
            className={`${styles.publishQstnbutton} ${
              isPublished ? styles.published : ""
            }`}
          >
            {isPublished ? "Published" : "Publish"}
          </PrimaryButton>
        </div>
      </div>

      <Box className={styles.buttonContainer}>
        <ButtonGroup className={styles.buttonGroup}>
          <PrimaryButton
            className={styles.StyleButtonGroup}
            startIcon={<ContentCopy />}
            onClick={() => handleOpenModal("duplicate")}
            noBorder
          >
            Duplicate
          </PrimaryButton>
          <PrimaryButton
            className={styles.StyleButtonGroup}
            startIcon={<Delete />}
            onClick={() => handleOpenModal("delete")}
            noBorder
          >
            Delete
          </PrimaryButton>
        </ButtonGroup>
      </Box>

      <DefineQstnForQstnr />

      <QstnrActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        actionType={modalType ?? "delete"}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default QstnrHeader;
