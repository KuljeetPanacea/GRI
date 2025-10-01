import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  display: "inline-block",
  padding: "0.5rem 1rem",  
  width: "auto",     
  whiteSpace: "nowrap",
  backgroundColor: "#DB1F42",
  color: "white",
  borderRadius:'25px',
  fontSize:'12px',
  fontWeight:'500',
  "&:hover": {
    backgroundColor: "white",
    color: "#DB1F42",
    border: "1px solid #DB1F42", // Darker shade on hover
  },
  "&:active": {
    backgroundColor: "white",
    color: "#DB1F42",
    border: "1px solid #DB1F42",
  },
});

const PrimaryButtonLogin = ({
  children,
  onClick,
  startIcon,
  endIcon,
  className,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => (
  <StyledButton
    variant="contained"
    onClick={onClick}
    startIcon={startIcon}
    endIcon={endIcon}
    className={className}
    type={type}
    disabled={disabled} 
  >
    {children}
  </StyledButton>
);

export default PrimaryButtonLogin;
