import React from "react";
import styles from "../styles/ContactInfo.module.css";
import { useBusinessOverview } from "../hooks/useBusinessOverview"; // adjust the path as needed
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { Alert, Snackbar } from "@mui/material";

const BusinessOverview: React.FC = () => {
  const {
    formData,
    errors,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    snackbar,
    handleCloseSnackbar,
    isDirty
  } = useBusinessOverview();

  return (
      <React.Fragment>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHead}>
        <h3 className={styles.subsectionTitle}>2. Business Overview</h3>
        <PrimaryButton children={"Save"} type="submit" disabled={!isDirty} />
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.subsectionTitle}>
            2.1 Description of the Entity’s Payment Card Business
          </h3>
          <p className={styles.note}>
            Provide an overview of the entity’s payment card business,
            including:
          </p>

          <div className={styles.fieldGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Describe the nature of the entity’s business
                <p className={styles.note}>
                  <b>Note: </b>This is not intended to be a cut-and-paste from
                  the entity’s website but should be a tailored description that
                  shows the assessor understands the business of the entity
                  being assessed.
                </p>
              </label>
              <input
                type="text"
                name="businessNatureDescription"
                value={formData.businessNatureDescription}
                onChange={handleInputChange}
                className={styles.input}
              />
              {errors.businessNatureDescription && (
                <div className={styles.error}>
                  {errors.businessNatureDescription}
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Describe the entity’s business, services, or functions that
                store, process, or transmit account data
              </label>
              <input
                type="text"
                name="accountDataHandlingDescription"
                value={formData.accountDataHandlingDescription}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Describe any services or functions that the entity performs that
                could impact the security of account data.
              </label>
              <input
                type="text"
                name="securityImpactingServices"
                value={formData.securityImpactingServices}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Identify the payment channels the entity utilizes.
              </label>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="Card_Present_Yes"
                  checked={formData.paymentChannels.cardPresent}
                  onChange={handleCheckboxChange}
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>Card-Present</span>

                <input
                  type="checkbox"
                  name="Mail_Tele_Order_Yes"
                  checked={formData.paymentChannels.moto}
                  onChange={handleCheckboxChange}
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>
                  Mail Order/Telephone Order (MOTO)
                </span>

                <input
                  type="checkbox"
                  name="E-com_Yes"
                  checked={formData.paymentChannels.ecommerce}
                  onChange={handleCheckboxChange}
                  className={styles.input}
                />
                <span className={styles.checkboxLabel}>E-Commerce</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Other details, if applicable:
              </label>
              <input
                type="text"
                name="otherDetails"
                value={formData.otherDetails}
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

export default BusinessOverview;
