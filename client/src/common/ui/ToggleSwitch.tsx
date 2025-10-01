import { Switch, FormControlLabel, Box } from "@mui/material";

interface ToggleSwitchProps {
  checked: boolean;
}

const ToggleSwitch = ({ checked }: ToggleSwitchProps) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          disabled
          color="success"
          size="small" 
        />
      }
      label={
        <Box
          sx={{
            minWidth: "60px", 
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "bold",
            color: checked ? "green" : "gray",
            marginLeft:-1
          }}
        >
          {checked ? "Active" : "Inactive"}
        </Box>
      }
      sx={{
        bgcolor: checked ? "rgba(0, 200, 83, 0.1)" : "rgba(0, 0, 0, 0.05)",
        px: 0.5,
        py: 0.5,
        borderRadius: 5,
      }}
    />
  );
};

export default ToggleSwitch;
