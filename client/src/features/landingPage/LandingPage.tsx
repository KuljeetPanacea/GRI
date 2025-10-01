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
import DigitalAvatar from "../digitalAvatar/digitalAvatar";
import AEInternalAssessorsList from "../AuditProjectFlow/components/AEInternalAssessorsList";
import ProjectListForAEPoc from "../ProjectListForAEPoc/ProjectListForAEPoc";
import AEPocQstnr from "../ProjectListForAEPoc/components/AEPocQstnr";
import ProjectListForAssessor from "../ProjectLIstForAssessor/ProjectListForAssessor";
import AssessorQstnr from "../ProjectLIstForAssessor/components/AssessorQstnr";
import GapManagementComponent from "../AuditProjectFlow/phases/GapAndRemediation/components/GapManagementComponent";
import AssessmentView from "../AuditProjectFlow/phases/Assessment/AssessmentView";
import PendingEvidences from "../ProjectLIstForAssessor/components/PendingEvidences";
import EvidencesGallery from "../ProjectLIstForAssessor/components/EvidencesGallery";
import AssessorGaps from "../ProjectLIstForAssessor/components/AssessorGaps";
import AsssessorRevise from "../ProjectLIstForAssessor/components/AsssessorRevise";
import EvidenceResolutionContainer from "../ProjectLIstForAssessor/components/EvidenceResolutionContainer";
import AssessmentEvidenceTracker from "../AuditProjectFlow/phases/Assessment/components/AssessmentEvidenceTracker";
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
              <Route path='/aelist' element={<AEInternalAssessorsList />} />
              <Route path="/project-management" element={<ProjectManagement/>}/>
              <Route path="/dashboard" element={<DashboardRoute/>}/>
              <Route path="/createNewProject" element={<CreateNewProject/>} />
              <Route path="/digital-avatar" element={<DigitalAvatar/>} />
              <Route path="/question-attempt" element={<QuestionAttemptWrapper />} />
              <Route path="/project-aepoc" element={<ProjectListForAEPoc/>} />
              <Route path= "/aepoc-qstnr" element={<AEPocQstnr/>} />
              <Route path= "/assessor-qstnr" element={<AssessorQstnr/>} />
              <Route path= "/assessor-gaps" element={<AssessorGaps/>} />
              <Route path="/project-assessor" element={<ProjectListForAssessor />} />
              <Route path="/gap-remediation" element={<GapManagementComponent />} />
              
              <Route path="/assessment" element={<AssessmentView />} />
              <Route path="/pending-evidences-assessor" element={<PendingEvidences />} />
              <Route path="/evidence-gallery" element={<EvidencesGallery />} />
              <Route path="/AsssessorRevise" element={<AsssessorRevise />} />
              <Route path="/Asssessor-log-Revise" element={<EvidenceResolutionContainer />} />
              <Route path="/AssessmentEvidencetracker" element={<AssessmentEvidenceTracker />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
