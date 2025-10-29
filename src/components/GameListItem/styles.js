import { styled } from '@mui/material';
import { ListItem } from '@mui/material';


export const GamesListItem = styled(ListItem)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    gap: '16px',
    borderBottom: '1px solid',
    borderColor: theme.palette.neutrallight.dark,
    '&:hover': {
        backgroundColor: theme.palette.highlight.lightest,
    },
    '.MuiAvatar-root': {
        width: '100px',
        height: '100px',
        backgroundColor: theme.palette.highlight.lightest,
        borderRadius: '24px',
        color: theme.palette.text.primary,
        svg: {
            width: '40px',
            height: '40px'
        }
    }
}));

export default {};