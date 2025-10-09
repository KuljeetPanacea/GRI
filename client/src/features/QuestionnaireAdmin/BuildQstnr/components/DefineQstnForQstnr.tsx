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
import React, { useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import FeedbackSnackbar from "../../../../common/ui/FeedbackSnackbar";
import { TableColumn, TableConfig, TableMode } from "../../../../redux/qstnrQuestion";
import useDefineQstnForQstnr from "../hooks/useDefineQstnForQstnr";

const DefineQstnForQstnr = () => {
  const {
    question,
    options,
    open,
    phase,
    newQuestion,
    ErrorMessage,
    questionType,
    selectedQuestion,
    setQuestion,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    handleCancel,
    handleSaveOrUpdate,
    handleSnackbarClose,
    updateTableConfig,
  } = useDefineQstnForQstnr();

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
              onClick={handleSaveOrUpdate}
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
              onClick={handleSaveOrUpdate}
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
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            🔧 TABLE TYPE QUESTION DETECTED - Mode: {selectedQuestion?.tableConfig?.mode || 'dynamic'}
          </Typography>
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
          
          <div className={styles.tableConfigContainer}>
            <UnifiedTableConfig 
              updateTableConfig={updateTableConfig}
            />
          </div>
          
          {selectedQuestion?.type === "table_type" && 
           selectedQuestion.tableConfig?.mode === "template" &&
           (!selectedQuestion.tableConfig?.rows?.length || 
            !selectedQuestion.tableConfig?.columns?.length) && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: 1 
            }}>
              <Typography variant="body2" color="warning.dark">
                <strong>Note:</strong> You need to add at least one row and one column before you can save this template table question.
              </Typography>
            </Box>
          )}
          
          <div className={styles.tableButtonContainer}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveOrUpdate}
                className={styles.addSaveUpdateButton}
                disabled={
                  !question.trim() || 
                  (selectedQuestion?.type === "table_type" && 
                   selectedQuestion.tableConfig?.mode === "template" &&
                   (!selectedQuestion.tableConfig?.rows?.length || 
                    !selectedQuestion.tableConfig?.columns?.length))
                }
              >
                {newQuestion ? "Save" : "Update"}
              </Button>
            </div>
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
              onClick={handleSaveOrUpdate}
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
          onClose={handleSnackbarClose}
        />
      }
    </>
  );
};

// Default configuration outside component to avoid dependency issues
const defaultTableConfig: TableConfig = {
  mode: 'dynamic',
  columns: []
};

// Unified Table Configuration Component
interface UnifiedTableConfigProps {
  updateTableConfig: (config: TableConfig) => void;
}

const UnifiedTableConfig = ({ updateTableConfig }: UnifiedTableConfigProps) => {
  const selectedQuestion = useSelector((state: RootState) => state.qstnrQuestion.selectedQuestion);
  
  const [config, setConfig] = useState<TableConfig>(
    selectedQuestion?.tableConfig || defaultTableConfig
  );

  // Update local state when selectedQuestion changes
  React.useEffect(() => {
    if (selectedQuestion?.tableConfig) {
      setConfig(selectedQuestion.tableConfig);
    } else {
      setConfig(defaultTableConfig);
    }
  }, [selectedQuestion]);

  const updateConfigAndStore = (newConfig: TableConfig) => {
    setConfig(newConfig);
    if (updateTableConfig) {
      updateTableConfig(newConfig);
    }
  };

  const updateMode = (mode: TableMode) => {
    const newConfig: TableConfig = {
      ...config,
      mode,
      // Reset rows when switching to dynamic mode
      ...(mode === 'dynamic' && { rows: undefined }),
      // Reset rows when switching to template mode
      ...(mode === 'template' && { rows: [] })
    };
    updateConfigAndStore(newConfig);
  };

  const addColumn = () => {
    const newColumn: TableColumn = {
      id: `column_${Date.now()}`,
      label: `Column ${config.columns.length + 1}`,
      type: 'text'
    };
    const newConfig = {
      ...config,
      columns: [...config.columns, newColumn]
    };
    updateConfigAndStore(newConfig);
  };

  const updateColumn = (index: number, field: keyof TableColumn, value: string | number | boolean | string[]) => {
    const newColumns = [...config.columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    const newConfig = {
      ...config,
      columns: newColumns
    };
    updateConfigAndStore(newConfig);
  };

  const removeColumn = (index: number) => {
    const newColumns = config.columns.filter((_, i) => i !== index);
    const newConfig = {
      ...config,
      columns: newColumns
    };
    updateConfigAndStore(newConfig);
  };

  const addRow = () => {
    const newRow = {
      id: `row_${Date.now()}`,
      label: `Row ${(config.rows?.length || 0) + 1}`
    };
    const newConfig = {
      ...config,
      rows: [...(config.rows || []), newRow]
    };
    updateConfigAndStore(newConfig);
  };

  const updateRowLabel = (rowId: string, newLabel: string) => {
    const newConfig = {
      ...config,
      rows: config.rows?.map(row => 
        row.id === rowId ? { ...row, label: newLabel } : row
      ) || []
    };
    updateConfigAndStore(newConfig);
  };

  const removeRow = (rowId: string) => {
    if ((config.rows?.length || 0) <= 1) return; // Keep at least one row
    const newConfig = {
      ...config,
      rows: config.rows?.filter(row => row.id !== rowId) || []
    };
    updateConfigAndStore(newConfig);
  };

  const addOption = (columnIndex: number, option: string) => {
    const newColumns = [...config.columns];
    if (!newColumns[columnIndex].options) {
      newColumns[columnIndex].options = [];
    }
    newColumns[columnIndex].options!.push(option);
    const newConfig = {
      ...config,
      columns: newColumns
    };
    updateConfigAndStore(newConfig);
  };

  const removeOption = (columnIndex: number, optionIndex: number) => {
    const newColumns = [...config.columns];
    newColumns[columnIndex].options!.splice(optionIndex, 1);
    const newConfig = {
      ...config,
      columns: newColumns
    };
    updateConfigAndStore(newConfig);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Table Mode Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Table Mode
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={config.mode === 'dynamic' ? 'contained' : 'outlined'}
            onClick={() => updateMode('dynamic')}
            size="small"
          >
            Dynamic Table
          </Button>
          <Button
            variant={config.mode === 'template' ? 'contained' : 'outlined'}
            onClick={() => updateMode('template')}
            size="small"
          >
            Template Table
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {config.mode === 'dynamic' 
            ? 'Dynamic tables allow users to add/remove rows as needed.'
            : 'Template tables have predefined rows with fixed labels.'}
        </Typography>
      </Box>


      {/* Template Mode - Predefined Rows */}
      {config.mode === 'template' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Predefined Rows (Area of Change)
          </Typography>
          {config.rows?.map((row) => (
            <Box key={row.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
              <TextField
                value={row.label}
                onChange={(e) => updateRowLabel(row.id, e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <IconButton
                onClick={() => removeRow(row.id)}
                color="error"
                size="small"
                disabled={(config.rows?.length || 0) <= 1}
              >
                <Remove />
              </IconButton>
            </Box>
          ))}
          <Button
            size="small"
            startIcon={<Add />}
            onClick={addRow}
            sx={{ mt: 1 }}
          >
            Add Row
          </Button>
          
          {(config.rows?.length || 0) === 0 && (
            <Box sx={{ textAlign: 'center', py: 3, border: '2px dashed #ccc', borderRadius: 1, mt: 2 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                No predefined rows yet.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add rows like "Activities", "Products", "Services", "Markets served", "Supply chain"
              </Typography>
              <Button variant="contained" onClick={addRow} sx={{ mt: 1 }}>
                Add First Row
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Columns Configuration */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Table Columns
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addColumn}
            size="small"
          >
            Add Column
          </Button>
        </Box>

        {config.columns.map((column, index) => (
        <Card key={column.id} className={styles.columnCard} sx={{ mb: 2, p: 2 }}>
          <Box className={styles.columnCardContent}>
            <Box className={styles.columnHeader}>
              <TextField
                value={column.label}
                onChange={(e) => updateColumn(index, 'label', e.target.value)}
                size="small"
                label="Column Label"
                placeholder="Enter column label"
              />
              <FormControl size="small">
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
            <Box className={styles.optionsContainer}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Select Options:
              </Typography>
              <Box className={styles.optionsList}>
                {column.options?.map((option, optionIndex) => (
                  <Box key={optionIndex} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(column.options || [])];
                        newOptions[optionIndex] = e.target.value;
                        updateColumn(index, 'options', newOptions);
                      }}
                      size="small"
                      placeholder={`Option ${optionIndex + 1}`}
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
              </Box>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={() => addOption(index, '')}
                variant="outlined"
              >
                Add Option
              </Button>
            </Box>
          )}

          {column.type === 'number' && (
            <Box className={styles.validationContainer}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                Number Validation:
              </Typography>
              <TextField
                label="Min Value"
                type="number"
                value={column.validation?.min || ''}
                onChange={(e) => {
                  const newColumns = [...config.columns];
                  newColumns[index] = {
                    ...newColumns[index],
                    validation: {
                      ...(newColumns[index].validation || {}),
                      min: e.target.value ? Number(e.target.value) : undefined
                    }
                  };
                  const newConfig = {
                    ...config,
                    columns: newColumns
                  };
                  updateConfigAndStore(newConfig);
                }}
                size="small"
                placeholder="Min value"
              />
              <TextField
                label="Max Value"
                type="number"
                value={column.validation?.max || ''}
                onChange={(e) => {
                  const newColumns = [...config.columns];
                  newColumns[index] = {
                    ...newColumns[index],
                    validation: {
                      ...(newColumns[index].validation || {}),
                      max: e.target.value ? Number(e.target.value) : undefined
                    }
                  };
                  const newConfig = {
                    ...config,
                    columns: newColumns
                  };
                  updateConfigAndStore(newConfig);
                }}
                size="small"
                placeholder="Max value"
              />
            </Box>
          )}
          </Box>
        </Card>
      ))}

        {config.columns.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed #ccc', borderRadius: 1 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No columns configured yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add columns like "Description of Change", "Reason/Impact", "Previous Period Data", "Current Period Data"
            </Typography>
            <Button variant="contained" onClick={addColumn} sx={{ mt: 1 }}>
              Add First Column
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DefineQstnForQstnr;