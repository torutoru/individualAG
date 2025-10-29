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
     MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--max-content-view-width': '1280px',
          '--content-padding-small': '24px',
          '--content-padding-large': '40px',
          '--radius-small': '12px',
          '--radius-medium': '20px',
          '--radius-large': '30px',
          '--icon-small': '20px',
          '--icon-medium': '24px',
          '--icon-large': '42px',
        },
      },
    },
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