import React from "react";
import styles from "../../Part_1/styles/ContactInfo.module.css";

const AppendixD: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3>Appendix D Customized Approach</h3>
      <p className={styles.info}>
        This approach is intended for entities that decide to meet a PCI DSS
        requirement’s stated Customized Approach Objective in a way that does
        not strictly follow the defined requirement. The customized approach
        allows an entity to take a strategic approach to meeting a requirement’s
        Customized Approach Objective, so it can determine and design the
        security controls needed to meet the objective in a manner unique for
        that organization
      </p>
      <p className={styles.info}>
        <strong>The entity</strong> implementing a customized approach must
        satisfy the following criteria:
      </p>
      <ul className={styles.info}>
        <li className={styles.list}>
          Document and maintain evidence about each customized control,
          including all information specified in the Controls Matrix Template in
          PCI DSS v4.x: Sample Templates to Support Customized Approach on the
          PCI SSC website.
        </li>
        <li className={styles.list}>
          Perform and document a targeted risk analysis (PCI DSS Requirement
          12.3.2) for each customized control, including all information
          specified in the Targeted Risk Analysis Template in PCI DSS v4.x:
          Sample Templates to Support Customized Approach on the PCI SSC
          website.
        </li>
        <li className={styles.list}>
          Perform testing of each customized control to prove effectiveness, and
          document testing performed, methods used, what was tested, when
          testing was performed, and results of testing in the controls matrix.
        </li>
        <li className={styles.list}>
          Monitor and maintain evidence about the effectiveness of each
          customized control.
        </li>
        <li className={styles.list}>
          Provide completed controls matrix(es), targeted risk analysis, testing
          evidence, and evidence of customized control effectiveness to its
          assessor.
        </li>
      </ul>

      <p className={styles.info}>
        <strong>The assessor</strong> performing an assessment of customized
        controls must satisfy the following criteria:
        <ul className={styles.info}>
          <li className={styles.list}>
            Review the entity’s controls matrix(es), targeted risk analysis, and
            evidence of control effectiveness to fully understand the customized
            control(s) and to verify the entity meets all Customized Approach
            documentation and evidence requirements.
          </li>
          <li className={styles.list}>
            Derive and document the appropriate testing procedures needed to
            conduct thorough testing of each customized control.
          </li>
          <li className={styles.list}>
            Test each customized control to determine whether the entity’s
            implementation 1) meets the requirement’s Customized Approach
            Objective and 2) results in an “in place” finding for the
            requirement.
          </li>
          <li className={styles.list}>
            At all times, QSAs maintain independence requirements defined in the
            QSA Qualification Requirements. This means if a QSA is involved in
            designing or implementing a customized control, that QSA does not
            also derive testing procedures for, assess, or assist with the
            assessment of that customized control.
          </li>
        </ul>
      </p>
      <p className={styles.info}>
        The entity and its assessor are expected to work together to ensure 1)
        they agree that the customized control(s) fully meets the customized
        approach objective, 2) the assessor fully understands the customized
        control, and 3) the entity understands the derived testing the assessor
        will perform.
        </p>
        <p className={styles.info}>
        Use of the customized approach must be documented by a QSA or ISA in
        accordance with instructions in the Report on Compliance (ROC) Template
        and following the instructions in the FAQs for use with PCI DSS v4.x ROC
        Template available on the PCI SSC website. </p>
        <p className={styles.info}>
        Entities that complete a Self-Assessment Questionnaire are not eligible
        to use a customized approach; however, these entities may elect to have
        a QSA or ISA perform their assessment and document it in a ROC Template.{" "}
        </p>
        <p className={styles.info}>
        The use of the customized approach may be regulated by organizations
        that manage compliance programs (for example, payment brands and
        acquirers). Therefore, questions about use of a customized approach must
        be referred to those organizations, including, for example, whether an
        entity is required to use a QSA, or may use an ISA to complete an
        assessment using the customized approach.
         </p>
        <p className={styles.note}>
          <strong>Note: </strong>Compensating controls are not an option with
          the customized approach. Because the customized approach allows an
          entity to determine and design the controls needed to meet a
          requirement’s Customized Approach Objective, the entity is expected to
          effectively implement the controls it designed for that requirement
          without needing to also implement alternate, compensating controls.
        </p>
    </div>
  );
};

export default AppendixD;
