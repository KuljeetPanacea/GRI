import {
  Box,
  Typography,
  Switch,
  Button,
  FormControlLabel,
  Paper,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import { CheckBox, Image, AutoFixHigh, ExpandMore } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BranchingSection from "./BranchingSection";
import useBuildQstnr from "../useBuildQstnr";
import SelectDropdown from "../../../../common/ui/SelectDropdown";
import reqConfig from "../../../AuditProjectFlow/phases/Assessment/configFiles/reqConfig";
import { useDispatch } from "react-redux";
import {
  setReq,
  setSubReq,
  setSubControl,
  updateQuestion,
  clearRequirements,
  clearRequirementsOnly,
  setDisableReq,
  setEvidenceReference,
  setTestingProcedure
} from "../../../../redux/qstnrQuestion";
import store, { RootState, useAppSelector } from "../../../../redux/store";
import React from "react";

const QuestionSettings = () => {
  const {
    selectedQuestion,
    handleAlwaysGoToChange,
    questionList,
    multipleSelection,
    isLogicOpen,
    setIsLogicOpen,
    handleMultipleSelectionChange,
  } = useBuildQstnr();
  
  const dispatch = useDispatch();
  const { phase } = useAppSelector((state: RootState) => state.defineQstnr);
  const { selectedReq, selectedSubReq, selectedSubControl, selectedEvidenceReference, selectedTestingProcedure, type: questionType } = useAppSelector((state: RootState) => state.qstnrQuestion);
  
  // Using Redux state values instead of local state
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [selectedSubRequirement, setSelectedSubRequirement] = useState("");
  const [selectedControl, setSelectedControl] = useState("");
  const [selectedSectionRef, setSelectedSectionRef] = useState<string>("");
  const [selectedTestingProc, setSelectedTestingProc] = useState<string>("");
  
  const [availableSubRequirements, setAvailableSubRequirements] = useState<{ id: number; title: string; controls: { title: string }[] }[]>([]);
  const [availableControls, setAvailableControls] = useState<{ title: string }[]>([]);
  const [availableTestingProcedures, setAvailableTestingProcedures] = useState<string[]>([]);
  const [availableEvidenceReferences, setAvailableEvidenceReferences] = useState<string[]>([]);
  
  // Initialize and clear values
  useEffect(() => {
    dispatch(setDisableReq(false));
    // Clear all requirements on component mount
    setSelectedRequirement("");
    setSelectedSubRequirement("");
    setSelectedControl("");
    setSelectedSectionRef("");
    setSelectedTestingProc("");
    dispatch(clearRequirements());
  }, []);
  
  // Sync between selected question and Redux state
  useEffect(() => {
    if (selectedQuestion) {
      const reqValue = selectedQuestion.requirements || "";
      const subReqValue = selectedQuestion.subRequirements || "";
      const controlValue = selectedQuestion.subControl || "";
      const sectionRefValue = selectedQuestion.evidenceReference || "";
      const testingProcValue = selectedQuestion.testingProcedure || "";
      
      // Update local state
      setSelectedRequirement(reqValue);
      setSelectedSubRequirement(subReqValue);
      setSelectedControl(controlValue);
      setSelectedSectionRef(sectionRefValue);
      setSelectedTestingProc(testingProcValue);
      
      // Update Redux state
      dispatch(setReq(reqValue));
      dispatch(setSubReq(subReqValue));
      dispatch(setSubControl(controlValue));
      if (sectionRefValue) {
        dispatch(setEvidenceReference(sectionRefValue));
      }
      if (testingProcValue) {
        dispatch(setTestingProcedure(testingProcValue));
      }
    } else {
      // Clear values when no question is selected, but preserve section reference for file upload questions
      setSelectedRequirement("");
      setSelectedSubRequirement("");
      setSelectedControl("");
      setSelectedSectionRef("");
      setSelectedTestingProc("");
      // Only clear requirements, not section reference
      dispatch(clearRequirementsOnly());
    }
  }, [selectedQuestion, dispatch]);
  
  // Sync from Redux to local state
  useEffect(() => {
    setSelectedRequirement(selectedReq || "");
    setSelectedSubRequirement(selectedSubReq || "");
    setSelectedControl(selectedSubControl || "");
    setSelectedSectionRef(selectedEvidenceReference || "");
    setSelectedTestingProc(selectedTestingProcedure || "");
  }, [selectedReq, selectedSubReq, selectedSubControl, selectedEvidenceReference, selectedTestingProcedure]);
  
  // Update available sub-requirements when requirement changes
  useEffect(() => {
    if (selectedRequirement) {
      const requirement = reqConfig.find(
        (req) => req.reqName === selectedRequirement
      );
      if (requirement) {
        setAvailableSubRequirements(requirement.subReq);
        if (
          !requirement.subReq.some(
            (sub) => sub.title === selectedSubRequirement
          )
        ) {
          setSelectedSubRequirement("");
          setSelectedControl("");
          setSelectedTestingProc("");
          setSelectedSectionRef("");
          dispatch(setSubReq(""));
          dispatch(setSubControl(""));
          dispatch(setTestingProcedure(""));
          dispatch(setEvidenceReference(""));
          setAvailableControls([]);
          setAvailableTestingProcedures([]);
          setAvailableEvidenceReferences([]);
        } else {
          const subReq = requirement.subReq.find(
            (sub) => sub.title === selectedSubRequirement
          );
          if (subReq) {
            setAvailableControls(subReq.controls);
          }
        }
      }
    } else {
      setAvailableSubRequirements([]);
      setSelectedSubRequirement("");
      setSelectedControl("");
      setSelectedTestingProc("");
      setSelectedSectionRef("");
      dispatch(setSubReq(""));
      dispatch(setSubControl(""));
      dispatch(setTestingProcedure(""));
      dispatch(setEvidenceReference(""));
      setAvailableControls([]);
      setAvailableTestingProcedures([]);
      setAvailableEvidenceReferences([]);
    }
  }, [selectedRequirement, selectedSubRequirement, dispatch]);
  
  // Update available controls when sub-requirement changes
  useEffect(() => {
    if (selectedRequirement && selectedSubRequirement) {
      const requirement = reqConfig.find(
        (req) => req.reqName === selectedRequirement
      );
      if (requirement) {
        const subReq = requirement.subReq.find(
          (sub) => sub.title === selectedSubRequirement
        );
        if (subReq) {
          setAvailableControls(subReq.controls);
          if (
            !subReq.controls.some(
              (control) => control.title === selectedControl
            )
          ) {
            setSelectedControl("");
            setSelectedTestingProc("");
            setSelectedSectionRef("");
            dispatch(setSubControl(""));
            dispatch(setTestingProcedure(""));
            dispatch(setEvidenceReference(""));
            setAvailableTestingProcedures([]);
            setAvailableEvidenceReferences([]);
          }
        }
      }
    } else {
      setAvailableControls([]);
      setSelectedControl("");
      setSelectedTestingProc("");
      setSelectedSectionRef("");
      dispatch(setSubControl(""));
      dispatch(setTestingProcedure(""));
      dispatch(setEvidenceReference(""));
      setAvailableTestingProcedures([]);
      setAvailableEvidenceReferences([]);
    }
  }, [selectedRequirement, selectedSubRequirement, selectedControl, dispatch]);
  
  // Update available testing procedures and evidence references when control changes
  useEffect(() => {
    if (selectedRequirement && selectedSubRequirement && selectedControl) {
      const requirement = reqConfig.find(
        (req) => req.reqName === selectedRequirement
      );
      if (requirement) {
        const subReq = requirement.subReq.find(
          (sub) => sub.title === selectedSubRequirement
        );
        if (subReq) {
          const control = subReq.controls.find(
            (ctrl) => ctrl.title === selectedControl
          );
          if (control) {
            // Set testing procedures
            if ('testingProcedure' in control && control.testingProcedure) {
              setAvailableTestingProcedures(control.testingProcedure);
            } else {
              setAvailableTestingProcedures([]);
            }
            
            // Set evidence references - clean up the values by removing commas and extra spaces
            if ('evidenceReference' in control && control.evidenceReference) {
              const cleanedEvidenceRefs = control.evidenceReference
                .map(ref => ref.replace(/,$/, '').trim()) // Remove trailing commas and trim spaces
                .filter(ref => ref.length > 0); // Remove empty strings
              setAvailableEvidenceReferences(cleanedEvidenceRefs);
            } else {
              setAvailableEvidenceReferences([]);
            }
          }
        }
      }
    } else {
      setAvailableTestingProcedures([]);
      setAvailableEvidenceReferences([]);
    }
  }, [selectedRequirement, selectedSubRequirement, selectedControl]);
  
  const handleRequirementChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value;
    setSelectedRequirement(value);
    dispatch(setReq(value));
    if (selectedQuestion && selectedQuestion._id) {
      dispatch(
        updateQuestion({
          _id: selectedQuestion._id,
          selectedReq: value,
        })
      );
    }
  };
  
  const handleSubRequirementChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value;
    setSelectedSubRequirement(value);
    dispatch(setSubReq(value));
    if (selectedQuestion && selectedQuestion._id) {
      dispatch(
        updateQuestion({
          _id: selectedQuestion._id,
          selectedSubReq: value,
        })
      );
    }
  };
  
  const handleControlChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value;
    setSelectedControl(value);
    dispatch(setSubControl(value));
    if (selectedQuestion && selectedQuestion._id) {
      dispatch(
        updateQuestion({
          _id: selectedQuestion._id,
          selectedSubControl: value,
        })
      );
    }
  };
  
  const handleTestingProcedureChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value;
    setSelectedTestingProc(value);
    dispatch(setTestingProcedure(value));
    if (selectedQuestion && selectedQuestion._id) {
      dispatch(
        updateQuestion({
          _id: selectedQuestion._id,
          testingProcedure: value,
        })
      );
    }
  };
  
  const handleEvidenceReferenceChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value;
    setSelectedSectionRef(value);
    dispatch(setEvidenceReference(value));
    if (selectedQuestion && selectedQuestion._id) {
      dispatch(
        updateQuestion({
          _id: selectedQuestion._id,
          evidenceReference: value,
        })
      );
    }
  };
  
  return (
    <>
      <Paper
        sx={{
          p: 3,
          maxWidth: 350,
          height: "100vh",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
          >
            <CheckBox fontSize="small" />
            Question Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Button
            startIcon={<Image />}
            sx={{
              color: "#DB1F42",
              textTransform: "none",
              fontSize: "12px",
              mb: 2,
            }}
          >
            + Add an Image or Video
          </Button>
          {(phase === "Assessment") && 
          <React.Fragment>
            <Divider sx={{ mb: 2 }} />
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
          >
            PCI DSS Requirements<span style={{ color: "#DB1F42" }}>*</span>
          </Typography>
          <FormControl fullWidth sx={{ mb: 0.5 }}>
            <SelectDropdown
              title="Requirement"
              placeholder="Select Requirement"
              disabled={!selectedQuestion && !(store.getState().qstnrQuestion.disableReq)}
              value={selectedRequirement}
              onChange={handleRequirementChange}
              options={reqConfig.map((req) => ({
                label: req.reqName,
                value: req.reqName,
              }))}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 0.5 }}>
            <SelectDropdown
              title="Sub-Requirement"
              placeholder="Select Sub-Requirement"
              disabled={!selectedRequirement}
              value={selectedSubRequirement}
              onChange={handleSubRequirementChange}
              options={availableSubRequirements.map((subReq) => ({
                label: subReq.title,
                value: subReq.title,
              }))}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 0.5 }}>
            <SelectDropdown
              title="Control"
              placeholder="Select Control"
              disabled={!selectedSubRequirement}
              value={selectedControl}
              onChange={handleControlChange}
              options={availableControls.map((control) => ({
                label: control.title,
                value: control.title,
              }))}
            />
          </FormControl>
          {(selectedQuestion && selectedQuestion.type === "file_type") || 
           (questionType === "file_type" && !selectedQuestion) ? (
            <>
              <FormControl fullWidth sx={{ mb: 0.5 }}>
                <SelectDropdown
                  title="Testing Procedure"
                  placeholder="Select Testing Procedure"
                  disabled={!selectedControl}
                  value={selectedTestingProc}
                  onChange={handleTestingProcedureChange}
                  options={availableTestingProcedures.map((proc) => ({
                    label: proc,
                    value: proc,
                  }))}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <SelectDropdown
                  title="Evidence Reference"
                  placeholder="Select Evidence Reference"
                  disabled={!selectedControl}
                  value={selectedSectionRef}
                  onChange={handleEvidenceReferenceChange}
                  options={availableEvidenceReferences.map((ref) => ({
                    label: ref,
                    value: ref,
                  }))}
                />
              </FormControl>
            </>
          ) : null}
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={multipleSelection}
                onChange={handleMultipleSelectionChange}
                color="primary"
              />
            }
            label="Allow Multiple Selection"
            labelPlacement="start"
            sx={{ width: "100%", justifyContent: "space-between", ml: 0 }}
          />
        </React.Fragment>
      }
      </Box>
        <Divider sx={{ mb: 2 }} />
        <Box>
          <Typography
            variant="h3"
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
          >
            <AutoFixHigh fontSize="small" />
            Logic
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {selectedQuestion && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {!["single_choice", "multiple_choice"].includes(
                  selectedQuestion.type
                ) && (
                  <Select
                    onChange={(event) => handleAlwaysGoToChange(event)}
                    displayEmpty
                    IconComponent={ExpandMore}
                    sx={{ borderRadius: "50px", height: "40px", flex: 1 }}
                    value={selectedQuestion?.alwaysGoTo || ""}
                  >
                    <MenuItem value="" disabled>
                      Always go to
                    </MenuItem>
                    {questionList.map((question) => (
                      <MenuItem key={question._id} value={question._id}>
                        {question.text}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Box>
              {["single_choice", "multiple_choice"].includes(
                selectedQuestion.type
              ) && (
                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={() => setIsLogicOpen(true)}
                  sx={{
                    color: "#DB1F42",
                    textTransform: "none",
                    fontSize: "12px",
                    mt: 2,
                  }}
                >
                  View Rules
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Paper>
      <BranchingSection
        isOpen={isLogicOpen}
        onClose={() => setIsLogicOpen(false)}
      />
    </>
  );
};

export default QuestionSettings;