import { styled } from '@mui/material';

export const HomeMain = styled('main')(() => ({
    position: 'relative', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    color: '#fff',
    zIndex: '20',

    a: {
        color: '#fff',
        textDecoration: 'none',
    }
}));

export default {};