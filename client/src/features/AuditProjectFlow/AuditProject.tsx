import React from "react";
import useProjectView from "./hooks/useAuditProject";
import PhaseContainer from "./components/PhaseContainer";
import AuditProjectHeader from "./components/AuditProjectHeader";
import { Route, Routes } from "react-router-dom";
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
        <Route path="/gap-remediation" element={<GapManagementComponent />} />
      </Routes>
    </>
  );
};

export default AuditProject;
