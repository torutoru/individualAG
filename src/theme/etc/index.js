import { createTheme } from '@mui/material';

const etc = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default {
  breakpoints: etc.breakpoints,
  shape: etc.shape,
  shadows: etc.shadows,
};
