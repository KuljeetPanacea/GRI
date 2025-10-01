import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useAxios from '../../api/useAxios';
import { storeUserResponse } from '../../api/project';

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
  questions?: Question[];
  currentQuestionTracker?: string;
}

const useQuestionAttempt = (questionnaireId: string) => {
  const axiosInstance = useAxios();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState<string | string[]>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedQSTNR = useSelector(
    (state: RootState) => state.projectManagement.selectedQstnr
  );
  
  const userLogin = useSelector((state: RootState) => state.login.user);

  // Get current question
  const currentQuestion = questionnaire?.questions?.[currentQuestionIndex] || null;
  const totalQuestions = questionnaire?.questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Navigation states
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Load questionnaire data
  useEffect(() => {
    const loadQuestionnaire = async () => {
      try {
        setIsLoading(true);
        setError('');

        // For now, we'll use the selected questionnaire from Redux
        // In a real implementation, you might fetch from API using questionnaireId
        if (selectedQSTNR) {
          setQuestionnaire(selectedQSTNR);
          
          // Find current question index based on tracker
          if (selectedQSTNR.currentQuestionTracker && selectedQSTNR.questions) {
            const index = selectedQSTNR.questions.findIndex(
              q => q._id === selectedQSTNR.currentQuestionTracker
            );
            if (index !== -1) {
              setCurrentQuestionIndex(index);
            }
          }
        } else {
          setError('No questionnaire selected');
        }
      } catch (err) {
        console.error('Error loading questionnaire:', err);
        setError('Failed to load questionnaire');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestionnaire();
  }, [questionnaireId, selectedQSTNR]);

  // Update user response when question changes
  useEffect(() => {
    if (currentQuestion) {
      setUserResponse(currentQuestion.userResponse || '');
    }
  }, [currentQuestion]);

  // Handle response change
  const handleResponseChange = useCallback((response: string | string[]) => {
    setUserResponse(response);
  }, []);

  // Submit response to database
  const handleSubmitResponse = useCallback(async () => {
    if (!currentQuestion || !userResponse) return;

    try {
      setIsSubmitting(true);

      // Get user role from Redux state
      const role = userLogin?.roles?.[0] || 'AEStakeholder';

      const responseData = {
        questionId: currentQuestion._id,
        choiceValue: Array.isArray(userResponse) ? userResponse : [userResponse],
        assessmentId: questionnaireId, // This should be the assessment ID, not questionnaire ID
      };

      await storeUserResponse(role, axiosInstance, responseData);

      // Update local questionnaire state
      if (questionnaire && questionnaire.questions) {
        const updatedQuestions = questionnaire.questions.map(q => 
          q._id === currentQuestion._id 
            ? { ...q, userResponse: Array.isArray(userResponse) ? userResponse.join(', ') : userResponse }
            : q
        );
        
        setQuestionnaire({
          ...questionnaire,
          questions: updatedQuestions,
          currentQuestionTracker: currentQuestion._id,
        });
      }

    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to save response');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuestion, userResponse, questionnaireId, questionnaire, axiosInstance]);

  // Navigate to next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  // Navigate to previous question
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    userResponse,
    isLoading,
    error,
    progress,
    isSubmitting,
    isFirstQuestion,
    isLastQuestion,
    handleResponseChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitResponse,
  };
};

export default useQuestionAttempt;
