import React, { useState } from 'react';
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
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useAxios from '../../../../../api/useAxios';
import { storeGapComment } from '../../../../../api/project';

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

interface QuestionListProps {
  questionnaires: Questionnaire[];
  isLoading?: boolean;
  error?: string;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questionnaires,
  isLoading = false,
  error = '',
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [gapDialogOpen, setGapDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [gapComment, setGapComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const axiosInstance = useAxios();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleGapCommentClick = (question: Question) => {
    setSelectedQuestion(question);
    setGapComment(question.gaps?.gaps || '');
    setGapDialogOpen(true);
    setSubmitError('');
  };

  const handleGapCommentSubmit = async () => {
    if (!selectedQuestion || !gapComment.trim()) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');

      const gapCommentData = {
        questionId: selectedQuestion._id,
        gapComment: gapComment,
        clientComment: selectedQuestion.gaps?.clientComment || "",
        status: selectedQuestion.gaps?.status || "Finding Open",
        assessmentId: selectedQuestion._id,
      };

      await storeGapComment(axiosInstance, gapCommentData);

      setGapDialogOpen(false);
      setGapComment('');
      setSelectedQuestion(null);

    } catch (error) {
      console.error('Error submitting gap comment:', error);
      setSubmitError('Failed to save gap comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponseDisplay = (question: Question) => {
    if (!question.userResponse) {
      return <Chip label="No Response" color="default" size="small" />;
    }

    if (question.type === 'multiple_choice' && question.choices) {
      const responseString = typeof question.userResponse === 'string' 
        ? question.userResponse 
        : String(question.userResponse);
      const responses = responseString.split(', ');
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {responses.map((response, index) => (
            <Chip
              key={index}
              label={response.trim()}
              sx={{ 
                backgroundColor: '#dc2626',
                color: 'white',
                '&:hover': { backgroundColor: '#b91c1c' }
              }}
              size="small"
            />
          ))}
        </Box>
      );
    }

    if (question.type === 'single_choice' && question.choices) {
      return (
        <Chip
          label={String(question.userResponse)}
          sx={{ 
            backgroundColor: '#dc2626',
            color: 'white',
            '&:hover': { backgroundColor: '#b91c1c' }
          }}
          size="small"
        />
      );
    }

    return (
      <Typography
        variant="body2"
        sx={{
          backgroundColor: '#fef2f2',
          padding: 1.5,
          borderRadius: 1,
          maxHeight: 100,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          border: '1px solid #fecaca',
        }}
      >
        {String(question.userResponse)}
      </Typography>
    );
  };


  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading questions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!questionnaires || questionnaires.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No questionnaires available</Typography>
      </Box>
    );
  }

  const currentQuestionnaire = questionnaires[selectedTab];

  return (
    <Box sx={{ 
      backgroundColor: '#f8f9fa', 
      height: '85vh', 
      display: 'flex', 
      flexDirection: 'column', 
     mb: '1rem'
    }}>
      {/* Fixed Tabs Section */}
      <Box sx={{ 
        backgroundColor: 'white', 
        borderBottom: '2px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flexShrink: 0,
        mb: 2,
      }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
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
          {questionnaires.map((questionnaire, index) => (
            <Tab
              key={questionnaire.id || questionnaire._id || index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
      <Box sx={{ 
        p: 3, 
        pb: 2, 
        color: 'white',
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        flexShrink: 0,
        borderRadius: '10px 10px 0px 0px',
      }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1,borderRadius: '10px' }}>
          <QuizIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {currentQuestionnaire.title || `Questionnaire ${selectedTab + 1}`}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={currentQuestionnaire.phase || 'Unknown Phase'}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 500,
            }}
            size="small"
          />
          <Chip
            label={`${currentQuestionnaire.questions?.length || 0} Questions`}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 500,
            }}
            size="small"
          />
        </Stack>

        {currentQuestionnaire.description && (
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {currentQuestionnaire.description}
          </Typography>
        )}
      </Box>

      {/* Scrollable Questions Section */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        backgroundColor: 'white',
      }}>
        <Stack spacing={0}>
          {currentQuestionnaire.questions?.map((question, questionIndex) => (
            <Paper
              key={question._id}
              elevation={0}
              sx={{
                p: 3,
                borderBottom: questionIndex < (currentQuestionnaire.questions?.length || 0) - 1 
                  ? '1px solid #e0e0e0' 
                  : 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                },
              }}
            >
              {/* Question Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {questionIndex + 1}
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    {question.text}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} alignItems="center">
                   
                    {question.userResponse && (
                      <Chip
                        icon={<CheckCircleIcon sx={{ color: '#16a34a !important' }} />}
                        label="Answered"
                        size="small"
                        sx={{
                          borderColor: '#16a34a',
                          color: '#16a34a',
                        }}
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>

                <IconButton
                  size="small"
                  onClick={() => handleGapCommentClick(question)}
                  sx={{
                    color: question.gaps?.gaps ? "#dc2626" : "#6b7280",
                    backgroundColor: question.gaps?.gaps ? "rgba(220, 38, 38, 0.1)" : "transparent",
                    '&:hover': {
                      color: question.gaps?.gaps ? "#991b1b" : "#374151",
                      backgroundColor: question.gaps?.gaps ? "rgba(220, 38, 38, 0.2)" : "rgba(0, 0, 0, 0.04)"
                    }
                  }}
                  title={question.gaps?.gaps ? "Edit Gap Comment" : "Add Gap Comment"}
                >
                  <CommentIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Response Section */}
              <Box sx={{ ml: 7 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    mb: 1,
                  }}
                >
                  Response
                </Typography>
                {getResponseDisplay(question)}

                {/* Gap Comment Display */}
                {question.gaps?.gaps && (
                  <Box sx={{ mt: 2 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#dc2626',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block',
                        mb: 1,
                      }}
                    >
                      Gap Comment
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: '#fef2f2',
                        padding: 2,
                        borderRadius: 2,
                        border: '1px solid #fecaca',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#991b1b' }}>
                        {question.gaps.gaps}
                      </Typography>
                      {question.gaps.clientComment && (
                        <>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#dc2626',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'block',
                              mb: 1,
                              mt: 2,
                            }}
                          >
                            Client Comment
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#991b1b' }}>
                            {question.gaps.clientComment}
                          </Typography>
                        </>
                      )}
                      {question.gaps.status && (
                        <>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#dc2626',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'block',
                              mb: 1,
                              mt: 2,
                            }}
                          >
                            Status
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#991b1b', fontWeight: 500 }}>
                            {question.gaps.status}
                          </Typography>
                        </>
                      )}
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
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            color: 'white',
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <CommentIcon />
          {selectedQuestion?.gaps?.gaps ? "Edit Gap Comment" : "Add Gap Comment"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {selectedQuestion && (
            <Paper
              elevation={0}
              sx={{ 
                mt: 3, 
                mb: 3, 
                p: 2.5,
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600,
                  color: '#dc2626',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  mb: 1,
                 
                }}
              >
                Question
              </Typography>
              <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.6 }}>
                {selectedQuestion.text}
              </Typography>
            </Paper>
          )}
          
          {submitError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
              }}
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
        <DialogActions sx={{ p: 2.5, backgroundColor: '#f9fafb', gap: 1 }}>
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