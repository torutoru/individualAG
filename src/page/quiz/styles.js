import { styled } from '@mui/material/styles';

export const MainContainer = styled('main')(({ theme }) => ({
    maxWidth: 'var(--max-content-view-width)',
    minHeight: 'calc(100dvh - var(--appbar-height) - var(--bottom-navigation-height))',
    margin: '0 auto',
    padding: 'var(--content-padding-small)',
    [theme.breakpoints.up('sm')]: {
     padding: 'var(--content-padding-large)',
    },
}));

export default {};