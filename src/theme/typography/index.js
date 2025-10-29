import { createTheme } from '@mui/material';

const typography = createTheme({
  typography: {
    fontFamily: ['Pretendard', 'sans-serif'].join(','),
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.5,
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.45,
    },
    h5: {
      fontWeight: 600,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    'body-xlarge': {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.6,
    },
    'body-large': {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    'body-medium': {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.45,
    },
    'body-small': {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    'body-xsmall': {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    error: {
      color: '#ff0202',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.6875rem',
      lineHeight: 1.5,
      color: '#6C6E78',
    },
    ellipsis: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
});

export default typography;
