import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: 'none',
        color: '#fff',
          '&:hover': {
            textDecoration: 'underline',
            color: 'inherit',
          },
        },
      },
    },
  },
});

export default theme;