import { Box, FormControl, Input, MenuItem, Select, Typography } from "@mui/material";

interface SelectWithReasonInputProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  selectClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export const SelectWithReasonInput = ({
  options,
  value,
  onChange,
  placeholder = "Write reason for your finding here...",
  selectClassName,
  containerClassName,
  inputClassName,
}: SelectWithReasonInputProps) => {
  return (
    <Box className={containerClassName}>
      <FormControl variant="outlined" sx={{ minWidth: 100 }}>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClassName}
        >
          {options.map((option, idx) => (
            <MenuItem key={idx} value={option}>
              <Typography>{option}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box onClick={(e) => e.stopPropagation()}>
        <Input
          placeholder={placeholder}
          className={inputClassName}
        />
      </Box>
    </Box>
  );
};
