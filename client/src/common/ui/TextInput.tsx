import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const InputWrapper = styled("div")({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
});

const StyledInput = styled("input")<{ error?: boolean; inputType?: string }>(
  ({ error, inputType }) => ({
    width: "100%",
    padding: inputType === "password" ? "8px 30px 8px 0" : "8px", // Conditional padding
    border: "none",
    borderBottom: `2px solid ${error ? "red" : "#BCBCBC"}`,
    outline: "none",
    fontSize: "0.8rem",
    color: "#383838",
    backgroundColor: "transparent",
    transition: "border-color 0.3s ease",
    borderRadius: "0px",

    "&:focus": {
      borderBottom: `2px solid ${error ? "red" : "#8C8C8C"}`,
    },

    "&::placeholder": {
      color: "#BCBCBC",
      fontSize: "0.8rem",
    },

    "&:disabled": {
      borderBottom: "2px dashed #BCBCBC",
      backgroundColor: "#F5F5F5",
      cursor: "not-allowed",
    },
  })
);


const ToggleButton = styled(IconButton)({
  position: "absolute",
  right: 0,
  padding: "4px",
});

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: boolean; // New prop to indicate an error
}

const TextInput: React.FC<TextInputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className,
  name,
  id,
  required = false,
  disabled = false,
  maxLength,
  autoComplete,
  error = false, // Default is false
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <InputWrapper>
      <StyledInput
        type={isPassword && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        name={name}
        id={id}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        error={error} // Pass error prop to change border color
        {...rest}
      />
      {isPassword && (
        <ToggleButton onClick={() => setShowPassword((prev) => !prev)} size="small">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </ToggleButton>
      )}
    </InputWrapper>
  );
};

export default TextInput;
