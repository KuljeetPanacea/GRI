import { useDispatch, useSelector } from "react-redux";
import {
  setRequirementData,
  setStakeholderData,
  setDeviceData,
  setSelectedReq,
  setSelectedControl,
  setSidebarOpen,
  setDrawerOpen,
  setPhaseType,
  selectSortBy,
  selectRequirementData,
  selectStakeholderData,
  selectDeviceData,
  selectSelectedReq,
  selectSelectedControl,
  selectSidebarOpen,
  selectDrawerOpen,
  selectPhaseType,
  setSelectedOptions,
  setSelectedAssesmentId,
  resetControlFinding,
  setTableLoading,
  clearAllSubReqs,
  setSelectedSubReq,
} from "../../../../redux/assessmentSlice";
import { AppDispatch, RootState } from "../../../../redux/store";
import reqConfig from "./configFiles/reqConfig";
import { useCallback, useEffect, useState } from "react";
import useAxios from "../../../../api/useAxios";
import {
  fetchRocData,
} from "../../../../api/rocData";

export interface Control {
  title: string;
}

export interface SidebarItem {
  projectId: string;
  reqNo: string;
  subReqNo: string;
  controlNo: string;
  AEInternalAssessor: string;
  deviceType: string;
  deviceRef: string;
  qstnrID: string;
  qstnrName: string;
  qstnID: string;
  qstnDesc: string;
  response: string;
  evidences: string[];
  qstnFinding: string;
  controlFinding: string;
  deviceRefFinding?: string;
}

const useAssessment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const [header, setHeader] = useState<SidebarItem[]>([]);
  const [selectedAE, setSelectedAE] = useState<string>("");
  const sortBy = useSelector(selectSortBy);
  const requirementData = useSelector(selectRequirementData);
  const stakeholderData = useSelector(selectStakeholderData);
  const deviceData = useSelector(selectDeviceData);
  const selectedReq = useSelector(selectSelectedReq);
  const selectedControl = useSelector(selectSelectedControl);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const drawerOpen = useSelector(selectDrawerOpen);
  const phaseType = useSelector(selectPhaseType);

  const axiosInstance = useAxios();

  const handleSubReqToggle = (subReqId: string) => {
    // Clear all data when subrequirement changes
    dispatch(resetControlFinding());
    setHeader([]);
    dispatch(setSelectedSubReq(subReqId));
  };

  const fetchUniqueRocHeader = useCallback(
    async (subReq: string, controlTitle: string) => {
      try {
        dispatch(setTableLoading(true));
        const response = await fetchRocData(
          axiosInstance,
          selectedProject?._id || "",
          selectedReq,
          subReq,
          controlTitle
        );

        const res = response.data;
        if (res && res.length > 0) {
          setHeader(res);
          dispatch(setSelectedControl({ title: res[0].controlNo }));
          dispatch(setSelectedAssesmentId(res[0].assessmentId));
        }
      } catch (err) {
        console.error("Failed to get signed URL for viewing", err);
      } finally {
        dispatch(setTableLoading(false));
      }
    },
    [axiosInstance, selectedProject?._id, selectedReq, dispatch] // dependencies
  );

  useEffect(() => {
    if (
      sortBy === "Requirement" &&
      selectedProject?.currentAuditStage == "assessment"
    ) {
      let reqNumber = Number(selectedReq?.split("-")[1]);

      if (!reqNumber) {
        reqNumber = 1;
        dispatch(setSelectedReq("Req-1"));
      }

      const subReq = `Sub-req-${reqNumber}.1`;
      const controlTitle = `Control-${reqNumber}.1.1`;
      fetchUniqueRocHeader(subReq, controlTitle);
    }
  }, [sortBy, selectedReq]);

  const handleControlClick = (control: Control | string) => {
    const isStr = typeof control === "string";
    const title = isStr ? control : control.title;
    const subReq =
      "Sub-req-" +
      (title.split("-")[1]?.split(".").slice(0, -1).join(".") || "");
    if (typeof control != "string") {
      // Reset control finding when selecting a new control
      dispatch(resetControlFinding());
      dispatch(setSelectedControl(control));
      // Clear header immediately to prevent showing stale data
      setHeader([]);
      if (sortBy === "Requirement") {
        fetchUniqueRocHeader(subReq, control.title);
      }
    }
  };
  const handleOptionChange = (
    rowIndex: string,
    refIndex: string,
    newOption: string
  ) => {
    dispatch(
      setSelectedOptions({
        key: `${rowIndex}-${refIndex}`,
        value: newOption === "In Place",
      })
    );
  };

  const setAeStakeHolderlgapsdetails = (details: { title: string }) => {
    // Clear all data when requirement changes
    dispatch(clearAllSubReqs());
    dispatch(resetControlFinding());
    setHeader([]);
    setSelectedReq(details.title); // details.title should be the device ref string
  };

  const [topHeight, setTopHeight] = useState(60); // default percentage height
  let startY = 0;
  let startHeight = 0;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    startY = e.clientY;
    startHeight = topHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = startHeight + (deltaY / window.innerHeight) * 100;
      if (newHeight > 20 && newHeight < 80) {
        setTopHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return {
    setAeStakeHolderlgapsdetails,
    sortBy,
    requirementData,
    updateRequirementData: (data: string) => dispatch(setRequirementData(data)),
    stakeholderData,
    updateStakeholderData: (data: string) => dispatch(setStakeholderData(data)),
    deviceData,
    updateDeviceData: (data: string) => dispatch(setDeviceData(data)),
    selectedReq,
    setSelectedReq: (id: string) => {dispatch(setSelectedReq(id));
    },
    selectedControl,
    handleControlClick,
    sidebarOpen,
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    drawerOpen,
    setDrawerOpen: (open: boolean) => dispatch(setDrawerOpen(open)),
    reqConfig,
    phaseType,
    setPhaseType: (type: string) => dispatch(setPhaseType(type)),
    handleOptionChange,
    header,
    setHeader,
    dispatch,
    selectedAE,
    setSelectedAE,
    handleSubReqToggle,
    handleMouseDown,
    topHeight
  };
};

export default useAssessment;
