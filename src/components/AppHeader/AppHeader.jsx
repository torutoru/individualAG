import React from 'react';
import {AppBar, Toolbar, IconButton, Typography, Box} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {useNavigate} from 'react-router-dom'

const AppHeader = ({title = '', onBack}) => {

  const navigate = useNavigate();
  const handleRightClick = () => {
    navigate('/profile');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{bgcolor: 'background.default'}}>
      <Toolbar sx={{minHeight: 64}}>
        <Box sx={{width: 48}}>
          {onBack && (<IconButton onClick={onBack} size="small" sx={{color: 'text.primary'}}>
            <ArrowBackIcon/>
          </IconButton>)}
        </Box>
        <Typography
          variant="h6"
          sx={{flex: 1, textAlign: 'center', fontWeight: 700, color: 'text.primary'}}
        >
          {title}
        </Typography>
        <Box sx={{width: 48, display: 'flex', justifyContent: 'flex-end'}}>
          <IconButton onClick={() => handleRightClick()} size="small" sx={{color: 'text.primary'}}>
            <PersonOutlineIcon/>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>);
};

export default AppHeader;
