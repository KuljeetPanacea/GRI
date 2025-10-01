import React from "react";
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  Snackbar,
  Alert,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import styles from "./complianceReportView.module.css";
import { useComplianceReportView } from "./useComplianceReportView";
import UnsavedChangesModal from "./UnsavedChangesModal";
import ContactInfo from "../../../Roc_Parts/Part_1/components/ContactInfo";
import BusinessOverview from "../../../Roc_Parts/Part_1/components/BusinessOverview";
import ScopeOfWork from "../../../Roc_Parts/Part_1/components/ScopeOfWork";
import ReviewedEnv from "../../../Roc_Parts/Part_1/components/ReviewedEnv";
import QuarterlyScan from "../../../Roc_Parts/Part_1/components/QuarterlyScan";
import SamplingEvidence from "../../../Roc_Parts/Part_2/Components/SamplingEvidence";
import PCIReportView from "../../../Roc_Parts/Part_2/Components/PCIReportView";
import AppendixA3 from "../../../Roc_Parts/Appendix/components/AppendixA3";
import AppendixB from "../../../Roc_Parts/Appendix/components/AppendixB";
import AppendixD from "../../../Roc_Parts/Appendix/components/AppendixD";
import AppendixC from "../../../Roc_Parts/Appendix/components/AppendixC";
import AppendixE from "../../../Roc_Parts/Appendix/components/AppendixE";
import AppendixA from "../../../Roc_Parts/Appendix/components/AppendixA";

const ComplianceReportView: React.FC = () => {
  const {
    selectedSubReq,
    selectedControl,
    selectedReq,
    selectedPart,
    mergedControl,
    data,
    expandedReqs,
    expandedSubReqs,
    handleControlClick,
    handlePartClick,
    hasControls,
    hasSubRequirements,
    isReqActive,
    isSubReqActive,
    isControlActive,
    isPartActive,
    getComponentKey,
    getPCIReportData,
    getCurrentRequirements,
    handleReqClickWithExpansion,
    handleSubReqClickWithExpansion,
    // Modal related props
    showUnsavedModal,
    isSaving,
    handleModalDiscard,
    handleModalCancel,
    // NEW: Snackbar related props
    snackbar,
    hideSnackbar,
  } = useComplianceReportView();

  // Component mapping - now using the helper function from hook
  const componentMap: { [key: string]: React.ReactNode } = {
    "Contact Information": (
      <ContactInfo />
    ),
    "Business Overview": <BusinessOverview />,
    "Scope of work": <ScopeOfWork />,
    "Reviewed Environments": <ReviewedEnv />,
    "Quarterly Scans": <QuarterlyScan />,
    "Sampling and Evidences": <SamplingEvidence />,
    "Appendix A3":<AppendixA3/>,
    "Appendix-B":<AppendixB/>,
    "Appendix-C":<AppendixC/>,
    "Appendix-D":<AppendixD/>,
    "Appendix-E":<AppendixE/>
  };

  const getComponentFromMap = (title: string) => {
    const key = getComponentKey(title);
    return (
      componentMap[key!] || (
        <Typography variant="body1">
          Component for "{title}" is not implemented yet.
        </Typography>
      )
    );
  };

  const renderMainContent = () => {
    // Handle requirements without sub-requirements
    if (selectedReq && !hasSubRequirements(selectedReq)) {
      return getComponentFromMap(selectedReq.reqName);
    }

    // Handle sub-requirements
    if (!selectedSubReq) return null;

    if (hasControls(selectedSubReq)) {
      if (!selectedControl) {
        return (
          <Typography variant="body1">
            Please select a control from the left sidebar.
          </Typography>
        );
      }

      if (!mergedControl) {
        return (
          <Typography variant="body1">
            Loading control details...
          </Typography>
        );
      }

      const pciData = getPCIReportData();
      if (!pciData) return null;

      if (/^A/.test(selectedControl.title)){
      return(
        <AppendixA data={pciData} expandedControls={mergedControl} />
      )
      }
      else{
        return(
          <PCIReportView
          data={pciData}
          expandedControls={mergedControl}
        />
        )
      }
    }

    return getComponentFromMap(selectedSubReq.title);
  };

  return (
    <Box className={styles.container}>
      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        open={showUnsavedModal}
        onDiscard={handleModalDiscard}
        onCancel={handleModalCancel}
        loading={isSaving}
      />

      {/* NEW: Snackbar for error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={hideSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Part Buttons - Only these remain as buttons */}
      <div className={styles.buttonContainer}>
        {Object.entries(data).map(([partKey, partData]) => (
          <div
            key={partData.id}
            className={`${styles.reqButton} ${
              isPartActive(partKey) ? styles.activeButton : ""
            }`}
            onClick={() => handlePartClick(partKey)}
          >
            {partData.title}
          </div>
        ))}
      </div>

      <Stack direction="row" spacing={2}>
        {/* Sidebar with Hierarchical List */}
        <div className={styles.sidebar}>
          <List>
            {/* Requirements List */}
            {selectedPart && getCurrentRequirements().map((req) => (
              <React.Fragment key={req.id}>
                {/* Requirement Item */}
                <ListItem disablePadding>
                  <ListItemButton
                    className={`${styles.listItem} ${
                      isReqActive(req.id) ? styles.activeListItem : ""
                    }`}
                    onClick={() => handleReqClickWithExpansion(req)}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "16px", fontWeight: "bold", flexGrow: 1 }}
                    >
                      {req.reqName}
                    </Typography>
                    {/* Only show expand/collapse icon if requirement has sub-requirements */}
                    {hasSubRequirements(req) && (
                      expandedReqs.includes(req.id) ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>

                {/* Sub-requirements Collapse - Only render if requirement has sub-requirements */}
                {hasSubRequirements(req) && (
                  <Collapse 
                    in={expandedReqs.includes(req.id)} 
                    timeout="auto" 
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {req.subReq?.map((sub) => (
                        <React.Fragment key={sub.id}>
                          {/* Sub-requirement Item */}
                          <ListItem disablePadding>
                            <ListItemButton
                              className={`${styles.listItem} ${
                                isSubReqActive(sub.id) ? styles.activeListItem : ""
                              }`}
                              onClick={() => handleSubReqClickWithExpansion(sub)}
                              sx={{ pl: 4 }}
                            >
                              <Typography
                                variant="body1"
                              >
                                {sub.title}
                              </Typography>
                              {hasControls(sub) && (
                                expandedSubReqs.includes(sub.id) ? <ExpandLess /> : <ExpandMore />
                              )}
                            </ListItemButton>
                          </ListItem>

                          {/* Controls Collapse */}
                          {hasControls(sub) && (
                            <Collapse 
                              in={expandedSubReqs.includes(sub.id)} 
                              timeout="auto" 
                              unmountOnExit
                            >
                              <List component="div" disablePadding>
                                {sub.controls?.map((control) => (
                                  <ListItem key={control.id} disablePadding>
                                    <ListItemButton
                                      selected={isControlActive(control.title)}
                                      onClick={() => {
                                        handleControlClick(control);
                                      }}
                                      className={`${styles.listItem} ${
                                        isControlActive(control.title) ? styles.activeListItem : ""
                                      }`}
                                      sx={{ pl: 6 }}
                                    >
                                      <Typography variant="body1" sx={{ fontSize: "13px" }}>
                                        {control.title}
                                      </Typography>
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            </Collapse>
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </div>

        {/* Main Content Panel */}
        <div className={styles.detailsContainer}>
          {renderMainContent()}
        </div>
      </Stack>
    </Box>
  );
};

export default ComplianceReportView;