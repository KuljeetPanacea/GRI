import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import GapsTabs from "./GapsTabs";
import styles from "./styles/GapManagementComponent.module.css";
import { AlertTriangle } from "lucide-react";
import {
  fetchGapsDevices,
  fetchGapsRemediation,
  fetchOneDevicesRef,
  fetchOnestakeholderGaps,
  setIsGapRemediation,
} from "../../../../../redux/GapsRemediationSlice";
import { useGapAndRemediationView } from "../useGapAndRemediationView";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

interface Evidence {
  name: string;
  uploadedAt: string;
}

interface Question {
  _id: string;
  text: string;
  type: string;
  choices?: Array<{ value: string }>;
  requirements?: string | null;
  subRequirements?: string | null;
  subControl?: string | null;
  userResponse?: string;
  gaps?: {
    gaps?: string;
    clientComment?: string;
    status?: string;
  };
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
}

const GapManagementComponent = () => {
  const {
    requirementFilter,
    selectedRow,
    selectedReqNo,
    ActiveFilter,
    selectedProject,
    handleResolveClick,
    handleRowClick,
    flattenedGaps,
    handleEvidenceClick,
    axiosInstance,
    dispatch,
    navigate,
  } = useGapAndRemediationView();

  const location = useLocation();
  const [questionnaireGaps, setQuestionnaireGaps] = useState<
    QuestionnaireGap[]
  >([]);
  const [isQuestionnaireView, setIsQuestionnaireView] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string>("");
  const [isAEPocView, setIsAEPocView] = useState(false);
  const [availableQuestionnaires, setAvailableQuestionnaires] = useState<string[]>([]);
  
  // Get user role from Redux store
  const userRole = useSelector((state: RootState) => state.login.user?.roles?.[0]);
  const isAEPocUser = userRole === "AEPoc" || userRole === "AEPoC";

  // Handle questionnaire data from navigation state
  useEffect(() => {
    if (location.state) {
      const { questionnaireData, questionsWithGaps, isAEPoc } = location.state;
      if (questionnaireData && questionsWithGaps) {
        setIsQuestionnaireView(true);
        setIsAEPocView(isAEPoc || false);
        console.log('AEPoc view set to:', isAEPoc || false);
        console.log('User role:', userRole, 'isAEPocUser:', isAEPocUser);

        // Transform questionnaire gaps to table format
        const transformedGaps: QuestionnaireGap[] = questionsWithGaps.map(
          (question: Question, index: number) => ({
            id: `GAP-${String(index + 1).padStart(3, "0")}`,
            questionText: question.text || "No question text",
            userResponse: question.userResponse || "No response",
            gapComment: question.gaps?.gaps || "No gap comment",
            questionnaireTitle:
              questionnaireData.title || "Unknown Questionnaire",
            questionnairePhase: questionnaireData.phase || "Unknown Phase",
            questionId: question._id || `q-${index}`,
            status: question.gaps?.status || "Finding Open",
          })
        );

        setQuestionnaireGaps(transformedGaps);
        
        // Set available questionnaires (only those with gaps)
        const uniqueQuestionnaires = Array.from(
          new Set(transformedGaps.map(gap => gap.questionnaireTitle))
        );
        setAvailableQuestionnaires(uniqueQuestionnaires);
        
        // Set default selected questionnaire to the first one
        if (uniqueQuestionnaires.length > 0) {
          setSelectedQuestionnaire(uniqueQuestionnaires[0]);
        }
      }
    }
  }, [location.state, userRole, isAEPocUser]);

  useEffect(() => {
    if (
      Array.from({ length: 12 }, (_, i) => `Req-${i + 1}`).includes(
        selectedReqNo ?? ""
      )
    ) {
      dispatch(
        fetchGapsRemediation({
          projectId: selectedProject?._id ?? "",
          reqNo: selectedReqNo ?? "",
          axiosInstance,
        })
      );
    } else if (
      [
        "Firewall",
        "Router",
        "Switch",
        "Database",
        "Cloud Network",
        "Server Hardening",
      ].includes(selectedReqNo ?? "")
    ) {
      dispatch(
        fetchGapsDevices({
          projectId: selectedProject?._id ?? "",
          deviceType: selectedReqNo ?? "",
          axiosInstance,
        })
      );
    } else if (ActiveFilter?.value === "Stakeholder") {
      dispatch(
        fetchOnestakeholderGaps({
          projectId: selectedProject?._id ?? "",
          AEInternalAssessor: selectedReqNo ?? "",
          axiosInstance,
        })
      );
    } else {
      dispatch(
        fetchOneDevicesRef({
          projectId: selectedProject?._id ?? "",
          deviceRef: selectedReqNo ?? "",
          axiosInstance,
        })
      );
    }
  }, [dispatch, requirementFilter]);

  // Process gaps for merging cells
  const processGapsForMerging = (gaps: FlattenedGap[]): FlattenedGap[] => {
    const processed: FlattenedGap[] = [];
    const gapGroups: { [key: string]: FlattenedGap[] } = {};

    // Group gaps by ID and control reference
    gaps.forEach((gap, index: number) => {
      const groupKey = `${gap.id}-${gap.controlReference}`;
      if (!gapGroups[groupKey]) {
        gapGroups[groupKey] = [];
      }
      gapGroups[groupKey].push({ ...gap, originalIndex: index });
    });

    // Process each group
    Object.keys(gapGroups).forEach((groupKey: string) => {
      const group = gapGroups[groupKey];
      group.forEach((gap, indexInGroup: number) => {
        processed.push({
          ...gap,
          isFirstInGroup: indexInGroup === 0,
          rowSpan: group.length,
        });
      });
    });

    return processed;
  };

  const processedGaps = processGapsForMerging(flattenedGaps);

  // Filter questionnaire gaps based on selected questionnaire
  const filteredQuestionnaireGaps = questionnaireGaps.filter(gap => {
    if (!selectedQuestionnaire) return true; // Show all if no selection
    return gap.questionnaireTitle === selectedQuestionnaire;
  });

  
  const getStatusChip = (status: string) => {
    let colorClass = "";

    switch (status.toLowerCase()) {
      case "pending client":
        colorClass = styles.statusClient;
        break;
      case "pending qsa":
        colorClass = styles.statusQsa;
        break;
      case "yet to sent":
        colorClass = styles.statusYet;
        break;
      case "resolved":
        colorClass = styles.statusResolved;
        break;
      default:
        colorClass = styles.statusDefault;
    }

    return (
      <span className={`${styles.statusChip} ${colorClass}`}>{status}</span>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finding Closed":
        return "#10b981"; // Green
      case "Finding Open":
        return "#f59e0b"; // Amber
      case "Client input pending":
        return "#3b82f6"; // Blue
      case "Under Auditor Review":
        return "#8b5cf6"; // Purple
      default:
        return "#f59e0b"; // Default to amber
    }
  };

  const getStatusTextColor = () => {
    return "#ffffff"; // White text for all statuses
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
      
      {/* Questionnaire Dropdown - only show in questionnaire view */}
      {isQuestionnaireView && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.dropdown}>
              <label className={styles.dropdownLabel}>Questionnaire:</label>
              <select
                value={selectedQuestionnaire}
                onChange={(e) => setSelectedQuestionnaire(e.target.value)}
                disabled={isAEPocView || isAEPocUser}
                className={styles.statusSelect}
                title={isAEPocView || isAEPocUser ? "Dropdown disabled for AEPoc users" : "Select questionnaire"}
              >
                {availableQuestionnaires.map((questionnaire) => (
                  <option key={questionnaire} value={questionnaire}>
                    {questionnaire}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.gapDetailsHeader}>Gap Details</th>
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
              <th className={styles.statusHeader}>Status</th>
              <th className={styles.actionHeader}>Action</th>
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
                        onClick={() => handleRowClick(index)}
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

                        {/* Resolution Comment */}
                        <td
                          className={`${styles.tableCell} ${styles.commentCell}`}
                        >
                          {isAEPocView || isAEPocUser ? (
                            <textarea
                              value={gap.gapComment}
                              onChange={(e) => {
                                e.stopPropagation();
                                setQuestionnaireGaps((prevGaps) =>
                                  prevGaps.map((g) =>
                                    g.id === gap.id
                                      ? { ...g, gapComment: e.target.value }
                                      : g
                                  )
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={styles.editableComment}
                              rows={3}
                              placeholder="Enter resolution comment..."
                            />
                          ) : (
                            <div className={styles.resolutionContainer}>
                              <div className={styles.resolutionText}>
                                {gap.gapComment}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td
                          className={`${styles.tableCell} ${styles.statusCell}`}
                        >
                          {getStatusChip("Pending Auditor")}
                        </td>

                        {/* Action */}
                        <td
                          className={`${styles.tableCell} ${styles.actionCell}`}
                        >
                          <select
                            className={`${styles.statusSelect} ${styles.questionnaireStatusSelect}`}
                            value={gap.status || "Finding Open"}
                            onChange={(e) => {
                              e.stopPropagation();
                              console.log(
                                "Status changed for gap:",
                                gap.id,
                                "to:",
                                e.target.value
                              );

                              // Update the status in the local state
                              setQuestionnaireGaps((prevGaps) =>
                                prevGaps.map((g) =>
                                  g.id === gap.id
                                    ? { ...g, status: e.target.value }
                                    : g
                                )
                              );

                              // TODO: Update status in backend
                            }}
                            onClick={(e) => e.stopPropagation()}
                            data-status={gap.status || "Finding Open"}
                            style={{
                              backgroundColor: getStatusColor(
                                gap.status || "Finding Open"
                              ),
                              color: getStatusTextColor(),
                              border: "none",
                              borderRadius: "8px",
                              padding: "8px 32px 8px 12px",
                              fontSize: "14px",
                              fontWeight: "500",
                              cursor: "pointer",
                              outline: "none",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              transition: "all 0.2s ease",
                              appearance: "none",
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 12px center",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 8px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 4px rgba(0,0,0,0.1)";
                            }}
                          >
                            <option
                              value="Finding Closed"
                              style={{
                                backgroundColor: "#10b981",
                                color: "white",
                                padding: "8px",
                              }}
                            >
                              ✓ Finding Closed
                            </option>
                            <option
                              value="Finding Open"
                              style={{
                                backgroundColor: "#f59e0b",
                                color: "white",
                                padding: "8px",
                              }}
                            >
                              ⚠ Finding Open
                            </option>
                            <option
                              value="Client input pending"
                              style={{
                                backgroundColor: "#3b82f6",
                                color: "white",
                                padding: "8px",
                              }}
                            >
                              ⏳ Client input pending
                            </option>
                            <option
                              value="Under Auditor Review"
                              style={{
                                backgroundColor: "#8b5cf6",
                                color: "white",
                                padding: "8px",
                              }}
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

                      {/* Status - merged cell */}
                      {gap.isFirstInGroup && (
                        <td
                          className={`${styles.tableCell} ${styles.statusCell}`}
                          rowSpan={gap.rowSpan}
                        >
                          {getStatusChip(gap.Status)}
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
    </div>
  );
};

export default GapManagementComponent;
