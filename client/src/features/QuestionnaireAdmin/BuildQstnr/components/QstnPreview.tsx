import {
  Card,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import TableInput from "./TableInput";
import styles from "../BuildQstnr.module.css";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import useQstnPreview from "../hooks/useQstnPreview";

const QstnPreview = () => {
  const {
    currentIndex,
    currentQuestion,
    selectedValue,
    selectedValues,
    textValue,
    questionList,
    handleSingleChoiceChange,
    handleMultipleChoiceChange,
    handleNext,
    handlePrevious,
    handleTableDataChange,
    handleFileChange,
    handleTextChange,
  } = useQstnPreview();

  // Show loading state if no current question
  if (!currentQuestion) {
    return (
      <div className={styles.previewContainer}>
        <Card className={styles.previewCard}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {questionList && questionList.length > 0 ? "Loading..." : "No questions available"}
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.previewContainer}>
      <Card 
        className={
          currentQuestion.type === "table_type"
            ? styles.tablePreviewCard 
            : styles.previewCard
        } 
        key={currentQuestion._id}
        sx={{
          ...(currentQuestion.type === "table_type" && {
            minWidth: '600px',
            width: '100%',
            maxWidth: 'none',
            padding: '20px'
          })
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          {currentQuestion.text}
        </Typography>

        {currentQuestion.type === "single_choice" ? (
          <RadioGroup value={selectedValue} onChange={handleSingleChoiceChange}>
            {currentQuestion.choices?.map((option) => (
              <FormControlLabel
                key={option._id}
                className={styles.previewOption}
                control={<Radio />}
                label={option.value}
                value={option.value}
              />
            ))}
          </RadioGroup>
        ) : currentQuestion.type === "multiple_choice" ? (
          <FormGroup>
            {currentQuestion.choices?.map((option) => (
              <FormControlLabel
                key={option._id}
                className={styles.previewOption}
                control={
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onChange={handleMultipleChoiceChange}
                  />
                }
                label={option.value}
                value={option.value}
              />
            ))}
          </FormGroup>
        ) : currentQuestion.type === "file_type" ? (
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginTop: "10px", marginBottom: "10px" }}
          />
        ) : currentQuestion.type === "table_type" ? (
          <TableInput
            config={currentQuestion.tableConfig || { mode: 'dynamic', columns: [] }}
            data={currentQuestion.tableData || []}
            onDataChange={handleTableDataChange}
            readOnly={false}
          />
        ) : currentQuestion.type === "short_text" ||
          currentQuestion.type === "long_text" ? (
          <TextField
            multiline={currentQuestion.type === "long_text"}
            fullWidth
            id="outlined-basic"
            variant="outlined"
            sx={{ mb: 2 }}
            value={textValue}
            onChange={handleTextChange}
          />
        ) : null}

        <div className={styles.previewButtonContainer}>
          <PrimaryButton
            className={styles.previewSubmitButton}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </PrimaryButton>
          <PrimaryButton
            className={styles.previewNextButton}
            onClick={handleNext}
          >
            Next
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default QstnPreview;
