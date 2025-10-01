/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Radio, RadioGroup, Typography, Box, RadioProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Option {
  label: string;
  value: string;
  color: string;
}

interface CustomRadioGroupProps {
  options: Option[];
  value?: string; // controlled value from parent
  onChange?: (value: string) => void; // callback to update parent
}

interface CustomRadioProps extends RadioProps {
  checkedcolor: string;
}

const StyledRadio = styled((props: CustomRadioProps) => {
  const { checkedcolor, ...rest } = props;
  return <Radio {...rest} />;
})<CustomRadioProps>(({ checkedcolor }) => ({
  padding: 4,
  "&.Mui-checked": {
    color: checkedcolor,
  },
}));

export const CustomRadioGroup = ({
  options,
  value = "",
  onChange,
}: CustomRadioGroupProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <RadioGroup
      row
      value={internalValue}
      onChange={handleChange}
      sx={{ gap: 2, justifyContent: "space-between" }}
    >
      {options.map(({ label, value, color }) => (
        <Box
          key={value}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <StyledRadio
            value={value}
            checkedcolor={color}
            size="small"
            checked={internalValue === value}
            sx={{ p: 0, mb: 1 }}
          />
          <Typography
            sx={{
              color: "black",
              fontSize: "0.6rem",
              textAlign: "center",
              p:0.5
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </RadioGroup>
  );
};
