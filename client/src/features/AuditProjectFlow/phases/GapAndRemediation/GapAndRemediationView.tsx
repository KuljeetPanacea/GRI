import { Typography, Box, Grid,  Card, CardContent } from "@mui/material";
import styles from "./components/styles/gapAndRemediationView.module.css";
import StatusBar from "./components/StatusBar";
import { useGapAndRemediationView } from "./useGapAndRemediationView";
import {
  GapRemediationDropdown,
} from "./useGapAndRemediationView";
import GapsTabs from "./components/GapsTabs";
import { useEffect, useState } from "react";
import {
  fetchGapsRequirements,
  GapsRemediation,
  setGapRemediationDropdown,
  
} from "../../../../redux/GapsRemediationSlice";
import { deviceLookUp } from "../../../../api/project";
import GapCard from "./components/GapCard";
import { fetchProjectQuestionaire } from "../../../../api/project";
import { useNavigate } from "react-router-dom";

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

const GapAndRemediationView = () => {
  const {
 
    activeFilter,
    setDeviceTypes,
    selectedProject,
    dispatch,
    
    axiosInstance,
   
  } = useGapAndRemediationView();
  
  const navigate = useNavigate();

  // Questionnaire gap states
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  // Fetch questionnaires with gaps
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      if (!selectedProject?._id) return;
      
      try {
        // Fetch questionnaires using the same API as AEPoc
        const data = await fetchProjectQuestionaire(axiosInstance, selectedProject._id);
        setQuestionnaires(data || []);
      } catch (error) {
        console.error("Error fetching questionnaires:", error);
      }
    };

    fetchQuestionnaires();
  }, [selectedProject?._id, axiosInstance]);

  useEffect(() => {
    const fetchDeviceLookUp = async () => {
      try {
        const response = await deviceLookUp(axiosInstance);
        setDeviceTypes(response.data[0]?.values || []);
      } catch (error) {
        console.error("Error fetching device lookup:", error);
      }
    };

    fetchDeviceLookUp();
  }, [axiosInstance, setDeviceTypes]);

  useEffect(() => {
    const resultAction = dispatch(
      fetchGapsRequirements({
        projectId: selectedProject?._id ?? "",
        axiosInstance,
      })
    );
    resultAction
      .then((res) => res.payload.data)
      .then((data) => {
        dispatch(
          setGapRemediationDropdown({
            title: "Requirement",
            options: data.map((item: GapsRemediation) => item.reqNo),
          } as GapRemediationDropdown)
        );
      });
    //  dispatch(setGapRemediationDropdown(data.map((item) => item.deviceType)));
  }, [dispatch, activeFilter, axiosInstance, selectedProject?._id]);


  // Calculate total gaps across all questionnaires
  const totalQuestionnaireGaps = questionnaires.reduce((total, questionnaire) => {
    return total + (questionnaire.questions?.filter(q => q.gaps?.gaps && q.gaps.gaps.trim() !== '').length || 0);
  }, 0);


  const renderContent = () => {
    return (
      <>
        <StatusBar
          totalNoOfGaps={totalQuestionnaireGaps}
          PendingClient={0}
          PendingQsa={totalQuestionnaireGaps}
        />
        <Box className={styles.requirementsContainer}>
          <Grid container spacing={2}>
            {questionnaires.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" align="center" color="text.secondary">
                      No questionnaires found
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : totalQuestionnaireGaps === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" align="center" color="text.secondary">
                      No gaps found in questionnaires
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              questionnaires.map((questionnaire, questionnaireIndex) => {
                const questionsWithGaps = questionnaire.questions?.filter(q => q.gaps?.gaps && q.gaps.gaps.trim() !== '') || [];
                
                if (questionsWithGaps.length === 0) {
                  return null; // Don't render questionnaires without gaps
                }

                return (
                  <Grid item xs={12} md={6} key={questionnaireIndex}>
                    <GapCard
                      title={questionnaire.title || `Questionnaire ${questionnaireIndex + 1}`}
                      description={questionnaire.phase ? `Phase: ${questionnaire.phase}` : undefined}
                      totalGaps={questionsWithGaps.length}
                      completedGaps={0}
                      onClick={() => {
                        // Navigate to gap remediation page with questionnaire data
                        navigate('/landing/gap-remediation', { 
                          state: { 
                            questionnaireId: questionnaire.id || questionnaire._id,
                            questionnaireTitle: questionnaire.title,
                            questionnaireData: questionnaire,
                            questionsWithGaps: questionsWithGaps
                          } 
                        });
                      }}
                    />
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
      </>
    );
  };
  return (
    <div className={styles.container}>
      <Box>
        <nav className={styles.breadcrumb}>
          <span className={`${styles.crumb} ${styles.active}`}>
            Gap overview
          </span>
        </nav>
        <GapsTabs />

        <Box className={styles.contentContainer}>{renderContent()}</Box>
      </Box>
    </div>
  );
};

export default GapAndRemediationView;
