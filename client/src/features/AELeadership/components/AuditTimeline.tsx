import { CalendarDays, PlayCircle, Clock } from "lucide-react";
import styles from "./auditTimeline.module.css";
import useDashboard from "../useDashboard";

const AuditTimeline = () => {
  const {
    project,
    ended,
    started,
    istTime,
    scopingProgress,
    assessmentProgress,
    gapProgress,
    rocProgress,
    assesmentEnded,
    assesmentstarted,
     gapPhaseEnded,
  gapPhaseStarted
  } = useDashboard();

  const auditPhases = [
    {
      title: "Scoping",
      desc: "Asset identification and scope definition",
      percent: scopingProgress,
      started: started,
      ended: ended,
      note: "Ends after asset identification is complete",
    },
    {
      title: "Assessment",
      desc: "Gap analysis and assessment activities",
      percent: assessmentProgress,
      started: assesmentstarted,
      ended: assesmentEnded,
      note: "Ends after Gap Report is sent",
    },
    {
      title: "G&R",
      desc: "Gap remediation and validation",
      percent: gapProgress,
      started: gapPhaseStarted,
      ended: gapPhaseEnded,
      note: "Ends after ROC is sent for review",
    },
    {
      title: "ROC Submission",
      desc: "ROC Submission and Approval",
      percent: rocProgress,
      started: gapPhaseStarted,
      ended: gapPhaseEnded,
      note: "Ends when ROC is approved by all stakeholders",
    },
  ];

  const getDynamicStatus = (percent: number) => {
    if (percent === 100) return { status: "Complete", color: "#22C55E" };
    if (percent > 0) return { status: "Ongoing", color: "#F97316" };
    return { status: "Pending", color: "#E5E7EB" };
  };

  const isCompleted = project?.status === "Completed";

  const today =
    isCompleted && project?.updateDtTime
      ? new Date(project.updateDtTime)
      : new Date();

  const todayFormatted = today.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const getDaysSinceStart = (startDate: Date, endDate: Date) => {
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays >= 0 ? diffInDays + 1 : 0;
  };

  const startDate = project?.createDtTime
    ? new Date(project.createDtTime)
    : null;

  const daysSinceStart = startDate
    ? getDaysSinceStart(startDate, today)
    : "N/A";

  type AuditPhase = {
    title: string;
    desc: string;
    percent: number;
    started: string | null;
    ended: string | null;
    note: string;
  };

  const getConnectingLineGradient = (
    currentPhase: AuditPhase,
    nextPhase: AuditPhase
  ) => {
    const current = getDynamicStatus(currentPhase.percent);
    const next = getDynamicStatus(nextPhase.percent);

    if (current.status === "Complete" && next.status === "Complete") {
      return "linear-gradient(to right, #22C55E, #22C55E)";
    } else if (current.status === "Complete" && next.status === "Ongoing") {
      return "linear-gradient(to right, #22C55E, #F97316)";
    } else if (current.status === "Complete" && next.status === "Pending") {
      return "linear-gradient(to right, #22C55E, #D1D5DB)";
    } else if (current.status === "Ongoing" && next.status === "Ongoing") {
      return "linear-gradient(to right, #F97316, #F97316)";
    } else if (current.status === "Ongoing" && next.status === "Pending") {
      return "linear-gradient(to right, #F97316, #FED7AA, #D1D5DB)";
    } else {
      return "linear-gradient(to right, #D1D5DB, #D1D5DB)";
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <CalendarDays size={20} color="#3B82F6" />
          <h2 className={styles.title}>Audit Timeline</h2>
        </div>
      </div>
      <div className={styles.startgap}>
      <div className={styles.timelineInfo}>
        <span className={styles.startDate}>
          <strong> Start Date </strong>
          <br />
          {istTime}
        </span>
      </div>
      <div className={styles.timelineContainer}>
        <div
          className={styles.progressBar}
          style={{
            width: `${
              (scopingProgress +
                assessmentProgress +
                gapProgress +
                rocProgress) /
              4
            }%`,
          }}
        ></div>
        <div
          className={styles.todayMarker}
          style={{
            left: `${
              (scopingProgress +
                assessmentProgress +
                gapProgress +
                rocProgress + 20) /
              4
            }%`,
          }}
        >
          <span className={styles.todayText}>
            {isCompleted ? "Completed" : "Today"}
            <br />
            <strong>{todayFormatted}</strong>
          </span>
        </div>
        <div className={`${styles.dayLabel} ${styles.dayLabelStart}`}>
          Day 1
        </div>
        <div className={`${styles.dayLabel} ${styles.dayLabelEnd}`}>
          Day {daysSinceStart}
        </div>
      </div>
      </div>

      <h3 className={styles.phasesTitle}>Audit Phases Progress</h3>
      <div className={styles.phasesContainer}>
        {auditPhases.map((phase, idx) => {
          const dynamicStatus = getDynamicStatus(phase.percent);
          return (
            <div key={idx} className={styles.phaseItem}>
              {idx < auditPhases.length - 1 && (
                <div
                  className={styles.connectingLine}
                  style={{
                    background: getConnectingLineGradient(
                      phase,
                      auditPhases[idx + 1]
                    ),
                  }}
                ></div>
              )}
              <div
                className={`${styles.phaseIcon} ${
                  dynamicStatus.status === "Pending"
                    ? styles.phaseIconPending
                    : styles.phaseIconActive
                }`}
                style={{ backgroundColor: dynamicStatus.color }}
              >
                {dynamicStatus.status === "Complete" ? (
                  "✓"
                ) : dynamicStatus.status === "Ongoing" ? (
                  <PlayCircle size={16} />
                ) : (
                  <Clock size={16} />
                )}
              </div>
              <div className={styles.phaseTitle}>{phase.title}</div>
              <div className={styles.phaseDesc}>{phase.desc}</div>
              <div className={styles.phaseProgressContainer}>
                <div
                  className={styles.phaseProgressBar}
                  style={{
                    width: `${phase.percent}%`,
                    backgroundColor: dynamicStatus.color,
                  }}
                ></div>
              </div>
              <div className={styles.phasePercent}>
                {phase.percent}% Complete
              </div>
              <div className={styles.phaseDates}>
                {phase.percent === 100 && phase.started && phase.ended ? (
                  <>
                    Started:{" "}
                    {new Date(phase.started).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}{" "}
                    &nbsp;&nbsp; Ended:{" "}
                    {new Date(phase.ended).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </>
                ) : phase.percent === 0 ? (
                  <>Yet to Start</>
                ) : phase.started ? (
                  <>
                    Started:{" "}
                    {new Date(phase.started).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </>
                ) : (
                  <>In Progress</>
                )}
              </div>

              <div className={styles.phaseNote}>{phase.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditTimeline;
