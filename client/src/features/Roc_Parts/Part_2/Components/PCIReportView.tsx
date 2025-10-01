// components/PCIDSSComplianceReport/PCIReportView.tsx
import React from "react";
import { MergedControl, MergedPCIDSSData } from "../types";
import styles from "../styles/pciReport.module.css";

interface Props {
  data: MergedPCIDSSData;
  expandedControls: MergedControl;
}

const PCIReportView: React.FC<Props> = ({ data, expandedControls }) => {
  return (
    <div className={styles.wrapper}>
      {data.requirements.map((requirement) => (
        <div key={requirement.reqId}>
          {requirement.subReq.map((subReq) => (
            <div key={subReq.subReqId}>
              {subReq.controls.map((control) => {
                return (
                  <div key={control.id}>
                    <div className={styles.header}>
                      <h3>Requirement Description</h3>
                    </div>
                    <div className={styles.formHead}>
                      <h3 className={styles.subsectionTitle}>
                        <strong>{subReq.subReqId}:</strong> {subReq.subReqDesc}
                      </h3>
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
                      <h3>Assessment Findings</h3>
                      <span className={styles.methodLabel}>Methods Used</span>
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
                                name={`assessmentFinding-${control.title}`}
                                checked={
                                  control.controlAssessmentFinding === status
                                }
                                readOnly
                              />
                            </td>
                          ))}
                          <td>
                            <input
                              type="checkbox"
                              checked={control.compensatingControl || false}
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={control.customizedApproach || false}
                              readOnly
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className={styles.descSection}>
                      <p className={styles.descNote}>
                        {control.assessmentDesc}
                      </p>
                      <textarea
                        value={control.detailed_finding || ""}
                        placeholder="Assessment finding description..."
                        rows={4}
                        className={styles.textarea}
                        readOnly
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
                                        // Find corresponding evidence based on evidenceReference and evidenceCategory
                                        const correspondingEvidences =
                                          control.evidences?.filter(
                                            (evidence) =>
                                              evidence.evidenceCategory ===
                                                instr.evidenceReference &&
                                              instr.id ===
                                                evidence.testingProcedure
                                          );
                                        const joinedEvidenceRefs =
                                          correspondingEvidences
                                            ?.map((ev) => ev.refName)
                                            .join(" , ") || "";
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
                                                {proc.description?.split("\n").map((line, idx) => (
                                                  <React.Fragment key={idx}>
                                                    {line}
                                                    {idx < proc.description.split("\n").length - 1 && <br />}
                                                  </React.Fragment>
                                                ))}
                                              </td>
                                            )}
                                            <td
                                              className={styles.instructionCell}
                                            >
                                              <div>
                                                <p>{instr.description}</p>
                                              </div>
                                            </td>
                                            <td className={styles.responseCell}>
                                              <div>
                                                <input
                                                  type="text"
                                                  value={joinedEvidenceRefs}
                                                  placeholder="Evidence reference..."
                                                  className={styles.textarea}
                                                  readOnly
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
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PCIReportView;