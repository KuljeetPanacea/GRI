import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./AddDeviceModel.module.css";
import SelectDropdown from "../../../../../common/ui/SelectDropdown";
import { useDeviceIdentification } from "../useDeviceIdentificationView";
import { device } from "../../../../../redux/projectManagementSlice";
import { getAEProjects } from "../../../../../api/project";
import useAxios from "../../../../../api/useAxios";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose }) => {
  const {
    deviceRefName,
    setDeviceRefName,
    deviceType,
    questionnaire,
    questionnaires,
    setQuestionnaire,
    primaryAEStakeholder,
    setPrimaryAEStakeholder,
    department,
    setDepartment,
    // ipAddress,
    // setIpAddress,
    addNewDevice,
    selectedProject,
    deviceOptions,
    handleDeviceCategoryChange,
    questionnaireOptions,
    setdeviceType,
  } = useDeviceIdentification();

  const [error, setError] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [AEInternal, setAEInternal] = useState([]);
  const axiosInstance = useAxios();
  
  useEffect(()=>{
    const fetchAE = (async ()=>{
      const response = await getAEProjects(axiosInstance,selectedProject?._id || "")
      setAEInternal(response)
    })
    fetchAE()
  },[])

  useEffect(() => {
    if (isOpen) {
      setDeviceRefName("");
      setdeviceType("");
      setQuestionnaire(undefined);
      setDepartment("");
      setPrimaryAEStakeholder([]);
      // setIpAddress("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddDevice = () => {
    const missing: string[] = [];

    if (!deviceRefName) missing.push("deviceRefName");
    if (!deviceType) missing.push("deviceType");
    if (!questionnaire?.id) missing.push("questionnaireId");

    if (missing.length > 0) {
      setError("*Please fill in all required fields before submitting.");
      setMissingFields(missing);
      return;
    }

    const newDeviceObj: device = {
      deviceRefName,
      deviceType,
      questionnaireId: questionnaire?.id,
      department,
      primaryAEStakeholderId: primaryAEStakeholder[0],
      // ipAddress,
    };

    addNewDevice(newDeviceObj);
    setError("");
    setMissingFields([]);
    onClose();
  };



  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={()=>{
          onClose();
           setError("");
           setMissingFields([]);
          }}>
          <CloseIcon />
        </button>
        <h2>Add New Device</h2>
        {error && <p className={styles.errorText}>{error}</p>}{" "}
        {/* Error Message */}
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>Device Reference Name</label>
            <input
              type="text"
              value={deviceRefName}
              onChange={(e) => setDeviceRefName(e.target.value)}
              className={`${styles.input} ${
                missingFields.includes("deviceRefName")
                  ? styles.errorBorder
                  : ""
              }`}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Device Type</label>
            <SelectDropdown
              options={deviceOptions}
              value={deviceType}
              onChange={(e) => {
                handleDeviceCategoryChange(e.target.value);
                setdeviceType(e.target.value);
              }}
              className={`${styles.noBorderDropdown} ${
                missingFields.includes("deviceType") ? styles.errorBorder : ""
              }`}
              placeholder="Select an option"
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>Questionnaire Name</label>
            <SelectDropdown
              options={
                questionnaireOptions?.filter(
                  (option): option is { label: string; value: string } =>
                    option.label !== undefined && option.value !== undefined
                ) ?? []
              }
              value={questionnaire?.id}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedQ = questionnaires.find(
                  (q) => q.id === selectedId
                );
                if (selectedQ) setQuestionnaire(selectedQ);
              }}
              placeholder="Select an option"
              className={`${styles.noBorderDropdown} ${
                missingFields.includes("questionnaireId")
                  ? styles.errorBorder
                  : ""
              }`}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Department</label>
            <SelectDropdown
              options={[
                { label: "IT", value: "IT" },
                { label: "HR", value: "HR" },
                { label: "Operation", value: "Operation" },
                { label: "Applications & Development", value: "Applications & Development" },
                { label: "Others", value: "Others" },
              ]}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Select Department"
              className={styles.noBorderDropdown}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <label>AE Internal Assessors</label>
            <SelectDropdown
              isMultiple={true}
              placeholder="Select an option"
              options={
                AEInternal?.map((stakeholder: {name: string,email: string}) => ({
                  label: stakeholder.name,
                  value: stakeholder.email,
                })) ?? []
              }
              value={primaryAEStakeholder.map((p) => p)}
              onChange={(e) => {
                const selectedValues: string[] = e.target.value;
                setPrimaryAEStakeholder((prev) =>
                  Array.from(new Set([...prev, ...selectedValues]))
                );
              }}
            />
          </div>
          {/* <div className={styles.inputWrapper}>
            <label>IP Address</label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className={styles.underlineInput}
            />
          </div> */}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button className={styles.addButton} onClick={handleAddDevice}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
