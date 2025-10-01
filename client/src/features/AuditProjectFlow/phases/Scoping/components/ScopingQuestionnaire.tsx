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
  Grid,
} from '@mui/material';
import { ArrowBack, ArrowForward, PlayArrow } from '@mui/icons-material';
import PrimaryButton from '../../../../../common/ui/PrimaryButton';
import useScopingQuestionnaire from "../hooks/useScopingQuestionnaire";

interface Question {
  _id: string;
  text: string;
  type: string;
  choices?: Array<{ value: string }>;
  requirements?: string | null;
  subRequirements?: string | null;
  subControl?: string | null;
  userResponse?: string;
}

interface Questionnaire {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  phase?: string;
  questions?: Question[];
}

const ScopingQuestionnaire: React.FC = () => {
  const {
    questionnaires,
    currentQuestionnaire,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    userResponse,
    isLoading,
    error,
    progress,
    isFirstQuestion,
    isLastQuestion,
    handleResponseChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitResponse,
    handleQuestionnaireSelect,
    handleCompleteQuestionnaire,
  } = useScopingQuestionnaire();

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
      handleCompleteQuestionnaire();
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
              {currentQuestion.choices?.map((choice: { value: string }, index: number) => (
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
              {currentQuestion.choices?.map((choice: { value: string }, index: number) => (
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

  // Show questionnaire selection if no questionnaire is selected
  if (!currentQuestionnaire) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Select a Questionnaire to Begin
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <LinearProgress sx={{ width: '50%' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {questionnaires.map((questionnaire: { id?: string, _id?: string, title?: string, description?: string, phase?: string, questions?: { _id?: string, text?: string, type?: string, choices?: { value: string }[] }[] }) => (
              <Grid item xs={12} md={6} lg={4} key={questionnaire.id || questionnaire._id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 },
                    transition: 'box-shadow 0.3s'
                  }}
                  onClick={() => handleQuestionnaireSelect(questionnaire as Questionnaire)}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {questionnaire.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {questionnaire.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Phase:</strong> {questionnaire.phase}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Questions:</strong> {questionnaire.questions?.length || 0}
                    </Typography>
                    <PrimaryButton
                      startIcon={<PlayArrow />}
                    >
                      Begin Questionnaire
                    </PrimaryButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading question...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => handleQuestionnaireSelect(null)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  // Show no question state
  if (!currentQuestion) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No questions available.</Alert>
        <Button onClick={() => handleQuestionnaireSelect(null)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  // Show question interface
  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => handleQuestionnaireSelect(null)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {currentQuestionnaire.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Question {currentQuestionIndex + 1} of {totalQuestions}
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
          
          {currentQuestion.requirements && (
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
          )}

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

export default ScopingQuestionnaire;
