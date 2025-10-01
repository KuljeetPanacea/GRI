import React, { useEffect } from "react";
import styles from "./styles/PLHeader.module.css";
import ProjectCard from "./components/ProjectCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById, Project } from "../../redux/projectManagementSlice";
import { RootState, useAppSelector, AppDispatch } from "../../redux/store";
import useAxios from "../../api/useAxios";

const PLGridView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const axiosInstance = useAxios();
  const projects = useSelector(
    (state: RootState) => state.projectManagement.projects
  );
  
  const loginUser = useSelector((state: RootState) => state.login.user);
  const { projectStatus, ongoingProjects, search, currentPage } = useAppSelector(
    (state: RootState) => state.projectManagement
  );

  useEffect(() => {
    dispatch(
      fetchProjectById({
        axiosInstance,
        userId: loginUser?.id as string,
        role: loginUser?.roles as string[],
        page: currentPage as number,
        limit: 5,
        ongoingProjects,
        projectStatus,
        search,
      })
    );
  }, [
    dispatch,
    axiosInstance,
    currentPage,
    loginUser?.id,
    loginUser?.roles,
    ongoingProjects,
    projectStatus,
    search,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {projects.map((Project: Project) => (
          <ProjectCard key={Project._id} project={Project} />
        ))}
      </div>
    </div>
  );
};

export default PLGridView;
