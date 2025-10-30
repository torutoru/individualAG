import { createTheme } from '@mui/material/styles';
import typography from './typography';
import etc from './etc';

const baseTheme = createTheme({
  ...typography,
  ...etc,
  
  palette: {
    primary: {
      main: '#006FFD',
    },
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
});

const theme = createTheme(baseTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--max-content-view-width': '1280px',
          '--appbar-height': '56px',
          '--bottom-navigation-height': '68px',
          '--content-padding-small': '24px',
          '--content-padding-large': '40px',
          '--radius-small': '12px',
          '--radius-medium': '20px',
          '--radius-large': '30px',
          '--icon-small': '20px',
          '--icon-medium': '24px',
          '--icon-large': '42px',
        },
        html: {
          fontSize: '16px',
          [baseTheme.breakpoints.up('sm')]: {
            fontSize: '20px',
          },
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