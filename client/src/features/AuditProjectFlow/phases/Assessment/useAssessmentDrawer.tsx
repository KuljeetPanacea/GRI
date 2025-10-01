import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  
  fetchControlAssessment,
  ModeEnumType,
  RocControlFindingDTO,
  submitControlAssessment,
} from "../../../../api/rocData";
import useAxios from "../../../../api/useAxios";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  setSelectedControlFinding,
  selectAssessmentId,
  selectControlFinding,
  selectSelectedControl,
  selectedDeviceKey,
  Evidence,
} from "../../../../redux/assessmentSlice";


const useAssessmentDrawer = () => {
  const axiosInstance = useAxios();
  const dispatch = useDispatch<AppDispatch>();
  const selectedControl = useSelector(selectSelectedControl);
  const findingData = useSelector(selectControlFinding);
  const assessmentId = useSelector(selectAssessmentId);
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [controlFinding, setControlFinding] = useState("");
  const [detailedFinding, setDetailedFinding] = useState("");
  const [validationCustomized, setValidationCustomized] = useState("no");
  const [customisedApproach, setCustomisedApproach] = useState("");
  const [validationCompensating, setvalidationCompensating] = useState("no");
  const [defineApproach, setDefineApproach] = useState("");
  const [assessmentMode, setAssessmentMode] = useState("");
  const [compensationText, setCompensationText] = useState("");
  const [evideceRef, setEvideceRef] = useState<Evidence[]>([]);
  const deviceRefKey = useSelector(selectedDeviceKey);
  
  // Track initial values for change detection
  const initialValuesRef = useRef({
    controlFinding: "",
    detailedFinding: "",
    validationCustomized: "no",
    validationCompensating: "no",
    assessmentMode: "",
    compensationText: "",
    evideceRef: [] as Evidence[]
  });

  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);
  
  // Track the current control to detect changes
  const [currentControlKey, setCurrentControlKey] = useState<string>("");

  // Clear drawer state function
  const clearDrawerState = useCallback(() => {
    setControlFinding("");
    setDetailedFinding("");
    setValidationCustomized("no");
    setvalidationCompensating("no");
    setAssessmentMode("");
    setCompensationText("");
    setEvideceRef([]);
    setHasChanges(false);
    
    // Reset initial values
    initialValuesRef.current = {
      controlFinding: "",
      detailedFinding: "",
      validationCustomized: "no",
      validationCompensating: "no",
      assessmentMode: "",
      compensationText: "",
      evideceRef: []
    };
  }, []);

  // Detect control changes and clear state
  useEffect(() => {
    const newControlKey = selectedControl?.title || "";
    
    // If control has changed, clear the drawer
    if (newControlKey !== currentControlKey) {
      console.log("Control changed from", currentControlKey, "to", newControlKey);
      clearDrawerState();
      setCurrentControlKey(newControlKey);
    }
    
    // If no control is selected, ensure drawer is cleared
    if (!newControlKey) {
      clearDrawerState();
      setCurrentControlKey("");
    }
  }, [selectedControl?.title, currentControlKey, clearDrawerState]);

  // Fetch control finding when control changes
  useEffect(() => {
    if (selectedControl?.title && assessmentId && selectedProject?._id) {
      fetchControlFinding();
    }
  }, [selectedControl?.title, assessmentId, selectedProject?._id]);

  const fetchControlFinding = useCallback(async () => {
    if (!selectedControl?.title || !assessmentId || !selectedProject?._id) {
      return;
    }

    try {
      const response = await fetchControlAssessment(
        axiosInstance,
        selectedControl.title,
        assessmentId,
        selectedProject._id
      );
      const res = response.data;

      if (!res.message) {
        dispatch(setSelectedControlFinding(res));
      } else {
        console.warn("Unexpected response format:", res);
      }
    } catch (err) {
      console.error("Failed to fetch control finding:", err);
    }
  }, [selectedControl?.title, assessmentId, selectedProject?._id, axiosInstance, dispatch]);

  // Load data into drawer when finding data is available
  useEffect(() => {
    if (findingData && selectedControl?.title && selectedProject?._id && 
        findingData.controlNo === selectedControl.title && 
        findingData.projectId === selectedProject._id) {
      console.log("Loading finding data for control:", selectedControl.title);
      
      setControlFinding(findingData.controlAssessmentFinding || "");
      setDetailedFinding(findingData.detailed_finding || "");
      
      // Map validation method checkboxes
      const customizedValue = findingData.customizedApproach ? "yes" : "no";
      const compensatingValue = findingData.compensatingControl ? "yes" : "no";
      
      console.log("Validation mapping:", {
        customizedApproach: findingData.customizedApproach,
        compensatingControl: findingData.compensatingControl,
        mappedCustomized: customizedValue,
        mappedCompensating: compensatingValue
      });
      
      setValidationCustomized(customizedValue);
      setvalidationCompensating(compensatingValue);
      
      setAssessmentMode(findingData.modeOfAssessment?.mode || "");
      setCompensationText(findingData.modeOfAssessment?.compensation || "");
      setEvideceRef(findingData.evidences || []);
      
      console.log("Evidences mapping:", findingData.evidences);
      
      // Update initial values after loading data
      initialValuesRef.current = {
        controlFinding: findingData.controlAssessmentFinding || "",
        detailedFinding: findingData.detailed_finding || "",
        validationCustomized: customizedValue,
        validationCompensating: compensatingValue,
        assessmentMode: findingData.modeOfAssessment?.mode || "",
        compensationText: findingData.modeOfAssessment?.compensation || "",
        evideceRef: findingData.evidences || []
      };
      setHasChanges(false);
    }
  }, [findingData, selectedControl?.title, selectedProject?._id]);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const options = [
    { label: "In\nPlace", value: "In Place", color: "green" },
    { label: "Not in\nPlace", value: "Not in Place", color: "red" },
    { label: "Not\nTested", value: "Not Tested", color: "orange" },
    { label: "Not\nApplicable", value: "Not Applicable", color: "black" },
  ];

  const modeOfAssessmentOptions = [
    { label: "Remote", value: "Remote", color: "red" },
    { label: "In\nPlace", value: "In Place", color: "green" },
    { label: "Hybrid", value: "hybrid", color: "orange" },
  ];

  // Check for changes whenever any value changes
  useEffect(() => {
    const currentValues = {
      controlFinding,
      detailedFinding,
      validationCustomized,
      validationCompensating,
      assessmentMode,
      compensationText,
      evideceRef
    };

    const hasUnsavedChanges = 
      currentValues.controlFinding !== initialValuesRef.current.controlFinding ||
      currentValues.detailedFinding !== initialValuesRef.current.detailedFinding ||
      currentValues.validationCustomized !== initialValuesRef.current.validationCustomized ||
      currentValues.validationCompensating !== initialValuesRef.current.validationCompensating ||
      currentValues.assessmentMode !== initialValuesRef.current.assessmentMode ||
      currentValues.compensationText !== initialValuesRef.current.compensationText ||
      JSON.stringify(currentValues.evideceRef) !== JSON.stringify(initialValuesRef.current.evideceRef);

    setHasChanges(hasUnsavedChanges);
  }, [controlFinding, detailedFinding, validationCustomized, validationCompensating, assessmentMode, compensationText, evideceRef]);

  const submitControlFinding = async () => {
    const data: RocControlFindingDTO = {
      projectId: selectedProject?._id || "",
      assessmentId,
      controlNo: selectedControl?.title || "",
      controlAssessmentFinding: controlFinding as
        | "In Place"
        | "Not in Place"
        | "Not Tested"
        | "Not Applicable",
      detailed_finding: detailedFinding,
      evidences: evideceRef,
      compensatingControl: validationCompensating === "yes",
      customizedApproach: validationCustomized === "yes",
      modeOfAssessment: {
        mode: assessmentMode as ModeEnumType,
        compensation: compensationText,
      },
    };

    try {
      const response = await submitControlAssessment(axiosInstance, data);
      const res = response.data;
      if (res) {
        dispatch(setSelectedControlFinding(res));
        // Update initial values after successful save
        initialValuesRef.current = {
          controlFinding,
          detailedFinding,
          validationCustomized,
          validationCompensating,
          assessmentMode,
          compensationText,
          evideceRef
        };
        setHasChanges(false);
        return { success: true, message: "Control assessment saved successfully!" };
      }
    } catch (err) {
      console.error("Failed to submit control finding", err);
      return { success: false, message: "Failed to save control assessment. Please try again." };
    }
  };

  return {
    expanded,
    handleChange,
    submitControlFinding,
    controlFinding,
    setControlFinding,
    detailedFinding,
    setDetailedFinding,
    validationCustomized,
    setValidationCustomized,
    customisedApproach,
    setCustomisedApproach,
    validationCompensating,
    setvalidationCompensating,
    defineApproach,
    setDefineApproach,
    assessmentMode,
    setAssessmentMode,
    compensationText,
    setCompensationText,
    options,
    modeOfAssessmentOptions,
    fetchControlFinding,
    selectedControl,
    deviceRefKey,
    evideceRef,
    setEvideceRef,
    hasChanges,
  };
};

export default useAssessmentDrawer;
