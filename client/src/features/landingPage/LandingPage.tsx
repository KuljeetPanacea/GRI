import React from "react";
import { Routes, Route } from "react-router-dom";
import styles from "./styles/LandingPage.module.css";
import LPHeader from "./LPHeader";
import LPSideMenuBar from "./LPSideMenuBar";
import LPMainAreaContainer from "./LPMainAreaContainer";
import UserManagement from "../userManagement/UserManagement";
import ClientManagement from "../clientManagement/ClientManagement";
import QstnrAdmin from "../QuestionnaireAdmin/QstnrAdmin/QstnrAdmin";
import BuildQstnr from "../QuestionnaireAdmin/BuildQstnr/BuildQstnr";
import QstnPreview from "../QuestionnaireAdmin/BuildQstnr/components/QstnPreview";
import PLQSA from "../ProjectListForQSA/PLQSA";
import AuditProject from "../AuditProjectFlow/AuditProject";
import ProjectManagement from "../projectManagement/ProjectManagement";
import CreateNewProject from "../projectManagement/components/CreateNewProject";
import ProjectListForAEPoc from "../ProjectListForAEPoc/ProjectListForAEPoc";
import AEPocQstnr from "../ProjectListForAEPoc/components/AEPocQstnr";
import GapManagementComponent from "../AuditProjectFlow/phases/GapAndRemediation/components/GapManagementComponent";
import DashboardRoute from "./DashboardRoute";
import QuestionAttemptWrapper from "../ProjectListForAEPoc/components/QuestionAttemptWrapper";

const LandingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <LPHeader />
      <div className={styles.mainContent}>
        <LPSideMenuBar />
        <div className={styles.mainArea}>
          <Routes>
            <Route path="/" element={<LPMainAreaContainer />}/>
              <Route index element={<DashboardRoute />} />
              <Route path='/users' element={<UserManagement />} />
              <Route path="/questionnaire" element={<QstnrAdmin />} />
              <Route path="/add-question" element={<BuildQstnr />} />
              <Route path="/qstn-preview" element={<QstnPreview />} />
              <Route path='/clients' element={<ClientManagement />} />
              <Route path='/projects' element={<PLQSA />} />
              <Route path='/ProjectView/*' element={<AuditProject />} />
              <Route path="/project-management" element={<ProjectManagement/>}/>
              <Route path="/dashboard" element={<DashboardRoute/>}/>
              <Route path="/createNewProject" element={<CreateNewProject/>} />
              <Route path="/question-attempt" element={<QuestionAttemptWrapper />} />
              <Route path="/project-aepoc" element={<ProjectListForAEPoc/>} />
              <Route path= "/aepoc-qstnr" element={<AEPocQstnr/>} />
              <Route path="/gap-remediation" element={<GapManagementComponent />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
