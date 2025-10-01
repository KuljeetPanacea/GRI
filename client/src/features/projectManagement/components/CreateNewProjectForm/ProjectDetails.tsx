import React from "react";
import TextInput from "../../../../common/ui/TextInput";
import { Typography } from "@mui/material";
import styles from "../../ProjectManagement.module.css";
import { NewProject } from "../../../../redux/createNewProjectSlice";

interface ProjectDetailsProps {
  formData: NewProject;
  handleChange: (field: keyof NewProject, value: string) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ formData, handleChange }) => {
  return (
    <div className={styles.details}>
      <Typography variant="body2"><b>Project Name *</b></Typography>
      <TextInput className={styles.textInput} value={formData.projectName} onChange={(e) => handleChange("projectName", e.target.value)} />
      
      <Typography variant="body2"><b>Project Description *</b></Typography>
      <TextInput value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
    </div>
  );
};

export default ProjectDetails;
