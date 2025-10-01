import React from "react";
import styles from "../../Part_1/styles/ContactInfo.module.css";

const AppendixB: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3>Appendix B Compensating Controls</h3>
      <p className={styles.info}>
        Compensating controls may be considered when an entity cannot meet a PCI
        DSS requirement explicitly as stated, due to legitimate and documented
        technical or business constraints but has sufficiently mitigated the
        risk associated with not meeting the requirement through implementation
        of other, or compensating, controls. Compensating controls must satisfy
        the following criteria:
      </p>
      <ol className={styles.info}>
        <li className={styles.list}>Meet the intent and rigor of the original PCI DSS requirement</li>
        <li className={styles.list}>
          Provide a similar level of defense as the original PCI DSS
          requirement, such that the compensating control sufficiently offsets
          the risk that the original PCI DSS requirement was designed to defend
          against. To understand the intent of a requirement, see the Customized
          Approach Objective for most PCI DSS requirements. If a requirement is
          not eligible for the Customized Approach and therefore does not have a
          Customized Approach Objective, refer to the Purpose in the Guidance
          column for that requirement.{" "}
        </li>
        <li className={styles.list}>
          Be “above and beyond” other PCI DSS requirements. (Simply being in
          compliance with other PCI DSS requirements is not a compensating
          control.)
        </li>
        <li className={styles.list}>
          When evaluating “above and beyond” for compensating controls, consider
          the following:
          <div className={styles.list}>
            <p className={styles.note}>
              <strong>Note:</strong> All compensating controls must be reviewed
              and validated for sufficiency by the assessor who conducts the PCI
              DSS assessment. The effectiveness of a compensating control is
              dependent on the specifics of the environment in which the control
              is implemented, the surrounding security controls, and the
              configuration of the control. Entities should be aware that a
              given compensating control will not be effective in all
              environments.
            </p>
          </div>
          <ol >
            <li className={styles.list}>
              Existing PCI DSS requirements CANNOT be considered as compensating
              controls if they are already required for the item under review.
              For example, passwords for non-console administrative access must
              be sent encrypted to mitigate the risk of intercepting cleartext
              administrative passwords. An entity cannot use other PCI DSS
              password requirements (intruder lockout, complex passwords, etc.)
              to compensate for the lack of encrypted passwords, since those
              other password requirements do not mitigate the risk of
              interception of cleartext passwords. Also, the other password
              controls are already PCI DSS requirements for the item under
              review (passwords).
            </li>
            <li className={styles.list}>
              Existing PCI DSS requirements MAY be considered as compensating
              controls if they are required for another area but are not
              required for the item under review.
            </li>
            <li className={styles.list}>
              Existing PCI DSS requirements may be combined with new controls to
              become a compensating control. For example, if a company is unable
              to address a vulnerability that is exploitable through a network
              interface because a security update is not yet available from a
              vendor, a compensating control could consist of controls that
              include all of the following: 1) internal network segmentation, 2)
              limiting network access to the vulnerable interface to only
              required devices (IP address or MAC address filtering), and 3)
              IDS/IPS monitoring of all traffic destined to the vulnerable
              interface.
            </li>
          </ol>
        </li>
        <li className={styles.list}>
          Address the additional risk imposed by not adhering to the PCI DSS
          requirement.
        </li>
        <li className={styles.list}>
          Address the requirement currently and in the future. A compensating
          control cannot address a requirement that was missed in the past (for
          example, where the performance of a task was required two quarters
          ago, but that task was not performed).
        </li>
      </ol>
      <p className={styles.info}>
        The assessor is required to thoroughly evaluate compensating controls
        during each annual PCI DSS assessment to confirm that each compensating
        control adequately addresses the risk that the original PCI DSS
        requirement was designed to address, per items 1-6 above.<br/> To maintain
        compliance, processes and controls must be in place to ensure
        compensating controls remain effective after the assessment is complete.
        Additionally, compensating control results must be documented in the
        applicable report for the assessment (for example, a Report on
        Compliance or a Self-Assessment Questionnaire) in the corresponding PCI
        DSS requirement section, and included when the applicable report is
        submitted to the requesting organization.
      </p>
    </div>
  );
};

export default AppendixB;
