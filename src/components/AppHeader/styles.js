import { styled } from '@mui/material/styles';
import { AppBar } from '@mui/material';


export const AppbarContainer = styled(AppBar)(({ theme }) => ({
  height: 'var(--appbar-height)',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
}));

export default {};