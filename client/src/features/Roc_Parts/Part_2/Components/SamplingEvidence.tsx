import React from "react";
import styles from "../../Part_1/styles/ContactInfo.module.css";
import { useSamplingEvidence } from "../hooks/useSamplingEvidence";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { AssessmentEvidenceRow } from "../types";

const SamplingEvidence: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleTableInputChange,
    addTableRow,
    removeTableRow,
    handleSubmit,
  } = useSamplingEvidence();

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formHead}>
          <h3 className={styles.subsectionTitle}>6. Sampling and Evidence</h3>
          <PrimaryButton children={"Save"} type="submit" />
        </div>

        <div className={styles.container}>
          <h3 className={styles.subsectionTitle}>6.1 Evidence Retention</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Describe the repositories where the evidence collected during
                this assessment is stored including the names of the
                repositories and how the data is secured.
              </label>
              <input
                type="text"
                name="EvidenceRepoDetails"
                value={formData.EvidenceRepoDetails}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Identify the entity or entities who controls the evidence
                repositories.
              </label>
              <input
                type="text"
                name="EvidenceRepoControlEntities"
                value={formData.EvidenceRepoControlEntities}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Indicate whether the entity or entities in control of the
                evidence repositories understands that all evidence from this
                assessment must be maintained for a minimum of 3 years and must
                be made available to PCI SSC upon request.
              </label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="EvidenceRetention_3Years_Yes"
                  checked={formData.EvidenceRetention_3Years_Yes}
                  onChange={handleInputChange}
                  className={styles.input}
                />{" "}
                <span className={styles.checkboxLabel}>Yes</span>
                <input
                  type="checkbox"
                  name="EvidenceRetention_3Years_No"
                  checked={formData.EvidenceRetention_3Years_No}
                  onChange={handleInputChange}
                  className={styles.input}
                />{" "}
                <span className={styles.checkboxLabel}>No</span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Identify the assessor who attests that all evidence, including
                interview notes, system configuration evidence, documentation,
                and observation notes has been gathered and stored as per the
                QSA Company's evidence retention policy.
              </label>
              <input
                type="text"
                name="EvidenceAttestingAssessor"
                value={formData.EvidenceAttestingAssessor}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>
          <h3 className={styles.subsectionTitle}>6.2 Sampling</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Indicate whether sampling is used.
              </label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="Sampling_Used_Yes"
                  checked={formData.Sampling_Used_Yes}
                  onChange={handleInputChange}
                  className={styles.input}
                />{" "}
                <span className={styles.checkboxLabel}>Yes</span>
                <input
                  type="checkbox"
                  name="Sampling_Used_No"
                  checked={formData.Sampling_Used_No}
                  onChange={handleInputChange}
                  className={styles.input}
                />{" "}
                <span className={styles.checkboxLabel}>No</span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                • If "No," provide the name of the assessor who attests that
                every item in each population has been assessed.
              </label>
              <input
                type="text"
                name="Attesting_Assessor"
                value={formData.Attesting_Assessor}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <p className={styles.note}>
              • If "Yes," complete the following:
              <br />
              <b>Note: </b>If multiple sampling methodologies are used, clearly
              respond for each methodology.
            </p>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                – Describe the sampling rationale(s) used for selecting sample
                sizes (for people, process evidence, technologies, devices,
                locations/sites, etc.).
              </label>
              <input
                type="text"
                name="Sampling_Rationale_Desc"
                value={formData.Sampling_Rationale_Desc}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                – Describe how the samples are appropriate and representative of
                the overall populations.
              </label>
              <input
                type="text"
                name="Sampling_Method_justification"
                value={formData.Sampling_Method_justification}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                – Indicate whether standardized processes and controls are in
                place that provide consistency between each item in the
                samples—for example, automated system build processes,
                configuration change detection, etc.
              </label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="StandardSampleControls_Yes"
                  checked={formData.StandardSampleControls_Yes}
                  onChange={handleInputChange}
                  className={styles.input}
                />{" "}
                <span className={styles.checkboxLabel}>Yes</span>
                <input
                  type="checkbox"
                  name="StandardSampleControls_No"
                  checked={formData.StandardSampleControls_No}
                  onChange={handleInputChange}
                  className={styles.input}
                />{" "}
                <span className={styles.checkboxLabel}>No</span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                • If "Yes," describe how the processes and controls were
                validated by the assessor to be in place and effective.
              </label>
              <input
                type="text"
                name="StandardSample_Desc"
                value={formData.StandardSample_Desc}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>
          <h3 className={styles.subsectionTitle}>
            6.3 Sample Sets for Reporting
          </h3>
          <p className={styles.info}>
            Identify all sample sets used during testing. This table only needs
            to be completed for populations where sampling was used. <br />
            When sampling is used the assessor must identify the items in the
            population that were tested (for example, as "Sample Set-1") as part
            of the sample in the table below. All unique sample sets must be
            documented in this table.
          </p>
          <p className={styles.note}>
            <b>Note: </b>For items where the total population fluctuates or is
            difficult to determine, the assessor may work with the assessed
            entity to provide an estimated total population in the total
            population column below.
          </p>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>
                    Tested Sample Set Reference Number
                  </th>
                  <th className={styles.headerCell}>
                    Sample Type/ Description1
                  </th>
                  <th className={styles.headerCell}>
                    Identify All Items in the Sample Set2
                  </th>
                  <th className={styles.headerCell}>Selection Method3</th>
                  <th className={styles.headerCell}>Total Sampled</th>
                  <th className={styles.headerCell}>Total Population</th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.sampleSets.map((row, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        value={row.TestedSampleSetRefNumber}
                        onChange={(e) =>
                          handleTableInputChange(
                            "sampleSets",
                            index,
                            "TestedSampleSetRefNumber",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.SampleTypeDescription}
                        onChange={(e) =>
                          handleTableInputChange(
                            "sampleSets",
                            index,
                            "SampleTypeDescription",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.SampleSetItemsList}
                        onChange={(e) =>
                          handleTableInputChange(
                            "sampleSets",
                            index,
                            "SampleSetItemsList",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.SelectionMethod}
                        onChange={(e) =>
                          handleTableInputChange(
                            "sampleSets",
                            index,
                            "SelectionMethod",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.TotalSampledCount}
                        onChange={(e) =>
                          handleTableInputChange(
                            "sampleSets",
                            index,
                            "TotalSampledCount",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.TotalPopulationCount}
                        onChange={(e) =>
                          handleTableInputChange(
                            "sampleSets",
                            index,
                            "TotalPopulationCount",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeTableRow("sampleSets", index)}
                        disabled={formData.sampleSets.length === 1}
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
              onClick={() => addTableRow("sampleSets")}
              className={styles.addButton}
            >
              Add Sample Set Row
            </button>
          </div>
          <p className={styles.info}>
            1 For example, firewalls, datacenters, change records, User IDs, and
            so on.
            <br />
            2 For example, unique system identifiers, location
            addresses/identifiers, change record numbers/identifiers, personnel
            identifier, and so on. <br />
            3 Describe the method for selecting individual items in the sample
            sets.
            <br />
          </p>
          <h3 className={styles.subsectionTitle}>6.4 Documentation Evidence</h3>
          <p className={styles.info}>
            Identify all evidence for any testing procedure requiring a review
            of documents such as policies, procedures, standards, records,
            inventories, vendor documentation, and diagrams. Include the
            following: (Add rows as needed)
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>Reference Number</th>
                  <th className={styles.headerCell}>
                    Document Name
                    <br />
                    (including version, if applicable)
                  </th>
                  <th className={styles.headerCell}>Document Purpose</th>
                  <th className={styles.headerCell}>
                    Document Revision Date
                    <br />
                    (if applicable)
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.evenRow}>
                  <td>
                    <p className={styles.info}>EXAMPLE: Doc-1</p>
                  </td>
                  <td>
                    <p className={styles.info}>
                      Company XPY Information Security Policy
                    </p>
                  </td>
                  <td>
                    <p className={styles.info}>Information Security Policy</p>
                  </td>
                  <td>
                    <p className={styles.info}>2021-02-18</p>
                  </td>
                  <td>
                    <p className={styles.info}>Example</p>
                  </td>
                </tr>
                {formData.documentEvidence.map((row, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        value={row.DocumentReviewEvidenceReferenceNumber}
                        onChange={(e) =>
                          handleTableInputChange(
                            "documentEvidence",
                            index,
                            "DocumentReviewEvidenceReferenceNumber",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.DocumentNameAndVersion}
                        onChange={(e) =>
                          handleTableInputChange(
                            "documentEvidence",
                            index,
                            "DocumentNameAndVersion",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.DocumentPurposeDescription}
                        onChange={(e) =>
                          handleTableInputChange(
                            "documentEvidence",
                            index,
                            "DocumentPurposeDescription",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.DocumentRevisionDate}
                        onChange={(e) =>
                          handleTableInputChange(
                            "documentEvidence",
                            index,
                            "DocumentRevisionDate",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() =>
                          removeTableRow("documentEvidence", index)
                        }
                        disabled={formData.documentEvidence.length === 1}
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
              onClick={() => addTableRow("documentEvidence")}
              className={styles.addButton}
            >
              Add Document Evidence Row
            </button>
          </div>
          <h3 className={styles.subsectionTitle}>6.5 Interview Evidence</h3>
          <p className={styles.info}>
            Identify all evidence for testing procedures requiring an interview,
            such as interview notes. Include the following: (Add rows as needed)
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>Reference Number</th>
                  <th className={styles.headerCell}>
                    Title of Workpaper with
                    <br /> Interview Notes
                  </th>
                  <th className={styles.headerCell}>Topics Covered</th>
                  <th className={styles.headerCell}>
                    Role(s) of Interviewee(s)
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.evenRow}>
                  <td>
                    <p className={styles.info}>EXAMPLE: Int-01</p>
                  </td>
                  <td>
                    <p className={styles.info}>
                      Assessor notes from interview with Information Security
                      Manager
                    </p>
                  </td>
                  <td>
                    <p className={styles.info}>
                      Information security processes including security
                      vulnerability risk ranking, anti-malware configurations,
                      and cryptographic key management.
                    </p>
                  </td>
                  <td>
                    <p className={styles.info}>Information Security Manager</p>
                  </td>
                  <td>
                    <p className={styles.info}>Example</p>
                  </td>
                </tr>
                {formData.interviewEvidence.map((row, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        value={row.InterviewEvidenceReferenceNumber}
                        onChange={(e) =>
                          handleTableInputChange(
                            "interviewEvidence",
                            index,
                            "InterviewEvidenceReferenceNumber",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.InterviewEvidenceWorkpaperTitle}
                        onChange={(e) =>
                          handleTableInputChange(
                            "interviewEvidence",
                            index,
                            "InterviewEvidenceWorkpaperTitle",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.InterviewTopicsDescription}
                        onChange={(e) =>
                          handleTableInputChange(
                            "interviewEvidence",
                            index,
                            "InterviewTopicsDescription",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.IntervieweeRoles}
                        onChange={(e) =>
                          handleTableInputChange(
                            "interviewEvidence",
                            index,
                            "IntervieweeRoles",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() =>
                          removeTableRow("interviewEvidence", index)
                        }
                        disabled={formData.interviewEvidence.length === 1}
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
              onClick={() => addTableRow("interviewEvidence")}
              className={styles.addButton}
            >
              Add Interview Evidence Row
            </button>
          </div>
          <h3 className={styles.subsectionTitle}>
            6.6 Other Assessment Evidence
          </h3>
          <p className={styles.info}>
            Identify evidence for any testing procedure that requires
            observation of processes or examination of system evidence, such as
            review of configurations, settings, audit logs, access control
            lists, etc. Include the following: (Add rows as needed.)
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>Reference Number</th>
                  <th className={styles.headerCell}>
                    Title of Workpaper or Evidence
                  </th>
                  <th className={styles.headerCell}>
                    Topics Covered or Evidence Collected
                  </th>
                  <th className={styles.headerCell}>
                    Sample Set Reference Number from Table 6.3 (if applicable)
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.evenRow}>
                  <td>
                    <p className={styles.info}>EXAMPLE: Evidence-1</p>
                  </td>
                  <td>
                    <p className={styles.info}>Windows Config-1</p>
                  </td>
                  <td>
                    <p className={styles.info}>
                      Configuration settings for: Passwords, Logging, Services
                      and Protocols.{" "}
                    </p>
                  </td>
                  <td>
                    <p className={styles.info}>Sample Set 1 </p>
                  </td>
                </tr>
                {formData.assessmentEvidence.map(
                  (row: AssessmentEvidenceRow, index: number) => (
                    <tr key={index} className={styles.evenRow}>
                      <td>
                        <input
                          type="text"
                          value={row.AEvidenceRefNo}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleTableInputChange(
                              "assessmentEvidence",
                              index,
                              "AEvidenceRefNo",
                              e.target.value
                            )
                          }
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.ATitle_Evidence}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleTableInputChange(
                              "assessmentEvidence",
                              index,
                              "ATitle_Evidence",
                              e.target.value
                            )
                          }
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.ATopicsCovered}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleTableInputChange(
                              "assessmentEvidence",
                              index,
                              "ATopicsCovered",
                              e.target.value
                            )
                          }
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.ASampleSetRefNo}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleTableInputChange(
                              "assessmentEvidence",
                              index,
                              "ASampleSetRefNo",
                              e.target.value
                            )
                          }
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() =>
                            removeTableRow("assessmentEvidence", index)
                          }
                          disabled={formData.assessmentEvidence.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addTableRow("assessmentEvidence")}
            >
              Add Assessment Evidence Row
            </button>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default SamplingEvidence;
