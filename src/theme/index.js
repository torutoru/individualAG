import { createTheme } from '@mui/material/styles';
import typography from './typography';
import etc from './etc';

const theme = createTheme({
  ...typography,
  ...etc,
  palette: {
    highlight: {
      darkest: '#006FFD',
      darker: '#2897FF',
      medium: '#6FB9FF',
      lightest: '#EAF2FF',
    },
    neutrallight: {
      dark: '#D4D6DD',
      medium: '#E8E9F1',
    },
  },
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