import React from "react";
import useProjectView from "./hooks/useAuditProject";
import PhaseContainer from "./components/PhaseContainer";
import AuditProjectHeader from "./components/AuditProjectHeader";
import AEInternalAssessorsList from "./components/AEInternalAssessorsList";
import { Route, Routes } from "react-router-dom";
import AssessmentEvidenceTracker from "./phases/Assessment/components/AssessmentEvidenceTracker";
import GapManagementComponent from "./phases/GapAndRemediation/components/GapManagementComponent";

const AuditProject: React.FC = () => {
  const { project } = useProjectView();
  if (!project) {
    return <div>No project selected</div>;
  }

  return (
    <>
      <AuditProjectHeader />
      <Routes>
        <Route index element={<PhaseContainer />} />
        <Route path="aelist" element={<AEInternalAssessorsList />} />
        <Route
          path="/AssessmentEvidencetracker"
          element={<AssessmentEvidenceTracker />}
        />
        <Route path="/gap-remediation" element={<GapManagementComponent />} />
      </Routes>
    </>
  );
};

export default AuditProject;
