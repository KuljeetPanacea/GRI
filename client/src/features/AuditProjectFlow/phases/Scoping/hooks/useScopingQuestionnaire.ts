import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import useAxios from '../../../../../api/useAxios';
import { storeUserResponse } from '../../../../../api/project';
import { fetchProjectQuestionaire } from '../../../../../api/project';

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

const useScopingQuestionnaire = () => {
  const axiosInstance = useAxios();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<Questionnaire | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState<string | string[]>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProject = useSelector((state: RootState) => state.projectView.selectedProject);
  const userLogin = useSelector((state: RootState) => state.login.user);

  // Get current question
  const currentQuestion = currentQuestionnaire?.questions?.[currentQuestionIndex] || null;
  const totalQuestions = currentQuestionnaire?.questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Navigation states
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Load questionnaires for the project
  useEffect(() => {
    const loadQuestionnaires = async () => {
      try {
        setIsLoading(true);
        setError('');

        if (selectedProject?._id) {
          const data = await fetchProjectQuestionaire(axiosInstance, selectedProject._id);
          setQuestionnaires(data);
        } else {
          setError('No project selected');
        }
      } catch (err) {
        console.error('Error loading questionnaires:', err);
        setError('Failed to load questionnaires');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestionnaires();
  }, [selectedProject?._id, axiosInstance]);

  // Update user response when question changes
  useEffect(() => {
    if (currentQuestion) {
      setUserResponse(currentQuestion.userResponse || '');
    }
  }, [currentQuestion]);

  // Handle questionnaire selection
  const handleQuestionnaireSelect = useCallback((questionnaire: Questionnaire | null) => {
    setCurrentQuestionnaire(questionnaire);
    setCurrentQuestionIndex(0);
    setUserResponse('');
    
    if (questionnaire) {
      // Find current question index based on tracker
      if (questionnaire.currentQuestionTracker && questionnaire.questions) {
        const index = questionnaire.questions.findIndex(
          q => q._id === questionnaire.currentQuestionTracker
        );
        if (index !== -1) {
          setCurrentQuestionIndex(index);
        }
      }
    }
  }, []);

  // Handle response change
  const handleResponseChange = useCallback((response: string | string[]) => {
    setUserResponse(response);
  }, []);

  // Submit response to database
  const handleSubmitResponse = useCallback(async () => {
    if (!currentQuestion || !userResponse || !currentQuestionnaire) return;

    try {
      setIsSubmitting(true);

      // Get user role from Redux state
      const role = userLogin?.roles?.[0] || 'AEStakeholder';

      const responseData = {
        questionId: currentQuestion._id,
        choiceValue: Array.isArray(userResponse) ? userResponse : [userResponse],
        assessmentId: currentQuestionnaire.id || currentQuestionnaire._id || '',
      };

      await storeUserResponse(role, axiosInstance, responseData);

      // Update local questionnaire state
      if (currentQuestionnaire.questions) {
        const updatedQuestions = currentQuestionnaire.questions.map(q => 
          q._id === currentQuestion._id 
            ? { ...q, userResponse: Array.isArray(userResponse) ? userResponse.join(', ') : userResponse }
            : q
        );
        
        setCurrentQuestionnaire({
          ...currentQuestionnaire,
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
  }, [currentQuestion, userResponse, currentQuestionnaire, userLogin, axiosInstance]);

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

  // Complete questionnaire
  const handleCompleteQuestionnaire = useCallback(() => {
    // Mark questionnaire as completed and return to selection
    if (currentQuestionnaire) {
      // You can add completion logic here (e.g., update project status)
      console.log('Questionnaire completed:', currentQuestionnaire.title);
    }
    
    // Return to questionnaire selection
    handleQuestionnaireSelect(null);
  }, [currentQuestionnaire, handleQuestionnaireSelect]);

  return {
    questionnaires,
    currentQuestionnaire,
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
    handleQuestionnaireSelect,
    handleCompleteQuestionnaire,
  };
};

export default useScopingQuestionnaire;
