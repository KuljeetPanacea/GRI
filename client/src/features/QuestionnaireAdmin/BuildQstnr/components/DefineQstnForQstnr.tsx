import {
  Box,
  Card,
  Typography,
  IconButton,
  Radio,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import styles from "../BuildQstnr.module.css";
import React, { useEffect, useState, useRef } from "react";
import { Add, Remove } from "@mui/icons-material";
import useBuildQstnr from "../useBuildQstnr";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../../../redux/store";
import FeedbackSnackbar from "../../../../common/ui/FeedbackSnackbar";
import { setErrorMessage, TableColumn } from "../../../../redux/qstnrQuestion";

const DefineQstnForQstnr = () => {
  const {
    question,
    options,
    setOptions,
    setQuestion,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    addQuestionInList,
    updateQuestionInList,
    updateTableColumns,
    updateTableRows
  } = useBuildQstnr();
  
  const dispatch = useDispatch();
  const { phase } = useAppSelector((state: RootState) => state.defineQstnr);
  const { newQuestion } = useAppSelector((state: RootState) => state.qstnrQuestion);
  const ErrorMessage = useAppSelector(
    (state: RootState) => state.qstnrQuestion.ErrorMessage);
  const questionType = useSelector(
    (state: RootState) => state.qstnrQuestion.type
  );
  const selectedQuestion = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedQuestion
  );
  
  const [open, setOpen] = useState<boolean>(true);
  const prevNewQuestionRef = useRef(newQuestion);
  
  // Clear fields when questionType changes, but only if newQuestion is true
  useEffect(() => {
    prevNewQuestionRef.current = newQuestion;
    
    if (newQuestion) {
      setQuestion("");
      setOptions([]);
    }
    
  }, [newQuestion, setQuestion, setOptions]);
  
  // Handle selected question changes
  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion.text || "");
      setOptions(selectedQuestion.choices?.map((choice) => choice.value) || []);
    }
  }, [selectedQuestion, setOptions, setQuestion]);
  
  useEffect(() => {
    if (ErrorMessage) {
      setOpen(true);
      
      // Optional: Auto-hide after some time
      const timer = setTimeout(() => {
        setOpen(false);
        dispatch(setErrorMessage("")); // Clear the error message
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [ErrorMessage, dispatch]);
  
  return (
    <>
      {(questionType === "short_text" ||
        questionType === "long_text" ||
        selectedQuestion?.type === "short_text" ||
        selectedQuestion?.type === "long_text") && (
        <Card className={styles.questionCard}>
          <TextField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.description}
          >
            Description (Optional)
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
            disabled
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button onClick={handleAddOption} className={styles.addOtherButton}>
              + Add "Other" option
            </Button>
            <Button
              onClick={
                newQuestion ? addQuestionInList : updateQuestionInList
              }
              className={styles.addSaveUpdateButton}
            >
              {newQuestion ? "Save" : "Update"}
            </Button>
          </div>
        </Card>
      )}
      {(questionType === "multiple_choice" ||
        questionType === "single_choice" ||
        selectedQuestion?.type === "multiple_choice" ||
        selectedQuestion?.type === "single_choice") && (
        <Card className={styles.questionCard}>
          <TextField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.description}
          >
            Description (Optional)
          </Typography>
          {options.map((option, index) => (
            <Box key={index} className={styles.optionContainer}>
              <Box className={styles.optionInput}>
                <Radio disabled color="default" />
                <TextField
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  variant="standard"
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                />
              </Box>
              <Box>
                <IconButton
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length <= 1}
                >
                  <Remove />
                </IconButton>
                <IconButton onClick={handleAddOption}>
                  <Add />
                </IconButton>
              </Box>
            </Box>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button onClick={handleAddOption} className={styles.addOtherButton}>
              + Add "Other" option
            </Button>
            <Button
              onClick={
                newQuestion ? addQuestionInList : updateQuestionInList
              }
              className={styles.addSaveUpdateButton}
            >
              {newQuestion ? "Save" : "Update"}
            </Button>
          </div>
        </Card>
      )}
      {(questionType === "table_type" ||
        selectedQuestion?.type === "table_type") && (
        <Card className={styles.tableQuestionCard}>
          <TextField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.description}
          >
            Configure Table Columns
          </Typography>
          <TableConfig 
            updateTableColumns={updateTableColumns}
            updateTableRows={updateTableRows}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button
              onClick={() => {
                setQuestion("");
                setOptions([]);
              }}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={
                newQuestion ? addQuestionInList : updateQuestionInList
              }
              className={styles.addSaveUpdateButton}
            >
              {newQuestion ? "Save" : "Update"}
            </Button>
          </div>
        </Card>
      )}
      {questionType === "file_type" ||
      selectedQuestion?.type === "file_type" ? (
        <Card className={styles.questionCard}>
          <TextField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className={styles.questionInput}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.description}
          >
            Description (Optional)
          </Typography>
          <input
            disabled
            type="file"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file) {
                console.log("Selected file:", file);
              }
            }}
            style={{ marginTop: "10px", width: "100%" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button
              onClick={
                newQuestion ? addQuestionInList : updateQuestionInList
              }
              className={styles.addSaveUpdateButton}
            >
              {newQuestion ? "Save" : "Update"}
            </Button>
          </div>
        </Card>
      ) : null}
      {(phase === "Assessment" && ErrorMessage) &&
        <FeedbackSnackbar
          open={open}
          message={ErrorMessage}
          severity={"error"}
          onClose={() => setOpen(false)}
        />
      }
    </>
  );
};

// Table Configuration Component
interface TableConfigProps {
  updateTableColumns: (columns: TableColumn[]) => void;
  updateTableRows: (rows: number) => void;
}

const TableConfig = ({ updateTableColumns, updateTableRows }: TableConfigProps) => {
  const selectedQuestion = useSelector((state: RootState) => state.qstnrQuestion.selectedQuestion);
  const [columns, setColumns] = useState<TableColumn[]>(selectedQuestion?.tableColumns || []);
  const [defaultRows, setDefaultRows] = useState(selectedQuestion?.tableRows || 3);

  // Update local state when selectedQuestion changes
  React.useEffect(() => {
    if (selectedQuestion?.tableColumns) {
      setColumns(selectedQuestion.tableColumns);
    }
    if (selectedQuestion?.tableRows) {
      setDefaultRows(selectedQuestion.tableRows);
    }
  }, [selectedQuestion]);

  const addColumn = () => {
    const newColumn: TableColumn = {
      id: `column_${Date.now()}`,
      label: `Column ${columns.length + 1}`,
      type: 'text'
    };
    const newColumns = [...columns, newColumn];
    setColumns(newColumns);
    // Update Redux store
    if (updateTableColumns) {
      updateTableColumns(newColumns);
    }
  };

  // Initialize with a default column if none exist
  React.useEffect(() => {
    if (columns.length === 0 && !selectedQuestion?.tableColumns) {
      const defaultColumn: TableColumn = {
        id: `column_${Date.now()}`,
        label: 'Column 1',
        type: 'text'
      };
      setColumns([defaultColumn]);
      if (updateTableColumns) {
        updateTableColumns([defaultColumn]);
      }
    }
  }, [columns.length, selectedQuestion, updateTableColumns]);

  const updateColumn = (index: number, field: keyof TableColumn, value: string | number | boolean | string[]) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
    // Update Redux store
    if (updateTableColumns) {
      updateTableColumns(newColumns);
    }
  };

  const removeColumn = (index: number) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
    // Update Redux store
    if (updateTableColumns) {
      updateTableColumns(newColumns);
    }
  };

  const addOption = (columnIndex: number, option: string) => {
    const newColumns = [...columns];
    if (!newColumns[columnIndex].options) {
      newColumns[columnIndex].options = [];
    }
    newColumns[columnIndex].options!.push(option);
    setColumns(newColumns);
    // Update Redux store
    if (updateTableColumns) {
      updateTableColumns(newColumns);
    }
  };

  const removeOption = (columnIndex: number, optionIndex: number) => {
    const newColumns = [...columns];
    newColumns[columnIndex].options!.splice(optionIndex, 1);
    setColumns(newColumns);
    // Update Redux store
    if (updateTableColumns) {
      updateTableColumns(newColumns);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Table Configuration</Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addColumn}
          size="small"
        >
          Add Column
        </Button>
      </Box>

      <TextField
        label="Default Number of Rows"
        type="number"
        value={defaultRows}
        onChange={(e) => {
          const rows = Number(e.target.value);
          setDefaultRows(rows);
          // Update Redux store
          if (updateTableRows) {
            updateTableRows(rows);
          }
        }}
        size="small"
        sx={{ mb: 2, width: 200 }}
        inputProps={{ min: 1, max: 50 }}
      />

      {columns.map((column, index) => (
        <Card key={column.id} sx={{ mb: 2, p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Column Label"
              value={column.label}
              onChange={(e) => updateColumn(index, 'label', e.target.value)}
              size="small"
              sx={{ flex: '1 1 200px', minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120, flex: '0 0 120px' }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={column.type}
                onChange={(e) => updateColumn(index, 'type', e.target.value)}
                label="Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              onClick={() => removeColumn(index)}
              color="error"
              size="small"
              sx={{ flex: '0 0 auto' }}
            >
              <Remove />
            </IconButton>
          </Box>

          {column.type === 'select' && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Options:
              </Typography>
              {column.options?.map((option, optionIndex) => (
                <Box key={optionIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(column.options || [])];
                      newOptions[optionIndex] = e.target.value;
                      updateColumn(index, 'options', newOptions);
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    onClick={() => removeOption(index, optionIndex)}
                    color="error"
                    size="small"
                  >
                    <Remove />
                  </IconButton>
                </Box>
              ))}
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => addOption(index, '')}
              >
                Add Option
              </Button>
            </Box>
          )}

          {column.type === 'number' && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                Validation:
              </Typography>
              <TextField
                label="Min Value"
                type="number"
                value={column.validation?.min || ''}
                onChange={(e) => {
                  const newColumns = [...columns];
                  newColumns[index] = {
                    ...newColumns[index],
                    validation: {
                      ...(newColumns[index].validation || {}),
                      min: e.target.value ? Number(e.target.value) : undefined
                    }
                  };
                  setColumns(newColumns);
                  if (updateTableColumns) {
                    updateTableColumns(newColumns);
                  }
                }}
                size="small"
                sx={{ width: 120 }}
              />
              <TextField
                label="Max Value"
                type="number"
                value={column.validation?.max || ''}
                onChange={(e) => {
                  const newColumns = [...columns];
                  newColumns[index] = {
                    ...newColumns[index],
                    validation: {
                      ...(newColumns[index].validation || {}),
                      max: e.target.value ? Number(e.target.value) : undefined
                    }
                  };
                  setColumns(newColumns);
                  if (updateTableColumns) {
                    updateTableColumns(newColumns);
                  }
                }}
                size="small"
                sx={{ width: 120 }}
              />
            </Box>
          )}
        </Card>
      ))}

      {columns.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No columns configured. Click "Add Column" to get started.
        </Typography>
      )}
    </Box>
  );
};

export default DefineQstnForQstnr;