import React from "react";
import styles from "../styles/ContactInfo.module.css";
import { useQuarterlyScanForm } from "../hooks/useQuarterlyScan";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { Alert, Snackbar } from "@mui/material";

const QuarterlyScan: React.FC = () => {
  const {
    formData,
    errors,
    handleInputChange,
    handleCheckboxChange,
    updateExternalScanField,
    updateInternalScanField,
    addRow,
    removeRow,
    handleSubmit,
    snackbar,
    handleCloseSnackbar,
    isDirty
  } = useQuarterlyScanForm();

  return (
    <React.Fragment>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHead}>
        <h3 className={styles.subsectionTitle}>5. Quarterly Scan Results</h3>
        <PrimaryButton children={"Save"} type="submit" disabled={!isDirty} />
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.subsectionTitle}>
            5.1 Quarterly External Scan Results
          </h3>

          <p className={styles.info}>
            Identify each quarterly ASV scan performed within the last 12 months
            in the table below. Refer to PCI DSS Requirement 11.3.2 for
            information about initial PCI DSS assessments against the ASV scan
            requirements.
          </p>

          <div className={styles.tableContainer}>
            <table className={styles.assessmentTable}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>Date of the Scan(s)</th>
                  <th className={styles.headerCell}>
                    Name of ASV that Performed the Scan
                  </th>
                  <th className={styles.headerCell}>
                    Were any vulnerabilities found that resulted in a failed
                    initial scan?
                  </th>
                  <th className={styles.headerCell}>
                    For all scans resulting in a Fail, provide date(s) of
                    re-scans showing that the vulnerabilities have been
                    corrected
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.externalScans.map((row, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        value={row.QuarterlyASVScanDates}
                        onChange={(e) =>
                          updateExternalScanField(
                            index,
                            "QuarterlyASVScanDates",
                            e.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Enter scan dates"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.ASVNamePerformingScan}
                        onChange={(e) =>
                          updateExternalScanField(
                            index,
                            "ASVNamePerformingScan",
                            e.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Enter ASV name"
                      />
                    </td>
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          checked={
                            row.VulnerabilitiesFoundFailedInitialScan_Yes
                          }
                          onChange={(e) =>
                            updateExternalScanField(
                              index,
                              "VulnerabilitiesFoundFailedInitialScan_Yes",
                              e.target.checked
                            )
                          }
                        />{" "}
                        Yes
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={row.VulnerabilitiesFoundFailedInitialScan_No}
                          onChange={(e) =>
                            updateExternalScanField(
                              index,
                              "VulnerabilitiesFoundFailedInitialScan_No",
                              e.target.checked
                            )
                          }
                        />{" "}
                        No
                      </label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.RescanDatesAfterVulnerabilitiesCorrected}
                        onChange={(e) =>
                          updateExternalScanField(
                            index,
                            "RescanDatesAfterVulnerabilitiesCorrected",
                            e.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Enter rescan dates"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow("externalScans", index)}
                        className={styles.removeButton}
                        disabled={formData.externalScans.length <= 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => addRow("externalScans")}
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Indicate whether this is the assessed entity's initial PCI DSS
                assessment against the ASV scan requirements.
              </label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="Initial_Assessment_Yes"
                  checked={formData.Initial_Assessment_Yes}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "Initial_Assessment_Yes",
                      e.target.checked
                    )
                  }
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>Yes</span>
                <input
                  type="checkbox"
                  name="Initial_Assessment_No"
                  checked={formData.Initial_Assessment_No}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "Initial_Assessment_No",
                      e.target.checked
                    )
                  }
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>No</span>
              </div>
              {errors.Initial_Assessment_Yes && (
                <div className={styles.errorMessage}>
                  {errors.Initial_Assessment_Yes}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                If yes, Identify the name of the document the assessor verified
                to include the entity's documented policies and procedures
                requiring scanning at least once every three months going
                forward.
              </label>
              <input
                type="text"
                name="QuarterlyScanDocName"
                value={formData.QuarterlyScanDocName}
                onChange={(e) =>
                  handleInputChange("QuarterlyScanDocName", e.target.value)
                }
                className={styles.input}
                placeholder="Enter document name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Assessor comments, if applicable:
              </label>
              <input
                type="text"
                name="External_Scan_AssessorComments"
                value={formData.External_Scan_AssessorComments}
                onChange={(e) =>
                  handleInputChange(
                    "External_Scan_AssessorComments",
                    e.target.value
                  )
                }
                className={styles.input}
                placeholder="Enter comments"
              />
            </div>
          </div>

          <h3 className={styles.subsectionTitle}>
            5.2 Attestations of Scan Compliance
          </h3>

          <p className={styles.info}>
            The scans must cover all externally accessible (Internet-facing) IP
            addresses in existence at the entity, in accordance with the PCI DSS
            Approved Scanning Vendors (ASV) Program Guide.
          </p>

          <div className={styles.fieldGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Indicate whether the ASV and the assessed entity completed the
                Attestations of Scan Compliance, confirming that all externally
                accessible (Internet-facing) IP addresses in existence at the
                entity were appropriately scoped for the ASV scans.
              </label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="isASVScanCompliant_Yes"
                  checked={formData.isASVScanCompliant_Yes}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "isASVScanCompliant_Yes",
                      e.target.checked
                    )
                  }
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>Yes</span>
                <input
                  type="checkbox"
                  name="isASVScanCompliant_No"
                  checked={formData.isASVScanCompliant_No}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "isASVScanCompliant_No",
                      e.target.checked
                    )
                  }
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>No</span>
              </div>
              {errors.isASVScanCompliant_Yes && (
                <div className={styles.errorMessage}>
                  {errors.isASVScanCompliant_Yes}
                </div>
              )}
            </div>
          </div>

          <h3 className={styles.subsectionTitle}>
            5.3 Quarterly Internal Scan Results
          </h3>

          <p className={styles.info}>
            In the table below identify each quarterly internal vulnerability
            scan performed within the last 12 months.
          </p>

          <div className={styles.tableContainer}>
            <table className={styles.assessmentTable}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>Date of the Scan(s)</th>
                  <th className={styles.headerCell}>Authenticated Scan?</th>
                  <th className={styles.headerCell}>High-Risk Vulns Found?</th>
                  <th className={styles.headerCell}>Re-scan Dates</th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.internalScans.map((row, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        value={row.QuarterlyInternalVulnerabilityScanDates}
                        onChange={(e) =>
                          updateInternalScanField(
                            index,
                            "QuarterlyInternalVulnerabilityScanDates",
                            e.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Enter scan dates"
                      />
                    </td>
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          checked={row.AuthenticatedScanPerformed_Yes}
                          onChange={(e) =>
                            updateInternalScanField(
                              index,
                              "AuthenticatedScanPerformed_Yes",
                              e.target.checked
                            )
                          }
                        />{" "}
                        Yes
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={row.AuthenticatedScanPerformed_No}
                          onChange={(e) =>
                            updateInternalScanField(
                              index,
                              "AuthenticatedScanPerformed_No",
                              e.target.checked
                            )
                          }
                        />{" "}
                        No
                      </label>
                    </td>
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          checked={row.HighRiskCriticalVulnerabilitiesFound_Yes}
                          onChange={(e) =>
                            updateInternalScanField(
                              index,
                              "HighRiskCriticalVulnerabilitiesFound_Yes",
                              e.target.checked
                            )
                          }
                        />{" "}
                        Yes
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={row.HighRiskCriticalVulnerabilitiesFound_No}
                          onChange={(e) =>
                            updateInternalScanField(
                              index,
                              "HighRiskCriticalVulnerabilitiesFound_No",
                              e.target.checked
                            )
                          }
                        />{" "}
                        No
                      </label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.RescanDates_CorrectedVulnerabilities}
                        onChange={(e) =>
                          updateInternalScanField(
                            index,
                            "RescanDates_CorrectedVulnerabilities",
                            e.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Enter rescan dates"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow("internalScans", index)}
                        className={styles.removeButton}
                        disabled={formData.internalScans.length <= 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => addRow("internalScans")}
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Indicate if this is the assessed entity's initial PCI DSS
                assessment against the internal scan requirements.
              </label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="Internal_InitialCompliant_Yes"
                  checked={formData.Internal_InitialCompliant_Yes}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "Internal_InitialCompliant_Yes",
                      e.target.checked
                    )
                  }
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>Yes</span>
                <input
                  type="checkbox"
                  name="Internal_InitialCompliant_No"
                  checked={formData.Internal_InitialCompliant_No}
                  onChange={(e) =>
                    handleCheckboxChange(
                      "Internal_InitialCompliant_No",
                      e.target.checked
                    )
                  }
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>No</span>
              </div>
              {errors.Internal_InitialCompliant_Yes && (
                <div className={styles.errorMessage}>
                  {errors.Internal_InitialCompliant_Yes}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                If yes, Identify the name of the document the assessor verified
                to include the entity's documented policies and procedures
                requiring scanning at least once every three months going
                forward.
              </label>
              <input
                type="text"
                name="InternalScanPolicyDocName"
                value={formData.InternalScanPolicyDocName}
                onChange={(e) =>
                  handleInputChange("InternalScanPolicyDocName", e.target.value)
                }
                className={styles.input}
                placeholder="Enter document name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Assessor comments, if applicable:
              </label>
              <input
                type="text"
                name="Internal_Scan_AssessorComments"
                value={formData.Internal_Scan_AssessorComments}
                onChange={(e) =>
                  handleInputChange(
                    "Internal_Scan_AssessorComments",
                    e.target.value
                  )
                }
                className={styles.input}
                placeholder="Enter comments"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
    <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            elevation={6}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
    </React.Fragment>
  );
};

export default QuarterlyScan;
