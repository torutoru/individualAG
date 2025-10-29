import {  styled } from '@mui/material';

export const MainContainer = styled('main')(({ theme }) => ({
    display: 'flex', 
    flexDirection: 'column',
    maxWidth: '1200px',
    padding: '24px',
    [theme.breakpoints.up('sm')]: {
     padding: '40px',
    },
}));

export default {};