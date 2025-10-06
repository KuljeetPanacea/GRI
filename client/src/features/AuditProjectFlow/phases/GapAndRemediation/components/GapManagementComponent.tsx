import { FileText, X } from "lucide-react";
import GapsTabs from "./GapsTabs";
import styles from "./styles/GapManagementComponent.module.css";
import { AlertTriangle } from "lucide-react";
import { setIsGapRemediation } from "../../../../../redux/GapsRemediationSlice";
import { useGapAndRemediationView } from "../useGapAndRemediationView";
import { useState } from "react";
import { storeUserResponse, userResponseDto, storeGapComment } from "../../../../../api/project";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

interface Evidence {
  name: string;
  uploadedAt: string;
}

// Define the type for the flattened gap object
interface FlattenedGap {
  id: string;
  description: string;
  controlReference: string;
  AEInternalAssessor: string;
  Status: string;
  previousEvidence: Evidence[];
  previousDate: string;
  latestEvidence: Evidence[];
  latestDate: string;
  resolutionComment: string;
  resolutionDate: string;
  originalId: string;
  ReqNo: string;
  subReqNo: string;
  originalIndex?: number;
  isFirstInGroup?: boolean;
  rowSpan?: number;
  uploadedAt?: string;
}

// Define the type for questionnaire gaps
interface QuestionnaireGap {
  id: string;
  questionText: string;
  userResponse: string;
  gapComment: string;
  questionnaireTitle: string;
  questionnairePhase: string;
  questionId: string;
  status?: string;
  clientComment?: string;
  questionType?: string;
  choices?: Array<{ value: string }>;
}

const GapManagementComponent = () => {
  const {
    selectedRow,

    handleResolveClick,
    handleRowClick,
    handleEvidenceClick,
    dispatch,
    navigate,
    // New questionnaire-related state and functions
    setQuestionnaireGaps,
    isQuestionnaireView,
    isAEPocView,
    isAEPocUser,
    filteredQuestionnaireGaps,
    processedGaps,
    handleClientResponseChange,
    axiosInstance,
  } = useGapAndRemediationView();

  // Get user role from Redux store
  const userRole = useSelector((state: RootState) => state.login.user?.roles?.[0]);

  // State for popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGap, setSelectedGap] = useState<QuestionnaireGap | null>(null);
  const [popupResponse, setPopupResponse] = useState<string | string[]>("");

  // Handle row click based on user type
  const handleRowClickWithUserCheck = (index: number, gap: QuestionnaireGap) => {
    if (isAEPocUser) {
      // For AEPoc users, open popup with actual question
      setSelectedGap(gap);
      
      // Initialize response based on question type
      if (gap.questionType === 'multiple_choice') {
        // For multiple choice, convert comma-separated string to array
        const responseArray = gap.userResponse ? gap.userResponse.split(',').map(s => s.trim()) : [];
        setPopupResponse(responseArray);
      } else {
        // For single choice and text, use string directly
        setPopupResponse(gap.userResponse || "");
      }
      
      setIsPopupOpen(true);
    } else {
      // For other users, redirect to assessment phase with exact question
      handleRowClick(index);
      // Navigate to assessment phase with question data
      navigate('/landing/assessment', { 
        state: { 
          questionId: gap.questionId,
          questionnaireId: gap.questionnaireTitle,
          questionText: gap.questionText,
          currentResponse: gap.userResponse,
          questionType: gap.questionType,
          choices: gap.choices
        } 
      });
    }
  };

  // Handle popup response update
  const handlePopupResponseUpdate = async () => {
    if (selectedGap) {
      try {
        // Convert array to string for API call if needed
        const responseValue = Array.isArray(popupResponse) ? popupResponse.join(', ') : popupResponse;
        
        // Prepare the API payload
        const userResponseData: userResponseDto = {
          questionId: selectedGap.questionId,
          choiceValue: Array.isArray(popupResponse) ? popupResponse : [responseValue]
        };
        
        // Call the userResponse API
        await storeUserResponse(userRole || "AEPoc", axiosInstance, userResponseData);
        
        // Update the userResponse in local state
        setQuestionnaireGaps((prevGaps) =>
          prevGaps.map((g) =>
            g.id === selectedGap.id
              ? { ...g, userResponse: responseValue }
              : g
          )
        );
        
        console.log('User response updated successfully');
        
        setIsPopupOpen(false);
        setSelectedGap(null);
        setPopupResponse("");
      } catch (error) {
        console.error('Error updating user response:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  // Close popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedGap(null);
    setPopupResponse("");
  };

  // Render question input based on type
  const renderQuestionInput = (question: QuestionnaireGap) => {
    if (!question) return null;

    switch (question.questionType || 'short_text') {
      case 'short_text':
        return (
          <textarea
            className={styles.popupTextarea}
            value={popupResponse as string}
            onChange={(e) => setPopupResponse(e.target.value)}
            placeholder="Enter your response..."
            rows={4}
          />
        );
      
      case 'single_choice':
        return (
          <div className={styles.radioGroup}>
            {question.choices?.map((choice, index) => (
              <label key={index} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="questionResponse"
                  value={choice.value}
                  checked={popupResponse === choice.value}
                  onChange={(e) => setPopupResponse(e.target.value)}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>{choice.value}</span>
              </label>
            ))}
          </div>
        );
      
      case 'multiple_choice':
        return (
          <div className={styles.checkboxGroup}>
            {question.choices?.map((choice, index) => (
              <label key={index} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={choice.value}
                  checked={Array.isArray(popupResponse) && popupResponse.includes(choice.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(popupResponse) ? popupResponse : [];
                    if (e.target.checked) {
                      setPopupResponse([...currentValues, choice.value]);
                    } else {
                      setPopupResponse(currentValues.filter(v => v !== choice.value));
                    }
                  }}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxText}>{choice.value}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return (
          <textarea
            className={styles.popupTextarea}
            value={popupResponse as string}
            onChange={(e) => setPopupResponse(e.target.value)}
            placeholder="Enter your response..."
            rows={4}
          />
        );
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <span
          className={styles.crumb}
          onClick={() => navigate("/landing/ProjectView")}
        >
          Gap overview
        </span>
        <span className={styles.separator}>/</span>
        <span className={`${styles.crumb} ${styles.active}`}>
          Identified gaps
        </span>
      </nav>
      <div className={styles.cardHeading}>
        <div className={styles.iconBoxHeading}>
          <AlertTriangle size={20} />
        </div>
        <div className={styles.contentHeading}>
          <div className={styles.titleHeading}>Identified Gaps</div>
          <div className={styles.descriptionHeading}>
            Review and manage identified gaps for remediation tracking.
          </div>
        </div>
      </div>
      <GapsTabs />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.gapDetailsHeader}>Gap Details</th>
              {isQuestionnaireView && (
                <th className={styles.questionHeader}>Question</th>
              )}
              {!isQuestionnaireView && (
                <>
                  <th className={styles.evidenceHeader}>Evidence</th>
                  <th className={styles.assessorHeader}>
                    Internal
                    <br />
                    Assessor
                  </th>
                </>
              )}
              <th className={styles.commentHeader}>Resolution Comment</th>
              <th className={styles.actionHeader}>Status</th>
            </tr>
          </thead>
        </table>
        <div className={styles.scrollBody}>
          <table className={styles.table}>
            <tbody>
              {isQuestionnaireView
                ? filteredQuestionnaireGaps.map(
                    (gap: QuestionnaireGap, index: number) => (
                      <tr
                        key={gap.id}
                        className={`${styles.tableRow} ${
                          selectedRow === index ? styles.selectedRow : ""
                        }`}
                        onClick={() => handleRowClickWithUserCheck(index, gap)}
                      >
                        {/* Gap Details */}
                        <td
                          className={`${styles.tableCell} ${styles.gapDetailsCell}`}
                        >
                          <div className={styles.gapHeader}>
                            <div className={styles.gapId}>{gap.id}</div>
                          </div>

                          <div className={styles.resolutionText}>
                            {gap.gapComment}
                          </div>
                        </td>

                        {/* Question Name */}
                        <td
                          className={`${styles.tableCell} ${styles.questionCell}`}
                        >
                          <div className={styles.questionText}>
                            {gap.questionText}
                          </div>
                        </td>

                        {/* Client Response */}
                        <td
                          className={`${styles.tableCell} ${styles.commentCell}`}
                        >
                          {isAEPocView || isAEPocUser ? (
                            <textarea
                              value={gap.clientComment || ""}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleClientResponseChange(
                                  gap.questionId,
                                  e.target.value
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={styles.editableComment}
                              rows={3}
                              placeholder="Enter client response..."
                            />
                          ) : (
                            <div className={styles.resolutionContainer}>
                              <div className={styles.resolutionText}>
                                {gap.clientComment || "No gap comment"}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Action */}
                        <td
                          className={`${styles.tableCell} ${styles.actionCell}`}
                        >
                          <select
                            className={`${styles.statusSelect} ${styles.questionnaireStatusSelect} ${styles.statusSelectInline}`}
                            value={gap.status || "Finding Open"}
                            disabled={isAEPocUser}
                            onChange={async (e) => {
                              e.stopPropagation();
                              const newStatus = e.target.value;
                              console.log(
                                "Status changed for gap:",
                                gap.id,
                                "to:",
                                newStatus
                              );

                              // Update the status in the local state immediately
                              setQuestionnaireGaps((prevGaps) =>
                                prevGaps.map((g) =>
                                  g.id === gap.id
                                    ? { ...g, status: newStatus }
                                    : g
                                )
                              );

                              // Update status in backend
                              try {
                                const gapCommentData = {
                                  questionId: gap.questionId,
                                  gapComment: gap.gapComment || "",
                                  clientComment: gap.clientComment || "",
                                  status: newStatus,
                                  assessmentId: gap.questionId,
                                };

                                await storeGapComment(axiosInstance, gapCommentData);
                                console.log('Status updated successfully in database');
                              } catch (error) {
                                console.error('Error updating status in database:', error);
                                // Revert the local state change on error
                                setQuestionnaireGaps((prevGaps) =>
                                  prevGaps.map((g) =>
                                    g.id === gap.id
                                      ? { ...g, status: gap.status || "Finding Open" }
                                      : g
                                  )
                                );
                                // You might want to show an error message to the user here
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            data-status={gap.status || "Finding Open"}
                          >
                            <option
                              value="Finding Closed"
                              className={styles.optionFindingClosed}
                            >
                              ✓ Finding Closed
                            </option>
                            <option
                              value="Finding Open"
                              className={styles.optionFindingOpen}
                            >
                              ⚠ Finding Open
                            </option>
                            <option
                              value="Client input pending"
                              className={styles.optionClientInputPending}
                            >
                              ⏳ Client input pending
                            </option>
                            <option
                              value="Under Auditor Review"
                              className={styles.optionUnderAuditorReview}
                            >
                              🔍 Under Auditor Review
                            </option>
                          </select>
                        </td>
                      </tr>
                    )
                  )
                : processedGaps.map((gap: FlattenedGap, index: number) => (
                    <tr
                      key={gap.originalId || index}
                      className={`${styles.tableRow} ${
                        selectedRow === gap.originalIndex
                          ? styles.selectedRow
                          : ""
                      }`}
                      onClick={() => handleRowClick(gap.originalIndex || 0)}
                    >
                      {/* Gap Details - merged cell */}
                      {gap.isFirstInGroup && (
                        <td
                          className={`${styles.tableCell} ${styles.gapDetailsCell}`}
                          rowSpan={gap.rowSpan}
                        >
                          <div className={styles.gapHeader}>
                            <div className={styles.gapId}>{gap.id}</div>
                          </div>
                          {gap.description && (
                            <div className={styles.gapDescription}>
                              {gap.description}
                            </div>
                          )}
                          <div className={styles.controlRef}>
                            {gap.controlReference}
                          </div>
                        </td>
                      )}

                      {/* Evidence - individual cells */}
                      {!isQuestionnaireView && (
                        <td
                          className={`${styles.tableCell} ${styles.evidenceCell}`}
                        >
                          <div className={styles.evidenceSection}>
                            <div className={styles.evidenceLabel}>
                              Previous Evidence
                            </div>
                            <div className={styles.evidenceContainer}>
                              {Array.isArray(gap.previousEvidence) &&
                              gap.previousEvidence.length > 0 ? (
                                <>
                                  {gap.previousEvidence.map(
                                    (evidence: Evidence, idx: number) => (
                                      <>
                                        <div
                                          key={idx}
                                          className={styles.evidenceLink}
                                          onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            handleEvidenceClick(evidence.name);
                                          }}
                                        >
                                          <FileText
                                            className={styles.viewIcon}
                                          />
                                          <span className={styles.evidenceText}>
                                            {evidence.name}
                                          </span>
                                        </div>
                                        <div>
                                          Submitted:{" "}
                                          {new Date(
                                            evidence.uploadedAt
                                          ).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                        </div>
                                      </>
                                    )
                                  )}
                                </>
                              ) : (
                                <span className={styles.noEvidenceText}>
                                  No previous evidence
                                </span>
                              )}
                            </div>
                          </div>

                          <div className={styles.evidenceSection}>
                            <div className={styles.evidenceLabel}>
                              Latest Evidence
                            </div>
                            <div className={styles.evidenceContainer}>
                              {Array.isArray(gap.latestEvidence) &&
                              gap.latestEvidence.length > 0 ? (
                                <>
                                  {gap.latestEvidence.map(
                                    (evidence: Evidence, idx: number) => (
                                      <>
                                        <div
                                          key={idx}
                                          className={styles.evidenceLink}
                                          onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            handleEvidenceClick(evidence.name);
                                          }}
                                        >
                                          <FileText
                                            className={styles.viewIcon}
                                          />
                                          <span className={styles.evidenceText}>
                                            {evidence.name}
                                          </span>
                                        </div>
                                        <div>
                                          Submitted:{" "}
                                          {new Date(
                                            evidence.uploadedAt
                                          ).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                        </div>
                                      </>
                                    )
                                  )}
                                </>
                              ) : (
                                <div className={styles.noEvidenceText}>
                                  No evidence submitted
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Internal Assessor - merged cell */}
                      {!isQuestionnaireView && gap.isFirstInGroup && (
                        <td
                          className={`${styles.tableCell} ${styles.assessorCell}`}
                          rowSpan={gap.rowSpan}
                        >
                          <div className={styles.assessorContainer}>
                            <div className={styles.assessorAvatar}>
                              {gap.AEInternalAssessor?.charAt(0) || "A"}
                            </div>
                            <div className={styles.assessorName}>
                              {gap.AEInternalAssessor}
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Resolution Comment - merged cell */}
                      {gap.isFirstInGroup && (
                        <td
                          className={`${styles.tableCell} ${styles.commentCell}`}
                          rowSpan={gap.rowSpan}
                        >
                          <div className={styles.resolutionContainer}>
                            {gap.resolutionComment && (
                              <div className={styles.resolutionText}>
                                {gap.resolutionComment}
                              </div>
                            )}
                            {gap.resolutionDate && (
                              <div className={styles.dateText}>
                                {gap.resolutionDate}
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Action - merged cell */}
                      {gap.isFirstInGroup && (
                        <td
                          className={`${styles.tableCell} ${styles.actionCell}`}
                          rowSpan={gap.rowSpan}
                        >
                          <button
                            className={styles.resolveButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setIsGapRemediation(true));
                              handleResolveClick(
                                gap.ReqNo,
                                gap.controlReference,
                                gap.subReqNo,
                                gap.AEInternalAssessor
                              );
                            }}
                          >
                            Resolve
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup for AEPoc users */}
      {isPopupOpen && selectedGap && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <h3 className={styles.popupTitle}>Update Response</h3>
              <button 
                className={styles.closeButton}
                onClick={closePopup}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.popupBody}>
              <div className={styles.questionSection}>
                <label className={styles.questionLabel}>Question:</label>
                <div className={styles.questionText}>
                  {selectedGap.questionText}
                </div>
              </div>
              
              <div className={styles.responseSection}>
                <label className={styles.responseLabel}>Your Response:</label>
                {renderQuestionInput(selectedGap)}
              </div>
            </div>
            
            <div className={styles.popupFooter}>
              <button 
                className={styles.cancelButton}
                onClick={closePopup}
              >
                Cancel
              </button>
              <button 
                className={styles.updateButton}
                onClick={handlePopupResponseUpdate}
              >
                Update Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GapManagementComponent;
