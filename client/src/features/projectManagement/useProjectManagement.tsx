import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  setViewMode,
} from "../../redux/projectManagementSlice";
 
 
const useProjectManagement = () => {
  const dispatch = useAppDispatch();
  const viewMode = useSelector(
    (state: RootState) => state.projectManagement.viewMode
  );
  const projects = useSelector(
    (state: RootState) => state.projectManagement.projects
  );
  const [open, setOpen] = useState(false);
 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [createdBy, setCreatedBy] = useState("");
 
  const handleNewProject = () => {
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
  };
 
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "list" | "grid" | null
  ) => {
    console.log(event);
    if (newViewMode) {
      dispatch(setViewMode(newViewMode));
    }
  };
 
  // refractor code
 
  const handleAssignedUsersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setAssignedUsers(typeof value === "string" ? value.split(",") : value);
  };
 
  const handleCreateProject = async () => {
    if (!name || !description || !startDate || !endDate || !status) {
      alert("Please fill in all required fields.");
      return;
    }
 
    try {
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setAssignedUsers([]);
      setStatus("");
      setCreatedBy("");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };
 
  // DeleteProjectModal
  //   const handleDelete = (projectId:string,onClose) => {
  //     if (projectId !== null) {
  //       dispatch(deleteProject(projectId));
  //       onClose();
  //     }
  //   };
 
  //edit project
  const [formData, setFormData] = useState({
    client: "",
    description: "",
    projectName: "",
    clientDBA: "",
    clientWebsiteLink: "",
    clientPocName: "",
    clientContactNumber: "",
    clientEmailAddress: "",
    auditEntity: {
      pocEmail: "",
      pocName: "",
      pocPhoneNumber: "",
      assessedEntityname: "",
      assessedDba: "",
      assessedWebsiteLink: "",
      leadershipName: "",
      leadershipContactNo: "",
      leadershipEmailId:"",
        },
    QSAInfo:{},
    updateDtTime: "",

  });
 
 
  return {
    handleNewProject,
    handleClose,
    open,
    handleViewChange,
    viewMode,
    projects,
    handleAssignedUsersChange,
    name,
    setName,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    assignedUsers,
    status,
    setStatus,
    createdBy,
    setCreatedBy,
    setAssignedUsers,
    handleCreateProject,
    formData,
    setFormData,
  };
};
 
export default useProjectManagement;