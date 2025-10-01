import React from "react";
import usePhaseBreadcrumbs from "../hooks/useAuditProjectPhases";
import styles from "../styles/AuditProjectPhases.module.css";
import usePVHeader from "../hooks/useAuditProjectHeader";

const AuditProjectPhases: React.FC = () => {
  const { phases, selectedPhase, handlePhaseClick, getStatusColor } =
    usePhaseBreadcrumbs();

    const {
      project
    } = usePVHeader();

  return (
    <>
    <div>
        <p className={styles.details}>
          Project Start Date: {project?.createDtTime!.split("T")[0]} | AE
          POC: {project?.auditEntity?.assessedEntityname} | PMO:{" "}
          {project?.clientInfo?.pocName}
        </p>
      </div>
    <div className={styles.container}>
      
      {phases.map((phase, index) => {
        const statusColor = getStatusColor(phase);
        const isSelected = selectedPhase === phase.phaseName;
   
        return (
          <React.Fragment key={index}>
            <div
              className={styles.phaseContainer}
              onClick={() => handlePhaseClick(phase.phaseName)}
            >
              {/* Phase Number Circle */}
              <div
                className={`${styles.phaseNumber} ${styles[statusColor]} ${
                  isSelected ? styles.selectedPhase : ""
                }`}
              >
                {/* {phase.id} */}
              </div>

              {/* Phase Title & Subtitle */}
              <div className="text-center">
                <div
                  className={`${styles.phaseTitle} ${
                    isSelected ? styles.selectedTitle : styles.defaultTitle
                  }`}
                >
                  {phase.title}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < phases.length - 1 && (
              <div
                className={`${styles.connector} ${
                  index < phase.id - 1 ? styles.completedConnector : ""
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
    </>
  );
};

export default AuditProjectPhases;
