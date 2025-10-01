import { useEffect, useState } from "react";
import { fetchAEData, fetchAEDataControl, fetchAEDataSubControl } from "../../../../api/rocData";
import useAxios from "../../../../api/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { selectOpenSubReq, selectSelectedControl, selectSelectedReq, selectSortBy, setSelectedControl, setSelectedReq, toggleSubReq, resetControlFinding, setTableLoading } from "../../../../redux/assessmentSlice";
import { Control, SidebarItem } from "./useAssessmentView";
import { resetSelectedReqNo } from "../../../../redux/GapsRemediationSlice";

interface SubReq {
    title: string;
    controls: Control[];
  }

const useAEAssessor = () => {
  const [aeStakeHolder, setAeStakeHolderl] = useState<string[]>([]);
  const [aeIntial, setAeIntial] = useState<SidebarItem>();
  const [aeSidebar, seteSideBar] = useState<SubReq[]>([]);
  const selectedControl = useSelector(selectSelectedControl);
  const openSubReq = useSelector(selectOpenSubReq);
  const selectedProject = useSelector(
      (state: RootState) => state.projectView.selectedProject
    );
  const sortBy = useSelector(selectSortBy);
  const dispatch = useDispatch<AppDispatch>();
  const selectedReq = useSelector(selectSelectedReq);
  const axiosInstance = useAxios();

  useEffect(() => {
    if (sortBy === "AE Internal Assessors") {
      fetchUniqueAE();
    }
  }, [sortBy]);

  const [topHeight, setTopHeight] = useState(60); // default percentage height
  let startY = 0;
  let startHeight = 0;
  const {
      selectedControlNoGap,
      selectedAEInternalAssessorGap,
    } = useSelector((state: RootState) => state.gapsRemediation);

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

  const fetchcontrolAE = async (name: string) => {
    try {
      const response = await fetchAEDataControl(
        axiosInstance,
        selectedProject?._id || "",
        name
      );
      const res = response.data;
      if (res) {
        setAeIntial(res.flatData[0]);
        seteSideBar(res.groupedData);

        dispatch(setSelectedControl({ title: res.flatData[0].controlNo }));
      }
    } catch (err) {
      console.error("Failed to get signed URL for viewing", err);
    }
  };

const fetchUniqueAE = async () => {
    try {
      const response = await fetchAEData(
        axiosInstance,
        selectedProject?._id || ""
      );
      const res = response.data;
      if (res) {

        dispatch(
          setSelectedReq(
            selectedAEInternalAssessorGap || res.firstData.AEInternalAssessor
          )
        );
        fetchcontrolAE(
          selectedAEInternalAssessorGap || res.firstData.AEInternalAssessor
        );
        setAeIntial(res.firstData);
        setAeStakeHolderl(res.primaryAEStakeholder);
        dispatch(
          setSelectedControl({
            title: selectedControlNoGap || res.firstData.controlNo,
          })
        );
      }
    } catch (err) {
      console.error("Failed to get signed URL for viewing", err);
    }
  };

    useEffect(() => {
    return () => {
        dispatch(resetSelectedReqNo()); 
    };
    }, [dispatch]);

    const handleSubReqToggle = (subReqId: string) => {
        dispatch(toggleSubReq(subReqId));
      };

    const fetchSubcontrolAE = async (subReq: string, controlNo: string) => {
        try {
            dispatch(setTableLoading(true));
            const response = await fetchAEDataSubControl(
                axiosInstance,
                selectedProject?._id || "",
                selectedReq,
                subReq,
                controlNo
            );
            const res = response.data;
            if (res) {
                setAeIntial(res[0]);
            }
        } catch (err) {
            console.error("Failed to get signed URL for viewing", err);
        } finally {
            dispatch(setTableLoading(false));
        }
    };

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
            // Clear table data immediately to prevent showing stale data
            setAeIntial(undefined);
            fetchSubcontrolAE(subReq, control.title);
        }
    };

  return {
    selectedReq,
    selectedControl,
    setSelectedReq,
    openSubReq,
    handleSubReqToggle,
    handleControlClick,
    aeStakeHolder,
    aeIntial,
    setAeIntial,
    fetchcontrolAE,
    aeSidebar,
    dispatch,
    handleMouseDown,
    topHeight
  };
};

export default useAEAssessor;
