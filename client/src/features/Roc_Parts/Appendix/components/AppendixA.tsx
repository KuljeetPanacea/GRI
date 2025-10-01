import React from "react";
import { MergedControl, MergedPCIDSSData } from "../../Part_2/types";
import styles from "../../Part_2/styles/pciReport.module.css";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { Alert, Snackbar } from "@mui/material";
import { useAppendixAForm } from "../hooks/useAppendixAForm";

interface Props {
  data: MergedPCIDSSData;
  expandedControls: MergedControl;
}

const AppendixA: React.FC<Props> = ({ data, expandedControls }) => {
  const {
    formData,
    updateFormData,
    updateOrCreateAssessorResponse,
    handleSubmit,
    snackbar,
    closeSnackbar,
    hasChanges,
  } = useAppendixAForm(data, expandedControls);

  console.log("This is the form data", formData);

  return (
    <div className={styles.wrapper}>
      {data.requirements.map((requirement) => (
        <div key={requirement.reqId}>
          {requirement.subReq.map((subReq) => (
            <div key={subReq.subReqId}>
              {subReq.controls.map((control) => (
                <div key={control.id}>
                  <div className={styles.header}>
                    <h3>Requirement Description</h3>
                  </div>
                  <div className={styles.formHead}>
                    <h3 className={styles.subsectionTitle}>
                      <strong>{subReq.subReqId}:</strong> {subReq.subReqDesc}
                    </h3>
                    <PrimaryButton
                      children={"Save"}
                      onClick={handleSubmit}
                      disabled={!hasChanges}
                    />
                  </div>
                  <div className={styles.header}>
                    <h3>PCI DSS Requirement</h3>
                  </div>
                  <div className={styles.subHeader}>
                    <div>
                      <span className={styles.bold}>{control.title}</span>{" "}
                      {control.desc?.split("\n").map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                    <ul>
                      {control.requirements &&
                        control.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                    </ul>
                  </div>
                  <div className={styles.findingHeader}>
                    <h3>Assessment Findings (select one)</h3>
                    <span className={styles.methodLabel}>
                      Select If Below Method(s) Was Used
                    </span>
                  </div>
                  <table className={styles.findingTable}>
                    <thead>
                      <tr>
                        <th>In Place</th>
                        <th>Not Applicable</th>
                        <th>Not Tested</th>
                        <th>Not in Place</th>
                        <th>Compensating Control</th>
                        <th>Customized Approach</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {[
                          "In Place",
                          "Not Applicable",
                          "Not Tested",
                          "Not in Place",
                        ].map((status) => (
                          <td key={status}>
                            <input
                              type="radio"
                              name="assessmentFinding"
                              checked={
                                formData[control.title]?.assessmentFinding ===
                                status
                              }
                              onChange={() =>
                                updateFormData(
                                  control.title,
                                  "assessmentFinding",
                                  status
                                )
                              }
                            />
                          </td>
                        ))}
                        <td>
                          <input
                            type="checkbox"
                            checked={
                              formData[control.title]?.compensatingControl ||
                              false
                            }
                            onChange={(e) =>
                              updateFormData(
                                control.title,
                                "compensatingControl",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={
                              formData[control.title]?.customizedApproach ||
                              false
                            }
                            onChange={(e) =>
                              updateFormData(
                                control.title,
                                "customizedApproach",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className={styles.descSection}>
                    <p className={styles.descNote}>{control.assessmentDesc}</p>
                    <textarea
                      name="assessmentFindingDesc"
                      value={
                        formData[control.title]?.assessmentFindingDesc || ""
                      }
                      onChange={(e) =>
                        updateFormData(
                          control.title,
                          "assessmentFindingDesc",
                          e.target.value
                        )
                      }
                      placeholder="Enter assessment finding description..."
                      rows={4}
                      className={styles.textarea}
                    />
                  </div>
                  <span className={styles.expandToggle}>
                    Testing Procedures & Reporting Details
                  </span>
                  {expandedControls && (
                    <div className={styles.tableContainer}>
                      <table className={styles.testingTable}>
                        <thead>
                          <tr>
                            <th className={styles.headerProcedures}>
                              Testing Procedures
                            </th>
                            <th className={styles.headerInstructions}>
                              Reporting Instructions
                            </th>
                            <th className={styles.headerResponse}>
                              Assessor's Response
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {control.testingProcedures &&
                            control.testingProcedures
                              .map((proc) => {
                               
                                return (
                                  proc.reportingInstructions?.map(
                                    (instr, instrIndex) => {
                                      const uniqueResponseId = `${proc.id}_${instrIndex}`;
                                      const correspondingResponse = formData[
                                        control.title
                                      ]?.assessorResponse?.find(
                                        (response) =>
                                          response.reportingInstructionId ===
                                          uniqueResponseId
                                      );
                                      return (
                                        <tr
                                          key={`${proc.id}-${instr.id}-${instrIndex}`}
                                        >
                                          {instrIndex === 0 && (
                                            <td
                                              className={styles.procedureCell}
                                              rowSpan={
                                                proc.reportingInstructions
                                                  ?.length || 1
                                              }
                                            >
                                              <strong>{proc.id}</strong> -{" "}
                                              {proc.description}
                                            </td>
                                          )}
                                          <td
                                            className={styles.instructionCell}
                                          >
                                            <div>
                                              <p>{instr.description}</p>
                                              {instr.evidenceReference && (
                                                <p>
                                                  Ref: {instr.evidenceReference}
                                                </p>
                                              )}
                                            </div>
                                          </td>
                                          <td className={styles.responseCell}>
                                            <div>
                                              <input
                                                type="text"
                                                value={
                                                  correspondingResponse?.refName ||
                                                  ""
                                                }
                                                onChange={(e) => {
                                                  updateOrCreateAssessorResponse(
                                                    control.title,
                                                    proc.id,
                                                    instrIndex,
                                                    "refName",
                                                    e.target.value
                                                  );
                                                }}
                                                placeholder="Enter evidence reference..."
                                                className={styles.textarea}
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  ) || []
                                );
                              })
                              .flat()}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AppendixA;