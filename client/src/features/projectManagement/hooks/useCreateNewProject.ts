import { useNavigate } from "react-router-dom";
import {useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  nextStep,
  submitProject,
  updateProjectAsync,
} from "../../../redux/createNewProjectSlice";
import useAxios from "../../../api/useAxios";
import { resetDraftStatus, setDraftStatus } from "../../../redux/projectManagementSlice";
import React from "react";


export const useCreateNewProject = () => {
  const dispatch = useAppDispatch();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  
  const { activeStep, Project, isLoading, error, ProjectId, formType} = useAppSelector(
    (state) => state.createNewProject
  );

  React.useEffect(() => {
  dispatch(setDraftStatus("started"));
}, [dispatch]);

 
  // Function to create a new project (Only when activeStep === 0)
  const handleCreateProject = async () => { 

    if ( !Project.projectName || !Project.description) {  
      alert("Project data is incomplete!");
      return;
    }
     if(!ProjectId){
       const resultAction = await dispatch(submitProject({ Project, axiosInstance }));
       if (submitProject.fulfilled.match(resultAction)) {
         dispatch(nextStep());
         dispatch(setDraftStatus("inprogress"));
       }
     }else{
      console.log("This is the Projectdata", Project);
      handleUpdateProject();
     }
  };


  const handleUpdateProject = async () => {

    await dispatch(
      updateProjectAsync({
        updatedProjectData: Project,
        axiosInstance,
      })
    );
    dispatch(nextStep());
  };

  const handleSubmit = async () => {
    const resultAction = await dispatch(
      updateProjectAsync({
        updatedProjectData: {...Project, status:"In-Progress"},
        axiosInstance,
      })
    );

    if (updateProjectAsync.fulfilled.match(resultAction)) {
      dispatch(resetDraftStatus());
      navigate("/landing/project-management");
  
    }
  };

  return {
    activeStep,
    Project,
    isLoading,
    error,
    dispatch,
    handleCreateProject,
    handleUpdateProject,
    handleSubmit,
    formType,
  };
};
