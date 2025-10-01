import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import useAxios from '../../../../../api/useAxios';
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

const useAssessmentQuestionnaire = () => {
  const axiosInstance = useAxios();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

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

  return {
    questionnaires,
    isLoading,
    error,
  };
};

export default useAssessmentQuestionnaire;
