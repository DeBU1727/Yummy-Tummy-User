import { createTheme } from '@mui/material/styles';

export const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const theme = createTheme({
  palette: {
    primary: {
      main: BRAND.primary,
    },
    secondary: {
      main: BRAND.secondary,
    },
    background: {
      default: BRAND.bg,
      paper: BRAND.surface,
    },
    text: {
      primary: BRAND.text,
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 900,
    },
    h2: {
      fontWeight: 900,
    },
    h3: {
      fontWeight: 900,
    },
    h4: {
      fontWeight: 900,
    },
    h5: {
      fontWeight: 900,
    },
    h6: {
      fontWeight: 900,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 30,
        },
      },
    },
  },
});

export default theme;
