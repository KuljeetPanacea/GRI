import React, { useState } from 'react';
import styles from './SalesScoping.module.css';

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  description?: string;
  options: QuestionOption[];
}

interface Questionnaire {
  id: string;
  title: string;
  questions: Question[];
  industry?: string;
  industrySize?: string;
}

const SSCreateNew: React.FC = () => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
    id: '1',
    title: '',
    questions: [],
    industry: 'Banking',
    industrySize: 'Big'
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionnaire({ ...questionnaire, title: e.target.value });
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionnaire({ ...questionnaire, industry: e.target.value });
  };

  const handleIndustrySizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionnaire({ ...questionnaire, industrySize: e.target.value });
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: '',
      options: []
    };
    
    setQuestionnaire({
      ...questionnaire,
      questions: [...questionnaire.questions, newQuestion]
    });
    
    setSelectedQuestionIndex(questionnaire.questions.length);
  };

  const handlePublish = () => {
    // Implement publishing logic
    console.log('Publishing questionnaire:', questionnaire);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button className={styles.addQuestionBtn} onClick={handleAddQuestion}>
          <span className={styles.plusIcon}>+</span> Add Question
        </button>
        
        <div className={styles.questionList}>
          {questionnaire.questions.map((question, index) => (
            <div 
              key={question.id} 
              className={`${styles.questionItem} ${selectedQuestionIndex === index ? styles.selectedQuestion : ''}`}
              onClick={() => setSelectedQuestionIndex(index)}
            >
              <span>{index + 1}. {question.text || 'Please let us know...'}</span>
              <div className={styles.itemActions}>⋮</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="eComm Questionnaire"
            value={questionnaire.title}
            onChange={handleTitleChange}
          />
          <div className={styles.headerControls}>
            <button className={styles.publishBtn} onClick={handlePublish}>Publish</button>
            <div className={styles.settingsText}>Question Settings</div>
          </div>
        </div>
        
        <div className={styles.questionEditor}>
          {selectedQuestionIndex !== null && (
            <div className={styles.questionPanel}>
              <div className={styles.questionActions}>
                <button className={styles.actionBtn}>
                  <span role="img" aria-label="Translate">🌐</span> Translate
                </button>
                <button className={styles.actionBtn}>
                  <span role="img" aria-label="Duplicate">📋</span> Duplicate
                </button>
                <button className={styles.actionBtn}>
                  <span role="img" aria-label="Delete">🗑️</span> Delete
                </button>
                
                <div className={styles.industrySelectors}>
                  <div className={styles.selectWrapper}>
                    <span>Industry:</span>
                    <select value={questionnaire.industry} onChange={handleIndustryChange}>
                      <option value="Banking">Banking</option>
                      <option value="Retail">Retail</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Technology">Technology</option>
                    </select>
                  </div>
                  
                  <div className={styles.selectWrapper}>
                    <span>Industry Size:</span>
                    <select value={questionnaire.industrySize} onChange={handleIndustrySizeChange}>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Big">Big</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className={styles.questionContent}>
                <div className={styles.questionNumberAndText}>
                  <span className={styles.questionNumber}>{selectedQuestionIndex + 1}.</span>
                  <input
                    type="text"
                    className={styles.questionText}
                    placeholder="Please let us know your Business Category"
                    value={questionnaire.questions[selectedQuestionIndex].text}
                    onChange={(e) => {
                      const updatedQuestions = [...questionnaire.questions];
                      updatedQuestions[selectedQuestionIndex].text = e.target.value;
                      setQuestionnaire({...questionnaire, questions: updatedQuestions});
                    }}
                  />
                </div>
                
                <textarea
                  className={styles.questionDescription}
                  placeholder="Description (Optional)"
                  value={questionnaire.questions[selectedQuestionIndex].description || ''}
                  onChange={(e) => {
                    const updatedQuestions = [...questionnaire.questions];
                    updatedQuestions[selectedQuestionIndex].description = e.target.value;
                    setQuestionnaire({...questionnaire, questions: updatedQuestions});
                  }}
                />
                
                <div className={styles.optionsContainer}>
                  {questionnaire.questions[selectedQuestionIndex].options.map((option, optionIndex) => (
                    <div key={option.id} className={styles.optionItem}>
                      <input
                        type="text"
                        className={styles.optionText}
                        placeholder="Option text"
                        value={option.text}
                        onChange={(e) => {
                          const updatedQuestions = [...questionnaire.questions];
                          updatedQuestions[selectedQuestionIndex].options[optionIndex].text = e.target.value;
                          setQuestionnaire({...questionnaire, questions: updatedQuestions});
                        }}
                      />
                    </div>
                  ))}
                  
                  <button 
                    className={styles.addOptionBtn}
                    onClick={() => {
                      const newOption = { id: `opt-${Date.now()}`, text: '' };
                      const updatedQuestions = [...questionnaire.questions];
                      updatedQuestions[selectedQuestionIndex].options.push(newOption);
                      setQuestionnaire({...questionnaire, questions: updatedQuestions});
                    }}
                  >
                    Add Option
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {selectedQuestionIndex === null && (
            <div className={styles.emptyState}>
              <p>Click "Add Question" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SSCreateNew;