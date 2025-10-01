import { useDispatch, useSelector } from "react-redux";
import { SelectedControlQuestions, selectedDeviceKey, selectedNewEvidences, selectedOldEvidences, selectExpandablePanelState, selectSelectedControl, setSelectedControlQuestions, setSelectedExpandableButton, toggleExpandablePanel } from "../../../../redux/assessmentSlice";
import { fetchControlQuestions, getIdentifiedGaps, saveIdentifiedGaps } from "../../../../api/rocData";
import useAxios from "../../../../api/useAxios";
import { RootState } from "../../../../redux/store";
import { useEffect, useState } from "react";
export interface AssessmentQuestion {
  projectId: string;
  controlNo: string;
  deviceRef: string;
  qstnID: string;
  qstnDesc: string;
  response: string;
  evidences: string[];
  evidenceReference?: 'document' | 'interview' | 'others';
}
 
export interface gapRow {
  gapDesc: string;
  oldEvidence: string[] | object[];
  evidences: string[] | object[];
  status: string;
}
 
const useExpandPanel = () => {
 
    const dispatch = useDispatch();
    const axiosInstance = useAxios();
    const { height, isExpanded, selectedButton } = useSelector(
      selectExpandablePanelState
    );
    const assessmentQuestions = useSelector(SelectedControlQuestions);
    const [gapRows, setGapRows] = useState<{ id: number; controlNumber: string; gapDescription: string;oldEvidence: string[] | object[]; evidence: string[] | object[];status: string }[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentRowId, setCurrentRowId] = useState<number | null>(null);
    const [gapText, setGapText] = useState("");
    const oldEvidenceOptions = useSelector(selectedOldEvidences);
    const newEvidenceOptions = useSelector(selectedNewEvidences);
    const deviceRefKey: string = useSelector(selectedDeviceKey);
    const axios = useAxios();
 
    const selectedControl = useSelector(selectSelectedControl);
    const selectedProject = useSelector(  
        (state: RootState) => state.projectView.selectedProject
        );
    const toggleHeight = () => {
      dispatch(toggleExpandablePanel());
    };
 
    const fetchControlFindingQuestions = async () => {
      if(selectedProject?._id && selectedControl?.title){
        try {
          const response = await fetchControlQuestions(
              axiosInstance,
              selectedControl?.title || "",
              selectedProject?._id || "",
              deviceRefKey.split("_")[1] || "",
          );
         
          const res = response.data;
          if (res) {
              dispatch(setSelectedControlQuestions(res))
          }
          } catch (err) {
          console.error( err);
          }
      }
       
    };
 
    const fetchAllGaps = async () => {
      if(deviceRefKey && selectedControl?.title){
        try {
          const response = await getIdentifiedGaps(
              axiosInstance,
              deviceRefKey.split("_")[1] || "",
              selectedControl?.title || "",
          );
         
          const res = response.data;
          if (res ) {
            const enrichedGaps = res.map((gap: gapRow) => ({
              ...gap,
              id: Date.now(),
              controlNumber: selectedControl.title,
              gapDescription: gap.gapDesc || "",
              oldEvidence: gap.oldEvidence || [],
              evidence: gap.evidences || [],
              status: gap.status || "",
            }));
            setGapRows(enrichedGaps);
          }
          } catch (err) {
          console.error( err);
          setGapRows([]);
          }
      }
    };
 
    const handleButtonSelect =  (buttonName: string) => {
      if(buttonName == "All assessment Questions"){
        fetchControlFindingQuestions()
      }
      if(buttonName == "Identified gaps")
      {
        fetchAllGaps()
      }
      dispatch(setSelectedExpandableButton(buttonName));
    };
 
   
 
    useEffect(()=>{
      dispatch(setSelectedControlQuestions([]))
      handleButtonSelect("")
      fetchAllGaps()
    },[selectedControl]);
 
 
   
  const handleAddDescription = (rowId: number) => {
   
    const selectedRow = gapRows.find(row => row.id === rowId);
    setGapText(selectedRow?.gapDescription || "");
    setCurrentRowId(rowId);
    setModalOpen(true);
  };
 
 
  useEffect(() => {
    setGapRows([]);
  },[selectedControl])
 
  const handleModalSave = () => {
    setGapRows(prev =>
      prev.map(row =>
        row.id === currentRowId ? { ...row, gapDescription: gapText } : row
      )
    );
    setModalOpen(false);
    setCurrentRowId(null);
    setGapText("");
  };
 
  const handleAddGap = () => {
    if(deviceRefKey!="")
    {
      const newGap = {
        id: Date.now(),
        controlNumber: selectedControl?.title || "",
        gapDescription: "",
        oldEvidence: [],
        evidence: [],
        status: "Yet to send",
      };
      setGapRows((prev) => [...prev, newGap]);
    }
   
  };
 
  const handleDeleteGap = (id: number) => {
    setGapRows((prev) => prev.filter((gap) => gap.id !== id));
  };
 
  const handleOnChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    rowId: number,
    field: "evidence" | "oldEvidence"
  ) => {
    const selectedNames = event.target.value as string[];
    // Get the evidence options based on the field
    const evidenceOptions = field === "evidence" ? newEvidenceOptions : oldEvidenceOptions;
    
    // Convert selected names back to full evidence objects and remove duplicates
    const selectedEvidenceObjects = selectedNames
    .map(name => {
      const evidenceObj = evidenceOptions.find(option => option.name === name);
      return evidenceObj ? JSON.stringify(evidenceObj) : null;
    })
    .filter(Boolean) // Remove null values
    .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
    
    setGapRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [field]: selectedEvidenceObjects } : row
  )
);
console.log("selectedNames-------------------->>>",gapRows)
  };
 
  const handleOnChangeStatus = (
    event: React.ChangeEvent<{ value: unknown }>,
    rowId: number
  ) => {
    const newValue = event.target.value as string;
 
    setGapRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              status: newValue,
            }
          : row
      )
    );
  };
 
  const handleSave = async () => {
    const hasInvalidRows = gapRows.some(
      (row) =>
        !row.gapDescription?.trim() || !Array.isArray(row.evidence) || row.evidence.length === 0
    );
 
    if (hasInvalidRows) {
      alert("Please fill in gap description and select at least one evidence for all entries.");
      return;
    }
 
    // Helper function to convert evidence data back to evidence objects
    const convertEvidenceData = (evidenceData: string[] | object[]): { name: string; type: string; url: string; questionId: string; qstnrId?: string; evidenceCategory?: 'document' | 'interview' | 'others'; refName?: string }[] => {
      return evidenceData.map(item => {
        // If item is already an object (from server), use it directly
        if (typeof item === 'object' && item !== null && 'name' in item) {
          const evidenceObj = item as { name: string; type: string; url: string; questionId: string; qstnrId?: string; evidenceCategory?: 'document' | 'interview' | 'others'; refName?: string , uploadedAt?: Date };
          return {
            name: evidenceObj.name,
            type: evidenceObj.type,
            url: evidenceObj.url,
            questionId: evidenceObj.questionId,
            qstnrId: evidenceObj.qstnrId,
            evidenceCategory: evidenceObj.evidenceCategory || 'document',
            refName: evidenceObj.refName || "",
            uploadedAt: evidenceObj.uploadedAt
          };
        }
        // If item is a string, try to parse as JSON
        if (typeof item === 'string') {
          try {
            const parsed = JSON.parse(item);
            return {
              name: parsed.name,
              type: parsed.type,
              url: parsed.url,
              questionId: parsed.questionId,
              qstnrId: parsed.qstnrId,
              evidenceCategory: parsed.evidenceCategory || 'document',
              refName: parsed.refName || "",
              uploadedAt: parsed.uploadedAt
              

            };
          } catch {
            // If parsing fails, return a default object
            return { name: item, type: '', url: '', questionId: '', evidenceCategory: 'document', refName: "" };
          }
        }
        // Fallback
        return { name: String(item), type: '', url: '', questionId: '', evidenceCategory: 'document', refName: "" };
      });
    };
 
    const data = {
      identifiedGaps: gapRows.map((row) => ({
        gapDesc: row.gapDescription,
        status: row.status,
        oldEvidence: convertEvidenceData(row.oldEvidence),
        evidences: convertEvidenceData(row.evidence),
      }))
    };
 
    try {
      await saveIdentifiedGaps(axios, deviceRefKey.split("_")[1], selectedControl?.title || "", data);
      alert("Gaps saved successfully.");
    } catch (err) {
      console.error("Failed to save identified gaps", err);
      alert("Error while saving gaps.");
    }
  };
 
   
    return {
        height,
        isExpanded,
        selectedButton,
        toggleHeight,
        handleButtonSelect,
        assessmentQuestions,
        modalOpen,
        oldEvidenceOptions,
        newEvidenceOptions,
        gapRows,
        setGapRows,
        gapText,
        setModalOpen,
        handleSave,
        handleOnChangeStatus
        ,handleOnChange,
        handleDeleteGap,
        handleAddGap,
        handleAddDescription,
        handleModalSave,
        setGapText
    }
}
 
export default useExpandPanel;