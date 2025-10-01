import { useEffect } from "react";
import useAssessor, { ReviseQstnObject } from "../useAssessor";
import { Card, CardContent, Chip, Typography } from "@mui/material";
import styles from "../components/Styles/Assessor.module.css";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { setSelectedReviseQstnId } from "../../../redux/projectManagementSlice";
import { ArrowLeft } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
const AsssessorRevise = () => {
  const { reviseQstn, navigate, fetchRevise, dispatch } = useAssessor();
  const reviseQstnObject = useSelector(
      (state: RootState) => state.gapsRemediation.reviseQstnObject
    ) as ReviseQstnObject;
  
  console.log("reviseQstn", reviseQstn,reviseQstnObject);
  useEffect(() => {
    fetchRevise();
  }, []);
  return (
    <>
      <Typography variant="h3" className={styles.myRemediation} onClick={() => navigate("/landing/assessor-gaps")}>
      <ArrowLeft />  My Remediation
      </Typography>
      <Typography variant="h3" className={styles.myRevision} >
      {reviseQstnObject.deviceRef}
      </Typography>

      <div className={styles.revisionCardContainer}>
        {reviseQstn?.map((question) => (
          <Card
            className={styles.revisionCard}
            elevation={1}
            key={question._id}
          >
            <CardContent className={styles.revisionCardContent}>
              <div className={styles.revisionCardHeader}>
                <Typography
                  variant="body1"
                  className={styles.revisionCardTitle}
                >
                  {question.text}
                </Typography>
              </div>
              <div className={styles.revisionCardMeta}>
                <Chip
                  label="SLA: 24 Dec"
                  size="small"
                  className={styles.revisionCardChip}
                />
              </div>
              <div className={styles.revisionCardActions}>
                <PrimaryButton
                  onClick={() => {
                    dispatch(setSelectedReviseQstnId(question._id));
                    navigate(`/landing/Asssessor-log-Revise`);
                  }}
                  children="Revise"
                  className={styles.revisionCardButton}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default AsssessorRevise;
