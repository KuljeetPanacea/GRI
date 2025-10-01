import { Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import SearchBar from "../../common/ui/SearchBar";
import SelectDropdown from "../../common/ui/SelectDropdown";
import AuditTimeline from "./components/AuditTimeline";
import DepartmentProgress from "./components/DepartmentProgress";
import Stakeholders from "./components/Stakeholders";
import styles from './dashboard.module.css';
import useDashboard from "./useDashboard";

const Dashboard = () => {
const {
  project,
  submittedCount,
  totalAssessments,
  complianceType,
  handleComplianceChange,
  istTime,
  progressWidth,
  totalGaps,
  completedGaps,
} = useDashboard();
 
const currentPhase: string = project?.currentAuditStage || "asessment";
  if (!project) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}><span className={styles.headerIconText}>🏦</span></div>
            <div>
              <h1 className={styles.headerTitle}>{project.projectName}</h1>
              <div style={{ display: "flex", gap: "12px" }}>
                <p className={styles.headerSubtitle}>Project Start Date: {istTime}</p>
                <p className={styles.headerSubtitle}>PMO: {project.clientInfo?.pocName}</p>
                <p className={styles.headerSubtitle}>AE POC: {project.auditEntity?.pocName}</p>
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <SelectDropdown
              title='Compliance Type'
              options={[
                { value: "PCIDSS", label: "PCI DSS" },
                { value: "ISO27001", label: "ISO 27001" },
                { value: "SOC2", label: "SOC 2" },
                { value: "HIPAA", label: "HIPAA" },
                { value: "GDPR", label: "GDPR" },
              ]}
              value={complianceType}
              onChange={handleComplianceChange}
            />
            <div className={styles.searchContainer}>
              <SearchBar value={"search"} onChange={() => {}} />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className={styles.mainGrid}>

          {/* Project Status */}
         <div className={styles.card}>
  <div className={styles.cardHeader}>
    <Calendar className={styles.cardIcon} />
    <h3 className={styles.cardTitle}>Project Status & Timeline</h3>
  </div>

  <div className={styles.cardContent}>
    <p className={styles.statusText}>Started: {istTime}</p>

    {/* Conditionally render End Date */}
    {progressWidth == "100" && (
      <p className={styles.statusText}>
        End Date - {new Date(project.updateDtTime).toLocaleDateString("en-IN")}
      </p>
    )}

    {/* Conditional badge class */}
    <div
      className={
        progressWidth == "100"
          ? styles.statusBadgeGreen
          : styles.statusBadge
      }
    >
      <span className={styles.statusBadgeText}>{project.status}</span>
    </div>
  </div>
</div>


          {/* Progress */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.progressIcon}></div>
              <h3 className={styles.cardTitle}>Progress</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.progressHeader}>
                Phase completion
                <div className={styles.progressPercentage}>{progressWidth}</div>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: progressWidth }}></div>
              </div>
              <div className={styles.progressSubtext}>4 Total Phases</div>
            </div>
          </div>

          {/* Assessment Status */}
          {/* <div className={styles.card}>
            <div className={styles.cardHeader}>
              <AlertCircle className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Assessment status</h3>
            </div>
            <div className={styles.assessmentContent}>
              <div className={styles.assessmentRow}>
                <span className={styles.assessmentLabel}>Total Assessments</span>
                <span className={styles.assessmentValue}>{totalAssessments}</span>
              </div>
              <div className={styles.assessmentRow}>
                <div className={styles.assessmentIconLabel}>
                  <CheckCircle className={`${styles.assessmentIcon} ${styles.assessmentIconGreen}`} />
                  <span className={styles.assessmentTextGreen}>Submitted</span>
                </div>
                <span className={styles.assessmentValueGreen}>{submittedCount}</span>
              </div>
              <div className={styles.assessmentRow}>
                <div className={styles.assessmentIconLabel}>
                  <Clock className={`${styles.assessmentIcon} ${styles.assessmentIconYellow}`} />
                  <span className={styles.assessmentTextYellow}>All Pending</span>
                </div>
                <span className={styles.assessmentValueYellow}>{totalAssessments-submittedCount}</span>
              </div>
            </div>
          </div> */}


 <div className={styles.card}>
      <div className={styles.cardHeader}>
        <AlertCircle className={styles.cardIcon} />
        <h3 className={styles.cardTitle}>
          {currentPhase === "gap"
            ? "Gap Status"
            : currentPhase === "assessment"
            ? "Assessment Status"
            : "Phase Status"}
        </h3>
      </div>

      {currentPhase === "gap" ? (
        <div className={styles.assessmentContent}>
          <div className={styles.assessmentRow}>
            <span className={styles.assessmentLabel}>Total Gaps</span>
            <span className={styles.assessmentValue}>{totalGaps}</span>
          </div>
          <div className={styles.assessmentRow}>
            <div className={styles.assessmentIconLabel}>
              <CheckCircle className={`${styles.assessmentIcon} ${styles.assessmentIconGreen}`} />
              <span className={styles.assessmentTextGreen}>Resolved</span>
            </div>
            <span className={styles.assessmentValueGreen}>{completedGaps}</span>
          </div>
          <div className={styles.assessmentRow}>
            <div className={styles.assessmentIconLabel}>
              <Clock className={`${styles.assessmentIcon} ${styles.assessmentIconYellow}`} />
              <span className={styles.assessmentTextYellow}>Pending</span>
            </div>
            <span className={styles.assessmentValueYellow}>{totalGaps - completedGaps}</span>
          </div>
        </div>
      ) : currentPhase === "assessment" ? (
        <div className={styles.assessmentContent}>
          <div className={styles.assessmentRow}>
            <span className={styles.assessmentLabel}>Total Assessments</span>
            <span className={styles.assessmentValue}>{totalAssessments}</span>
          </div>
          <div className={styles.assessmentRow}>
            <div className={styles.assessmentIconLabel}>
              <CheckCircle className={`${styles.assessmentIcon} ${styles.assessmentIconGreen}`} />
              <span className={styles.assessmentTextGreen}>Submitted</span>
            </div>
            <span className={styles.assessmentValueGreen}>{submittedCount}</span>
          </div>
          <div className={styles.assessmentRow}>
            <div className={styles.assessmentIconLabel}>
              <Clock className={`${styles.assessmentIcon} ${styles.assessmentIconYellow}`} />
              <span className={styles.assessmentTextYellow}>Pending</span>
            </div>
            <span className={styles.assessmentValueYellow}>{totalAssessments - submittedCount}</span>
          </div>
        </div>
      ) : (
        <div className={styles.assessmentContent}>
            <span className={styles.statusBadgeText}>Current Phase: {project.currentAuditStage}</span>
          <div className={styles.assessmentRow}>
  <div
      className={ styles.statusBadge
      }
    >

      <span className={styles.statusBadgeText}>In Progress</span>
    </div>  
          </div>
        </div>
      )}
    </div>


        </div>

        {/* Components */}
        <div className={styles.componentCard}><AuditTimeline/></div>
        <div className={styles.componentCard}><DepartmentProgress /></div>
        <div className={styles.componentCard}><Stakeholders /></div>
      </div>
    </div>
  );
};

export default Dashboard;
