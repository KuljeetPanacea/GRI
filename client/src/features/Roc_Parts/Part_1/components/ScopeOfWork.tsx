import React from "react";
import styles from "../styles/ContactInfo.module.css";
import { useScopeOfWork } from "../hooks/useScopeOfWork"; // adjust path if needed
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { Alert, Snackbar } from "@mui/material";
const ScopeOfWork: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    updateProduct,
    addProduct,
    removeProduct,
    snackbar,
    handleCloseSnackbar,
    isDirty
  } = useScopeOfWork();

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formHead}>
          <h3 className={styles.subsectionTitle}>
            3. Description of Scope of Work and Approach Taken
          </h3>
          <PrimaryButton children={"Save"} type="submit" disabled={!isDirty} />
        </div>
        <div className={styles.container}>
          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>
              3.1 Assessor's Validation of Defined Scope Accuracy
            </h3>
            <p className={styles.info}>
              Describe how the assessor validated the accuracy of the defined
              PCI DSS scope for the assessment: As noted in Payment Card
              Industry Data Security Standard (PCI DSS) Requirements and Testing
              Procedures: <br />
              "The minimum steps for an entity to confirm the accuracy of their
              PCI DSS scope are specified in PCI DSS Requirement 12.5.2. The
              entity is expected to retain documentation to show how PCI DSS
              scope was determined. The documentation is retained for assessor
              review and for reference during the entity's next PCI DSS scope
              confirmation activity. For each PCI DSS assessment, the assessor
              validates that the scope of the assessment is accurately defined
              and documented."
            </p>

            <div className={styles.fieldGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Describe how the assessor's evaluation of scope differs from
                  the assessed entity's evaluation of scope as documented in
                  Requirement 12.5. If no difference was identified, mark as
                  "Not Applicable."
                </label>
                <input
                  type="text"
                  name="ScopeEvaluationDifference_Description"
                  value={formData.ScopeEvaluationDifference_Description}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Provide the name of the assessor who attests that: • They have
                  performed an independent evaluation of the scope of the
                  assessed entity's PCI DSS environment. • If the assessor's
                  evaluation identified areas of scope not included in the
                  assessed entity's documented scope, the assessed entity has
                  updated their scoping documentation. • The scope of the
                  assessment is complete and accurate to the best of the
                  assessor's knowledge.
                </label>
                <input
                  type="text"
                  name="AssessorName_ScopeAttestation"
                  value={formData.AssessorName_ScopeAttestation}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Describe any business functions, locations, payment channels,
                  or other areas of scope that were excluded from the assessment
                  including the following: • What was excluded. • Why was it
                  excluded. • If it was included in a separate assessment. If
                  none, mark as "Not Applicable."
                </label>
                <input
                  type="text"
                  name="ExcludedScopeAreas_Description"
                  value={formData.ExcludedScopeAreas_Description}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Identify any factors that resulted in reducing or limiting
                  scope (for example, segmentation of the environment, use of a
                  P2PE solution, etc.) If none, mark as "Not Applicable."
                </label>
                <input
                  type="text"
                  name="ScopeReductionFactors_Identification"
                  value={formData.ScopeReductionFactors_Identification}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Describe any use of SAQ eligibility criteria in determining
                  applicability of PCI DSS requirements for this assessment,
                  including the following: • The type of SAQ applied. • The
                  eligibility criteria for the applicable SAQ. • How the
                  assessor verified that the assessed entity's environment meets
                  the eligibility criteria. If not used mark as "Not
                  Applicable." Note: The only SAQ for service providers is SAQ D
                  for Service Providers. All other SAQs are for merchants only.
                </label>
                <input
                  type="text"
                  name="SAQEligibilityCriteria_Description"
                  value={formData.SAQEligibilityCriteria_Description}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Additional information, if applicable:
                </label>
                <input
                  type="text"
                  name="AssessorsValidation_AddInfo"
                  value={formData.AssessorsValidation_AddInfo}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>
            <h3 className={styles.subsectionTitle}>3.2 Segmentation </h3>
            <div className={styles.fieldGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Indicate whether the assessed entity has used segmentation to
                  reduce the scope of the assessment. Note: An environment with
                  no segmentation is considered a "flat" network where all
                  systems are considered to be in scope.
                </label>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    name="ScopeReductionSegmentation_Yes"
                    checked={formData.ScopeReductionSegmentation_Yes}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                  <span className={styles.checkboxLabel}>Yes</span>
                  <input
                    type="checkbox"
                    name="ScopeReductionSegmentation_No"
                    checked={formData.ScopeReductionSegmentation_No}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                  <span className={styles.checkboxLabel}>No</span>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  • If "No," provide the name of the assessor who attests that
                  the entire network has been included in the scope of the
                  assessment.
                </label>
                <input
                  type="text"
                  name="AssessorNetworkScope"
                  value={formData.AssessorNetworkScope}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.fullLabel}>
                  • If "Yes," complete the following:
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  – Describe how the segmentation is implemented, including the
                  technologies and processes used.
                </label>
                <input
                  type="text"
                  name="ImplemetedSeg_Desc"
                  value={formData.ImplemetedSeg_Desc}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  – Describe the environments that were confirmed to be out of
                  scope as a result of the segmentation methods.
                </label>
                <input
                  type="text"
                  name="OutOfScopeEnv_Seg"
                  value={formData.OutOfScopeEnv_Seg}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  – Provide the name of the assessor who attests that the
                  segmentation was verified to be adequate to reduce the scope
                  of the assessment AND that the technologies/processes used to
                  implement segmentation were included in this PCI DSS
                  assessment.
                </label>
                <input
                  type="text"
                  name="Assessor_SegVerification"
                  value={formData.Assessor_SegVerification}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>

            <h3 className={styles.subsectionTitle}>
              3.3 PCI SSC Validated Products and Solutions
            </h3>
            <p className={styles.info}>
              For purposes of this document, "Lists of Validated Products and
              Solutions" means the lists of validated products, solutions,
              and/or components, appearing on the PCI SSC website
              (www.pcisecuritystandards.org) (For example: 3DS Software
              Development Kits, Approved PTS Devices, Validated Payment
              Software, Point to Point Encryption [P2PE] solutions,
              Software-Based PIN Entry on COTS [SPoC] solutions, Contactless
              Payments on COTS [CPoC] solutions, and Mobile Payment on COTS
              [MPoC] products.)
            </p>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Indicate whether the assessed entity uses one or more PCI SSC
                validated products or solutions.
              </label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="UsesValidatedPCIProducts_Yes"
                  checked={formData.UsesValidatedPCIProducts_Yes}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>Yes</span>
                <input
                  type="checkbox"
                  name="UsesValidatedPCIProducts_No"
                  checked={formData.UsesValidatedPCIProducts_No}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>No</span>
              </div>
            </div>
            <label className={styles.fullLabel}>
              If "Yes," provide the following information regarding items the
              organization uses from PCI SSC's Lists of Validated Products and
              Solutions:
            </label>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.headerRow}>
                    <th className={styles.headerCell}>
                      Name of PCI SSC validated product or solution
                    </th>
                    <th className={styles.headerCell}>
                      Version of product or solution
                    </th>
                    <th className={styles.headerCell}>
                      PCI SSC Standard to which product or solution was
                      validated
                    </th>
                    <th className={styles.headerCell}>
                      PCI SSC listing reference number
                    </th>
                    <th className={styles.headerCell}>
                      Expiry date of listing
                    </th>
                    <th className={styles.headerCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.ValidatedProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className={
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                      }
                    >
                      <td className={styles.cell}>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) =>
                            updateProduct(product.id, "name", e.target.value)
                          }
                          className={styles.input}
                          placeholder="Enter product name"
                        />
                      </td>
                      <td className={styles.cell}>
                        <input
                          type="text"
                          value={product.version}
                          onChange={(e) =>
                            updateProduct(product.id, "version", e.target.value)
                          }
                          className={styles.input}
                          placeholder="Enter version"
                        />
                      </td>
                      <td className={styles.cell}>
                        <input
                          type="text"
                          value={product.standard}
                          onChange={(e) =>
                            updateProduct(
                              product.id,
                              "standard",
                              e.target.value
                            )
                          }
                          className={styles.input}
                          placeholder="Enter PCI SSC standard"
                        />
                      </td>
                      <td className={styles.cell}>
                        <input
                          type="text"
                          value={product.listingReference}
                          onChange={(e) =>
                            updateProduct(
                              product.id,
                              "listingReference",
                              e.target.value
                            )
                          }
                          className={styles.input}
                          placeholder="Enter reference number"
                        />
                      </td>
                      <td className={styles.cell}>
                        <input
                          type="date"
                          value={product.expiryDate}
                          onChange={(e) =>
                            updateProduct(
                              product.id,
                              "expiryDate",
                              e.target.value
                            )
                          }
                          className={styles.input}
                        />
                      </td>
                      <td className={styles.cell}>
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className={styles.removeButton}
                          disabled={formData.ValidatedProducts.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.tableActions}>
                <button
                  type="button"
                  onClick={addProduct}
                  className={styles.addButton}
                >
                  Add Product
                </button>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Provide the name of the assessor who attests that they have
                  read the instruction manual associated with each of the
                  software/solution(s) listed above and confirmed that the
                  merchant has implemented the solution per the instructions and
                  detail in the instruction manual.
                </label>
                <input
                  type="text"
                  name="AssessorName_SolutionImplementation"
                  value={formData.AssessorName_SolutionImplementation}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Any additional comments or findings the assessor would like to
                  include, if applicable.
                </label>
                <input
                  type="text"
                  name="AdditionalComments_Findings"
                  value={formData.AdditionalComments_Findings}
                  onChange={handleInputChange}
                  className={styles.input}
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

export default ScopeOfWork;
