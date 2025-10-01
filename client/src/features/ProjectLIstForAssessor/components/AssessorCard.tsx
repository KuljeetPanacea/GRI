import { Avatar, Card, CardContent, Chip, Typography } from "@mui/material";
import style from "../components/Styles/Assessor.module.css";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchProjectById,
  selectPaginationState,
  selectFilteredProjects,
} from "../../../redux/projectManagementSlice";
import useAssessor from "../useAssessor";

const AssessorCard = () => {
  const { dispatch, handleViewProject, axiosInstance, loginUser } =
    useAssessor();
  const { currentPage } = useSelector(selectPaginationState);
  const projects = useSelector(selectFilteredProjects);
  const { search, complianceType } = useSelector((state: RootState) => state.projectManagement);

  useEffect(() => {
    dispatch(
      fetchProjectById({
        axiosInstance,
        userId: loginUser?.id as string,
        role: loginUser?.roles as string[],
        page: currentPage as number,
        limit: 5,
        search,
      })
    );
  }, [dispatch, axiosInstance, loginUser?.id, loginUser?.roles, currentPage, search, complianceType]);

  return (
    <>
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
                        label={project.currentAuditStage}
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
                    Assigned On:{" "}
                    {project.createDtTime
                      ? new Date(project.createDtTime).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </div>

                <div className={style.detailRow}>
                  <Typography className={style.detailLabel}>
                    PMO/Business Team: {project.clientInfo?.pocName}
                  </Typography>
                </div>

                <div className={style.detailRow}>
                  <Typography className={style.detailLabel}>
                    Auditor assigned:{" "}
                    {project.assignedTo
                      ?.filter((auditor) => auditor.role === "Auditor")
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
        ))
      ) : (
        <Typography variant="body1" className={style.noProjects}>
          No projects found.
        </Typography>
      )}
    </>
  );
};

export default AssessorCard;
