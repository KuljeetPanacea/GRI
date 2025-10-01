import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  Box,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./Questionnaire.module.css";
import { useScopeDocument } from "../hooks/useScopeDocuments";

const Questionnaire = () => {
  const {
    selectedAnswer,
    selectedScopingIndex,
    selectedQuestionIndex,
    expandedAccordions,
    scopingDataArray,
    selectedQuestion,
    handleAnswerChange,
    handleAccordionToggle,
    handleQuestionSelect
  } = useScopeDocument();

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.accordionContainer}>
          {scopingDataArray.map((scopingData, scopingIndex) => (
            <Accordion
              key={scopingIndex}
              expanded={expandedAccordions[scopingIndex] || false}
              onChange={() => handleAccordionToggle(scopingIndex)}
              className={styles.accordion}
              TransitionProps={{ unmountOnExit: true }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={styles.accordionSummary}
              >
                <Tooltip title={scopingData?.title ?? `Scoping Data ${scopingIndex + 1}`} arrow>
                  <Typography className={styles.sectionTitle}>
                    {scopingData?.title ?? `Scoping Data ${scopingIndex + 1}`}
                  </Typography>
                </Tooltip>
              </AccordionSummary>
              <AccordionDetails className={styles.accordionDetails}>
                <List className={styles.questionList}>
                  {scopingData?.questions?.map((question, questionIndex) => (
                    <ListItem
                      key={question._id}
                      className={`${styles.listItem} ${
                        scopingIndex === selectedScopingIndex && questionIndex === selectedQuestionIndex 
                          ? styles.activeItem 
                          : ""
                      }`}
                      onClick={() => handleQuestionSelect(scopingIndex, questionIndex)}
                    >
                      <Typography className={styles.questionNumber}>
                        {questionIndex + 1}.
                      </Typography>
                      <ListItemText
                        primary={question.text}
                        className={styles.questionText}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>

      <div className={styles.mainContent}>
        <Box className={styles.questionContainer}>
          {selectedQuestion ? (
            <>
              <Typography variant="h6" className={styles.mainQuestion}>
                {selectedQuestionIndex + 1}. {selectedQuestion.text}
              </Typography>

              {selectedQuestion.type === "multiple_choice" && selectedQuestion.choices ? (
                <FormControl component="fieldset" className={styles.formControl}>
                  <RadioGroup
                    value={selectedAnswer}
                    onChange={handleAnswerChange}
                    className={styles.radioGroup}
                  >
                    {selectedQuestion.choices.map((choice, index) => {
                      // Check if this choice matches the userResponse
                      const isChecked = selectedQuestion.userResponse 
                        ? Array.isArray(selectedQuestion.userResponse)
                          ? selectedQuestion.userResponse.some(response => 
                              response.toLowerCase().replace('.', '') === choice.value.toLowerCase()
                            )
                          : selectedQuestion.userResponse.toLowerCase().replace('.', '') === choice.value.toLowerCase()
                        : selectedAnswer === choice.value;

                      return (
                        <FormControlLabel
                          key={index}
                          value={choice.value}
                          control={<Radio className={styles.radio} checked={isChecked} />}
                          label={choice.value}
                          className={styles.radioOption}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              ) : selectedQuestion.type === "single_choice" && selectedQuestion.choices ? (
                <FormControl component="fieldset" className={styles.formControl}>
                  <RadioGroup
                    value={selectedAnswer}
                    onChange={handleAnswerChange}
                    className={styles.radioGroup}
                  >
                    {selectedQuestion.choices.map((choice, index) => {
                      const isChecked = selectedQuestion.userResponse 
                        ? selectedQuestion.userResponse.toLowerCase().replace('.', '') === choice.value.toLowerCase()
                        : selectedAnswer === choice.value;

                      return (
                        <FormControlLabel
                          key={index}
                          value={choice.value}
                          control={<Radio className={styles.radio} checked={isChecked} />}
                          label={choice.value}
                          className={styles.radioOption}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              ) : selectedQuestion.type === "long_text" ? (
                <FormControl component="fieldset" className={styles.formControl}>
                  <textarea 
                    className={styles.textarea} 
                    value={selectedAnswer}
                    onChange={handleAnswerChange}
                    placeholder="Enter your detailed response..."
                    rows={6}
                  />
                </FormControl>
              ) : selectedQuestion.type === "short_text" ? (
                <FormControl component="fieldset" className={styles.formControl}>
                  <textarea 
                    className={styles.textarea} 
                    value={selectedAnswer}
                    onChange={handleAnswerChange}
                    placeholder="Enter your response..."
                    rows={2}
                  />
                </FormControl>
              ) : selectedQuestion.type === "file_upload" ? (
                <FormControl component="fieldset" className={styles.formControl}>
                  <input 
                    type="file" 
                    className={styles.fileInput}
                    multiple
                  />
                  {selectedQuestion.userResponse && (
                    <Typography className={styles.fileInfo}>
                      Previously uploaded: {selectedQuestion.userResponse}
                    </Typography>
                  )}
                </FormControl>
              ) : (
                <Typography className={styles.noChoices}>
                  This question type ({selectedQuestion.type}) is not supported yet.
                </Typography>
              )}
            </>
          ) : (
            <Typography className={styles.noQuestion}>
              Please select a question from the sidebar.
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default Questionnaire;