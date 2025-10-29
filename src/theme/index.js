import { createTheme } from '@mui/material/styles';
import typography from './typography';
import etc from './etc';

const theme = createTheme({
  ...typography,
  ...etc,
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