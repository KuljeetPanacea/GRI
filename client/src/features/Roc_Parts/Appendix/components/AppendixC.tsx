import React from "react";
import styles from "../../Part_1/styles/ContactInfo.module.css";
import { useAppendixCForm } from "../hooks/useAppendixCForm"; // Adjust path as needed
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { Alert, Snackbar } from "@mui/material";

const AppendixC: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    snackbar,
    handleClose,
    isDirty
  } = useAppendixCForm();


  return (
    <React.Fragment>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formHead}>
          <h3 className={styles.subsectionTitle}>
            Appendix C Compensating Controls Worksheet
          </h3>
          <PrimaryButton
            children={"Save"}
            type="submit"
            disabled={!isDirty}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.section}>
            <p className={styles.info}>
              Use this worksheet to document any instance where a compensating
              control is used to meet a PCI DSS defined requirement. Note that
              compensating controls must also be documented at the corresponding
              PCI DSS requirement in Part II, section 7 Findings and
              Observations.
            </p>
            <p className={styles.note}>
              <strong>Note:</strong> Only entities that have legitimate and
              documented technological or business constraints can consider the
              use of compensating controls to achieve compliance.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Requirement Number and Definition</strong>
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
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.assessmentTable}>
                <thead>
                  <tr>
                    <td className={styles.tableHeader}></td>
                    <td className={styles.tableHeader}>Information Required</td>
                    <td className={styles.tableHeader}>Explanation</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.EtableCell}>1. Constraints</td>
                    <td className={styles.EtableCell}>
                      Document the legitimate technical or business constraints
                      precluding compliance with the original requirement.
                    </td>
                    <td className={styles.EtableCell}>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.constraints}
                        onChange={(e) =>
                          handleInputChange("constraints", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.EtableCell}>
                      2. Definition of Compensating Controls
                    </td>
                    <td className={styles.EtableCell}>
                      Define the compensating controls, explain how they address
                      the objectives of the original control and the increased
                      risk, if any.
                    </td>
                    <td className={styles.EtableCell}>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.compensatingControlsDefinition}
                        onChange={(e) =>
                          handleInputChange(
                            "compensatingControlsDefinition",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.EtableCell}>3. Objective</td>
                    <td className={styles.EtableCell}>
                      <div>
                        Define the objective of the original control (for
                        example, the Customized Approach Objective).
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        Identify the objective met by the compensating control
                        (note: this can be, but is not required to be, the
                        stated Customized Approach Objective for the PCI DSS
                        requirement).
                      </div>
                    </td>
                    <td className={styles.EtableCell}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Original control objective"
                        value={formData.originalObjective}
                        onChange={(e) =>
                          handleInputChange("originalObjective", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Compensating control objective"
                        value={formData.compensatingObjective}
                        onChange={(e) =>
                          handleInputChange(
                            "compensatingObjective",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.EtableCell}>4. Identified Risk</td>
                    <td className={styles.EtableCell}>
                      Identify any additional risk posed by the lack of the
                      original control.
                    </td>
                    <td className={styles.EtableCell}>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.identifiedRisk}
                        onChange={(e) =>
                          handleInputChange("identifiedRisk", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.EtableCell}>
                      5. Validation of Compensating Controls
                    </td>
                    <td className={styles.EtableCell}>
                      Define how the compensating controls were validated and
                      tested.
                    </td>
                    <td className={styles.EtableCell}>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.validationMethod}
                        onChange={(e) =>
                          handleInputChange("validationMethod", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.EtableCell}>6. Maintenance</td>
                    <td className={styles.EtableCell}>
                      Define process(es) and controls in place to maintain
                      compensating controls.
                    </td>
                    <td className={styles.EtableCell}>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.maintenanceProcess}
                        onChange={(e) =>
                          handleInputChange(
                            "maintenanceProcess",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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

export default AppendixC;
