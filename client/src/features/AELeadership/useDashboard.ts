import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../redux/store";
import useAxios from "../../api/useAxios";
import { fetchAllAudittask } from "../../api/project";
import useAEPoc from "../ProjectListForAEPoc/useAEPoc";
import { fetchProjectById } from "../../redux/projectManagementSlice";

type DepartmentStats = {
  name: string;
  submitted: number;
  pending: number;
  completion: number;
  color: string;
};

type department = {
  name: string;
  submitted: number;
  pending: number;
  totalCompletion: number;
  devicesCount: number;
};

type Device = {
  department?: string;
  questionnaire?: {
    createDtTime?: string;
    updateDtTime?: string;
    questions?: {
      userResponse?: string | null;
    }[];
  };
};

type Gaps = {
  filteredGaps?: {
    createDtTime: string;
    updateDtTime: string;
    department: string;
    identifiedGaps: {
      status: string;
    }[];
  }[];
  totalNoOfGaps?: number;
  data?: { completedGaps?: number }[];
};

type Project = {
  _id: string;
  projectName: string;
  description: string;
  status: string;
  updateDtTime: string;
  createDtTime: string;
  clientInfo: { pocName: string };
  auditEntity: { pocName: string };
  assignedTo: { id: string; role: string; name: string }[];
  currentAuditStage: string;
  scopingQSTRNRData: {
    status: string | null;
    createDtTime: string;
    updateDtTime: string;
    questions: { userResponse: string }[];
  }[];
};

export default function useDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const axiosInstance = useAxios();
  const loginUser = useSelector((state: RootState) => state.login.user);
  const { currentPage } = useAppSelector((state: RootState) => state.projectManagement);
  const { handleComplianceChange, complianceType } = useAEPoc();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [gaps, setGaps] = useState<Gaps>({});
  const [submittedCount, setSubmittedCount] = useState(0);
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [started, setStarted] = useState("");
  const [ended, setEnded] = useState("");
  const [assesmentstarted, setAssesmentStarted] = useState("");
  const [assesmentEnded, setAssesmentEnded] = useState("");
  const [gapPhaseStarted, setGapPhaseStarted] = useState<string | null>(null);
  const [gapPhaseEnded, setGapPhaseEnded] = useState<string | null>(null);
  const [completedGaps, setCompletedGaps] = useState(0);
  const [totalGaps, setTotalGaps] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const resultAction = await dispatch(
          fetchProjectById({
            axiosInstance,
            userId: loginUser?.id as string,
            role: loginUser?.roles as string[],
            page: currentPage as number,
            limit: 5,
          })
        ).unwrap();

        const firstProject = resultAction?.projects?.[0];
        if (!firstProject?._id) return;

        const res = await fetchAllAudittask(axiosInstance, firstProject._id);

        const proj = res.projectDetails;
        const devs = res.devices;
        const gapsData = res.gaps;

        setProject(proj);
        setDevices(devs);
        setGaps(gapsData);
        setTotalAssessments(devs?.length || 0);
        setTotalGaps(gapsData?.totalNoOfGaps || 0);
        setCompletedGaps(gapsData?.data?.[0]?.completedGaps || 0);

        // Scoping dates
        const scopingData = proj.scopingQSTRNRData?.[0];
        setStarted(scopingData?.createDtTime || "");
        setEnded(scopingData?.updateDtTime || "");

        // Assessment dates
        const sortedCreate = [...devs].sort(
          (a, b) =>
            new Date(a.questionnaire?.createDtTime ?? "").getTime() -
            new Date(b.questionnaire?.createDtTime ?? "").getTime()
        );
        const sortedUpdate = [...devs].sort(
          (a, b) =>
            new Date(b.questionnaire?.updateDtTime ?? "").getTime() -
            new Date(a.questionnaire?.updateDtTime ?? "").getTime()
        );

        setAssesmentStarted(sortedCreate[0]?.questionnaire?.createDtTime || "");
        setAssesmentEnded(sortedUpdate[0]?.questionnaire?.updateDtTime || "");

        // Gap phase dates
        const filteredGaps = gapsData?.filteredGaps ?? [];
        const sortedGapsByCreate = [...filteredGaps].sort(
          (a, b) =>
            new Date(a.createDtTime).getTime() -
            new Date(b.createDtTime).getTime()
        );
        const sortedGapsByUpdate = [...filteredGaps].sort(
          (a, b) =>
            new Date(b.updateDtTime).getTime() -
            new Date(a.updateDtTime).getTime()
        );

        setGapPhaseStarted(sortedGapsByCreate[0]?.createDtTime || null);
        setGapPhaseEnded(sortedGapsByUpdate[0]?.updateDtTime || null);

        // Department stats
        const stats = computeDepartmentStats(devs);
        setDepartments(stats);
        setSubmittedCount(stats.filter((d) => d.pending === 0).length);

      } catch (error) {
        console.error("Dashboard data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const computeDepartmentStats = (devices: Device[]): DepartmentStats[] => {
    const map: Record<string, department> = {};

    devices.forEach((device) => {
      const dept = device.department || "Unknown";
      const questions = device.questionnaire?.questions || [];

      const total = questions.length;
      const submitted = questions.filter(
        (q) => q.userResponse !== "" && q.userResponse !== null
      ).length;

      if (!map[dept]) {
        map[dept] = {
          name: dept,
          submitted: 0,
          pending: 0,
          totalCompletion: 0,
          devicesCount: 0,
        };
      }

      map[dept].submitted += submitted;
      map[dept].pending += total - submitted;
      map[dept].totalCompletion += total ? (submitted / total) * 100 : 0;
      map[dept].devicesCount += 1;
    });

    return Object.values(map).map((dept) => {
      const avgCompletion = Math.round(dept.totalCompletion / dept.devicesCount);
      return {
        name: dept.name,
        submitted: dept.submitted,
        pending: dept.pending,
        completion: avgCompletion,
        color: avgCompletion < 50 ? "red" : "blue",
      };
    });
  };

  const getPercentage = (completed: number, total: number) =>
    total > 0 ? Math.round((completed / total) * 100) : 0;

  // Progress indicators
  const scopingQuestions = project?.scopingQSTRNRData?.[0]?.questions ?? [];
  const answeredScoping = scopingQuestions.filter(
    (q) => q.userResponse?.trim() !== ""
  ).length;

  const scopingProgress = getPercentage(answeredScoping, scopingQuestions.length);
  const assessmentProgress = getPercentage(submittedCount, totalAssessments);
  const gapProgress = getPercentage(completedGaps, totalGaps);
  const rocProgress = project?.status?.toLowerCase() === "completed" ? 100 : 0;
  const overallProgress = Math.round(
    (scopingProgress + assessmentProgress + gapProgress + rocProgress) / 4
  );

  const progressWidth = `${overallProgress}%`;

  const istTime = project?.createDtTime
    ? new Date(project.createDtTime).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    : "N/A";

  return {
    project,
    submittedCount,
    totalAssessments,
    complianceType,
    handleComplianceChange,
    istTime,
    progressWidth,
    loading,
    departments,
    totalGaps,
    completedGaps,
    started,
    ended,
    scopingProgress,
    assessmentProgress,
    gapProgress,
    rocProgress,
    assesmentEnded,
    assesmentstarted,
    gapPhaseEnded,
    gapPhaseStarted,
    gaps,
    devices
  };
}
