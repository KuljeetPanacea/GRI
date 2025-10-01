import React, { ReactNode } from "react";
import { Select, MenuItem, SelectProps, styled } from "@mui/material";

// Custom styled Select component
const CustomSelect = styled(Select)({
  backgroundColor: 'white',
  borderRadius: '25px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#EBEBEB',
    borderRadius: '25px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#EBEBEB',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#DB1F42',
    borderWidth: '1px',
  },
  '& .MuiSelect-select': {
    padding: '8px 16px',
    fontSize: '14px',
    paddingRight: '24px',
    fontWeight: 500,
    display: 'block', // <-- was flex
    overflow: 'visible', // <-- fix ellipsis
    wordBreak: 'break-word', // <-- wrap long strings
    minHeight: 'auto',
  },
  '& .MuiSelect-icon': {
    right: '12px',
    color: '#666',
  },
});


// Custom styled MenuItem component
const CustomMenuItem = styled(MenuItem)({
  fontSize: '14px',
  padding: '10px 16px',
  '&:not(:last-child)': {
    borderBottom: '1px solid #EBEBEB',
  },
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&.Mui-selected': {
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
});

interface SelectDropdownProps extends Omit<SelectProps, 'onChange'> {
  isMultiple?: boolean;
  value: string | string[] | undefined; // value can be either a single string or an array
  onChange: (event: any) => void;
  options: string[] | { label: string; value: string }[]; // options can be an array of strings or an array of objects with label and value
  title?: string; // Made title optional
  placeholder?: string; // Optional placeholder parameter - only shown when explicitly provided
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  isMultiple,
  className,
  value,
  onChange,
  options,
  title,
  placeholder, // No default value - only show when explicitly provided
  ...props
}) => {
  // Check if the value is an array or a string to determine if it's multiple selection or not
  const handleChange = (event: any) => {
    const { target: { value } } = event;
    // If it is a multiple select (Array), we handle the value as an array
    if (isMultiple) {
      // Ensure that the value is correctly updated as an array (split by commas if necessary)
      onChange({
        target: { value: typeof value === 'string' ? value.split(',') : value },
      });
    } else {
      // For single select, directly assign the value (a single string)
      onChange({
        target: { value },
      });
    }
  };

  const renderValue = (selected: unknown): ReactNode => {
    // Check if a value is selected
    const isEmpty = isMultiple 
      ? !selected || (Array.isArray(selected) && selected.length === 0)
      : !selected;
    
    // Return placeholder only when no value is selected AND placeholder is explicitly provided
    if (isEmpty && placeholder) {
      return <span style={{ fontWeight: 'normal', opacity: 0.7 }}>{placeholder}</span>;
    }
    
    // For empty state without placeholder, just show title if available
    if (isEmpty && title) {
      return <>{title}</>;
    }
    
    // For empty state with no title and no placeholder, show empty content
    if (isEmpty) {
      return <></>;
    }
    
    const values = isMultiple && Array.isArray(selected) ? selected : [selected];
  
    const getLabel = (val: unknown): string => {
      const match = options.find(opt =>
        typeof opt === 'string'
          ? opt === val
          : opt.value === val
      );
      return typeof match === 'string' ? match : match?.label ?? '';
    };
  
    // If title is provided, show it with the values
    if (title) {
      return (
        <>
          {title}
          <span style={{ margin: '0 4px' }}>: </span>
          <span style={{ fontWeight: 'normal' }}>
            {values.map(getLabel).join(', ')}
          </span>
        </>
      );
    }
    
    // Just show values without title
    return (
      <span style={{ fontWeight: 'normal' }}>
        {values.map(getLabel).join(', ')}
      </span>
    );
  };
  
  return (
    <CustomSelect
      multiple={isMultiple} // Dynamically set the multiple prop based on the value type
      className={className}
      value={value || (isMultiple ? [] : '')} // Provide default value
      onChange={handleChange}
      displayEmpty
      renderValue={renderValue}
      {...props}
    >
      {options.map((option) => {
        const optValue = typeof option === 'string' ? option : option.value;
        const optLabel = typeof option === 'string' ? option : option.label;
        return (
          <CustomMenuItem key={optValue} value={optValue}>
            {optLabel}
          </CustomMenuItem>
        );
      })}
    </CustomSelect>
  );
};

export default SelectDropdown;