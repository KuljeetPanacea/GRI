// import { useSelector } from "react-redux";
// import { RootState } from "../../../../redux/store";
// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";

// const useQstnPreview = () => {
//     const questionList = useSelector(
//         (state: RootState) => state.qstnrQuestion.questions
//       );
//       const qstnrId = useSelector(
//         (state: RootState) => state.qstnr.qstnr?.questionnaireId
//       );
// const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentQuestion, setCurrentQuestion] = useState(questionList[0]);
//   const [selectedValue, setSelectedValue] = useState("");
//   const [selectedValues, setSelectedValues] = useState<string[]>([]);
//   const [textValue, setTextValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Reset form state when current question changes
//   useEffect(() => {
//     setSelectedValue("");
//     setSelectedValues([]);
//     setTextValue("");
//   }, [currentQuestion]);

//   const handleSingleChoiceChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setSelectedValue(event.target.value);
//   };

//   const handleMultipleChoiceChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = event.target.value;
//     setSelectedValues((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//       setCurrentQuestion(questionList[currentIndex - 1]);
//     }
//   };

//   const findNextQuestion = useCallback((nextQuestionId: string | null) => {
//     if (!nextQuestionId) return null;
    
//     // First try to find by ID
//     const  nextQuestion = questionList.find(q => q._id === nextQuestionId);
//     if (nextQuestion) return nextQuestion;

//     // If not found, try to find the next question in sequence
//     const currentIndex = questionList.findIndex(q => q._id === currentQuestion._id);
//     if (currentIndex < questionList.length - 1) {
//       return questionList[currentIndex + 1];
//     }

//     return null;
//   }, [questionList, currentQuestion]);

//   const updateToNextQuestion = useCallback((nextQuestion: any) => {
//     if (!nextQuestion) return;

//     const newIndex = questionList.findIndex(q => q._id === nextQuestion._id);
//     if (newIndex !== -1) {
//       setCurrentQuestion(nextQuestion);
//       setCurrentIndex(newIndex);
//     }
//   }, [questionList]);

//   const handleNext = async () => {
//     if (!currentQuestion || isLoading) return;

//     setIsLoading(true);
//     try {
//       let selectedResponse: any = {};

//       if (currentQuestion.type === "single_choice") {
//         selectedResponse = selectedValue;
//       } else if (currentQuestion.type === "multiple_choice") {
//         selectedResponse = selectedValues;
//       } else if (
//         currentQuestion.type === "short_text" ||
//         currentQuestion.type === "long_text"
//       ) {
//         selectedResponse = textValue;
//       }

//       // First evaluate branching logic locally
//       let nextQuestionId = currentQuestion.alwaysGoTo;

//       if (
//         currentQuestion.branchingLogic &&
//         currentQuestion.branchingLogic.length > 0
//       ) {
//         for (const rule of currentQuestion.branchingLogic) {
//           let allConditionsMet = true;

//           for (const condition of rule.conditions) {
//             if (condition.questionId !== currentQuestion._id) {
//               continue;
//             }

//             const response =
//               currentQuestion.type === "single_choice"
//                 ? selectedValue
//                 : currentQuestion.type === "multiple_choice"
//                 ? selectedValues
//                 : textValue;

//             const conditionValues = condition.value.map(v => typeof v === 'string' ? v : v.value);

//             let conditionMet = false;
//             switch (condition.operator) {
//               case "EQUALS":
//                 if (currentQuestion.type === "single_choice" || 
//                     currentQuestion.type === "short_text" || 
//                     currentQuestion.type === "long_text") {
//                   conditionMet = response === conditionValues[0];
//                 } else {
//                   conditionMet =
//                     Array.isArray(response) &&
//                     response.length === conditionValues.length &&
//                     conditionValues.every((val) => response.includes(val)) &&
//                     response.every((val) => conditionValues.includes(val));
//                 }
//                 break;
//               case "CONTAINS_ANY":
//                 if (currentQuestion.type === "short_text" || currentQuestion.type === "long_text") {
//                   conditionMet = conditionValues.some(val => 
//                     (response as string).toLowerCase().includes(val.toLowerCase())
//                   );
//                 } else if (currentQuestion.type === "single_choice") {
//                   conditionMet = conditionValues.includes(response as string);
//                 } else {
//                   conditionMet =
//                     Array.isArray(response) &&
//                     response.some((r) => conditionValues.includes(r));
//                 }
//                 break;
//               case "CONTAINS_ALL":
//                 if (currentQuestion.type === "short_text" || currentQuestion.type === "long_text") {
//                   conditionMet = conditionValues.every(val => 
//                     (response as string).toLowerCase().includes(val.toLowerCase())
//                   );
//                 } else {
//                   conditionMet =
//                     Array.isArray(response) &&
//                     response.includes(conditionValues[0]);
//                 }
//                 break;
//               case "CONTAINS":
//                 conditionMet =
//                   typeof response === "string" &&
//                   conditionValues.some((val) => (response as string).toLowerCase().includes(val.toLowerCase()));
//                 break;
//               case "NOT_EQUALS":
//                 conditionMet = !conditionValues.some((val) => response === val);
//                 break;
//               default:
//                 conditionMet = false;
//             }

//             if (!conditionMet) {
//               allConditionsMet = false;
//               break;
//             }
//           }

//           if (allConditionsMet) {
//             nextQuestionId = rule.next;
//             break;
//           }
//         }
//       }

//       const payload = {
//         responses: { [currentQuestion._id as string]: selectedResponse },
//         nextQuestionId,
//       };

//       // Send response to backend
//       const response = await axios.post(
//         `http://localhost:4000/questions/${currentQuestion._id}/evaluate/${qstnrId}`,
//         payload
//       );

//       // Try to find the next question
//       let nextQuestion = null;

//       // First try to find by nextQuestionId if it exists
//       if (nextQuestionId) {
//         nextQuestion = findNextQuestion(nextQuestionId);
//       }

//       // If no next question found by ID and we have response data, use that
//       if (!nextQuestion && response.data && response.data.data) {
//         nextQuestion = findNextQuestion(response.data.data._id);
//       }

//       // If we found a next question, update the state
//       if (nextQuestion) {
//         updateToNextQuestion(nextQuestion);
//       } else {
//         // If no next question is found, try to find the next question in sequence
//         const currentIndex = questionList.findIndex(q => q._id === currentQuestion._id);
//         if (currentIndex < questionList.length - 1) {
//           nextQuestion = questionList[currentIndex + 1];
//           updateToNextQuestion(nextQuestion);
//         }
//       }
//     } catch (error: any) {
//       console.error("Error submitting response:", error);
//       if (error.response) {
//         console.error("Error response data:", error.response.data);
//         console.error("Error response status:", error.response.status);
//         console.error("Error response headers:", error.response.headers);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return  {
//     questionList,
//     qstnrId,
//     currentIndex,
//     setCurrentIndex,
//     currentQuestion,
//     setCurrentQuestion,
//     selectedValue,
//     setSelectedValue,
//     selectedValues,
//     setSelectedValues,
//     textValue,
//     setTextValue,
//     handleSingleChoiceChange,
//     handleMultipleChoiceChange,
//     handlePrevious,
//     handleNext,
//     isLoading
//   }
// }

// export default useQstnPreview