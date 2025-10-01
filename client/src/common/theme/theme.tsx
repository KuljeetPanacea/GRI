import { createTheme } from '@mui/material/styles';
 
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
 
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
      contrastText: '#fff',
    },
 
    info: {
      main: '#1976d2',
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
 
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#fff',
    },
 
    text: {
      primary: '#333',
      secondary: '#666',
    },
 
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#fff',
    },
 
    error: {
      main: '#f44336',
    },
 
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
  },
 
  typography: {
    fontSize: 16,
    htmlFontSize: 16,
    fontFamily:'Inter',
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      '@media (max-width:600px)': { fontSize: '12px' },
    },
 
    h1: {
      fontWeight: '600',
      fontSize: '2rem',
      '@media (max-width:600px)': { fontSize: '1.125rem' },
    },
    h2: {
      fontWeight: '600',
      fontSize: '1.5rem',
      '@media (max-width:600px)': { fontSize: '1rem' },
    },
    h3: {
      fontWeight: '600',
      fontSize: '1rem',
      '@media (max-width:600px)': { fontSize: '0.875rem' },
    },
    h4: {
      fontWeight: '600',
      fontSize: '0.875rem',
      '@media (max-width:600px)': { fontSize: '0.75rem' },
    },
    h5: {
      fontWeight: '600',
      fontSize: '0.75rem',
      '@media (max-width:600px)': { fontSize: '0.625rem' },
    },
 
    h6: {
      fontWeight: '600',
      fontSize: '0.625rem',
      '@media (max-width:600px)': { fontSize: '0.5rem' },
    },
    body1: {
      fontWeight: '400',
      fontSize: '1rem',
      '@media (max-width:600px)': { fontSize: '0.875rem' },
    },
    body2: {
      fontWeight: '400',
      fontSize: '0.875rem',
      '@media (max-width:600px)': { fontSize: '0.75rem' },
    },
 
  },
 
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
 
  components: {

  },
});
 
export default theme;