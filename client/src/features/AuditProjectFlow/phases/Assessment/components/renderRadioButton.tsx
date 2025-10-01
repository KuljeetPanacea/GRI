import { useState } from "react";
import { Typography, Box, FormControl, Select, MenuItem } from "@mui/material";
import styles from "../../../styles/PV360.module.css";
import style from "./AssessmentComponents.module.css";
import { SelectChangeEvent } from "@mui/material";
import { useSelector } from "react-redux";
import { selectedDeviceKey, selectSelectedControl } from "../../../../../redux/assessmentSlice";
import useExpandPanel from "../useExpandPanel";
import { saveDeviceRefFinding } from "../../../../../api/rocData";
import useAxios from "../../../../../api/useAxios";
import { useGapEvidenceOptions } from "./useGapEvidenceOptions";

const STATUS_COLORS: Record<string, string> = {
  "In Place": "#2E7D32",
  "Not in Place": "#D32F2F",
  "Not tested": "#F57C00",
  "Not Applicable": "#424242",
};

type RadioButtonsProps = {
  disabled?: boolean;
  value: string;
};

export const RadioButtons = ({
  disabled = false,
  value,
}: RadioButtonsProps) => {
  const axios = useAxios()
  const options = ["In Place", "Not in Place", "Not tested", "Not Applicable"];
  const [selectedOption, setSelectedOption] = useState(value || "");
  const deviceRefKey = useSelector(selectedDeviceKey);
  const selectedControl = useSelector(selectSelectedControl);
  const { handleButtonSelect } = useExpandPanel();
  const {fetchEvidenceOptions} = useGapEvidenceOptions();
  const handleChange = async (event: SelectChangeEvent) => {
    
    const value = event?.target?.value;
    setSelectedOption(value);
    const data ={
      deviceRefFinding: value
    }
    await saveDeviceRefFinding(axios,deviceRefKey.split("_")[1],selectedControl?.title || "",data)
    if(deviceRefKey != "" && value == "Not in Place")
    {
      handleButtonSelect("Identified gaps");
      fetchEvidenceOptions()
    }
  };

  const renderOption = (option: string) => (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        sx={{
          backgroundColor: STATUS_COLORS[option],
        }}
        className={style.addDescriptionText}
      />
      <Typography>{option}</Typography>
    </Box>
  );

  return (
    <Box className={style.radioButtonsContainer}>
      <FormControl variant="outlined" sx={{ minWidth: 160 }}>
        <Select
          displayEmpty
          value={selectedOption}
          onChange={handleChange}
          className={styles.customSelect}
          disabled={disabled}
          renderValue={(selected) =>
            selected ? renderOption(selected) : <Typography color="textSecondary">Asset finding</Typography>
          }
        >
          <MenuItem disabled value="">
            <Typography color="textSecondary">Asset finding</Typography>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {renderOption(option)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
