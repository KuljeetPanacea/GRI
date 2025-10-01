import React from 'react';
import {
  Box,
} from '@mui/material';
import QuestionList from '../../Scoping/components/QuestionList';

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
  currentQuestionTracker?: string;
}

interface AssessmentQuestionListProps {
  questionnaires: Questionnaire[];
  isLoading?: boolean;
  error?: string;
}

const AssessmentQuestionList: React.FC<AssessmentQuestionListProps> = ({
  questionnaires,
  isLoading = false,
  error = '',
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <QuestionList
        questionnaires={questionnaires}
        isLoading={isLoading}
        error={error}
      />
    </Box>
  );
};

export default AssessmentQuestionList;
