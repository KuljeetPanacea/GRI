import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  LinearProgress,
  Alert,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Paper,
  Divider,
  Grid,
} from '@mui/material';
import { ArrowBack, ArrowForward, Save, CheckCircle, QuestionMark } from '@mui/icons-material';
import PrimaryButton from '../../../common/ui/PrimaryButton';
import useQuestionAttempt from '../useQuestionAttempt';
import styles from './QuestionAttemptScreen.module.css';

interface QuestionAttemptScreenProps {
  questionnaireId: string;
  onComplete: () => void;
  onBack: () => void;
}

const QuestionAttemptScreen: React.FC<QuestionAttemptScreenProps> = ({
  questionnaireId,
  onComplete,
  onBack,
}) => {
  const {
    currentQuestionIndex,
    totalQuestions,
    isLoading,
    error,
    progress,
    handleNextPage,
    handlePreviousPage,
    handleQuestionsPerPageChange,
    handleLocalResponseChange,
    saveAllResponsesWithFeedback,
    questionsPerPage,
    currentQuestions,
    currentPage,
    totalPages,
    isFirstPage,
    isLastPage,
    localResponses,
    isSaving,
    saveSuccess,
    allQuestionsAnswered,
  } = useQuestionAttempt(questionnaireId);

  const handleNext = () => {
    if (isLastPage) {
      onComplete();
    } else {
      handleNextPage();
    }
  };

  const handlePrevious = () => {
    if (isFirstPage) {
      // Do nothing if already on first page
    } else {
      handlePreviousPage();
    }
  };

  const renderQuestionInput = useMemo(() => {
    return (question: {_id: string; text: string; type: string; choices?: Array<{value: string}>; userResponse?: string | string[]}) => {
      if (!question) return null;

      const currentResponse = localResponses[question._id] || '';

      switch (question.type) {
        case 'short_text':
          return (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={currentResponse as string}
              onChange={(e) => handleLocalResponseChange(question._id, e.target.value)}
              placeholder="Enter your response..."
              variant="outlined"
            />
          );

        case 'single_choice':
          return (
            <FormControl component="fieldset">
              <RadioGroup
                value={currentResponse as string}
                onChange={(e) => handleLocalResponseChange(question._id, e.target.value)}
              >
                {question.choices?.map((choice: {value: string}, index: number) => (
                  <FormControlLabel
                    key={index}
                    value={choice.value}
                    control={<Radio />}
                    label={choice.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          );

        case 'multiple_choice':
          return (
            <FormControl component="fieldset">
              <FormGroup>
                {question.choices?.map((choice: {value: string}, index: number) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={(currentResponse as string[])?.includes(choice.value) || false}
                        onChange={(e) => {
                          const currentValues = (currentResponse as string[]) || [];
                          const newValues = e.target.checked
                            ? [...currentValues, choice.value]
                            : currentValues.filter(v => v !== choice.value);
                          handleLocalResponseChange(question._id, newValues);
                        }}
                      />
                    }
                    label={choice.value}
                  />
                ))}
              </FormGroup>
            </FormControl>
          );

        default:
          return (
            <TextField
              fullWidth
              value={currentResponse as string}
              onChange={(e) => handleLocalResponseChange(question._id, e.target.value)}
              placeholder="Enter your response..."
              variant="outlined"
            />
          );
      }
    };
  }, [localResponses, handleLocalResponseChange]);

  if (isLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading question...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={onBack} className={styles.errorButton}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!currentQuestions || currentQuestions.length === 0) {
    return (
      <Box className={styles.errorContainer}>
        <Alert severity="info">No questions available.</Alert>
        <Button onClick={onBack} className={styles.errorButton}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      {/* Header Section */}
      <Paper elevation={3} className={styles.headerPaper}>
        <Box className={styles.headerContent}>
          <IconButton 
            onClick={onBack} 
            className={styles.backButton}
          >
            <ArrowBack />
          </IconButton>
          <Box className={styles.headerTitle}>
            <Typography variant="h4" className={styles.titleText}>
              Assessment Questions
            </Typography>
            <Box className={styles.chipContainer}>
              <Chip 
                icon={<QuestionMark />}
                label={`Page ${currentPage + 1} of ${totalPages}`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`Questions ${currentQuestionIndex + 1}-${Math.min(currentQuestionIndex + questionsPerPage, totalQuestions)} of ${totalQuestions}`}
                color="secondary"
                variant="outlined"
              />
              <Chip 
                icon={<CheckCircle />}
                label={`${Math.round(progress)}% Complete`}
                color={progress === 100 ? "success" : "default"}
                variant="filled"
              />
            </Box>
          </Box>
        </Box>

        {/* Questions Per Page Dropdown */}
        <Box className={styles.controlsContainer}>
          <FormControl size="small" className={styles.selectControl}>
            <InputLabel>Questions per page</InputLabel>
            <Select
              value={questionsPerPage}
              label="Questions per page"
              onChange={(e) => handleQuestionsPerPageChange(Number(e.target.value))}
              className={styles.selectInput}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} question{num > 1 ? 's' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {saveSuccess && (
            <Chip 
              icon={<CheckCircle />}
              label="Responses saved successfully!"
              color="success"
              variant="filled"
            />
          )}
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          className={styles.progressBar}
          classes={{
            bar: styles.progressBarFill
          }}
        />
      </Paper>

      {/* Questions Grid */}
      <Grid container spacing={3} className={styles.questionsGrid}>
        {currentQuestions.map((question, index) => (
          <Grid item xs={12} key={question._id}>
            <Card 
              elevation={4} 
              className={styles.questionCard}
            >
              <CardContent className={styles.questionContent}>
                <Box className={styles.questionHeader}>
                  <Box className={styles.questionNumber}>
                    <Typography variant="h6" className={styles.questionNumberText}>
                      {currentQuestionIndex + index + 1}
                    </Typography>
                  </Box>
                  <Box className={styles.questionText}>
                    <Typography variant="h6" className={styles.questionTitle}>
                      {question.text}
                    </Typography>
                    
               
                  </Box>
                </Box>

                <Divider className={styles.questionDivider} />

                <Box sx={{ mt: 2 }}>
                  {renderQuestionInput(question)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Navigation and Save Section */}
      <Paper elevation={3} className={styles.navigationPaper}>
        <Box className={styles.navigationContainer}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handlePrevious}
            disabled={isFirstPage}
            className={styles.previousButton}
          >
            Previous Page
          </Button>

          <Box className={styles.actionsContainer}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={saveAllResponsesWithFeedback}
              disabled={!allQuestionsAnswered || isSaving}
              className={`${styles.saveButton} ${
                allQuestionsAnswered 
                  ? styles.saveButtonEnabled 
                  : styles.saveButtonDisabled
              }`}
              sx={{
                '&:disabled': {
                  background: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              {isSaving ? 'Saving...' : 'Save All Responses'}
            </Button>

            <PrimaryButton
              endIcon={<ArrowForward />}
              onClick={handleNext}
            >
              {isLastPage ? 'Complete Assessment' : 'Next Page'}
            </PrimaryButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default QuestionAttemptScreen;
