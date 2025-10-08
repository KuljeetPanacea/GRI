import React, { useEffect, useRef } from 'react';
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Paper,
  Stack,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useAssessmentQuestionnaire from '../hooks/useAssessmentQuestionnaire';
import styles from './QuestionList.module.css';

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
  tableConfig?: {
    mode: 'dynamic' | 'template';
    rows?: Array<{ id: string; label: string }>;
    columns: Array<{
      id: string;
      label: string;
      type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
      options?: string[];
      validation?: {
        min?: number;
        max?: number;
        pattern?: string;
      };
    }>;
    defaultRows?: number;
  };
  tableData?: Record<string, string | number | boolean>[];
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

interface QuestionListProps {
  questionnaires?: Questionnaire[];
  isLoading?: boolean;
  error?: string;
  navigationState?: {
    questionId?: string;
    questionnaireId?: string;
    questionText?: string;
    currentResponse?: string;
    questionType?: string;
    choices?: Array<{ value: string }>;
  };
}

const QuestionList: React.FC<QuestionListProps> = ({
  questionnaires: propQuestionnaires,
  isLoading: propIsLoading = false,
  error: propError = '',
  navigationState,
}) => {
  // Use the hook for state management
  const {
    questionnaires,
    isLoading,
    error,
    selectedTab,
    gapDialogOpen,
    selectedQuestion,
    gapComment,
    isSubmitting,
    submitError,
    questionsWithGaps,
    handleTabChange,
    handleGapCommentClick,
    handleGapCommentSubmit,
    getResponseDisplay,
    setGapComment,
    setGapDialogOpen,
  } = useAssessmentQuestionnaire(navigationState);

  // Use prop values if provided, otherwise use hook values
  const finalQuestionnaires = (propQuestionnaires && Array.isArray(propQuestionnaires)) ? propQuestionnaires : questionnaires;
  const finalIsLoading = propIsLoading || isLoading;
  const finalError = propError || error;

  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle navigation scrolling effect
  useEffect(() => {
    if (navigationState?.questionId && Array.isArray(finalQuestionnaires) && finalQuestionnaires.length > 0) {
      // Scroll to the question after a short delay to ensure DOM is updated
      setTimeout(() => {
        const questionElement = questionRefs.current[navigationState.questionId!];
        if (questionElement) {
          // Find the scrollable container by looking for the questions section
          const questionsContainer = document.querySelector('[style*="flexGrow: 1"][style*="overflow: auto"]') as HTMLElement;
          
          if (questionsContainer) {
            // Get the element's position relative to the container
            const elementOffsetTop = questionElement.offsetTop;
            
            // Calculate the visible area height
            const containerHeight = questionsContainer.clientHeight;
            
            // Calculate the target scroll position to center the element
            // but keep it below the header area
            const targetScrollTop = elementOffsetTop - (containerHeight / 3); // Position at 1/3 from top
            
            // Ensure we don't scroll to negative values
            const finalScrollTop = Math.max(0, targetScrollTop);
            
            // Smooth scroll to the calculated position
            questionsContainer.scrollTo({
              top: finalScrollTop,
              behavior: 'smooth'
            });
          } else {
            // Fallback: use scrollIntoView with better options
            questionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest',
              inline: 'nearest'
            });
          }
          
          // Add highlight effect
          questionElement.style.backgroundColor = '#fff3cd';
          questionElement.style.border = '2px solid #ffc107';
          questionElement.style.transition = 'all 0.3s ease';
          
          setTimeout(() => {
            questionElement.style.backgroundColor = '';
            questionElement.style.border = '';
          }, 3000);
        }
      }, 300); // Increased delay to ensure DOM is fully updated
    }
  }, [navigationState, finalQuestionnaires]);

  // Render response display based on the hook's getResponseDisplay function
  const renderResponseDisplay = (question: Question) => {
    const responseData = getResponseDisplay(question);

    switch (responseData.type) {
      case 'no-response':
        return <Chip label="No Response" color="default" size="small" />;
      
      case 'error':
        return <Chip label={String(responseData.content)} color="error" size="small" />;
      
      case 'no-data':
        return <Chip label="No Table Data" color="default" size="small" />;
      
      case 'table': {
        const { config, tableData } = responseData.content as { 
          config: Question['tableConfig']; 
          tableData: Record<string, string | number | boolean>[] 
        };
        
        // Template mode display
        if (config?.mode === 'template' && config.rows && config.rows.length > 0) {
          return (
            <TableContainer component={Paper} className={styles.tableContainer}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {config.columns.map((column) => (
                      <TableCell key={column.id} className={styles.tableHeader}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {config.rows.map((row, rowIndex: number) => {
                    const dataObject = tableData.length > 0 ? tableData[0] : {};
                    
                    return (
                      <TableRow key={row.id}>
                        {config.columns.map((column, colIndex: number) => {
                          if (colIndex === 0) {
                            return (
                              <TableCell key={`${row.id}_label`} className={styles.tableRowLabel}>
                                {row.label}
                              </TableCell>
                            );
                          } else {
                            const keysToTry = [
                              `${row.id}_${column.id}`,
                              column.id,
                              `${column.id}_${row.id}`,
                              `${rowIndex}_${column.id}`,
                              `${column.id}_${rowIndex}`
                            ];
                            
                            let cellValue: string | number | boolean = '';
                            for (const key of keysToTry) {
                              if (dataObject[key] !== undefined && dataObject[key] !== '') {
                                cellValue = dataObject[key];
                                break;
                              }
                            }
                            
                            return (
                              <TableCell key={column.id}>
                                {String(cellValue || '')}
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }

        // Dynamic mode display
        if (!config) {
          return <Chip label="Invalid Table Configuration" color="error" size="small" />;
        }
        
        return (
          <TableContainer component={Paper} className={styles.tableContainerDynamic}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {config.columns.map((column) => (
                    <TableCell key={column.id} className={styles.tableHeaderDynamic}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {config.columns.map((column) => (
                      <TableCell key={column.id}>
                        {String(row[column.id] || '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }
      
      case 'multiple-choice':
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(responseData.content as string[]).map((response: string, index: number) => (
              <Chip
                key={index}
                label={response.trim()}
                size="small"
                sx={{ 
                  backgroundColor: '#dc2626',
                  color: 'white',
                  '&:hover': { backgroundColor: '#b91c1c' }
                }}
              />
            ))}
          </Box>
        );
      
      case 'single-choice':
        return (
          <Chip
            label={String(responseData.content)}
            size="small"
            sx={{ 
              backgroundColor: '#dc2626',
              color: 'white',
              '&:hover': { backgroundColor: '#b91c1c' }
            }}
          />
        );
      
      case 'text':
        return (
          <Typography
            variant="body2"
            className={styles.textResponse}
          >
            {String(responseData.content)}
          </Typography>
        );
      
      default:
        return <Chip label="Unknown Response Type" color="default" size="small" />;
    }
  };


  if (finalIsLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography>Loading questions...</Typography>
      </Box>
    );
  }

  if (finalError) {
    return (
      <Box className={styles.errorContainer}>
        <Typography color="error">{finalError}</Typography>
      </Box>
    );
  }

  if (!finalQuestionnaires || !Array.isArray(finalQuestionnaires) || finalQuestionnaires.length === 0) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography color="text.secondary">No questionnaires available</Typography>
      </Box>
    );
  }

  const currentQuestionnaire = Array.isArray(finalQuestionnaires) ? finalQuestionnaires[selectedTab] : null;

  return (
    <Box className={styles.container}>
      {/* Fixed Tabs Section */}
      <Box className={styles.tabsContainer}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          className={styles.tabs}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              minHeight: 64,
              color: '#6b7280',
              '&.Mui-selected': {
                color: '#dc2626',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#dc2626',
              height: 3,
            },
          }}
        >
          {Array.isArray(finalQuestionnaires) && finalQuestionnaires.map((questionnaire, index) => (
            <Tab
              key={questionnaire.id || questionnaire._id || index}
              label={
                <Box className={styles.tabLabel}>
                  <QuizIcon sx={{ fontSize: 20 }} />
                  <span>{questionnaire.title || `Questionnaire ${index + 1}`}</span>
                  <Chip
                    label={questionnaire.questions?.length || 0}
                    size="small"
                    sx={{ 
                      height: 20,
                      fontSize: '0.75rem',
                      backgroundColor: selectedTab === index ? '#dc2626' : '#e5e7eb',
                      color: selectedTab === index ? 'white' : '#6b7280',
                    }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Fixed Header Section */}
      <Box className={styles.headerContainer}>
        <Stack direction="row" spacing={2} alignItems="center" className={styles.headerTitle}>
          <QuizIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {currentQuestionnaire?.title || `Questionnaire ${selectedTab + 1}`}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1} className={styles.headerChips}>
          <Chip
            label={currentQuestionnaire?.phase || 'Unknown Phase'}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${currentQuestionnaire?.questions?.length || 0} Questions`}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 500,
            }}
          />
        </Stack>

        {currentQuestionnaire?.description && (
          <Typography variant="body2" className={styles.headerDescription}>
            {currentQuestionnaire.description}
          </Typography>
        )}
      </Box>

      {/* Scrollable Questions Section */}
      <Box className={styles.questionsContainer}>
        <Stack spacing={0}>
          {currentQuestionnaire?.questions && Array.isArray(currentQuestionnaire.questions) && currentQuestionnaire.questions.map((question: Question, questionIndex: number) => (
            <Paper
              key={question._id}
              ref={(el) => {
                if (el) {
                  questionRefs.current[question._id] = el;
                }
              }}
              elevation={0}
              className={`${styles.questionCard} ${questionIndex < (currentQuestionnaire.questions?.length || 0) - 1 ? styles.questionCardBorder : styles.questionCardNoBorder}`}
            >
              {/* Question Header */}
              <Box className={styles.questionHeader}>
                <Box className={styles.questionNumber}>
                  {questionIndex + 1}
                </Box>
                
                <Box className={styles.questionContent}>
                  <Typography variant="body1" className={styles.questionTitle}>
                    {question.text}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} alignItems="center">
                   
                    {question.userResponse && (
                      <Chip
                        icon={<CheckCircleIcon sx={{ color: '#16a34a !important' }} />}
                        label="Answered"
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: '#16a34a',
                          color: '#16a34a',
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                <IconButton
                  size="small"
                  onClick={() => handleGapCommentClick(question)}
                  title={(question.gaps?.gaps || questionsWithGaps.has(question._id)) ? "Edit Gap Comment" : "Add Gap Comment"}
                  sx={{
                    color: (question.gaps?.gaps || questionsWithGaps.has(question._id)) ? "#dc2626" : "#6b7280",
                    backgroundColor: (question.gaps?.gaps || questionsWithGaps.has(question._id)) ? "rgba(220, 38, 38, 0.1)" : "transparent",
                    '&:hover': {
                      color: (question.gaps?.gaps || questionsWithGaps.has(question._id)) ? "#991b1b" : "#374151",
                      backgroundColor: (question.gaps?.gaps || questionsWithGaps.has(question._id)) ? "rgba(220, 38, 38, 0.2)" : "rgba(0, 0, 0, 0.04)"
                    }
                  }}
                >
                  <CommentIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Response Section */}
              <Box className={styles.responseSection}>
                <Typography 
                  variant="caption" 
                  className={styles.responseLabel}
                >
                  Response
                </Typography>
                {renderResponseDisplay(question)}

                {/* Gap Comment Display */}
                {(question.gaps?.gaps || questionsWithGaps.has(question._id)) && (
                  <Box className={styles.gapCommentSection}>
                    <Typography 
                      variant="caption" 
                      className={styles.gapCommentLabel}
                    >
                      Gap Comment
                    </Typography>
                    <Paper
                      elevation={0}
                      className={styles.gapCommentCard}
                    >
                      <Typography variant="body2" className={styles.gapCommentText}>
                        {question.gaps?.gaps || gapComment}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Gap Comment Dialog */}
      <Dialog 
        open={gapDialogOpen} 
        onClose={() => setGapDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          className: styles.dialogPaper
        }}
      >
        <DialogTitle className={styles.dialogTitle}>
          <CommentIcon />
          {selectedQuestion?.gaps?.gaps ? "Edit Gap Comment" : "Add Gap Comment"}
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          {selectedQuestion && (
            <Paper
              elevation={0}
              className={styles.questionCardDialog}
            >
              <Typography 
                variant="caption" 
                className={styles.questionLabel}
              >
                Question
              </Typography>
              <Typography variant="body1" className={styles.questionText}>
                {selectedQuestion.text}
              </Typography>
            </Paper>
          )}
          
          {submitError && (
            <Alert 
              severity="error" 
              className={styles.errorAlert}
            >
              {submitError}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={5}
            value={gapComment}
            onChange={(e) => setGapComment(e.target.value)}
            placeholder={selectedQuestion?.gaps?.gaps ? "Edit your gap comment..." : "Describe the gap or issue found..."}
            variant="outlined"
            label="Gap Comment"
            helperText={selectedQuestion?.gaps?.gaps ? "Your existing comment will be updated" : "Provide detailed information about the identified gap"}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#dc2626',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#dc2626',
                  borderWidth: 2,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#dc2626',
              },
            }}
          />
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: 2.5, 
            backgroundColor: '#f9fafb', 
            gap: 1 
          }}
        >
          <Button 
            onClick={() => setGapDialogOpen(false)}
            sx={{
              color: '#6b7280',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                backgroundColor: '#e5e7eb',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGapCommentSubmit}
            variant="contained"
            disabled={!gapComment.trim() || isSubmitting}
            sx={{
              backgroundColor: '#dc2626',
              fontWeight: 500,
              px: 3,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              '&:hover': {
                backgroundColor: '#991b1b',
                boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
              },
              '&:disabled': {
                backgroundColor: '#e5e7eb',
                color: '#9ca3af',
              }
            }}
          >
            {isSubmitting ? "Saving..." : (selectedQuestion?.gaps?.gaps ? "Update Comment" : "Save Comment")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionList;