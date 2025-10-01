import React from "react";
import { useContactInfo } from "../hooks/useContactInfo";
import styles from "../styles/ContactInfo.module.css";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { Alert, Snackbar } from "@mui/material";

const ContactInfo: React.FC = () => {
  const { formData, handleInputChange, handleSubmit, errors, snackbar, handleCloseSnackbar, isDirty } =
    useContactInfo();

  return (
    <React.Fragment>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHead}>
        <h3 className={styles.subsectionTitle}>
          1. Contact Information and Summary of Results
        </h3>
        <PrimaryButton children={"Save"} type="submit" disabled={!isDirty} />
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <h4 className={styles.subsectionTitle}>1.1 Contact Information</h4>

          <div className={styles.fieldGroup}>
            <h5 className={styles.groupTitle}>Assessed Entity</h5>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Company name:</label>
              <input
                type="text"
                name="company.name"
                value={formData.company.name}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors["company.name"] && (
                <span className={styles.error}>{errors["company.name"]}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>DBA (doing business as):</label>
              <input
                type="text"
                name="company.dba"
                value={formData.company.dba}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Mailing address:</label>
              <input
                type="text"
                name="company.mailingAddress"
                value={formData.company.mailingAddress}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Company main website:</label>
              <input
                type="url"
                name="company.website"
                value={formData.company.website}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Contact name:</label>
              <input
                type="text"
                name="contact.name"
                value={formData.contact.name}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors["contact.name"] && (
                <span className={styles.error}>{errors["contact.name"]}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Contact title:</label>
              <input
                type="text"
                name="contact.title"
                value={formData.contact.title}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Contact phone number:</label>
              <input
                type="tel"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Contact email address:</label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors["contact.email"] && (
                <span className={styles.error}>{errors["contact.email"]}</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <h5 className={styles.groupTitle}>
              Assessor Entity (Internal Security Assessors)
            </h5>
            <p className={styles.note}>
              Identify all Internal Security Assessors (ISAs) involved in the
              assessment. If there were none, mark as Not Applicable. (Add rows
              as needed)
            </p>

            <div className={styles.inputGroup}>
              <label className={styles.label}>ISA name:</label>
              <input
                type="text"
                name="internalSecurityAssessor.name"
                value={formData.internalSecurityAssessor.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <h5 className={styles.groupTitle}>
              Qualified Security Assessor Company
            </h5>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Company name:</label>
              <input
                type="text"
                name="qsaCompany.name"
                value={formData.qsaCompany.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Mailing address:</label>
              <input
                type="text"
                name="qsaCompany.mailingAddress"
                value={formData.qsaCompany.mailingAddress}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Company website:</label>
              <input
                type="url"
                name="qsaCompany.website"
                value={formData.qsaCompany.website}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <h5 className={styles.groupTitle}>
              Lead Qualified Security Assessor
            </h5>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Lead Assessor name:</label>
              <input
                type="text"
                name="leadAssessor.name"
                value={formData.leadAssessor.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Assessor phone number:</label>
              <input
                type="tel"
                name="leadAssessor.phone"
                value={formData.leadAssessor.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Assessor email address:</label>
              <input
                type="email"
                name="leadAssessor.email"
                value={formData.leadAssessor.email}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Assessor certificate number:
              </label>
              <input
                type="text"
                name="leadAssessor.certificateId"
                value={formData.leadAssessor.certificateId}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <h5 className={styles.groupTitle}>Additional Assessors</h5>
            <p className={styles.note}>
             Identify all Associate QSAs involved in the assessment. If there were none, mark as Not Applicable. (Add rows as needed)
            </p>
              <div className={styles.inputverticalContainer}>

            <div className={styles.inputGroupVertical}>
              <label className={styles.fullLabel}>Associate QSA name:</label>
              <input
                type="text"
                name="associateQSA.name"
                value={formData.associateQSA.name}
                onChange={handleInputChange}
                className={styles.input}
                />
            </div>

            <div className={styles.inputGroupVertical}>
              <label className={styles.fullLabel}>
                Associate QSA (mentor name):
              </label>
              <input
                type="text"
                name="associateQSA.mentorName"
                value={formData.associateQSA.mentorName}
                onChange={handleInputChange}
                className={styles.input}
                />
            </div>
                </div>

            <p className={styles.note}>
             Identify all other assessors involved in the assessment. If there were none, mark as Not Applicable. (Add rows as needed)
            </p>
<div className={styles.inputverticalContainer}>

            <div className={styles.inputGroupVertical}>
              <label className={styles.fullLabel}>Assessor name:</label>
              <input
                type="text"
                name="associateAssessor.name"
                value={formData.associateAssessor.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroupVertical}>
              <label className={styles.fullLabel}>
                Assessor certificate number: 
              </label>
              <input
                type="text"
                name="associateAssessor.certificateId"
                value={formData.associateAssessor.certificateId}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
</div>
          </div>

          <div className={styles.fieldGroup}>
            <h5 className={styles.groupTitle}>
              Assessor Quality Assurance (QA) Primary Reviewer for this specific report (not the general QA contact for the QSA Company)
            </h5>

            <div className={styles.inputGroup}>
              <label className={styles.label}>QA reviewer name:</label>
              <input
                type="tel"
                name="qaReviewer.name"
                value={formData.qaReviewer.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>QA reviewer phone number:</label>
              <input
                type="tel"
                name="qaReviewer.phone"
                value={formData.qaReviewer.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>QA reviewer email address:</label>
              <input
                type="email"
                name="qaReviewer.email"
                value={formData.qaReviewer.email}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                QA reviewer’s PCI credentials or certificate number: (See the current QSA Qualification Requirements for acceptable credentials)
              </label>
              <input
                type="text"
                name="qaReviewer.credentials"
                value={formData.qaReviewer.credentials}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          <h4 className={styles.subsectionTitle}>
            1.2 Date and Timeframe of Assessment
          </h4>
          <div className={styles.fieldGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Date of Report:
                <p className={styles.note}>
                  Note: The “Date of Report” indicates the completion date of
                  the ROC, and therefore must be no earlier than the date on
                  which the QSA Company and assessed entity agree on the final
                  version of the ROC.{" "}
                </p>
              </label>
              <input
                type="string"
                name="assessmentDates.reportDate"
                value={formData.assessmentDates.reportDate}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Date assessment began:
                <p className={styles.note}>
                  Note: This is the first date that evidence was gathered, or
                  observations were made.{" "}
                </p>
              </label>
              <input
                type="string"
                name="assessmentDates.startDate"
                value={formData.assessmentDates.startDate}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Date of Report:
                <p className={styles.note}>
                  Note: This is the last date that evidence was gathered, or
                  observations were made.{" "}
                </p>
              </label>
              <input
                type="string"
                name="assessmentDates.endDate"
                value={formData.assessmentDates.endDate}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Identify the date(s) spent onsite at the assessed entity.
              </label>
              <input
                type="string"
                name="assessmentDates.onsiteDays"
                value={formData.assessmentDates.onsiteDays}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>
          <h4 className={styles.subsectionTitle}>
            1.3 Remote Assessment Activities
          </h4>
          <p className={styles.note}>
            Refer to the PCI SSC Remote Assessment Guidelines and Procedures on
            the PCI SSC website for more information.{" "}
          </p>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              To what extent were remote testing methods used for this
              assessment?
            </label>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="remoteAssessment.performedOnsite"
                checked={formData.remoteAssessment.performedOnsite}
                onChange={handleInputChange}
                className={styles.input}
              />{" "}
              <span className={styles.checkboxLabel}>
                All testing was performed onsite
              </span>
              <input
                type="checkbox"
                name="remoteAssessment.combinationRemoteOnsite"
                checked={formData.remoteAssessment.combinationRemoteOnsite}
                onChange={handleInputChange}
                className={styles.input}
              />{" "}
              <span className={styles.checkboxLabel}>
                A combination of onsite and remote testing methods was used
              </span>
              <input
                type="checkbox"
                name="remoteAssessment.performedRemotely"
                checked={formData.remoteAssessment.performedRemotely}
                onChange={handleInputChange}
                className={styles.input}
              />{" "}
              <span className={styles.checkboxLabel}>
                All testing was performed remotely
              </span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              If remote testing was used for any part of the assessment, briefly
              describe why onsite testing was not feasible or practical.
            </label>
            <input
              type="string"
              name="remoteAssessment.justificationIfRemote"
              value={formData.remoteAssessment.justificationIfRemote}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <h4 className={styles.subsectionTitle}>
            1.4 Additional Services Provided by QSA Company
          </h4>
          <p className={styles.note}>
            The PCI SSC Qualification Requirements for Qualified Security
            Assessors (QSA) includes content on “Independence,” which specifies
            requirements for assessor disclosure of services and/or offerings
            that could reasonably be viewed to affect the independence of
            assessment. Complete the section below after reviewing the relevant
            portions of the Qualification Requirements to ensure responses are
            consistent with documented obligations
          </p>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Indicate whether the QSA Company provided any consultation on the
              development or implementation of controls used for the Customized
              Approach.
              <p className={styles.note}>
                Note: This does not apply to the assessment of the Customized
                Approach.
              </p>
            </label>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="qsaServices.consultationProvided"
                checked={formData.qsaServices.consultationProvided}
                onChange={handleInputChange}
                className={styles.input}
              />
              <span className={styles.checkboxLabel}>Yes</span>
              <input
                type="checkbox"
                name="qsaServices.consultationNotProvided"
                checked={formData.qsaServices.consultationNotProvided}
                onChange={handleInputChange}
                className={styles.input}
              />
              <span className={styles.checkboxLabel}>No</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              If “Yes,” describe the nature of the consultation.
            </label>
            <input
              type="string"
              name="qsaServices.consultationDetails"
              value={formData.qsaServices.consultationDetails}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Disclose all products or services provided to the assessed entity
              by the QSA Company that are not listed above and that were
              reviewed during this assessment or could reasonably be viewed to
              affect independence of assessment.
            </label>
            <input
              type="string"
              name="qsaServices.additionalServicesReviewed"
              value={formData.qsaServices.additionalServicesReviewed}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Describe efforts made to ensure no conflict of interest resulted
              from the above-mentioned products and services provided by the QSA
              Company.
            </label>
            <input
              type="string"
              name="qsaServices.conflictMitigation"
              value={formData.qsaServices.conflictMitigation}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <h4 className={styles.subsectionTitle}>1.5 Use of Subcontractors</h4>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Indicate whether any assessment activities were subcontracted to
              another Assessor Company.
              <p className={styles.note}>
                Note: The use of subcontractors must conform with the
                requirements defined in the Qualification Requirements for
                Qualified Security Assessors (QSA) and Qualified Security
                Assessor Program Guide.
              </p>
            </label>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="subcontracting.used"
                checked={formData.subcontracting.used}
                onChange={handleInputChange}
                className={styles.input}
              />
              <span className={styles.checkboxLabel}>Yes</span>
              <input
                type="checkbox"
                name="subcontracting.notUsed"
                checked={formData.subcontracting.notUsed}
                onChange={handleInputChange}
                className={styles.input}
              />
              <span className={styles.checkboxLabel}>No</span>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              If “Yes,” describe the nature of the consultation.
            </label>
            <input
              type="string"
              name="subcontracting.description"
              value={formData.subcontracting.description}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <h4 className={styles.subsectionTitle}>1.6 Additional Information</h4>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Identify the number of consecutive years (including the current
              year) the QSA Company has issued ROCs for this entity.
            </label>
            <input
              type="string"
              name="history.consecutiveRocYears"
              value={formData.history.consecutiveRocYears}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <h4 className={styles.subsectionTitle}>
            1.7 Overall Assessment Result
          </h4>
          <p className={styles.note}>
            {" "}
            Indicate below whether a full or partial assessment was completed.
            Select only one.
          </p>
          <div className={styles.inputGroup}>
            <input
              type="checkbox"
              name="assessmentScope.fullAssessment"
              checked={formData.assessmentScope.fullAssessment}
              onChange={handleInputChange}
              className={styles.input}
            />
            <label className={styles.checklabel}>
              <b>Full Assessment: </b> All requirements have been assessed and
              therefore no requirements were marked as Not Tested.
            </label>
          </div>
          <div className={styles.inputGroup}>
            <input
              type="checkbox"
              name="assessmentScope.partialAssessment"
              checked={formData.assessmentScope.partialAssessment}
              onChange={handleInputChange}
              className={styles.input}
            />
            <label className={styles.checklabel}>
              <b>Partial Assessment: </b> One or more requirements have not been
              assessed and were therefore marked as Not Tested. Any requirement
              not assessed is noted as Not Tested in section 1.8.1 below.
            </label>
          </div>

          <div className={styles.fieldGroup}>
            <h5 className={styles.groupTitle}>
              Overall Assessment Result (Select only One)
            </h5>

            <div className={styles.inputGroup}>
              <input
                type="checkbox"
                name="assessmentOutcome.compliant"
                checked={formData.assessmentOutcome.compliant}
                onChange={handleInputChange}
                className={styles.input}
              />
              <label className={styles.checklabel}>
                <b>Compliant: </b>All sections of the PCI DSS ROC are complete,
                and all assessed requirements are marked as being either In
                Place or Not Applicable, resulting in an overall COMPLIANT
                rating; thereby the assessed entity has demonstrated compliance
                with all PCI DSS requirements except those noted as Not Tested
                above.
              </label>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="checkbox"
                name="assessmentOutcome.nonCompliant"
                checked={formData.assessmentOutcome.nonCompliant}
                onChange={handleInputChange}
                className={styles.input}
              />
              <label className={styles.checklabel}>
                <b>Non-Compliant: </b>Not all sections of the PCI DSS ROC are
                complete, or one or more requirements are marked as Not in
                Place, resulting in an overall NON-COMPLIANT rating; thereby the
                assessed entity has not demonstrated compliance with PCI DSS
                requirements.
              </label>
            </div>
            <div className={styles.inputGroup}>
              <input
                type="checkbox"
                name="assessmentOutcome.legalExceptionCompliant"
                checked={formData.assessmentOutcome.legalExceptionCompliant}
                onChange={handleInputChange}
                className={styles.input}
              />
              <label className={styles.checklabel}>
                <b>Compliant but with Legal Exception: </b>One or more assessed
                requirements in the ROC are marked as Not in Place due to a
                legal restriction that prevents the requirement from being met
                and all other assessed requirements are marked as being either
                In Place or Not Applicable, resulting in an overall COMPLIANT
                BUT WITH LEGAL EXCEPTION rating, thereby the assessed{" "}
              </label>
            </div>
          </div>

          {/* Assessment Finding Section */}
          <h4 className={styles.subsectionTitle}>1.8 Summary of Assessment</h4>
          <h4 className={styles.subsectionTitle}>
            1.8.1 Summary of Assessment Findings and Methods
          </h4>
          <p className={styles.note}>
            Indicate all the findings and assessment methods within each PCI DSS
            principal requirement. Select all that apply. For example, In Place
            and Not Applicable must both be selected for Requirement 1 if there
            is at least one sub-requirement marked In Place and one
            sub-requirement marked Not Applicable. The columns for Compensating
            Controls and Customized Approach must be selected if there is at
            least one sub-requirement within the principal requirement that
            utilizes the respective method. For example, Compensating Control
            and Customized Approach must both be checked if at least one
            sub-requirement utilizes Compensating Controls and at least one sub
            requirement utilizes a Customized Approach. If neither Compensating
            Controls nor Customized Approach are used, then leave both blank.
          </p>
          <div className={styles.fieldGroup}>
            <h5 className={styles.groupTitle}>Assessment Finding</h5>
            <p className={styles.note}>Select all options that apply.</p>

            <div className={styles.tableContainer}>
              <table className={styles.assessmentTable}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>PCI DSS Requirement</th>
                    <th className={styles.tableHeader}>In Place</th>
                    <th className={styles.tableHeader}>Not Applicable</th>
                    <th className={styles.tableHeader}>Not Tested</th>
                    <th className={styles.tableHeader}>Not in Place</th>
                    <th className={styles.tableHeader}>Compensating Control</th>
                    <th className={styles.tableHeader}>Customized Approach</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Requirement 1",
                    "Requirement 2",
                    "Requirement 3",
                    "Requirement 4",
                    "Requirement 5",
                    "Requirement 6",
                    "Requirement 7",
                    "Requirement 8",
                    "Requirement 9",
                    "Requirement 10",
                    "Requirement 11",
                    "Requirement 12",
                    "Appendix 1",
                    "Appendix 2",
                    "Appendix 3",
                  ].map((req) => {
                    const findingData =
                      formData.assessmentFindings?.[req] || {};
                    return (
                      <tr key={req}>
                        <td className={styles.tableCell}>{req}:</td>

                        {/* Radio buttons for finding */}
                        {[
                          "InPlace",
                          "NotApplicable",
                          "NotTested",
                          "NotInPlace",
                        ].map((option) => (
                          <td key={option} className={styles.tableCell}>
                            <input
                              type="radio"
                              name={`assessmentFindings.${req}.finding`}
                              value={option}
                              checked={findingData.finding === option}
                              onChange={handleInputChange}
                              className={styles.checkbox}
                            />
                          </td>
                        ))}

                        {/* Checkbox for compensating control */}
                        <td className={styles.tableCell}>
                          <input
                            type="checkbox"
                            name={`assessmentFindings.${req}.compensatingControl`}
                            checked={!!findingData.compensatingControl}
                            onChange={handleInputChange}
                            className={styles.checkbox}
                          />
                        </td>

                        {/* Checkbox for customized approach */}
                        <td className={styles.tableCell}>
                          <input
                            type="checkbox"
                            name={`assessmentFindings.${req}.customizedApproach`}
                            checked={!!findingData.customizedApproach}
                            onChange={handleInputChange}
                            className={styles.checkbox}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className={styles.note}>
              In the sections below identify the sub-requirements with the
              following results and assessment methods. If there are none, enter
              "Not Applicable."
              <br />
              <strong>Note:</strong> Natural grouping of requirements is allowed
              (for example, Req. 3, 1.1, 1.1.1, 1.1.2, or 1.2.1 through 1.2.3,
              etc.) to reduce the number of individual requirements listed.
            </p>

            <div className={styles.tableContainer}>
              <table className={styles.assessmentTable}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>Not Applicable</th>
                    <th className={styles.tableHeader}>Not Tested</th>
                    <th className={styles.tableHeader}>
                      Not in Place Due to a Legal Restriction
                    </th>
                    <th className={styles.tableHeader}>
                      Not in Place Not Due to a Legal Restriction
                    </th>
                    <th className={styles.tableHeader}>Compensating Control</th>
                    <th className={styles.tableHeader}>Customized Approach</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.tableCell}>
                      <input
                        type="text"
                        name="assessmentSubReq.notApplicable"
                        value={formData.assessmentSubReq.notApplicable}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td className={styles.tableCell}>
                      <input
                        type="text"
                        name="assessmentSubReq.notTested"
                        value={formData.assessmentSubReq.notTested}
                        className={styles.input}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className={styles.tableCell}>
                      <input
                        type="text"
                        name="assessmentSubReq.notInPlaceLegal"
                        value={formData.assessmentSubReq.notInPlaceLegal}
                        className={styles.input}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className={styles.tableCell}>
                      <input
                        type="text"
                        name="assessmentSubReq.notInPlaceNotLegal"
                        value={formData.assessmentSubReq.notInPlaceNotLegal}
                        className={styles.input}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className={styles.tableCell}>
                      <input
                        type="text"
                        name="assessmentSubReq.compensatingControl"
                        value={formData.assessmentSubReq.compensatingControl}
                        className={styles.input}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className={styles.tableCell}>
                      <input
                        type="text"
                        name="assessmentSubReq.customizedApproach"
                        value={formData.assessmentSubReq.customizedApproach}
                        className={styles.input}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
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

export default ContactInfo;
