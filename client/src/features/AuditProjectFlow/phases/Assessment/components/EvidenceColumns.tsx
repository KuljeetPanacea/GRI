import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectDropdown from "../../../../../common/ui/SelectDropdown";
import { EvidenceType } from "./useEvidenceUpload";
import styles from "./Evidence.module.css"
 
export const gapEvidenceColumns = (
  onDeleteRow: (id: number) => void,
  handleAddDescription: (id: number) => void,
  handleOnChange: (
    event: React.ChangeEvent<{ value: unknown }>,
    rowId: number,
    field: "evidence" | "oldEvidence"
  ) => void,

  handleOnChangeStatus: (
    event: React.ChangeEvent<{ value: unknown }>,
    rowId: number
  ) => void,
  newEvidenceOptions: EvidenceType[],
  oldEvidenceOptions: EvidenceType[],
  statusOptions: string[]
) => {
 
  const formatEvidenceOptions = (list: EvidenceType[]) =>
    list.map((item) => ({
      label: item.name,
      value: item.name, // Use the name as value for proper matching
    }));
 
  const formatStatusOptions = (statuses: string[]) =>
    statuses.map((status) => ({
      label: status,
      value: status,
    }));
 
  // Helper function to get evidence names from stored evidence objects
  const getEvidenceNames = (evidenceData: string | string[] | object[] | undefined): string[] => {
    if (!evidenceData) return [];
    const evidenceArray = Array.isArray(evidenceData) ? evidenceData : [evidenceData];
    return evidenceArray.map(item => {
     
      if (typeof item === 'object' && item !== null && 'name' in item) {
        return (item as { name: string }).name;
      }

      if (typeof item === 'string') {
        try {
          const evidenceObj = JSON.parse(item);
          return evidenceObj.name;
        } catch {
          
          return item;
        }
      }
      // Fallback
      return String(item);
    }).filter((name, index, arr) => arr.indexOf(name) === index);
  };
 
 
 
   
  return [
    {
      key: "controlNumber",
      header: "Control Number",
      render: (_: unknown, row: { controlNumber: string  }) => (
        <Box
        className={styles.statusLabel}
        >
          {row.controlNumber}
        </Box>
      ),
    },
    {
      key: "gapDescription",
      header: "Gap description",
      render: (_: unknown, row: { id: number; gapDescription: string; }) => (
        <Typography
          onClick={() => handleAddDescription(row.id)}
          className={styles.addDescriptionText}
        >
          {row.gapDescription
            ? row.gapDescription.slice(0, 30) + "..."
            : "Click here to add gap description"}
        </Typography>
      ),
    },
    {
      key: "oldEvidence",
      header: "Previous evidence uploaded",
      render: (_: unknown, row: { oldEvidence: string | string[] | object[] | undefined; id: number; }) => (
        <SelectDropdown
          isMultiple={true}
          options={formatEvidenceOptions(oldEvidenceOptions)}
          value={getEvidenceNames(row.oldEvidence)}
          onChange={(e) => handleOnChange(e, row.id, "oldEvidence")}
          placeholder="Select previous evidence"
        />
      ),
    },
    {
      key: "currentEvidence",
      header: "Latest evidence uploaded",
      render: (_: unknown, row: { evidence: string | string[] | object[] | undefined; id: number; }) => (
        <SelectDropdown
          isMultiple={true}
          options={formatEvidenceOptions(newEvidenceOptions)}
          value={getEvidenceNames(row.evidence)}
          onChange={(e) => handleOnChange(e, row.id, "evidence")}
          placeholder="Select latest evidence"
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_: unknown, row: { status:string ; id: number; }) => (
        <SelectDropdown
          isMultiple={false}
          options={formatStatusOptions(statusOptions)}
          value={row.status || statusOptions[0]}
          onChange={(e) => handleOnChangeStatus(e, row.id)}
          placeholder="Select status"
        />
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (_: unknown, row: { id: number; }) => (
        <IconButton
          size="small"
          onClick={() => onDeleteRow(row.id)}
          className={styles.iconStyle}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
};
 
 