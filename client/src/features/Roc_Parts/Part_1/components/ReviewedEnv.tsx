import React from "react";
import { X, FileText, Image } from "lucide-react";
import styles from "../styles/ContactInfo.module.css";
import { useReviewedEnv } from "../hooks/useReviewedEnv";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import { Alert, Snackbar } from "@mui/material";

const ReviewedEnv: React.FC = () => {
  const {
    formData,
    handleFileUpload,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSubmit,
    dragOver,
    updateTableRow,
    handleCheckboxChange,
    formatFileSize,
    addRow,
    removeRow,
    snackbar,
    handleCloseSnackbar,
    isDirty
  } = useReviewedEnv();

  // Utility to show icon based on MIME type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image size={16} className={styles.fileIcon} />;
    }
    return <FileText size={16} className={styles.fileIcon} />;
  };

  const renderUploadSection = (
    type: "network" | "dataflow",
    title: string,
    description: string,
    files: File[],
    isDragOver: boolean
  ) => (
    <div className={styles.diagramSection}>
      <div
        className={`${styles.uploadArea} ${isDragOver ? styles.dragOver : ""}`}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={(e) => handleDragLeave(e, type)}
        onDrop={(e) => handleDrop(e, type)}
      >
        <div className={styles.uploadContent}>
          <h4 className={styles.uploadTitle}>{title}</h4>
          <p className={styles.uploadDescription}>{description}</p>
          <input
            type="file"
            id={`${type}-diagram-upload`}
            multiple
            accept=".jpg,.jpeg,.png,.gif,.svg,.pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileUpload(e.target.files, type)}
            className={styles.hiddenInput}
          />
          <label
            htmlFor={`${type}-diagram-upload`}
            className={styles.uploadButton}
          >
            Choose Files
          </label>
          <p className={styles.fileFormats}>
            Supported formats: JPG, PNG, GIF, SVG, PDF, DOC, DOCX, TXT
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className={styles.uploadedFiles}>
          <h5 className={styles.uploadedTitle}>
            Uploaded {title} ({files.length})
          </h5>
          <div className={styles.filesList}>
            {files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  {getFileIcon(file.type)}
                  <div className={styles.fileDetails}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index, type)}
                  className={styles.removeButton}
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <React.Fragment>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHead}>
        <h3 className={styles.subsectionTitle}>
          4. Details About Reviewed Environments
        </h3>
        <PrimaryButton children={"Save"} type="submit" disabled={!isDirty} />
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.subsectionTitle}>4.1 Network Diagrams</h3>
          <p className={styles.info}>
            Provide one or more network diagrams that:
            <br />
            • Shows all connections between the CDE and other networks,
            including any wireless networks. <br />• Is accurate and up to date
            with any changes to the environment. <br />
            • Illustrates all network security controls that are defined for
            connection points between trusted and untrusted networks. <br />
            • Illustrates how system components storing cardholder data are not
            directly accessible from the untrusted networks. <br />
            • Includes the techniques (such as intrusion-detection systems
            and/or intrusion-prevention systems) that are in place to monitor
            all traffic:
            <br />
            – At the perimeter of the cardholder data environment.
            <br />– At critical points in the cardholder data environment.
          </p>

          {renderUploadSection(
            "network",
            "Insert Network Diagrams",
            "Drag and drop your network diagrams here, or click to browse",
            formData.networkDiagrams,
            dragOver.network
          )}

          <h3 className={styles.subsectionTitle}>
            4.2 Account Dataflow Diagrams
          </h3>
          <p className={styles.info}>
            Provide one or more dataflow diagrams that:
            <br />
            • Shows all account data flows across systems and networks. <br />
            • Are accurate and up to date. <br />
          </p>

          {renderUploadSection(
            "dataflow",
            "Insert Data Flow Diagrams",
            "Drag and drop your data flow diagrams here, or click to browse",
            formData.dataFlowDiagrams,
            dragOver.dataflow
          )}

          <h3 className={styles.subsectionTitle}>
            4.2.1 Description of Account Data Flows
          </h3>
          <p className={styles.note}>
            Identify in which of the following account data flows the assessed
            entity participates:
            <br />
            Note: These data flows must be described in detail in the sections
            of the table that follow.
          </p>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="authorization"
              checked={formData.accountFlowOptions.authorization}
              onChange={handleCheckboxChange}
              className={styles.input}
            />{" "}
            <span className={styles.checkboxLabel}>Authorization</span>
            <input
              type="checkbox"
              name="capture"
              checked={formData.accountFlowOptions.capture}
              onChange={handleCheckboxChange}
              className={styles.input}
            />{" "}
            <span className={styles.checkboxLabel}>Capture</span>
            <input
              type="checkbox"
              name="settlement"
              checked={formData.accountFlowOptions.settlement}
              onChange={handleCheckboxChange}
              className={styles.input}
            />{" "}
            <span className={styles.checkboxLabel}>Settlement</span>
            <input
              type="checkbox"
              name="chargebackDispute"
              checked={formData.accountFlowOptions.chargebackDispute}
              onChange={handleCheckboxChange}
              className={styles.input}
            />{" "}
            <span className={styles.checkboxLabel}>Chargeback/Dispute</span>
            <input
              type="checkbox"
              name="refunds"
              checked={formData.accountFlowOptions.refunds}
              onChange={handleCheckboxChange}
              className={styles.input}
            />{" "}
            <span className={styles.checkboxLabel}>Refunds</span>
            <input
              type="checkbox"
              name="other"
              checked={formData.accountFlowOptions.other}
              onChange={handleCheckboxChange}
              className={styles.input}
            />{" "}
            <span className={styles.checkboxLabel}>Other</span>
          </div>
          <p className={styles.note}>
            <b> Identify and describe all data flows.</b> Descriptions should
            include how and where account data enters the environment, is
            transmitted, is processed, is stored, and how and why any personnel
            access the account data. Add rows as necessary.
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>
                    Account data flows (For example, account data flow 1,
                    account data flow 2)
                  </th>
                  <th className={styles.headerCell}>
                    Description (Include the type of account data)
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.accountFlows.map((flow, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        name="flow"
                        value={flow.flow}
                        onChange={(e) =>
                          updateTableRow(
                            "accountFlows",
                            index,
                            "flow",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="description"
                        value={flow.description}
                        onChange={(e) =>
                          updateTableRow(
                            "accountFlows",
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow("accountFlows", index)}
                        className={styles.removeButton}
                        title="Remove row"
                        disabled={formData.accountFlows.length === 1}
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
              onClick={() =>
                addRow("accountFlows", { flow: "", description: "" })
              }
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>

          <h3 className={styles.subsectionTitle}>
            4.3 Storage of Account Data
          </h3>
          <p className={styles.info}>
            Identify all databases, tables, and files storing account data and
            provide the following details:{" "}
          </p>
          <p className={styles.note}>
            <b>Note:</b> The list of files and tables that store account data in
            the table below must be supported by an inventory created (or
            obtained from the assessed entity) and retained by the assessor in
            the workpapers.
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>Data Store1</th>
                  <th className={styles.headerCell}>
                    File Name(s), <br />
                    Table Names(s) <br />
                    and/or Field Names
                  </th>
                  <th className={styles.headerCell}>
                    Account Data Elements Stored2
                  </th>
                  <th className={styles.headerCell}>How Data Is Secured3</th>
                  <th className={styles.headerCell}>
                    How Access to Data Stores Is Logged4
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.dataStorage.map((storage, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        name="dataStore"
                        value={storage.dataStore}
                        onChange={(e) =>
                          updateTableRow(
                            "dataStorage",
                            index,
                            "dataStore",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="fileTableField"
                        value={storage.fileTableField}
                        onChange={(e) =>
                          updateTableRow(
                            "dataStorage",
                            index,
                            "fileTableField",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="storedElements"
                        value={storage.storedElements}
                        onChange={(e) =>
                          updateTableRow(
                            "dataStorage",
                            index,
                            "storedElements",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="securityMethod"
                        value={storage.securityMethod}
                        onChange={(e) =>
                          updateTableRow(
                            "dataStorage",
                            index,
                            "securityMethod",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="loggingDescription"
                        value={storage.loggingDescription}
                        onChange={(e) =>
                          updateTableRow(
                            "dataStorage",
                            index,
                            "loggingDescription",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow("dataStorage", index)}
                        className={styles.removeButton}
                        title="Remove row"
                        disabled={formData.dataStorage.length === 1}
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
              onClick={() =>
                addRow("dataStorage", {
                  dataStore: "",
                  fileTableField: "",
                  storedElements: "",
                  securityMethod: "",
                  loggingDescription: "",
                })
              }
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>
          <p className={styles.info}>
            1 Database name, file server name, and so on.
            <br />
            2 For example, PAN, expiry, cardholder name, and so on.
            <br />
            3 For example, what type of encryption and strength.
            <br />4 Description of logging mechanism used for logging access to
            data—for example, describe the enterprise log management solution,
            application-level logging, operating system logging, etc. in place
          </p>

          <h3 className={styles.subsectionTitle}>4.3.1 Storage of SAD</h3>
          <p className={styles.note}>
            If SAD is stored complete the following:
            <br />
            <b>Note: </b>Anywhere SAD is stored should be documented in the
            table in 4.3
          </p>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Indicate whether SAD is stored post authorization:
            </label>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="sadStoredPostAuth_Yes"
                checked={formData.sadStoredPostAuth_Yes}
                onChange={handleCheckboxChange}
                className={styles.input}
              />{" "}
              <span className={styles.checkboxLabel}>Yes</span>
              <input
                type="checkbox"
                name="sadStoredPostAuth_No"
                checked={!formData.sadStoredPostAuth_No}
                onChange={handleCheckboxChange}
                className={styles.input}
              />{" "}
              <span className={styles.checkboxLabel}>No</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Indicate whether SAD is stored as part of Issuer functions:
            </label>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="sadStoredAsIssuer_Yes"
                checked={formData.sadStoredAsIssuer_Yes}
                onChange={handleCheckboxChange}
                className={styles.input}
              />{" "}
              <span className={styles.checkboxLabel}>Yes</span>
              <input
                type="checkbox"
                name="sadStoredAsIssuer_No"
                checked={!formData.sadStoredAsIssuer_No}
                onChange={handleCheckboxChange}
                className={styles.input}
              />{" "}
              <span className={styles.checkboxLabel}>No</span>
            </div>
          </div>

          <h3 className={styles.subsectionTitle}>
            4.4 In-Scope Third-Party Service Providers (TPSPs){" "}
          </h3>
          <p className={styles.info}>
            Provide the following for each third-party service provider: Refer
            to PCI DSS v4.x, section 4 Scope of PCI DSS Requirements, subsection
            Use of Third-Party Service Providers for more information.
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>Company Name</th>
                  <th className={styles.headerCell}>
                    Identify what account data
                    <br /> is shared or, if account data
                    <br /> is not shared, how the <br /> organization could
                    impact
                    <br /> the security of account data1
                  </th>
                  <th className={styles.headerCell}>
                    Describe the purpose for utilizing the service provider2
                  </th>
                  <th className={styles.headerCell}>
                    Has the third party been assessed separately against PCI
                    DSS?
                  </th>
                  <th className={styles.headerCell}>
                    If Yes, identify the date and PCI DSS version of the AOC.
                  </th>
                  <th className={styles.headerCell}>
                    If No, were the services provided by the third party
                    included in this assessment?
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.serviceProviders.map((provider, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        name="companyName"
                        value={provider.companyName}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "companyName",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="accountDataImpact"
                        value={provider.accountDataImpact}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "accountDataImpact",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="purpose"
                        value={provider.purpose}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "purpose",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        name="assessedYes"
                        checked={provider.assessedYes}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "assessedYes",
                            e.target.checked
                          )
                        }
                        className={styles.input}
                      />
                      <span className={styles.checkboxLabel}>Yes</span>
                      <input
                        type="checkbox"
                        name="assessedNo"
                        checked={provider.assessedNo}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "assessedNo",
                            e.target.checked
                          )
                        }
                        className={styles.input}
                      />
                      <span className={styles.checkboxLabel}>No</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="aocDate"
                        value={provider.aocDate}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "aocDate",
                            e.target.value
                          )
                        }
                        placeholder="Enter Date"
                        className={styles.input}
                      />
                      <input
                        type="text"
                        name="aocVersion"
                        value={provider.aocVersion}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "aocVersion",
                            e.target.value
                          )
                        }
                        placeholder="Enter Version"
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        name="includedInAssessmentYes"
                        checked={provider.includedInAssessmentYes}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "includedInAssessmentYes",
                            e.target.checked
                          )
                        }
                        className={styles.input}
                      />{" "}
                      <span className={styles.checkboxLabel}> Yes </span>
                      <input
                        type="checkbox"
                        name="includedInAssessmentNo"
                        checked={provider.includedInAssessmentNo}
                        onChange={(e) =>
                          updateTableRow(
                            "serviceProviders",
                            index,
                            "includedInAssessmentNo",
                            e.target.checked
                          )
                        }
                        className={styles.input}
                      />
                      <span className={styles.checkboxLabel}>No</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow("serviceProviders", index)}
                        className={styles.removeButton}
                        title="Remove row"
                        disabled={formData.serviceProviders.length <= 1}
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
              onClick={() =>
                addRow("serviceProviders", {
                  companyName: "",
                  accountDataImpact: "",
                  purpose: "",
                  assessedYes: false,
                  assessedNo: false,
                  aocDate: "",
                  aocVersion: "",
                  includedInAssessmentYes: false,
                  includedInAssessmentNo: false,
                })
              }
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>
          <p className={styles.info}>
            1 For example, PAN, expiry date, providing support via remote
            access, and so on. <br />2 For example, third-party storage,
            transaction processing, custom software development, and so on.
          </p>

          <h3 className={styles.subsectionTitle}>4.5 In-Scope Networks</h3>
          <p className={styles.info}>
            Identify all in-scope networks including the type of network (for
            example, wired, Wi-Fi, cloud, etc.).
          </p>
          <p className={styles.note}>
            <b>Note:</b> This section must align with networks identified on the
            network diagram.
          </p>
          <p className={styles.info}>
            Describe all networks that store, process, and/or transmit Account
            Data:
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>
                    Network Name
                    <br />
                    (In scope)
                  </th>
                  <th className={styles.headerCell}>Type of Network</th>
                  <th className={styles.headerCell}>
                    Function/ Purpose of Network
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.inScopeNetworks.map((network, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={network.name}
                        onChange={(e) =>
                          updateTableRow(
                            "inScopeNetworks",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="type"
                        value={network.type}
                        onChange={(e) =>
                          updateTableRow(
                            "inScopeNetworks",
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="purpose"
                        value={network.purpose}
                        onChange={(e) =>
                          updateTableRow(
                            "inScopeNetworks",
                            index,
                            "purpose",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow("inScopeNetworks", index)}
                        className={styles.removeButton}
                        title="Remove row"
                        disabled={formData.inScopeNetworks.length <= 1}
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
              onClick={() =>
                addRow("inScopeNetworks", { name: "", type: "", purpose: "" })
              }
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>
          <p className={styles.info}>
            Describe all networks that do not store, process, and/or transmit
            Account Data but are still in scope—for example, connected to the
            CDE or provide management functions to the CDE, etc.:
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>
                    Network Name
                    <br />
                    (In scope)
                  </th>
                  <th className={styles.headerCell}>Type of Network</th>
                  <th className={styles.headerCell}>
                    Function/ Purpose of Network
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.connectedNonCDENetworks.map((network, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={network.name}
                        onChange={(e) =>
                          updateTableRow(
                            "connectedNonCDENetworks",
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="type"
                        value={network.type}
                        onChange={(e) =>
                          updateTableRow(
                            "connectedNonCDENetworks",
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="purpose"
                        value={network.purpose}
                        onChange={(e) =>
                          updateTableRow(
                            "connectedNonCDENetworks",
                            index,
                            "purpose",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          removeRow("connectedNonCDENetworks", index)
                        }
                        className={styles.removeButton}
                        title="Remove row"
                        disabled={formData.connectedNonCDENetworks.length <= 1}
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
              onClick={() =>
                addRow("connectedNonCDENetworks", {
                  name: "",
                  type: "",
                  purpose: "",
                })
              }
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>
          <h3 className={styles.subsectionTitle}>
            4.6 In-Scope Locations/Facilities
          </h3>
          <p className={styles.info}>
            Identify and provide details for all types of physical
            locations/facilities (for example, retail locations, corporate
            offices, data centers, call centers and mail rooms) in scope. Add
            rows, as needed.
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>
                    Facility Type
                    <br />
                    (Datacenters, corporate office, call center, mail processing
                    facility, etc.)
                  </th>
                  <th className={styles.headerCell}>
                    Total Number of Locations
                    <br />
                    (How many locations of this type are in scope)
                  </th>
                  <th className={styles.headerCell}>
                    Location(s) of Facility <br />
                    (for example, city, country)
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.facilities.map((facility, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        name="type"
                        value={facility.type}
                        onChange={(e) =>
                          updateTableRow(
                            "facilities",
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="count"
                        value={facility.count}
                        onChange={(e) =>
                          updateTableRow(
                            "facilities",
                            index,
                            "count",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="location"
                        value={facility.location}
                        onChange={(e) =>
                          updateTableRow(
                            "facilities",
                            index,
                            "location",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow("facilities", index)}
                        className={styles.removeButton}
                        title="Remove row"
                        disabled={formData.facilities.length <= 1}
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
              onClick={() =>
                addRow("facilities", {
                  type: "",
                  count: "",
                  location: "",
                })
              }
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>
          <h3 className={styles.subsectionTitle}>
            4.7 In-Scope System Component Types
          </h3>
          <p className={styles.info}>
            Identify all types of system components in scope. Refer to PCI DSS
            v4.x section 4 Scope of PCI DSS Requirements for examples, that
            include but are not limited to, of system component types that are
            in scope for PCI DSS requirements.
            <br />
            For each item, even if they reside with other system components,
            list them below with each component with different roles, vendors,
            or make/model/version on separate rows. Add rows as needed.
          </p>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>
                    Type of System Component1
                  </th>
                  <th className={styles.headerCell}>
                    Total Number of System Components2
                  </th>
                  <th className={styles.headerCell}>Vendor</th>
                  <th className={styles.headerCell}>
                    Product Name and Version
                  </th>
                  <th className={styles.headerCell}>
                    Role/Function Description
                  </th>
                  <th className={styles.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.systemComponents.map((component, index) => (
                  <tr key={index} className={styles.evenRow}>
                    <td>
                      <input
                        type="text"
                        name="type"
                        value={component.type}
                        onChange={(e) =>
                          updateTableRow(
                            "systemComponents",
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="count"
                        value={component.count}
                        onChange={(e) =>
                          updateTableRow(
                            "systemComponents",
                            index,
                            "count",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="vendor"
                        value={component.vendor}
                        onChange={(e) =>
                          updateTableRow(
                            "systemComponents",
                            index,
                            "vendor",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="product"
                        value={component.product}
                        onChange={(e) =>
                          updateTableRow(
                            "systemComponents",
                            index,
                            "product",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="role"
                        value={component.role}
                        onChange={(e) =>
                          updateTableRow(
                            "systemComponents",
                            index,
                            "role",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeRow("systemComponents", index)}
                        className={styles.removeButton}
                        title="Remove row"
                        disabled={formData.systemComponents.length <= 1}
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
              onClick={() =>
                addRow("systemComponents", {
                  type: "",
                  count: "",
                  vendor: "",
                  product: "",
                  role: "",
                })
              }
              className={styles.addButton}
            >
              Add Row
            </button>
          </div>
          <p className={styles.info}>
            1 For example, application, firewall, server, IDS, Anti-malware
            software, database, and so on.
            <br />2 How many system components of this type are in scope.
          </p>
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

export default ReviewedEnv;
