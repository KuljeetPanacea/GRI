// components/CheckToggle.tsx
import { Typography, IconButton, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useState } from 'react';

type CheckToggleProps = {
  label: string;
  checked?: boolean;
  onToggle?: (newValue: boolean) => void;
  color?: string; // default is 'red'
  className?: string;
};

const CheckToggle = ({
  label,
  checked: checkedProp,
  onToggle,
  color = 'red',
  className = '',
}: CheckToggleProps) => {
  const [internalChecked, setInternalChecked] = useState(false);

  const isControlled = typeof checkedProp === 'boolean';
  const checked = isControlled ? checkedProp : internalChecked;

  const handleToggle = () => {
    const newChecked = !checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onToggle?.(newChecked);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton onClick={handleToggle} sx={{ color, p: 0 }}>
        {checked ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon sx={{ color: 'grey' }} />}
      </IconButton>

      <Typography
        variant="body1"
        component="strong"
        className={className}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default CheckToggle;
