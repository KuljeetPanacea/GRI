import { useEffect, useState } from "react";
import { fetchDeviceControlData, fetchDeviceHeaderApi, fetchDeviceSideBarData } from "../../../../api/rocData";
import useAxios from "../../../../api/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { selectOpenSubReq, selectPhaseType, selectSelectedControl, selectSelectedReq, selectSortBy, setPhaseType, setSelectedControl, setSelectedReq, toggleSubReq, resetControlFinding, setTableLoading, clearAllSubReqs } from "../../../../redux/assessmentSlice";
import { Control, SidebarItem } from "./useAssessmentView";
import { SelectChangeEvent } from "@mui/material";

interface DeviceCategory {
  category: string;
  deviceRef: string[];
}

interface DeviceSideBar {
    subReq: string;
    controls: string[];
  }

const useDevice = () => {
  const [deviceDropDown, setDeviceDropDown] = useState<DeviceCategory[]>([]);
  const [deviceSideBar, setDeviceSideBar] = useState<DeviceSideBar[]>([]);
  const selectedControl = useSelector(selectSelectedControl);
  const phaseType = useSelector(selectPhaseType);
  const openSubReq = useSelector(selectOpenSubReq);
  const selectedProject = useSelector(
      (state: RootState) => state.projectView.selectedProject
    );
  const sortBy = useSelector(selectSortBy);
  const dispatch = useDispatch<AppDispatch>();
  const [aeIntial, setAeIntial] = useState<SidebarItem>();
  const selectedReq = useSelector(selectSelectedReq);
  const axiosInstance = useAxios();

  const { selectedReqNo } = useSelector((state: RootState) => state.gapsRemediation);
  // Resizable Code
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

  const handleChange =
    (event: SelectChangeEvent<string>) => {
      
      const f1 = deviceDropDown.find(
        (item) => item.category === event.target.value
      );
      dispatch(setPhaseType(event.target.value));
      // Clear all data when device changes
      dispatch(clearAllSubReqs());
      dispatch(resetControlFinding());
      dispatch(setSelectedControl(null));
      setAeIntial(undefined);
      if (f1?.deviceRef[0]) {
        dispatch(setSelectedReq(f1?.deviceRef[0]));
        
      }
    };
    useEffect(() => {
    if (selectedReqNo) {
        const foundCategory = deviceDropDown.find(dev =>
        dev.deviceRef.includes(selectedReqNo)
        )?.category;

        if (foundCategory) {
        dispatch(setPhaseType(foundCategory));           
        dispatch(setSelectedReq(selectedReqNo));        
        }
    }
    }, [selectedReqNo, deviceDropDown]);

  useEffect(() => {
        fetchDeviceHeader();
    }, [sortBy]);
  
    useEffect(() => {
        fetchDeviceSideBar(selectedReq);
    }, [selectedReq, phaseType]);

    
  const fetchDeviceHeader = async () => {
    try {
      const response = await fetchDeviceHeaderApi(
        axiosInstance,
        selectedProject?._id || ""
      );
      const res = response.data;
      if (res) {
        console.log("res.defaultControl", res);
        dispatch(setPhaseType(res.defaultControl.deviceType));
        setAeIntial(res.defaultControl);
        setDeviceDropDown(res.deviceInfo);
        dispatch(setSelectedControl({ title: res.defaultControl.controlNo }));
        dispatch(setSelectedReq(res.defaultControl.deviceRef));
      }
    } catch (err) {
      console.error("Failed to get signed URL for viewing", err);
    }
  };

   const fetchDeviceSideBar = async (ref: string) => {
    console.log("check value ref", ref);
      try {
        const response = await fetchDeviceSideBarData(
          axiosInstance,
          selectedProject?._id || "",
          phaseType,
          ref
        );
        const res = response.data;
        if (res) {
          setDeviceSideBar(res.groupedControls);
          dispatch(setSelectedControl({ title: res.firstControlDoc.controlNo }));
          setAeIntial(res.firstControlDoc);
        }
      } catch (err) {
        console.error("Failed to get signed URL for viewing", err);
      }
    };

    const handleSubReqToggle = (subReqId: string) => {
        dispatch(toggleSubReq(subReqId));
      };

    const fetchDeviceControl = async (subReq:string,control:string) => {
        try {
            dispatch(setTableLoading(true));
            const response = await fetchDeviceControlData(
            axiosInstance,
            selectedProject?._id || "",
            phaseType,
            selectedReq,
            subReq,
            control
            );
            const res = response.data;
            if (res) {
            
            dispatch(setSelectedControl({"title":res[0].controlNo}))
            setAeIntial(res)
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
        }
        if (typeof control === "string") {
            if (sortBy === "Device") {
                // Reset control finding when selecting a new control
                dispatch(resetControlFinding());
                // Clear table data immediately to prevent showing stale data
                setAeIntial(undefined);
                fetchDeviceControl(subReq, control);
            }
        }
    };

  return {
    fetchDeviceHeader,
    fetchDeviceSideBar,
    deviceDropDown,
    deviceSideBar,
    aeIntial,
    setAeIntial,
    selectedReq,
    selectedControl,
    setSelectedReq,
    openSubReq,
    handleSubReqToggle,
    handleControlClick,
    phaseType,
    setPhaseType,
    dispatch,
    handleChange,
    handleMouseDown,
    topHeight
  };
};

export default useDevice;
