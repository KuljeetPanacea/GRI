import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'noBorder',
})<{ noBorder?: boolean }>(({ noBorder }) => ({
  display: "inline-block",
  padding: "0.5rem 1rem",
  width: "auto",
  maxWidth: "fit-content",
  whiteSpace: "nowrap",
  backgroundColor: "white",
  color: "#DB1F42",
  border: noBorder ? "none" : "1px solid #DB1F42",
  borderRadius: "25px",
  fontSize: "12px",
  fontWeight: "500",
  "&:hover": {
    backgroundColor: "#DB1F42",
    color: "white",
    border: noBorder ? "none" : "1px solid #DB1F42",
  },
  "&:active": {
    backgroundColor: "#DB1F42",
    color: "white",
    border: noBorder ? "none" : "1px solid #DB1F42",
  },
}));

const PrimaryButton = ({
  children,
  onClick,
  startIcon,
  endIcon,
  className,
  type = "button",
  disabled = false,
  noBorder = false, // default false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  noBorder?: boolean; // new optional prop
}) => (
  <StyledButton
    variant="contained"
    onClick={onClick}
    startIcon={startIcon}
    endIcon={endIcon}
    className={className}
    type={type}
    disabled={disabled}
    noBorder={noBorder} // pass it to styled component
  >
    {children}
  </StyledButton>
);

export default PrimaryButton;