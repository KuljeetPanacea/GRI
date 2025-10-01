import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import QuestionAttemptScreen from './QuestionAttemptScreen';

const QuestionAttemptWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { questionnaireId } = useParams<{ questionnaireId: string }>();
  
  const selectedQSTNR = useSelector(
    (state: RootState) => state.projectManagement.selectedQstnr
  );

  const handleComplete = () => {
    // Navigate to completion page or back to questionnaire list
    navigate('/landing/aepoc-qstnr');
  };

  const handleBack = () => {
    // Navigate back to questionnaire list
    navigate('/landing/aepoc-qstnr');
  };

  if (!selectedQSTNR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No questionnaire selected. Please go back and select a questionnaire.</p>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <QuestionAttemptScreen
      questionnaireId={questionnaireId || selectedQSTNR.id || ''}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
};

export default QuestionAttemptWrapper;
