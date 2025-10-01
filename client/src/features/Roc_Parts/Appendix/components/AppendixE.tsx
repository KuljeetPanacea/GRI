import React from "react";
import styles from "../../Part_1/styles/ContactInfo.module.css";
import { useAppendixEForm } from "../hooks/useAppendixEForm"; // Adjust path as needed
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { Alert, Snackbar } from "@mui/material";

const AppendixE: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    snackbar,
    handleClose,
    isDirty
  } = useAppendixEForm();

  return (
    <React.Fragment>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHead}>
        <h3 className={styles.subsectionTitle}>
          Appendix E Customized Approach Template
        </h3>
        <PrimaryButton
          children={"Save"}
          type="submit"
          disabled={!isDirty}
        />
      </div>
      <div className={styles.container}>
        <p className={styles.info}>
          Use this template to document each instance where a customized control
          is used to meet a PCI DSS requirement. Note that each use of the
          Customized Approach must also be documented at the corresponding PCI
          DSS requirement in Part II, section 7 Findings and Observations.
        </p>

        <div style={{ marginBottom: "20px" }}>
          <span className={styles.flex}>
          <p>
            <strong>Requirement Number and Definition:</strong>
          </p>
          <input
            type="text"
            className={styles.input}
            placeholder="Requirement Number"
            value={formData.requirementNumber}
            onChange={(e) =>
              handleInputChange("requirementNumber", e.target.value)
            }
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Requirement Definition"
            value={formData.requirementDefinition}
            onChange={(e) =>
              handleInputChange("requirementDefinition", e.target.value)
            }
          />
          </span>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.assessmentTable}>
            <tbody>
              <tr>
                <td className={`${styles.note} ${styles.EtableCell}`}>
                  Identify the customized control name / identifier for each
                  control used to meet the Customized Approach Objective. (Note:
                  use the Customized Control name from the assessed entity's
                  controls matrix)
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.customizedControlName}
                    onChange={(e) =>
                      handleInputChange("customizedControlName", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={`${styles.note} ${styles.EtableCell}`}>
                  Describe each control used to meet the Customized Approach
                  Objective. (Note: Refer to the Payment Card Industry Data
                  Security Standard (PCI DSS) Requirements and Testing
                  Procedures for the Customized Approach Objective)
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.textarea}
                    value={formData.controlDescription}
                    onChange={(e) =>
                      handleInputChange("controlDescription", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={`${styles.note} ${styles.EtableCell}`}>
                  Describe how the control(s) meet the Customized Approach
                  Objective.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.objectiveMeeting}
                    onChange={(e) =>
                      handleInputChange("objectiveMeeting", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={`${styles.note} ${styles.EtableCell}`}>
                  Identify the Controls Matrix documentation reviewed that
                  supports a customized approach for this requirement.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.controlsMatrixDocumentation}
                    onChange={(e) =>
                      handleInputChange(
                        "controlsMatrixDocumentation",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={`${styles.note} ${styles.EtableCell}`}>
                  Identify the Targeted Risk Analysis documentation reviewed
                  that supports the customized approach for this requirement.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.targetedRiskAnalysis}
                    onChange={(e) =>
                      handleInputChange("targetedRiskAnalysis", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={`${styles.note} ${styles.EtableCell}`}>
                  Identify name(s) of the assessor(s) who attests that:
                  <ul>
                    <li>
                      The entity completed the Controls Matrix including all
                      information specified in the Controls Matrix Template in
                      PCI DSS v4.x: Sample Templates to Support Customized
                      Approach on the PCI SSC website, and the results of the
                      Controls Matrix support the customized approach for this
                      requirement.
                    </li>
                    <li>
                      The entity completed the Targeted Risk Analysis including
                      all information specified in the Targeted Risk Analysis
                      Template in PCI DSS v4.x: Sample Templates to Support
                      Customized Approach on the PCI SSC website, and that the
                      results of the Risk Analysis support use of the customized
                      approach for this requirement.
                    </li>
                  </ul>
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.assessorNames}
                    onChange={(e) =>
                      handleInputChange("assessorNames", e.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className={styles.note}>
          <b>Describe</b> the testing procedures derived and performed by the
          assessor to validate that the implemented controls meet the Customized
          Approach <br />
          <b>Objective;</b> for example, whether the customized control(s) is
          sufficiently robust to provide at least an equivalent level of
          protection as provided by the defined approach.
          <br />
          <b>Note 1:</b> Technical reviews (for example, reviewing configuration
          settings, operating effectiveness, etc.) should be performed where
          possible and appropriate. <br />
          <b>Note 2:</b> Add additional rows for each assessor-derived testing
          procedure, as needed. Ensure that all rows to the right of the
          "Assessor-derived testing procedure" are copied for each
          assessor-derived testing procedure that is added.
          <br />
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.assessmentTable}>
            <tbody>
                <td className={styles.FirstEtableCell}>
                  Enter assessor-derived testing procedure here:
                  <input
                    type="text"
                    placeholder="Enter your response here"
                    className={styles.input}
                    value={formData.testingProcedure1}
                    onChange={(e) =>
                      handleInputChange("testingProcedure1", e.target.value)
                    }
                    />
                </td>
                <td>                
                <tr>
                <td className={styles.Enote}>
                  Identify what was tested (for example, individuals
                  interviewed, system components reviewed, processes observed,
                  etc.) Note: all items tested must be uniquely identified.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.whatTested1}
                    onChange={(e) =>
                      handleInputChange("whatTested1", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.Enote}>
                  Identify all evidence examined for this testing procedure.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.evidenceExamined1}
                    onChange={(e) =>
                      handleInputChange("evidenceExamined1", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.Enote}>
                  Describe the results of the testing performed by the assessor
                  for this testing procedure and how these results verify the
                  implemented controls meet the Customized Approach Objective.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.testingResults1}
                    onChange={(e) =>
                      handleInputChange("testingResults1", e.target.value)
                    }
                  />
                </td>
              </tr>
              </td>
            </tbody>
          </table>
        </div>

        <p className={styles.note}>
          <b>Document</b> the testing procedures derived and performed by the
          assessor to validate the controls are maintained to ensure ongoing
          effectiveness; for example, how the entity monitors for control
          effectiveness and how control failures are detected, responded to, and
          the actions taken. <br />
          <b>Note 1:</b> Technical reviews (for example, reviewing configuration
          settings, operating effectiveness, etc.) should be performed where
          possible and appropriate.
          <br />
          <b>Note 2:</b> Add additional rows for each assessor-derived testing
          procedure, as needed. Ensure that all rows to the right of the
          "Assessor-derived testing procedure" are copied for each
          assessor-derived testing procedure that is added.
          <br />
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.assessmentTable}>
            <tbody>
                <td className={styles.FirstEtableCell}>
                  Enter assessor-derived testing procedure here:
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.testingProcedure2}
                    onChange={(e) =>
                      handleInputChange("testingProcedure2", e.target.value)
                    }
                  />
                </td>
                <td>
              <tr>
                <td className={styles.Enote}>
                  Identify what was tested (for example, individuals
                  interviewed, system components reviewed, processes observed,
                  etc.) Note: all items tested must be uniquely identified.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.whatTested2}
                    onChange={(e) =>
                      handleInputChange("whatTested2", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.Enote}>
                  Identify all evidence examined for this testing procedure.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.evidenceExamined2}
                    onChange={(e) =>
                      handleInputChange("evidenceExamined2", e.target.value)
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.Enote}>
                  Describe the results of the testing performed by the assessor
                  for this testing procedure and how these results verify the
                  implemented controls are maintained to ensure ongoing
                  effectiveness.
                </td>
                <td className={styles.EtableCell}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.testingResults2}
                    onChange={(e) =>
                      handleInputChange("testingResults2", e.target.value)
                    }
                  />
                </td>
              </tr>
              </td>
            </tbody>
          </table>
        </div>
      </div>
    </form>
     <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </React.Fragment>
  );
};

export default AppendixE;
