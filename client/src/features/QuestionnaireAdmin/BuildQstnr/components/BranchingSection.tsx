import {
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Slide,
  Paper,
  Divider,
  Button,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  TextField,
  Checkbox,
} from "@mui/material";
import styles from "../BuildQstnr.module.css";
import { Add, Close, ExpandMore, Delete, Edit } from "@mui/icons-material";
import useBuildQstnr from "../useBuildQstnr";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setSelectedOperator,
  setSelectedValues,
  setSelectedNextQuestion,
  setSelectedOperation,
} from "../../../../redux/qstnrQuestion";
import { BranchingSectionProps } from "../../../../redux/qstnrQuestion";

const BranchingSection = ({
  isOpen = false,
  onClose,
}: BranchingSectionProps) => {
  const {
    addRule,
    updateRule,
    handlePublish,
    handleOperatorChange,
    handleNextQuestionChange,
    handleValueChange,
    questionList,
    selectedQuestion,
    handleAlwaysGoToChange,
    rulesForFormBranching,
    selectedValues,
    removeRule,
    selectedOperator,
    handleOperationChange,
    selectedNextQuestion,
  } = useBuildQstnr();

  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [additionalConditions, setAdditionalConditions] = useState<
    Array<{
      operator: string;
      values: Array<{ _id: string; value: string }>;
    }>
  >([]);

  const dispatch = useDispatch();

  const handleAddCondition = () => {
    setAdditionalConditions([
      ...additionalConditions,
      {
        operator: "EQUALS",
        values: [],
      },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...additionalConditions];
    newConditions.splice(index, 1);
    setAdditionalConditions(newConditions);
  };

  const handleConditionOperatorChange = (index: number, value: string) => {
    const newConditions = [...additionalConditions];
    newConditions[index] = {
      ...newConditions[index],
      operator: value,
    };
    setAdditionalConditions(newConditions);
  };

  const handleConditionValueChange = (
    index: number,
    value: string | string[]
  ) => {
    const newConditions = [...additionalConditions];
    newConditions[index] = {
      ...newConditions[index],
      values: Array.isArray(value)
        ? value.map((v) => ({ _id: Date.now().toString(), value: v }))
        : [{ _id: Date.now().toString(), value }],
    };
    setAdditionalConditions(newConditions);
  };

  const handleEditRule = (index: number) => {
    setEditingRuleIndex(index);
    const rule = rulesForFormBranching[index];
    const condition = rule.conditions[0];
    // Set form values to match the rule being edited
    handleOperatorChange({ target: { value: condition.operator } });
    // Handle the value based on operator type
    if (condition.operator === "EQUALS") {
      // For EQUALS, we need to find the matching choice and set it as a single value
      const choice = selectedQuestion?.choices?.find((c) => {
        if (!condition.value) return false;
        const conditionValue = Array.isArray(condition.value)
          ? condition.value[0]
          : condition.value;
        return (
          c.value ===
          (typeof conditionValue === "string"
            ? conditionValue
            : (conditionValue as { value: string }).value)
        );
      });
      if (choice) {
        handleValueChange({
          target: {
            value: choice.value,
          },
        });
      }
    } else {
      // For CONTAINS_ANY/ALL, we need to handle multiple values
      const values = Array.isArray(condition.value)
        ? condition.value.map((v) =>
            typeof v === "string" ? v : (v as { value: string }).value
          )
        : [condition.value];

      // Find all matching choices
      const choices =
        selectedQuestion?.choices?.filter((c) => values.includes(c.value)) ||
        [];

      // Set the selected values
      handleValueChange({
        target: {
          value: choices.map((c) => c.value),
        },
      });

      // If there are additional conditions, set them up
      if (rule.conditions.length > 1) {
        const additionalConditions = rule.conditions.slice(1).map((cond) => ({
          operator: cond.operator,
          values: Array.isArray(cond.value)
            ? cond.value.map((v) =>
                typeof v === "string"
                  ? { _id: Date.now().toString(), value: v }
                  : {
                      _id: (v as { _id?: string })._id || Date.now().toString(),
                      value: (v as { value: string }).value,
                    }
              )
            : [{ _id: Date.now().toString(), value: cond.value }],
        }));
        setAdditionalConditions(additionalConditions);
      }
    }
    handleNextQuestionChange({
      target: { value: rule.next },
    } as React.ChangeEvent<HTMLInputElement>);
    handleOperationChange({
      target: { value: rule.operation },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSaveRule = () => {
    if (
      !selectedQuestion ||
      !selectedOperator ||
      !selectedNextQuestion ||
      !selectedValues.length
    ) {
      return;
    }
    // Create the primary condition
    const primaryCondition = {
      questionId: selectedQuestion._id || "",
      operator: selectedOperator,
      value: selectedValues,
    };
    // Create additional conditions if any
    const additionalConditionsList =
      additionalConditions?.map((cond) => ({
        questionId: selectedQuestion._id || "",
        operator: cond.operator,
        value: cond.values,
      })) || [];

    // Combine all conditions
    const allConditions = [primaryCondition, ...additionalConditionsList];

    // Create the event object with all conditions
    const event = {
      target: {
        value: {
          conditions: allConditions.map((condition) => ({
            ...condition,
            value: condition.value.map((choice) => choice.value),
          })),
          next: selectedNextQuestion,
          operation: "AND",
          alwaysGoto: null,
        },
      },
    };
    if (editingRuleIndex !== null) {
      updateRule(editingRuleIndex, event);
      setEditingRuleIndex(null);
    } else {
      addRule(event);
    }
    // Reset all form fields
    setAdditionalConditions([]);
    dispatch(setSelectedOperator(""));
    dispatch(setSelectedValues([]));
    dispatch(setSelectedNextQuestion(""));
    dispatch(setSelectedOperation(""));
  };

  const handleAddRule = () => {
    // Reset all form fields when starting to add a new rule
    setEditingRuleIndex(null);
    setAdditionalConditions([]);
    dispatch(setSelectedOperator(""));
    dispatch(setSelectedValues([]));
    dispatch(setSelectedNextQuestion(""));
    dispatch(setSelectedOperation(""));
  };

  const handlePublishAndClose = () => {
    // Call the original handlePublish from useBuildQstnr
    handlePublish();
    // Close the branching section
    onClose?.();
  };

  return (
    <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "50vw",
          height: "100vh",
          zIndex: 1200,
          bgcolor: "background.paper",
          overflowY: "auto",
        }}
      >
        <Box sx={{ justifyContent: "center" }}>
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="h3"
                sx={{ borderBottom: "2px solid #DB1F42", mr: 2 }}
              >
                Conditional Logic
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Visual Flow
              </Typography>
            </Box>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={onClose}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ p: 2 }}>
          <Accordion sx={{ m: 2, borderRadius: "20px" }}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              onClick={handleAddRule}
            >
              <Typography variant="h4">
                {editingRuleIndex !== null ? "Edit Rule" : "Add New Rule"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h3">If</Typography>
                <TextField
                  disabled
                  variant="outlined"
                  value={selectedQuestion?.text}
                  sx={{
                    borderRadius: "50px",
                    height: "40px",
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px",
                      height: "40px",
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 2 }}>
                <Select
                  displayEmpty
                  value={selectedOperator}
                  onChange={(event) => {
                    handleOperatorChange(event);
                    if (event.target.value !== "CONTAINS_ANY") {
                      setAdditionalConditions([]);
                    }
                  }}
                  IconComponent={ExpandMore}
                  sx={{
                    borderRadius: "50px",
                    height: "40px",
                    width: "30%",
                  }}
                >
                  <MenuItem value="EQUALS">Is (Exact Match)</MenuItem>
                  <MenuItem value="CONTAINS_ANY">Contains any</MenuItem>
                  <MenuItem value="CONTAINS_ALL">Contains all</MenuItem>
                </Select>

                <Select
                  multiple={
                    selectedOperator === "CONTAINS_ANY" ||
                    selectedOperator === "CONTAINS_ALL"
                  }
                  displayEmpty
                  value={selectedValues.map((val) => val.value)}
                  onChange={handleValueChange}
                  IconComponent={ExpandMore}
                  disabled={!selectedOperator}
                  sx={{
                    borderRadius: "50px",
                    height: "40px",
                    flex: 1,
                  }}
                  renderValue={(selected) =>
                    Array.isArray(selected) &&
                    selected.length > 0 &&
                    selectedQuestion
                      ? selected.join(", ")
                      : "Select options"
                  }
                >
                  {selectedQuestion?.choices?.map((option) => (
                    <MenuItem
                      key={option._id}
                      value={option.value}
                      onClick={(e) => {
                        if (
                          selectedOperator === "CONTAINS_ANY" ||
                          selectedOperator === "CONTAINS_ALL"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {selectedOperator === "CONTAINS_ANY" ||
                      selectedOperator === "CONTAINS_ALL" ? (
                        <Checkbox
                          checked={selectedValues.some(
                            (val) => val.value === option.value
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newValue = selectedValues.some(
                              (val) => val.value === option.value
                            )
                              ? selectedValues.filter(
                                  (val) => val.value !== option.value
                                )
                              : [
                                  ...selectedValues,
                                  { _id: option._id, value: option.value },
                                ];
                            handleValueChange({
                              target: { value: newValue.map((v) => v.value) },
                            });
                          }}
                        />
                      ) : null}
                      <span>{option.value}</span>
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Additional Conditions Section */}
              {selectedOperator === "CONTAINS_ANY" && (
                <>
                  {additionalConditions.map((condition, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 2,
                        mb: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        AND
                      </Typography>
                      <Select
                        displayEmpty
                        value={condition.operator}
                        onChange={(event) =>
                          handleConditionOperatorChange(idx, event.target.value)
                        }
                        IconComponent={ExpandMore}
                        sx={{
                          borderRadius: "50px",
                          height: "40px",
                          width: "30%",
                        }}
                      >
                        <MenuItem value="EQUALS">Is (Exact Match)</MenuItem>
                        <MenuItem value="CONTAINS_ANY">Contains any</MenuItem>
                        <MenuItem value="CONTAINS_ALL">Contains all</MenuItem>
                      </Select>

                      <Select
                        multiple={
                          condition.operator === "CONTAINS_ANY" ||
                          condition.operator === "CONTAINS_ALL"
                        }
                        displayEmpty
                        value={condition.values?.map((val) => val?.value) || []}
                        onChange={(event) =>
                          handleConditionValueChange(idx, event.target.value)
                        }
                        IconComponent={ExpandMore}
                        sx={{
                          borderRadius: "50px",
                          height: "40px",
                          flex: 1,
                        }}
                        renderValue={(selected) =>
                          Array.isArray(selected) && selected.length > 0
                            ? selected.join(", ")
                            : "Select options"
                        }
                      >
                        {selectedQuestion?.choices?.map((option) => (
                          <MenuItem key={option._id} value={option.value}>
                            {(condition.operator === "CONTAINS_ANY" ||
                              condition.operator === "CONTAINS_ALL") && (
                              <Checkbox
                                checked={
                                  condition.values?.some(
                                    (val) => val?.value === option.value
                                  ) || false
                                }
                                onChange={(e) => {
                                  e.stopPropagation();
                                  const newValue = condition.values?.some(
                                    (val) => val?.value === option.value
                                  )
                                    ? condition.values.filter(
                                        (val) => val?.value !== option.value
                                      )
                                    : [
                                        ...(condition.values || []),
                                        {
                                          _id: option._id,
                                          value: option.value,
                                        },
                                      ];
                                  handleConditionValueChange(
                                    idx,
                                    newValue.map((v) => v?.value || "")
                                  );
                                }}
                              />
                            )}
                            <span>{option.value}</span>
                          </MenuItem>
                        ))}
                      </Select>
                      <IconButton
                        onClick={() => handleRemoveCondition(idx)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={handleAddCondition}
                    startIcon={<Add />}
                    sx={{
                      mt: 1,
                      borderRadius: "50px",
                      height: "35px",
                      textTransform: "none",
                    }}
                  >
                    Add Condition
                  </Button>
                </>
              )}

              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">Then Go To</Typography>
                <Select
                  displayEmpty
                  value={selectedNextQuestion || ""}
                  onChange={handleNextQuestionChange}
                  IconComponent={ExpandMore}
                  sx={{ borderRadius: "50px", height: "40px", flex: 1 }}
                >
                  {questionList.map((question) => (
                    <MenuItem key={question._id} value={question._id}>
                      {question.text}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <PrimaryButton
                children={
                  editingRuleIndex !== null ? "Update Rule" : "Add Rule"
                }
                className={styles.SaveRulebtn}
                onClick={handleSaveRule}
              />
            </AccordionDetails>
          </Accordion>

          {rulesForFormBranching.map((rule, index) => (
            <Accordion key={index} sx={{ m: 2, borderRadius: "20px" }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h4">Rule {index + 1}</Typography>
                <Box sx={{ marginLeft: "auto", display: "flex", gap: 1 }}>
                  <IconButton
                    onClick={() => handleEditRule(index)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => removeRule(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h3">If</Typography>
                  <TextField
                    disabled
                    variant="outlined"
                    value={selectedQuestion?.text}
                    sx={{
                      borderRadius: "50px",
                      height: "40px",
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "50px",
                        height: "40px",
                      },
                    }}
                  />
                </Box>
                <Box>
                  {rule.conditions.map((condition, conditionIndex) => (
                    <Box key={conditionIndex}>
                      <Box sx={{ display: "flex", gap: 2, mt: 3, mb: 2 }}>
                        <Select
                          displayEmpty
                          value={
                            editingRuleIndex === index
                              ? selectedOperator
                              : condition.operator
                          }
                          onChange={(event) => {
                            handleOperatorChange(event);
                            if (event.target.value !== "CONTAINS_ANY") {
                              setAdditionalConditions([]); // Clear additional conditions if not CONTAINS_ANY
                            }
                          }}
                          disabled={editingRuleIndex !== index}
                          IconComponent={ExpandMore}
                          sx={{
                            borderRadius: "50px",
                            height: "40px",
                            width: "30%",
                          }}
                        >
                          <MenuItem value="EQUALS">Is (Exact Match)</MenuItem>
                          <MenuItem value="CONTAINS_ANY">Contains any</MenuItem>
                          <MenuItem value="CONTAINS_ALL">Contains all</MenuItem>
                        </Select>

                        <Select
                          multiple={
                            editingRuleIndex === index
                              ? selectedOperator === "CONTAINS_ANY" ||
                                selectedOperator === "CONTAINS_ALL"
                              : condition.operator === "CONTAINS_ANY" ||
                                condition.operator === "CONTAINS_ALL"
                          }
                          displayEmpty
                          value={
                            editingRuleIndex === index
                              ? selectedValues.map((val) => val.value)
                              : Array.isArray(condition.value)
                              ? condition.value.map((v) =>
                                  typeof v === "string"
                                    ? v
                                    : (v as { value: string }).value
                                )
                              : [condition.value]
                          }
                          onChange={handleValueChange}
                          disabled={editingRuleIndex !== index}
                          IconComponent={ExpandMore}
                          sx={{
                            borderRadius: "50px",
                            height: "40px",
                            flex: 1,
                          }}
                          renderValue={(selected) =>
                            Array.isArray(selected) && selected.length > 0
                              ? selected.join(", ")
                              : "Select options"
                          }
                        >
                          {selectedQuestion?.choices?.map((option) => (
                            <MenuItem
                              key={option._id}
                              value={option.value}
                              onClick={(e) => {
                                if (
                                  selectedOperator === "CONTAINS_ANY" ||
                                  selectedOperator === "CONTAINS_ALL"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              {(selectedOperator === "CONTAINS_ANY" ||
                                selectedOperator === "CONTAINS_ALL") &&
                              editingRuleIndex === index ? (
                                <Checkbox
                                  checked={selectedValues.some(
                                    (val) => val.value === option.value
                                  )}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newValue = selectedValues.some(
                                      (val) => val.value === option.value
                                    )
                                      ? selectedValues.filter(
                                          (val) => val.value !== option.value
                                        )
                                      : [
                                          ...selectedValues,
                                          {
                                            _id: option._id,
                                            value: option.value,
                                          },
                                        ];
                                    handleValueChange({
                                      target: {
                                        value: newValue.map((v) => v.value),
                                      },
                                    });
                                  }}
                                />
                              ) : null}
                              <span>{option.value}</span>
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>

                      {/* Additional Conditions Section for Existing Rules */}
                      {editingRuleIndex === index &&
                        selectedOperator === "CONTAINS_ANY" && (
                          <>
                            {additionalConditions.map((cond, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  mt: 2,
                                  mb: 2,
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                  AND
                                </Typography>
                                <Select
                                  displayEmpty
                                  value={cond.operator}
                                  onChange={(event) =>
                                    handleConditionOperatorChange(
                                      idx,
                                      event.target.value
                                    )
                                  }
                                  IconComponent={ExpandMore}
                                  sx={{
                                    borderRadius: "50px",
                                    height: "40px",
                                    width: "30%",
                                  }}
                                >
                                  <MenuItem value="EQUALS">
                                    Is (Exact Match)
                                  </MenuItem>
                                  <MenuItem value="CONTAINS_ANY">
                                    Contains any
                                  </MenuItem>
                                  <MenuItem value="CONTAINS_ALL">
                                    Contains all
                                  </MenuItem>
                                </Select>

                                <Select
                                  multiple={
                                    cond.operator === "CONTAINS_ANY" ||
                                    cond.operator === "CONTAINS_ALL"
                                  }
                                  displayEmpty
                                  value={
                                    cond.values?.map((val) => val?.value) || []
                                  }
                                  onChange={(event) =>
                                    handleConditionValueChange(
                                      idx,
                                      event.target.value
                                    )
                                  }
                                  IconComponent={ExpandMore}
                                  sx={{
                                    borderRadius: "50px",
                                    height: "40px",
                                    flex: 1,
                                  }}
                                  renderValue={(selected) =>
                                    Array.isArray(selected) &&
                                    selected.length > 0
                                      ? selected.join(", ")
                                      : "Select options"
                                  }
                                >
                                  {selectedQuestion?.choices?.map((option) => (
                                    <MenuItem
                                      key={option._id}
                                      value={option.value}
                                    >
                                      {(cond.operator === "CONTAINS_ANY" ||
                                        cond.operator === "CONTAINS_ALL") && (
                                        <Checkbox
                                          checked={
                                            cond.values?.some(
                                              (val) =>
                                                val?.value === option.value
                                            ) || false
                                          }
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            const newValue = cond.values?.some(
                                              (val) =>
                                                val?.value === option.value
                                            )
                                              ? cond.values.filter(
                                                  (val) =>
                                                    val?.value !== option.value
                                                )
                                              : [
                                                  ...(cond.values || []),
                                                  {
                                                    _id: option._id,
                                                    value: option.value,
                                                  },
                                                ];
                                            handleConditionValueChange(
                                              idx,
                                              newValue.map(
                                                (v) => v?.value || ""
                                              )
                                            );
                                          }}
                                        />
                                      )}
                                      <span>{option.value}</span>
                                    </MenuItem>
                                  ))}
                                </Select>
                                <IconButton
                                  onClick={() => handleRemoveCondition(idx)}
                                  color="error"
                                  size="small"
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            ))}
                            <Button
                              variant="outlined"
                              onClick={handleAddCondition}
                              startIcon={<Add />}
                              sx={{
                                mt: 1,
                                borderRadius: "50px",
                                height: "35px",
                                textTransform: "none",
                              }}
                            >
                              Add Condition
                            </Button>
                          </>
                        )}
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body1">Then Go To</Typography>
                  <Select
                    displayEmpty
                    value={
                      editingRuleIndex === index
                        ? selectedNextQuestion
                        : rule.next
                    }
                    onChange={handleNextQuestionChange}
                    disabled={editingRuleIndex !== index}
                    IconComponent={ExpandMore}
                    sx={{ borderRadius: "50px", height: "40px", flex: 1 }}
                  >
                    {questionList.map((question) => (
                      <MenuItem key={question._id} value={question._id}>
                        {question.text}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                {editingRuleIndex === index && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setEditingRuleIndex(null)}
                      sx={{
                        borderRadius: "50px",
                        height: "35px",
                        transform: "translate(0px, 12px)",
                      }}
                    >
                      Cancel
                    </Button>
                    <PrimaryButton
                      children="Update Rule"
                      className={styles.SaveRulebtn}
                      onClick={handleSaveRule}
                    />
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">Other cases</Typography>
              <Select
                onChange={(event) => handleAlwaysGoToChange(event)}
                displayEmpty
                IconComponent={ExpandMore}
                sx={{ borderRadius: "50px", height: "40px", flex: 1 }}
                value={selectedQuestion?.alwaysGoTo || ""}
              >
                {questionList.map((question) => (
                  <MenuItem key={question._id} value={question._id}>
                    {question.text}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <PrimaryButton
                children="Publish"
                className={styles.rulePublishbtn}
                onClick={handlePublishAndClose}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
};

export default BranchingSection;
