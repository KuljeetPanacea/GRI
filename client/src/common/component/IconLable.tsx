
import { Box, Typography } from '@mui/material';
import { ReactElement } from 'react';

type IconLabelProps = {
  items: {
    icon: ReactElement;
    label: string;
    onClick?: () => void;
  }[];
  spacing?: number;
};

const IconLabel = ({ items, spacing = 1 }: IconLabelProps) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" gap={spacing}>
      {items.map((item, idx) => (
        <Box key={idx} display="flex" alignItems="center" gap={1} onClick={item.onClick} sx={{ cursor: item.onClick ? 'pointer' : 'default' }}>
          {item.icon}
          <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default IconLabel;
