import React, { useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import SalesScopingView from "../phases/SalesScoping/SalesScopingView";
import AssessmentView from "../phases/Assessment/AssessmentView";
import GapAndRemediationView from "../phases/GapAndRemediation/GapAndRemediationView";
import { RootState } from "../../../redux/store";
import { setIsDetailsOpen } from "../../../redux/projectViewSlice";
import GapManagementComponent from "../phases/GapAndRemediation/components/GapManagementComponent";
import AssuranceReport from "../phases/AssuranceReport/AssuranceReport";
const usePhaseView = () => {
  
  const phaseComponents: Record<string, React.ComponentType> = {
    "preScoping": SalesScopingView,

    // "deviceIdentification": DeviceIdentificationView, // Commented out - will be replaced with questionnaire functionality
    "assessment": AssessmentView, // Updated to include question responses functionality
    "gapandRemediation": GapAndRemediationView,
    "assuranceReport": AssuranceReport,
    "GapManagementComponent": GapManagementComponent
  };

  const dispatch = useDispatch()
  const selectedPhase = useSelector((state: RootState) => state.phase.selectedPhase);
  const PhaseComponent = phaseComponents[selectedPhase ?? ""] || (() => React.createElement("div", null, "No phase selected"));
  useEffect(() => {
    if (
      ["preScoping", "scoping", "deviceIdentification"].includes(selectedPhase)
    ) {
      dispatch(setIsDetailsOpen(true));
    } else {
      dispatch(setIsDetailsOpen(false));
    }
  }, [selectedPhase, dispatch]);


  return { PhaseComponent};
};

export default usePhaseView;