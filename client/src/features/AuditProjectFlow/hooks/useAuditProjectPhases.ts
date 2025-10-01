import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedPhase,
  selectSelectedPhase,
} from "../../../redux/phaseSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
const phases = [
  {
    id: 1,
    phaseName: "preScoping",
    title: "Pre Scoping",
  },
  { id: 2, phaseName: "assessment", title: "Assessment"},
  {
    id: 3,
    phaseName: "gapandRemediation",
    title: "Gap & Remediation",
  },
   {
    id: 4,
    phaseName: "assuranceReport",
    title: "Assurance Report",
  },
  {
    id: 5,
    phaseName: "complianceReport",
    title: "Compliance Report",
  },
];


const usePhaseBreadcrumbs = () => {
  const currentAuditStage = useSelector(
    (state: RootState) => state.projectView.selectedProject?.currentAuditStage
  );
  const selectedPhase = useSelector(selectSelectedPhase);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentPhaseId = phases.find((p) => p.phaseName === currentAuditStage)?.id ?? -1;

  const getStatusColor = (phase: { id: number; phaseName: string }) => {
    if (phase.phaseName === selectedPhase) return "boldRed";
    if (phase.phaseName === currentAuditStage) return "yellow";
    if (phase.id < currentPhaseId) return "green";
    return "grey";
  };

  const handlePhaseClick = (phaseName: string) => {
    dispatch(setSelectedPhase(phaseName));
    navigate("/landing/ProjectView");
  };

  return {
    phases,
    selectedPhase,
    currentAuditStage,
    getStatusColor,
    handlePhaseClick,
  };
};


export default usePhaseBreadcrumbs;
