import { useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import styles from "./AssessmentEvidenceTracker.module.css";
import { Eye } from "lucide-react";
import useAssessmentDrawer from "../useAssessmentTable";

const AssessmentEvidenceTracker = () => {
  const {
    getEvidenceTrackerdata,
    selectedTableRow,
    setSelectedtableRow,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    assessorFilter,
    setAssessorFilter,
    filteredData,
    tabs,
    uniqueCategories,
    uniqueAssessors,
    completionPercentage
  } = useAssessmentDrawer();

  useEffect(() => {
    getEvidenceTrackerdata();
  }, []);

  const getStatusChip = (status: string) => {
    let colorClass = "";
    switch (status.toLowerCase()) {
      case "uploaded":
        colorClass = styles.statusUploaded;
        break;
      case "missing":
        colorClass = styles.statusMissing;
        break;
      default:
        colorClass = styles.statusDefault;
    }
    return (
      <span className={`${styles.statusChip} ${colorClass}`}>{status}</span>
    );
  };



  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Typography variant="h4" component="h1" className={styles.title}>
            Evidence Tracker
          </Typography>
          <Typography variant="subtitle1" className={styles.subtitle}>
            Payment Security Audit - Evidence Review & Documentation
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          className={styles.uploadButton}
          sx={{
            height: 40,
            borderRadius: 8,
          }}
        >
          Upload interview evidence
        </Button>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.tabsAndControls}>
          <div className={styles.controls}>
            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${
                    activeTab === tab.id ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <div className={styles.searchAndFilterContainer}>
              <TextField
                variant="outlined"
                placeholder="Search by Control ID, Question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: 1,
                  maxWidth: 400,
                  "& .MuiOutlinedInput-root": {
                    height: 36,
                    backgroundColor: "white",
                    fontSize: 14,
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 12px",
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#9ca3af",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl
                sx={{
                  flex: 1,
                  maxWidth: 250,
                  "& .MuiOutlinedInput-root": {
                    height: 36,
                    backgroundColor: "white",
                    fontSize: 14,
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 12px",
                  },
                }}
              >
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="All Categories">All Categories</MenuItem>
                  {uniqueCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                sx={{
                  flex: 1,
                  maxWidth: 250,
                  "& .MuiOutlinedInput-root": {
                    height: 36,
                    backgroundColor: "white",
                    fontSize: 14,
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 12px",
                  },
                }}
              >
                <Select
                  value={assessorFilter}
                  onChange={(e) => setAssessorFilter(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="All AE Internal Assessors">
                    All AE Internal Assessors
                  </MenuItem>
                  {uniqueAssessors.map((assessor) => (
                    <MenuItem key={assessor} value={assessor}>
                      {assessor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Chip
                label={`${completionPercentage}%`}
                className={styles.percentageChip}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.assessmentContainer}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>CONTROL ID</th>
                <th>ASSET CATEGORY</th>
                <th>ASSET REFERENCE</th>
                <th>QUESTIONNAIRE</th>
                <th>QUESTION</th>
                <th>SUBMITTED BY</th>
                <th>SUBMITTED ON</th>
                <th>LATEST EVIDENCE</th>
                <th>STATUS</th>
              </tr>
            </thead>
          </table>

          <div className={styles.scrollBody}>
            <table className={styles.table}>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((gap, index) => (
                    <tr
                      key={gap.id}
                      className={`${styles.tableRow} ${
                        selectedTableRow === index ? styles.selectedRow : ""
                      }`}
                      onClick={() => setSelectedtableRow(index)}
                    >
                      <td className={styles.tableCell}>{gap.id}</td>
                      <td className={styles.tableCell}>{gap.deviceType}</td>
                      <td className={styles.tableCell}>{gap.deviceRefName}</td>
                      <td className={styles.tableCell}>{gap.questionnaire}</td>
                      <td className={styles.tableCell}>{gap.question}</td>

                      <td className={styles.tableCell}>
                        {gap.AEInternalAssessor}
                      </td>
                      <td className={styles.tableCell}>
                        {gap.resolutionDate || gap.SubmittedOn}
                      </td>
                      <td className={styles.tableCell}>
                        {gap.latestEvidence?.length ? (
                          gap.latestEvidence.map((evidence, idx) => (
                            <div key={idx} className={styles.evidenceLink}>
                              <Eye className={styles.viewIcon} />
                              <span className={styles.evidenceText}>
                                {evidence}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className={styles.evidenceText}>
                            No evidence submitted
                          </span>
                        )}
                      </td>
                      <td className={styles.tableCell}>
                        {getStatusChip(gap.Status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className={styles.noDataCell}>
                      No data found matching the current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentEvidenceTracker;
