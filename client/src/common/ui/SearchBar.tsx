import React from "react";
import { TextField, InputAdornment, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Custom styled TextField
const CustomTextField = styled(TextField)({
  height: "100%",
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    backgroundColor: '#fff',
    height: '100%', // Takes the height of the parent container
    display: 'flex',
    alignItems: 'center', // Ensures proper alignment
    '& fieldset': {
      borderColor: '#EBEBEB',
    },
    '&:hover fieldset': {
      borderColor: '#EBEBEB',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#DB1F42',
      borderWidth: '1px',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 16px', // Remove fixed padding to allow flexible height
    fontSize: '16px',
    color: '#666',
    height: '100%', // Ensures input fills the available height
    display: 'flex',
    alignItems: 'center',
    '&::placeholder': {
      color: '#666',
      opacity: 1,
    },
  },
});


// Custom styled SearchIcon
const CustomSearchIcon = styled(SearchIcon)({
  color: '#666',
  fontSize: '24px',
});

interface SearchBarProps {
  value: string;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, className }) => (
  <CustomTextField
   className={className}
    value={value}
    onChange={onChange}
    placeholder="Search..."
    variant="outlined"
    fullWidth
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <CustomSearchIcon />
        </InputAdornment>
      ),
    }}
  />
);

export default SearchBar;
