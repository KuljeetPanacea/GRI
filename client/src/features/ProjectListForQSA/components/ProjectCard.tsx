// ProjectCard.tsx
import React from "react";
import { Tooltip, IconButton, Divider } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import styles from "../styles/PLHeader.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedProject } from "../../../redux/projectViewSlice";
import { Project } from "../../../redux/projectManagementSlice";

interface ProjectCardProps{
    project:Project;
}


const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return styles.statusNew;
      case "in progress":
        return styles.statusInProgress;
      case "completed":
        return styles.statusCompleted;
      default:
        return styles.statusDefault;
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleStartAudit = () => {
    dispatch(setSelectedProject(project)); // Store project in Redux
    navigate("/landing/ProjectView"); // Navigate to the new page
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div style={{ display: "flex" }}>
          <div className={styles.companyTag}>{project.projectName}</div>
          <div className={`${styles.status} ${getStatusColor(project.status || "" )}`}>
            {project.status}
          </div>
        </div>
        <Tooltip title="Comment">
          <IconButton size="small" className={styles.commentButton}>
            <CommentIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className={styles.details}>
        <div className={styles.detailRow}>
          {project.createDtTime && (
            <span className={styles.label}>Assigned Date: {project.createDtTime.split("T")[0]}</span>
          )}
        </div>
        {project.createDtTime && (
          <div className={styles.detailRow}>
            <span className={styles.label}>Start Date: {project.createDtTime.split("T")[0]}</span>
          </div>
        )}
        <div className={styles.detailRow}>
          <span className={styles.label}>AE: {project.auditEntity?.assessedEntityname}</span>
          {project.auditEntity?.pocName&& <span className={styles.label}>AE POC: {project.auditEntity?.pocName}</span>}
        </div>
      </div>

      <Divider />
      <div className={styles.cardFooter}>
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar} style={{ width: "80%" }} />
          <span className={styles.progressText}>80%</span>
        </div>
        <div className={styles.auditButtonContainer}>
          <PrimaryButton children={"Start Audit"} onClick={handleStartAudit} className={styles.auditButton} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
