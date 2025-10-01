import { Typography, Box } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { ClockFading } from "lucide-react";
import styles from "./styles/gapAndRemediationView.module.css";
import {useGapAndRemediationView} from "../useGapAndRemediationView";
import { useEffect, useState } from "react";
import { fetchProjectQuestionaire } from "../../../../../api/project";
import useAxios from "../../../../../api/useAxios";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

interface Question {
  _id: string;
  text: string;
  type: string;
  choices?: Array<{ value: string }>;
  requirements?: string | null;
  subRequirements?: string | null;
  subControl?: string | null;
  userResponse?: string;
  gaps?: {
    gaps?: string;
    clientComment?: string;
    status?: string;
  };
}

interface Questionnaire {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  phase?: string;
  questions?: Question[];
  currentQuestionTracker?: string;
}

const GapsTabs = () => {
  const { statusData } = useGapAndRemediationView();
  const axiosInstance = useAxios();
  const selectedProject = useSelector((state: RootState) => state.projectView.selectedProject);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  // Fetch questionnaires with gaps
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      if (!selectedProject?._id) return;
      
      try {
        const data = await fetchProjectQuestionaire(axiosInstance, selectedProject._id);
        setQuestionnaires(data || []);
      } catch (error) {
        console.error("Error fetching questionnaires:", error);
      }
    };

    fetchQuestionnaires();
  }, [selectedProject?._id, axiosInstance]);

  // Calculate total gaps across all questionnaires
  const totalQuestionnaireGaps = questionnaires.reduce((total, questionnaire) => {
    return total + (questionnaire.questions?.filter(q => q.gaps?.gaps && q.gaps.gaps.trim() !== '').length || 0);
  }, 0);

  // Create updated status data with questionnaire gaps
  const updatedStatusData = statusData.map(status => {
    if (status.type === "total") {
      return { ...status, count: totalQuestionnaireGaps };
    } else if (status.type === "pending") {
      return { ...status, count: totalQuestionnaireGaps };
    }
    return status;
  });
  
  return (
    <Box className={styles.statusBar}>
      {updatedStatusData.map((status, index) => (
        <Box key={index} className={styles.statusItem}>
          {status.type === "total" && (
            <Box className={styles.iconContainer}>
              <DescriptionIcon className={styles.icon} />
            </Box>
          )}

          {status.type === "completed" && (
            <Box className={styles.iconContainer}>
              <ClockFading
                className={`${styles.icon} ${styles.completedIcon}`}
              />
            </Box>
          )}
          {status.type === "pending" && (
            <Box className={styles.iconContainer}>
              <ClockFading className={`${styles.icon} ${styles.pendingIcon}`} />
            </Box>
          )}

          <Box className={styles.textContainer}>
            <Typography
              variant="h4"
              className={styles.statusCount}
              style={{ color: status.color }}
            >
              {status.count}
            </Typography>
            <Typography variant="subtitle2" className={styles.statusLabel}>
              {status.label === "Pending QSA" ? "Pending Auditor" : status.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default GapsTabs;
