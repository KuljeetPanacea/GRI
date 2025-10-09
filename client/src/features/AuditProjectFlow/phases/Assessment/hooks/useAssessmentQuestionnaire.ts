import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import useAxios from '../../../../../api/useAxios';
import { fetchProjectQuestionaire, storeGapComment } from '../../../../../api/project';

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
  // Unified table properties
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

interface NavigationState {
  questionId?: string;
  questionnaireId?: string;
  questionText?: string;
  currentResponse?: string;
  questionType?: string;
  choices?: Array<{ value: string }>;
}

const useAssessmentQuestionnaire = (navigationState?: NavigationState) => {
  const axiosInstance = useAxios();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Gap management state
  const [selectedTab, setSelectedTab] = useState(0);
  const [gapDialogOpen, setGapDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [gapComment, setGapComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [questionsWithGaps, setQuestionsWithGaps] = useState<Set<string>>(new Set());

  const selectedProject = useSelector((state: RootState) => state.projectView.selectedProject);

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

  // Handle navigation to specific question
  useEffect(() => {
    if (navigationState?.questionId && questionnaires.length > 0) {
      // Find the questionnaire and question
      let targetQuestionnaireIndex = -1;

      questionnaires.forEach((questionnaire, qIndex) => {
        if (questionnaire.questions) {
          questionnaire.questions.forEach((question) => {
            if (question._id === navigationState.questionId) {
              targetQuestionnaireIndex = qIndex;
            }
          });
        }
      });

      if (targetQuestionnaireIndex !== -1) {
        // Set the correct tab
        setSelectedTab(targetQuestionnaireIndex);
      }
    }
  }, [navigationState, questionnaires]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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

      // Update local state to immediately reflect the gap comment
      setQuestionsWithGaps(prev => new Set([...prev, selectedQuestion._id]));

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
      return { type: 'no-response', content: null };
    }

    if (question.type === 'table_type') {
      // Parse table data from userResponse JSON string
      let tableData: Record<string, string | number | boolean>[] = [];
      
      // Handle different response formats
      if (typeof question.userResponse === 'string') {
        if (question.userResponse.startsWith('[')) {
          try {
            tableData = JSON.parse(question.userResponse);
          } catch (e) {
            console.error('Error parsing table data:', e);
            return { type: 'error', content: 'Invalid Table Data' };
          }
        } else if (question.userResponse.trim() === '') {
          tableData = [];
        }
      } else if (Array.isArray(question.userResponse)) {
        tableData = question.userResponse;
      }

      if (!tableData || tableData.length === 0) {
        return { type: 'no-data', content: null };
      }

      const config = question.tableConfig;
      if (!config || !config.columns || config.columns.length === 0) {
        return { type: 'error', content: 'Invalid Table Configuration' };
      }

      return { type: 'table', content: { config, tableData } };
    }

    if (question.type === 'multiple_choice' && question.choices) {
      const responseString = typeof question.userResponse === 'string' 
        ? question.userResponse 
        : String(question.userResponse);
      const responses = responseString.split(', ');
      return { type: 'multiple-choice', content: responses };
    }

    if (question.type === 'single_choice' && question.choices) {
      return { type: 'single-choice', content: String(question.userResponse) };
    }

    return { type: 'text', content: String(question.userResponse) };
  };

  return {
    questionnaires,
    isLoading,
    error,
    // Gap management state
    selectedTab,
    gapDialogOpen,
    selectedQuestion,
    gapComment,
    isSubmitting,
    submitError,
    questionsWithGaps,
    // Functions
    handleTabChange,
    handleGapCommentClick,
    handleGapCommentSubmit,
    getResponseDisplay,
    setGapComment,
    setGapDialogOpen,
  };
};

export default useAssessmentQuestionnaire;
