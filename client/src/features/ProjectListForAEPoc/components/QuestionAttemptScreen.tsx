import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import PrimaryButton from '../../../common/ui/PrimaryButton';
import useQuestionAttempt from '../useQuestionAttempt';

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
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    userResponse,
    isLoading,
    error,
    progress,
    handleResponseChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitResponse,
    isLastQuestion,
    isFirstQuestion,
  } = useQuestionAttempt(questionnaireId);

  const [localResponse, setLocalResponse] = useState<string | string[]>(userResponse);

  useEffect(() => {
    setLocalResponse(userResponse);
  }, [userResponse]);

  const handleLocalResponseChange = (value: string | string[]) => {
    setLocalResponse(value);
    handleResponseChange(value);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      handleNextQuestion();
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'short_text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={localResponse as string}
            onChange={(e) => handleLocalResponseChange(e.target.value)}
            placeholder="Enter your response..."
            variant="outlined"
          />
        );

      case 'single_choice':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={localResponse as string}
              onChange={(e) => handleLocalResponseChange(e.target.value)}
            >
              {currentQuestion.choices?.map((choice, index) => (
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
              {currentQuestion.choices?.map((choice, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={(localResponse as string[])?.includes(choice.value) || false}
                      onChange={(e) => {
                        const currentValues = (localResponse as string[]) || [];
                        const newValues = e.target.checked
                          ? [...currentValues, choice.value]
                          : currentValues.filter(v => v !== choice.value);
                        handleLocalResponseChange(newValues);
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
            value={localResponse as string}
            onChange={(e) => handleLocalResponseChange(e.target.value)}
            placeholder="Enter your response..."
            variant="outlined"
          />
        );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading question...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={onBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!currentQuestion) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No questions available.</Alert>
        <Button onClick={onBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}% Complete
        </Typography>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 3, height: 8, borderRadius: 4 }}
      />

      {/* Question Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentQuestion.text}
          </Typography>
          
          {/* {currentQuestion.requirements && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Requirements:</strong> {currentQuestion.requirements}
            </Typography>
          )}
          
          {currentQuestion.subRequirements && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Sub Requirements:</strong> {currentQuestion.subRequirements}
            </Typography>
          )}
          
          {currentQuestion.subControl && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Sub Control:</strong> {currentQuestion.subControl}
            </Typography>
          )} */}

          <Box sx={{ mt: 3 }}>
            {renderQuestionInput()}
          </Box>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handlePreviousQuestion}
          disabled={isFirstQuestion}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleSubmitResponse}
            disabled={!localResponse || (Array.isArray(localResponse) && localResponse.length === 0)}
          >
            Save Response
          </Button>

          <PrimaryButton
            endIcon={<ArrowForward />}
            onClick={handleNext}
            disabled={!localResponse || (Array.isArray(localResponse) && localResponse.length === 0)}
          >
            {isLastQuestion ? 'Complete' : 'Next'}
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionAttemptScreen;
