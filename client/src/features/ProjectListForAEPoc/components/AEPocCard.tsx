import { Avatar, Card, CardContent, Chip, Typography } from "@mui/material";
import style from "../components/AEPoc.module.css";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import useAxios from "../../../api/useAxios";
import {
  fetchProjectById,
  Project,
  selectPaginationState,
  setCurrentPage,
   // Add this import
} from "../../../redux/projectManagementSlice";
import Pagination from "../../../common/ui/Pagination";
import { useNavigate } from "react-router-dom";
import { setSelectedProject } from "../../../redux/projectViewSlice";


const AEPocCard = () => {
    // Redirect to login if user is not logged in
    const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const axiosInstance = useAxios();
  const loginUser = useSelector((state: RootState) => state.login.user);
  const { currentPage, totalPages, totalCount } = useSelector(
    selectPaginationState
  );
  const projects = useSelector(
    (state: RootState) => state.projectManagement.projects
  );

  
  useEffect(() => {
    dispatch(
      fetchProjectById({
        axiosInstance,
        userId: loginUser?.id as string,
        role: loginUser?.roles as string[],
        page: currentPage as number,
        limit: 5,
      })
    );
  }, [dispatch, axiosInstance, loginUser?.id, loginUser?.roles]);
  
  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    if (validPage !== currentPage) {
      dispatch(setCurrentPage(validPage));
    }
  };

  const handleViewProject = (project: Project) => {
    dispatch(setSelectedProject(project));
    navigate('/landing/aepoc-qstnr');
  };

  return (
    <>
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
    {projects && projects.length > 0 ? (
      projects.map((project) => (
        <Card key={project._id} className={style.auditCard}>
          <CardContent className={style.cardContent}>
            <div className={style.cardHeader}>
              <div className={style.titleSection}>
                <Avatar className={style.avatar}>
                  <img
                    src="https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=HD"
                    alt="HDFC"
                    className={style.avatarImage}
                  />
                </Avatar>
                <div className={style.titleInfo}>
                  <div>
                    <Typography variant="h6" className={style.auditTitle}>
                      {project.projectName}
                    </Typography>
                  </div>
                  <div>
                    <Chip
                      label={project.status}
                      className={style.statusChip}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={style.detailsSection}>
              <div className={style.detailRow}>
                <Typography className={style.detailLabel}>
                  Assigned On: {project.createDtTime ? new Date(project.createDtTime).toLocaleDateString() : "N/A"}
                </Typography>
              </div>

              <div className={style.detailRow}>
                <Typography className={style.detailLabel}>
                  PMO/Business Team: {project.clientInfo?.pocName}
                </Typography>
              </div>

              <div className={style.detailRow}>
                <Typography className={style.detailLabel}>
                  Auditor assigned: {project.assignedTo
                    ?.filter((auditor) => auditor.role === "QSA")
                    .map((auditor) => auditor.name)
                    .join(", ") || "N/A"}
                </Typography>
              </div>
            </div>

            <div className={style.actionSection}>
              <PrimaryButton
                children="View Project"
                onClick={() => handleViewProject(project)}
              />
            </div>
          </CardContent>
        </Card>
      ))) : (
      <Typography variant="body1" className={style.noProjects}>
        No projects found.
      </Typography>
      )
    }
    </div>
<div>


      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={10}
        totalItems={totalCount}
        onPageChange={handlePageChange}
        />
        </div>
    </>
  );
};

export default AEPocCard;