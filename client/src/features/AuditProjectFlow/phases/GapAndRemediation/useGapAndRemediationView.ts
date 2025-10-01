import { useEffect, useState } from 'react';
import { SelectChangeEvent } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { GapsRemediation, setActiveFilterRedux, setSelectedReqNo, setsetAEInternalAssesorGap } from '../../../../redux/GapsRemediationSlice';
import { AppDispatch, RootState } from '../../../../redux/store';
import usePhaseBreadcrumbs from '../../hooks/useAuditProjectPhases';
import {

  setSelectedControlNoGap,
  setSelectedReqNoGap,
  setSelectedSubReqNoGap,
  resetSelectedReqNoGap,
} from "../../../../redux/GapsRemediationSlice";
import { useNavigate } from 'react-router-dom';
import useAxios from '../../../../api/useAxios';
import { getSignedUrlAssessment } from '../../../../api/project';
import { Evidence } from '../../../../redux/assessmentSlice';
interface HoverData {
  color: string | undefined;
  percentage: number;
  x: number;
  y: number;
}
export interface GapRemediationDropdown {
  title: string;
  options: string[];
}

export interface GapCardProps {
  title: string;
  description?: string;
  totalGaps: number;
  completedGaps: number;
  onClick: () => void;
}

export type IdentifiedGap = {
  _id: string;
  gapDesc: string;
  status: string;
  evidences: Evidence[];
  oldEvidence: Evidence[];
  resolutionComment?: string;
  // add other properties if needed
};

type StakeholderGap = {
  totalGaps: number;
  completedGaps: number;
  AEInternalAssessor: string;
};

type DeviceType = { _id: string; name: string };

type DeviceGap = {
  deviceType?: string;
  deviceRef?: string;
  totalGaps: number;
  completedGaps: number;
};
export const useGapAndRemediationView = () => {
  const axiosInstance = useAxios();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [alldeviceGaps, setAlldeviceGaps] = useState<DeviceGap[]>([]);
  const [allStakeholderGaps, setAllStakeholderGaps] = useState<StakeholderGap[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [assessorFilter, setAssessorFilter] = useState("All Assessors");
  const [requirementFilter, setRequirementFilter] = useState("Req 1");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [hoverData, setHoverData] = useState<HoverData | null>(null);
  const { totalNoOfGaps, PendingClient, PendingQsa, selectedReqNo,gapRemediationDropdown, gapRemediationData, ActiveFilter ,requirementsData} =
      useSelector((state: RootState) => state.gapsRemediation);
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
console.log("gapRemediationData", gapRemediationData);
  const { handlePhaseClick } = usePhaseBreadcrumbs();
  const [activeFilter, setActiveFilter] = useState<{
  type: "tab" | "device" | null;
  value: string;
}>({ type: "tab", value: ActiveFilter.value ?? "Requirement" });

useEffect(() => {
  dispatch(setActiveFilterRedux(activeFilter));

}, [activeFilter]);


const setDropdownFilter = async (value: string) => {
    await dispatch(setSelectedReqNo(value));
    setRequirementFilter(value);
  };
const handleTabClick = (tabName: string) => {
  setActiveFilter({ type: "tab", value: tabName });
};

const handleDeviceChange = (event: SelectChangeEvent<string>) => {
  setActiveFilter({ type: "device", value: event.target.value });
};

const handleEvidenceClick = async (evidenceUrl: string) => {
    try {
      const response = await getSignedUrlAssessment(axiosInstance, evidenceUrl);
      const signedUrl = response.data;
      window.open(signedUrl, "_blank"); // Open in new tab
    } catch (error) {
      console.error("Error fetching signed URL:", error);
    }
  };
const handleMouseLeave = () => {
    setHoverData(null);
  };

const handleMouseEnter = (
    percentage: number,
    color: string,
    event: React.MouseEvent<SVGCircleElement, MouseEvent>
  ) => {
    const { clientX, clientY } = event;
    setHoverData({ percentage, x: clientX, y: clientY, color });
  };
const handleResolveClick = (
  reqNo: string,
  controlNo: string,
  subReqNo: string,
  AEInternalAssesor: string
) => {
  console.log(reqNo, controlNo, subReqNo);
  // Dispatch values to Redux
  dispatch(setSelectedReqNoGap(reqNo));
  dispatch(setSelectedControlNoGap(controlNo));
  dispatch(setSelectedSubReqNoGap(subReqNo));
  dispatch(setsetAEInternalAssesorGap(AEInternalAssesor));

  handlePhaseClick("assessment");
  resetSelectedReqNoGap();
};
const handleRowClick = (index: number) => {
    setSelectedRow(selectedRow === index ? null : index);
  };

 
const filteredData = gapRemediationData?.filter((gap) => {
const matchesSearch =
    (gap.id?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
    (gap.controlNo?.toLowerCase() ?? "").includes(searchTerm.toLowerCase());
 const normalizedStatusFilter = statusFilter.trim().toLowerCase();
const matchesStatus =
  normalizedStatusFilter === "all status" ||
  ((gap.identifiedGaps[0] as unknown) as GapsRemediation).status?.toLowerCase() === normalizedStatusFilter;

const normalizedAssessorFilter = assessorFilter.trim().toLowerCase();
const matchesAssessor =
  normalizedAssessorFilter === "all assessors" ||
  (gap.AEInternalAssessor?.toLowerCase() ?? "").includes(normalizedAssessorFilter);

  return matchesSearch && matchesStatus && matchesAssessor;
});

  let globalGapCounter = 1;
  const flattenedGaps = filteredData.flatMap((item) =>
    Array.isArray(item.identifiedGaps) && item.identifiedGaps.length > 0
      ? (item.identifiedGaps as unknown as IdentifiedGap[]).map((gap) => {
          const previousEvidences = gap.oldEvidence;
          const latestEvidences = gap.evidences || [];

          return {
            id: `GAP-${String(globalGapCounter++).padStart(3, "0")}`,
            description: gap?.gapDesc || "No description available",
            controlReference: item.controlNo || "N/A",
            AEInternalAssessor: item.AEInternalAssessor || "N/A",
            Status: gap.status,
            previousEvidence: previousEvidences,
            previousDate: "",
            latestEvidence: latestEvidences,
            latestDate: "",
            resolutionComment:gap.resolutionComment || "",
            resolutionDate: "",
            originalId: gap._id,
            ReqNo: item.reqNo,
            subReqNo: item.subReqNo,
          };
        })
      : [
          {
            id: `GAP-${String(globalGapCounter++).padStart(3, "0")}`,
            description: "No gaps identified",
            controlReference: item.controlNo || "N/A",
            AEInternalAssessor: item.AEInternalAssessor || "N/A",
            Status: item.status,
            previousEvidence: [],
            previousDate: "",
            latestEvidence: [],
            latestDate: "",
            resolutionComment: "",
            resolutionDate: "",
            originalId: item.id,
            ReqNo: item.reqNo,
            subReqNo: item.subReqNo,
          },
        ]
  );
 const statusData = [
    { label: "Total gaps", count: totalNoOfGaps, color: "#1E88E5", type: "total" },
    { label: "Pending client", count: PendingClient, color: "#EC8526", type: "completed" },
    { label: "Pending Auditor", count: PendingQsa, color: "#DD524C", type: "pending" },
  ];
  return {handleDeviceChange,activeFilter, hoverData, handleMouseLeave, handleMouseEnter, handleTabClick,searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    assessorFilter,
    setAssessorFilter,
    requirementFilter,
    setRequirementFilter,
    selectedRow,
    setSelectedRow, 
    totalNoOfGaps,
    selectedReqNo,
    gapRemediationData,
    ActiveFilter,
    selectedProject,
    handlePhaseClick,
    handleResolveClick  ,
    handleRowClick,
    filteredData,
    deviceTypes,
    setDeviceTypes,
    alldeviceGaps,
    setAlldeviceGaps,
    allStakeholderGaps,
    setAllStakeholderGaps,
    requirementsData,
    axiosInstance,dispatch,navigate,
      gapRemediationDropdown,
      setSelectedReqNoGap,
      PendingClient,
      PendingQsa,
      setDropdownFilter,
      handleEvidenceClick,
flattenedGaps,
statusData  
  };
};

