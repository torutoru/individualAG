import {  styled } from '@mui/material';

export const MainContainer = styled('main')(({ theme }) => ({
    maxWidth: 'var(--max-content-view-width)',
    margin: '0 auto',
    padding: 'var(--content-padding-small)',
    [theme.breakpoints.up('sm')]: {
     padding: 'var(--content-padding-large)',
     h2: {
      fontSize: '1.8rem'
     }
    },
}));

export default {};