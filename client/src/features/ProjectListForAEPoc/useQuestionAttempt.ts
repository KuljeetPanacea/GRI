import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [questionsPerPage, setQuestionsPerPage] = useState(1);
  const [localResponses, setLocalResponses] = useState<{[key: string]: string | string[]}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const initializedQuestions = useRef<Set<string>>(new Set());

  const selectedQSTNR = useSelector(
    (state: RootState) => state.projectManagement.selectedQstnr
  );
  
  const userLogin = useSelector((state: RootState) => state.login.user);

  // Get current question
  const currentQuestion = questionnaire?.questions?.[currentQuestionIndex] || null;
  const totalQuestions = questionnaire?.questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Calculate current page and questions to display
  const currentPage = Math.floor(currentQuestionIndex / questionsPerPage);
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);
  const currentQuestions = useMemo(() => {
    return questionnaire?.questions?.slice(startIndex, endIndex) || [];
  }, [questionnaire?.questions, startIndex, endIndex]);

  // Navigation states
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

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

  // Initialize local responses for current questions
  useEffect(() => {
    if (currentQuestions && currentQuestions.length > 0) {
      const newResponses: {[key: string]: string | string[]} = {};
      currentQuestions.forEach(question => {
        // Only initialize if not already initialized
        if (!initializedQuestions.current.has(question._id)) {
          newResponses[question._id] = question.userResponse || '';
          initializedQuestions.current.add(question._id);
        }
      });
      if (Object.keys(newResponses).length > 0) {
        setLocalResponses(prev => ({ ...prev, ...newResponses }));
      }
    }
  }, [currentQuestions]);

  // Handle response change
  const handleResponseChange = useCallback((response: string | string[]) => {
    setUserResponse(response);
  }, []);

  // Handle local response change for multiple questions
  const handleLocalResponseChange = useCallback((questionId: string, value: string | string[]) => {
    setLocalResponses(prev => {
      // Only update if the value actually changed
      if (prev[questionId] === value) {
        return prev;
      }
      return {
        ...prev,
        [questionId]: value
      };
    });
    setSaveSuccess(false); // Reset success state when user makes changes
  }, []);

  // Check if all questions on current page are answered
  const allQuestionsAnswered = currentQuestions.every(question => {
    const response = localResponses[question._id];
    return response && (Array.isArray(response) ? response.length > 0 : response.toString().trim() !== '');
  });

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
  }, [currentQuestion, userResponse, questionnaireId, questionnaire, axiosInstance, userLogin?.roles]);

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

  // Navigate to next page
  const handleNextPage = useCallback(() => {
    if (!isLastPage) {
      setCurrentQuestionIndex(prev => Math.min(prev + questionsPerPage, totalQuestions - 1));
    }
  }, [isLastPage, questionsPerPage, totalQuestions]);

  // Navigate to previous page
  const handlePreviousPage = useCallback(() => {
    if (!isFirstPage) {
      setCurrentQuestionIndex(prev => Math.max(prev - questionsPerPage, 0));
    }
  }, [isFirstPage, questionsPerPage]);

  // Handle questions per page change
  const handleQuestionsPerPageChange = useCallback((newQuestionsPerPage: number) => {
    setQuestionsPerPage(newQuestionsPerPage);
    // Reset to first question of current page
    const newCurrentPage = Math.floor(currentQuestionIndex / newQuestionsPerPage);
    setCurrentQuestionIndex(newCurrentPage * newQuestionsPerPage);
  }, [currentQuestionIndex]);

  // Save all responses for current page
  const handleSaveAllResponses = useCallback(async (responses: {[key: string]: string | string[]}) => {
    try {
      setIsSubmitting(true);
      
      // Get user role from Redux state
      const role = userLogin?.roles?.[0] || 'AEStakeholder';

      // Save each response
      for (const [questionId, response] of Object.entries(responses)) {
        if (response && (Array.isArray(response) ? response.length > 0 : response.toString().trim() !== '')) {
          const responseData = {
            questionId: questionId,
            choiceValue: Array.isArray(response) ? response : [response],
            assessmentId: questionnaireId,
          };

          await storeUserResponse(role, axiosInstance, responseData);
        }
      }

      // Update local questionnaire state
      if (questionnaire && questionnaire.questions) {
        const updatedQuestions = questionnaire.questions.map(q => {
          const response = responses[q._id];
          if (response) {
            return {
              ...q,
              userResponse: Array.isArray(response) ? response.join(', ') : response
            };
          }
          return q;
        });
        
        setQuestionnaire({
          ...questionnaire,
          questions: updatedQuestions,
        });
      }

      return true;
    } catch (err) {
      console.error('Error saving responses:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [questionnaireId, questionnaire, axiosInstance, userLogin]);

  // Save all responses with validation and success feedback
  const saveAllResponsesWithFeedback = useCallback(async () => {
    if (!allQuestionsAnswered) {
      alert('Please answer all questions before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await handleSaveAllResponses(localResponses);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving responses:', error);
      alert('Failed to save responses. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [allQuestionsAnswered, localResponses, handleSaveAllResponses]);

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
    handleResponseChange,
    handleLocalResponseChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleNextPage,
    handlePreviousPage,
    handleQuestionsPerPageChange,
    handleSubmitResponse,
    handleSaveAllResponses,
    saveAllResponsesWithFeedback,
  };
};

export default useQuestionAttempt;
