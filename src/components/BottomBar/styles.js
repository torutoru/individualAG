import { styled } from '@mui/material';
import { Paper } from '@mui/material';


export const BottomNavigationContainer = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  

  bgcolor: 'background.paper',
  zIndex: '100',
  '.MuiBottomNavigation-root': {
    height: '88px',
    padding: '0 16px',
  },
  '.MuiBottomNavigationAction-label.Mui-selected': {
    paddingTop: '6px',
    color: theme.palette.text.primary,
    fontSize: '0.75rem',
  }
}));

export default {};