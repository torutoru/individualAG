import { styled } from '@mui/material';
import { Paper } from '@mui/material';


export const BottomNavigationContainer = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: '100',
  '.MuiBottomNavigation-root': {
    height: 'var(--bottom-navigation-height)',
    padding: '0 16px',
  },
  '.MuiBottomNavigationAction-label.Mui-selected': {
    paddingTop: '6px',
    color: theme.palette.text.primary,
    fontSize: '0.75rem',
  }
}));

export default {};