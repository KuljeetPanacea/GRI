import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestion,
  setSelectedValues,
  updateQuestion,
  clearQuestions,
  selectQuestion,
  resetQuestionTypeValue,
  fetchQstnrQuestionsThunk,
  publishQstnrThunk,
  createQuestionThunk,
  Choice,
  setErrorMessage,
  setNewQuestion,
  setDisableReq,
  clearSelectedQuestion,
  questionTypeValue,
  setSelectedNextQuestion,
  setSelectedOperation,
  setSelectedOperator,
  setSelectedValueAndIdOfOption,
  deleteQstnThunk,
  duplicateQstnThunk,
  AdditionalCondition,
  BranchingCondition,
  BranchingLogic,
  FormBranchingLogic,
  Question,
} from "../../../redux/qstnrQuestion";
import store, { AppDispatch, RootState } from "../../../redux/store";
import useAxios from "../../../api/useAxios";

const useBuildQstnr = () => {
  const axiosInstance = useAxios();
  const dispatch = useDispatch<AppDispatch>();

  const selectedQuestion = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedQuestion
  ) as Question | null;
  const qstnrId = useSelector(
    (state: RootState) => state.defineQstnr.qstnr?.questionnaireId
  );
  const questionList = useSelector(
    (state: RootState) => state.qstnrQuestion.questions
  );
  const questionType = useSelector(
    (state: RootState) => state.qstnrQuestion.type
  );
  const selectedOperator = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedOperator
  );
  const selectedNextQuestion = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedNextQuestion
  );
  const selectedOperation = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedOperation
  );
  const selectedValue = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedValue
  );
  const selectedValueId = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedValueId
  );
  const selectedValues = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedValues
  );

  const [additionalConditions, setAdditionalConditions] = useState<
    AdditionalCondition[]
  >([]);
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([""]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rules, setRules] = useState<BranchingLogic[]>([]);
  const [rulesForFormBranching, setForFormBranching] = useState<
    FormBranchingLogic[]
  >([]);
  const [multipleSelection, setMultipleSelection] = useState(false);
  const [isLogicOpen, setIsLogicOpen] = useState(false);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const selectQstn = (_id: string) => {
    dispatch(selectQuestion(_id));
    dispatch(resetQuestionTypeValue());
  };
  const handleMultipleSelectionChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setMultipleSelection(event.target.checked);
  };
  const phase = useSelector((state: RootState) => state.defineQstnr.phase);

  const getQuestions = useCallback(async () => {
    try {
      if (!qstnrId) return;
      // dispatch(clearQuestions());
      dispatch(fetchQstnrQuestionsThunk({ qstnrId, axiosInstance }));
      const updatedArray = questionList
        .filter((obj: Question) => obj.isDeleted === false)
        .map((obj: Question, index: number) => ({
          ...obj,
          isSaved: true,
          id: index,
        }));
      const uniqueQuestions = new Map();
      updatedArray.forEach((obj: Question) => {
        if (obj._id && !uniqueQuestions.has(obj._id)) {
          uniqueQuestions.set(obj._id, obj);
        }
      });
      const uniqueQuestionsArray = Array.from(uniqueQuestions.values());
      uniqueQuestionsArray.forEach((question) => {
        dispatch(addQuestion(question));
      });
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
    }
  }, [qstnrId, dispatch]);
  useEffect(() => {
    if (qstnrId) {
      getQuestions();
    }
    return () => {
      dispatch(clearQuestions());
    };
  }, [qstnrId, dispatch, getQuestions]);

  useEffect(() => {
    if (selectedQuestion) {
      setRules([]);
      setForFormBranching([]);

      if (selectedQuestion.branchingLogic?.length) {
        setRules(selectedQuestion.branchingLogic);

        const formRules = selectedQuestion.branchingLogic.map((rule) => ({
          operation: rule.operation,
          conditions: rule.conditions.map((condition) => ({
            ChoiceId:
              selectedQuestion.choices?.find((c) =>
                Array.isArray(condition.value)
                  ? condition.value.some((v) => {
                      if (typeof v === "string") return v === c.value;
                      return (v as { value: string }).value === c.value;
                    })
                  : false
              )?._id || "",
            operator: condition.operator,
            value: condition.value,
            logic: rule.operation,
          })),
          next: rule.next,
        }));
        setForFormBranching(formRules);
      }

      // Only set form values if we're editing a rule
      if (editingRuleIndex !== null) {
        const rule = selectedQuestion.branchingLogic?.[editingRuleIndex];
        if (rule?.conditions?.[0]) {
          const condition = rule.conditions[0];
          dispatch(setSelectedOperator(condition.operator));
          dispatch(setSelectedOperation(rule.operation));
          dispatch(setSelectedNextQuestion(rule.next));

          if (Array.isArray(condition.value)) {
            const converted: Choice[] = condition.value.map((v) =>
              typeof v === "string" ? { value: v } : v
            );

            dispatch(setSelectedValues(converted));
          }
        }
      } else {
        // Reset form state when not editing
        dispatch(setSelectedValues([]));
        dispatch(setSelectedOperator(""));
        dispatch(setSelectedOperation(""));
        dispatch(setSelectedNextQuestion(""));
      }
    }
  }, [selectedQuestion, dispatch, editingRuleIndex]);

  const handleValueChange = (event: {
    target: { value: string | string[] };
  }) => {
    const value = event.target.value;
    if (!selectedQuestion?.choices) {
      dispatch(setSelectedValues([{ value: value as string }]));
      return;
    }

    // For CONTAINS_ANY or CONTAINS_ALL, always handle as multiple selection
    if (
      selectedOperator === "CONTAINS_ANY" ||
      selectedOperator === "CONTAINS_ALL"
    ) {
      const values = Array.isArray(value) ? value : [value];
      console.log("Handling multiple selection:", values);
      const selectedOptions = (selectedQuestion.choices || [])
        .filter((choice) => values.includes(choice.value))
        .map((choice) => ({ value: choice.value }));
      console.log("Selected options:", selectedOptions);
      dispatch(setSelectedValues(selectedOptions));
      return;
    }

    // For EQUALS or single choice without CONTAINS operators
    const selectedOption = selectedQuestion.choices.find(
      (choice) => choice.value === value
    );
    if (selectedOption) {
      console.log("Single selection:", selectedOption);
      dispatch(setSelectedValues([{ value: selectedOption.value }]));
    }
  };

  const handleOperatorChange = (event: { target: { value: string } }) => {
    dispatch(setSelectedOperator(event.target.value));
  };

  const handleNextQuestionChange = (event: { target: { value: string } }) => {
    console.log("Handling next question change:", event.target.value);
    dispatch(setSelectedNextQuestion(event.target.value));
  };

  const handleOperationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setSelectedOperation(event.target.value));
  };
  const handleValueChangeSlice = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as string;
    dispatch(
      setSelectedValueAndIdOfOption({ value, _id: Date.now().toString() })
    );
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAlwaysGoToChange = (event: { target: { value: string } }) => {
    const selectedQuestionId = event.target.value;
    if (selectedQuestion && selectedQuestion._id) {
      console.log(
        "Setting alwaysGoTo for question:",
        selectedQuestion._id,
        "to:",
        selectedQuestionId
      );
      dispatch(
        updateQuestion({
          _id: selectedQuestion._id,
          alwaysGoTo: selectedQuestionId,
        })
      );
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const addMenuValue =(questionType: string) => {
    dispatch(clearSelectedQuestion());
    console.log("This is the question",selectedQuestion)
    dispatch(questionTypeValue(questionType));
    dispatch(setNewQuestion(true));
    dispatch(setDisableReq(true));
    setAnchorEl(null);
  };

// Function to validate requirements
const validatePCIDSSMapping = () => {
  const requirement = store.getState().qstnrQuestion.selectedReq;
  const subRequirement = store.getState().qstnrQuestion.selectedSubReq;
  const subControl = store.getState().qstnrQuestion.selectedSubControl;
  const evidenceReference = store.getState().qstnrQuestion.selectedEvidenceReference;
  const testingProcedure = store.getState().qstnrQuestion.selectedTestingProcedure;
  const questionType = store.getState().qstnrQuestion.type;
  
  console.log("These are the values", requirement, subRequirement, subControl, evidenceReference, testingProcedure, questionType);
  
  // Be more specific about what's missing
  if (!requirement) {
    dispatch(setErrorMessage("Please select a requirement"));
    return false;
  }
  
  if (!subRequirement) {
    dispatch(setErrorMessage("Please select a sub-requirement"));
    return false;
  }
  
  if (!subControl) {
    dispatch(setErrorMessage("Please select a sub-control"));
    return false;
  }

  // For file upload questions, testing procedure and evidence reference are mandatory
  if (questionType === "file_type") {
    if (!testingProcedure) {
      dispatch(setErrorMessage("Please select a testing procedure for file upload questions"));
      return false;
    }
    if (!evidenceReference) {
      dispatch(setErrorMessage("Please select an evidence reference for file upload questions"));
      return false;
    }
  }
  
  return true;
};

const validateAndAddQuestion = async () => {
  if (question && qstnrId && questionType) {
    const newQuestion = {
      questionnaireId: qstnrId,
      type: questionType,
      text: question,
      choices:
        questionType === "multiple_choice" || questionType === "single_choice"
          ? options.map((option) => ({ value: option }))
          : [],
      requirements:null,
      subRequirements: null,
      subControl: null,
      isEditing: false,
      isDeleted: false,
      alwaysGoTo: null,
      setting: {},
      ...(questionType === "file_type" && { 
        evidenceReference: store.getState().qstnrQuestion.selectedEvidenceReference,
        testingProcedure: store.getState().qstnrQuestion.selectedTestingProcedure 
      }),
    };
    
    dispatch(addQuestion(newQuestion));
    await dispatch(
      createQuestionThunk({
        qstnrId,
        data: newQuestion,
        axiosInstance,
      })
    );
    await dispatch(
      fetchQstnrQuestionsThunk({ qstnrId: qstnrId as string, axiosInstance })
    );
    return true;
  }
  return false;
};

// Main function to add question in list
const addQuestionInList = async () => {
  if (phase === "Assessment") {
    const isRequirementsValid = validatePCIDSSMapping();
    if (!isRequirementsValid) return;
  }
  const isAdded = await validateAndAddQuestion();
  if (isAdded) {
    const newQuestion = store.getState().qstnrQuestion.questions.slice(-1)[0];
    console.log("New question added:", newQuestion);
    
    // Preserve the evidence reference and testing procedure when selecting the new question
    const currentEvidenceReference = store.getState().qstnrQuestion.selectedEvidenceReference;
    const currentTestingProcedure = store.getState().qstnrQuestion.selectedTestingProcedure;
    
    dispatch(selectQuestion(newQuestion._id ?? null));
    
    // If this was a file upload question and we have evidence reference and testing procedure, update the question
    if (questionType === "file_type" && currentEvidenceReference && currentTestingProcedure) {
      dispatch(updateQuestion({
        _id: newQuestion._id,
        evidenceReference: currentEvidenceReference,
        testingProcedure: currentTestingProcedure,
      }));
    }
    
    console.log("Selected question at the moment", store.getState().qstnrQuestion.selectedQuestion);
  }
  dispatch(setNewQuestion(false));
};

  const handlePublish = async () => {
    // Get the current state from Redux store and strip _id from choices
    const currentQuestionList = questionList.map((q) => {
      // Create a copy of the question without modifying the original
      const questionCopy = { ...q };
      // If this is the selected question, use its current state from Redux
      if (selectedQuestion && q._id === selectedQuestion._id) {
        questionCopy.branchingLogic = selectedQuestion.branchingLogic || [];
        // questionCopy.formBranchingLogic = selectedQuestion.formBranchingLogic || [];
      }
      // Strip _id from choices if they exist
      if (questionCopy.choices) {
        questionCopy.choices = questionCopy.choices.map((choice) => ({
          value: choice.value,
        }));
      }
      // Strip _id from branching logic values if they exist
      if (questionCopy.branchingLogic) {
        questionCopy.branchingLogic = questionCopy.branchingLogic.map(
          (logic) => ({
            ...logic,
            conditions: logic.conditions.map((condition) => ({
              ...condition,
              value: condition.value,
            })),
          })
        );
      }
      delete questionCopy.formBranchingLogic;
      return questionCopy;
    });
    // Send the updated question list to the backend
    console.log(
      "Publishing questionnaire with current state:",
      currentQuestionList
    );
    try {
      await dispatch(
        publishQstnrThunk({
          qstnrId,
          data: currentQuestionList,
          axiosInstance,
        })
      );
      dispatch(
        fetchQstnrQuestionsThunk({ qstnrId: qstnrId as string, axiosInstance })
      );
    } catch (error) {
      console.error("Failed to publish question:", error);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const addRule = (event?: {
    target: {
      value: {
        conditions: BranchingCondition[];
        next: string;
        operation: string;
        alwaysGoto: string | null;
      };
    };
  }) => {
    if (
      !selectedQuestion ||
      !selectedOperator ||
      !selectedNextQuestion ||
      !selectedValues.length
    ) {
      console.log("Missing required fields for rule creation");
      return;
    }

    // Get conditions from event or create a single condition
    const conditions = event?.target.value.conditions || [
      {
        questionId: selectedQuestion._id as string,
        operator: selectedOperator,
        value: selectedValues.map((v) => ({
          _id: Date.now().toString(),
          value: v.value,
        })),
      },
    ];

    // Create new rule with all conditions
    const newRule: BranchingLogic = {
      operation: conditions.length > 1 ? "AND" : "",
      conditions: conditions.map((condition) => ({
        questionId: condition.questionId || selectedQuestion._id as string,
        operator: condition.operator,
        value: Array.isArray(condition.value)
          ? condition.value.map((v) =>
              typeof v === "string" ? v : (v as { value: string }).value
            )
          : [
              typeof condition.value === "string"
                ? condition.value
                : (condition.value as { value: string }).value,
            ],
      })),
      next: event?.target.value.next || selectedNextQuestion,
      alwaysGoto: null,
    };

    // Create form version of the rule with all conditions
    // const newFormRule: FormBranchingLogic = {
    //   operation: conditions.length > 1 ? "AND" : "",  // Use AND when there are multiple conditions
    //   conditions: conditions.map(condition => ({
    //     ChoiceId: selectedQuestion._id,
    //     operator: condition.operator,
    //     value: Array.isArray(condition.value)
    //       ? condition.value.map(v => ({ _id: Date.now().toString(), value: v.value }))
    //       : [{ _id: Date.now().toString(), value: condition.value }],
    //     logic: conditions.length > 1 ? "AND" : "",  // Use AND when there are multiple conditions
    //   })),
    //   next: event?.target.value.next || selectedNextQuestion,
    // };

    // Get existing rules or initialize empty arrays
    const existingBranchingLogic = selectedQuestion.branchingLogic || [];
    // const existingFormBranchingLogic = selectedQuestion.formBranchingLogic || [];

    // Create new arrays with the new rules
    const updatedRules = [...existingBranchingLogic, newRule];
    // const updatedFormRules = [...existingFormBranchingLogic, newFormRule];

    // Update in Redux store first
    dispatch(
      updateQuestion({
        _id: selectedQuestion._id,
        branchingLogic: updatedRules,
        // formBranchingLogic: updatedFormRules,
      })
    );

    // Then update local state to match Redux
    setRules(updatedRules);
    // setForFormBranching(updatedFormRules);

    // Reset form
    dispatch(setSelectedOperator(""));
    dispatch(setSelectedValues([]));
    dispatch(setSelectedNextQuestion(""));
    dispatch(setSelectedOperation(""));
  };

  const updateRule = (
    index: number,
    event?: {
      target: {
        value: {
          conditions: BranchingCondition[];
          next: string;
          operation: string;
          alwaysGoto: string | null;
        };
      };
    }
  ) => {
    if (
      !selectedQuestion ||
      !selectedOperator ||
      !selectedNextQuestion ||
      !selectedValues.length
    ) {
      console.log("Missing required fields for rule update");
      return;
    }

    // Get conditions from event or create a single condition
    const conditions = event?.target.value.conditions || [
      {
        questionId: selectedQuestion._id as string,
        operator: selectedOperator,
        value: selectedValues.map((v) => ({ value: v.value })),
      },
    ];

    // Create updated rule with all conditions
    const updatedRule: BranchingLogic = {
      operation: conditions.length > 1 ? "AND" : "", // Use AND when there are multiple conditions
      conditions: conditions.map((condition) => ({
        questionId: condition.questionId || selectedQuestion._id as string,
        operator: condition.operator,
        value: Array.isArray(condition.value)
          ? condition.value.map((v) =>
              typeof v === "string" ? v : (v as { value: string }).value
            )
          : [
              typeof condition.value === "string"
                ? condition.value
                : (condition.value as { value: string }).value,
            ],
      })),
      next: event?.target.value.next || selectedNextQuestion,
      alwaysGoto: event?.target.value.alwaysGoto || null,
    };

    // Create updated form version of the rule with all conditions
    const updatedFormRule: FormBranchingLogic = {
      operation: conditions.length > 1 ? "AND" : "", // Use AND when there are multiple conditions
      conditions: conditions.map((condition) => ({
        ChoiceId: condition.questionId || selectedQuestion._id as string,
        operator: condition.operator,
        value: Array.isArray(condition.value)
          ? condition.value.map((v) => (typeof v === "string" ? v : v.value))
          : [
              typeof condition.value === "string"
                ? condition.value
                : (condition.value as { value: string }).value,
            ],
        logic: conditions.length > 1 ? "AND" : "",
      })),
      next: event?.target.value.next || selectedNextQuestion,
    };

    // Get existing rules
    const existingBranchingLogic = [...(selectedQuestion.branchingLogic || [])];
    const existingFormBranchingLogic = [
      ...(selectedQuestion.formBranchingLogic || []),
    ];

    // Update the rule at the specified index
    existingBranchingLogic[index] = updatedRule;
    existingFormBranchingLogic[index] = updatedFormRule;

    // Update in Redux store first
    dispatch(
      updateQuestion({
        _id: selectedQuestion._id,
        branchingLogic: existingBranchingLogic,
        formBranchingLogic: existingFormBranchingLogic,
      })
    );

    // Then update local state to match Redux
    setRules(existingBranchingLogic);
    setForFormBranching(existingFormBranchingLogic);

    // Reset form
    dispatch(setSelectedOperator(""));
    dispatch(setSelectedValues([]));
    dispatch(setSelectedNextQuestion(""));
    dispatch(setSelectedOperation(""));
  };

  const removeRule = (index: number) => {
    if (!selectedQuestion) return;

    // Create copies of the current rules arrays
    const updatedRules = [...rules];
    const updatedFormRules = [...rulesForFormBranching];

    // Remove the rule at the specified index from both arrays
    updatedRules.splice(index, 1);
    updatedFormRules.splice(index, 1);

    // Update local state
    setRules(updatedRules);
    setForFormBranching(updatedFormRules);

    // Update Redux store with both arrays
    dispatch(
      updateQuestion({
        _id: selectedQuestion._id,
        branchingLogic: updatedRules,
        formBranchingLogic: updatedFormRules,
      })
    );
  };

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

  const handleConditionValueChange = (index: number, value: string) => {
    if (!selectedQuestion?.choices) return;

    const selectedChoice = selectedQuestion.choices.find(
      (choice) => choice.value === value
    );
    if (selectedChoice) {
      const newConditions = [...additionalConditions];
      newConditions[index] = {
        ...newConditions[index],
        values: [selectedChoice], // Store as array of Choice objects
      };
      setAdditionalConditions(newConditions);
    }
  };

  const handleQstnDelete = async () => {
    try {
      if (selectedQuestion && qstnrId) {
        const currentQuestionIndex = questionList.findIndex(
          (q) => q._id === selectedQuestion._id
        );

        // Delete the selected question
        await dispatch(
          deleteQstnThunk({
            id: selectedQuestion._id as string,
            qstnrId: qstnrId,
            axiosInstance: axiosInstance,
          })
        ).unwrap();
        console.log("Question deleted successfully");

        // Determine the previous question
        const previousQuestion =
          currentQuestionIndex > 0
            ? questionList[currentQuestionIndex - 1]
            : null;

        // Refresh questions
        await dispatch(
          fetchQstnrQuestionsThunk({
            qstnrId: qstnrId as string,
            axiosInstance,
          })
        );

        // Set the previous question as the selected question
        if (previousQuestion) {
          dispatch(selectQuestion(previousQuestion._id ?? ""));
        } else {
          // If no previous question exists, clear the selected question
          dispatch(selectQuestion(null));
        }
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };
  const handleQstnDuplicate = async () => {
    try {
      if (selectedQuestion && qstnrId) {
        await dispatch(
          duplicateQstnThunk({
            questionId: selectedQuestion._id as string,
            questionnaireId: qstnrId,
            axiosInstance,
          })
        );
        console.log("Question duplicated successfully");
        // dispatch(clearQuestions());
        dispatch(
          fetchQstnrQuestionsThunk({
            qstnrId: qstnrId as string, axiosInstance,
          })
        );
        console.log("This is the selected question", selectedQuestion);
      }
    } catch (error) {
      console.error("Error duplicating question:", error);
    }
  };

  const updateQuestionInList = async () => {
    if (!selectedQuestion) {
      console.error("No question selected for update.");
      return;
    }
    dispatch(setNewQuestion(false));

    const newQuestion: Question = {
      ...selectedQuestion,
      text: question,

      choices: options.map((option, index) => ({
        _id:
          selectedQuestion.choices?.[index]?._id ||
          Date.now().toString() + index,
        value: option,
      })),
    };

    dispatch(updateQuestion(newQuestion));

    try {
      await dispatch(
        createQuestionThunk({
          qstnrId,
          data: newQuestion,
          axiosInstance,
        })
      );

      dispatch(
        fetchQstnrQuestionsThunk({ qstnrId: qstnrId as string, axiosInstance })
      );
    } catch (error) {
      console.error("Error while updating question:", error);
    }
  };

  return {
    setRules,
    setForFormBranching,
    rules,
    addRule,
    updateRule,
    removeRule,
    rulesForFormBranching,
    anchorEl,
    setAnchorEl,
    question,
    options,
    setOptions,
    questionType,
    setQuestion,
    questionList,
    selectedQuestion,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    handlePublish,
    addQuestionInList,
    handleMenuOpen,
    handleMenuClose,
    addMenuValue,
    handleOperatorChange,
    handleNextQuestionChange,
    handleOperationChange,
    handleValueChange,
    selectedOperator,
    selectedNextQuestion,
    selectedOperation,
    selectedValue,
    selectedValueId,
    handleAlwaysGoToChange,
    handleValueChangeSlice,
    selectedValues,
    additionalConditions,
    handleAddCondition,
    handleRemoveCondition,
    handleConditionOperatorChange,
    handleConditionValueChange,
    setAdditionalConditions,
    getQuestions,
    multipleSelection,
    setMultipleSelection,
    isLogicOpen,
    setIsLogicOpen,
    handleMultipleSelectionChange,
    selectQstn,
    handleQstnDelete,
    handleQstnDuplicate,
    updateQuestionInList,
    editingRuleIndex,
    setEditingRuleIndex,
  };
};

export default useBuildQstnr;
