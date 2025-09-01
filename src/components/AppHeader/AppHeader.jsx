import React from 'react';
import {AppBar, Toolbar, IconButton, Typography, Box} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {useNavigate} from 'react-router-dom'

const AppHeader = ({title = '', onBack}) => {

  const navigate = useNavigate();
  const handleRightClick = () => {
    navigate('/profile');
  };

  // 테스트 코드 - 뒤로가기 버튼 숨기기
  const isTest = true;

  return (
    <AppBar position="sticky" elevation={0} sx={{bgcolor: 'background.default'}}>
      <Toolbar>
{/*        <Box sx={{width: 48}}>
          {onBack && (<IconButton onClick={onBack} sx={{color: 'text.primary'}}>
            <ArrowBackIosNewRoundedIcon/>
          </IconButton>)}
        </Box>*/}
        <Box sx={{width: 48}}>
          {!isTest && onBack && (<IconButton onClick={onBack} sx={{color: 'text.primary'}}>
            <ArrowBackIosNewRoundedIcon/>
          </IconButton>)}
        </Box>
        <Typography
          variant="h6"
          sx={{flex: 1, textAlign: 'center', fontWeight: 700, color: 'text.primary'}}
        >
          {title}
        </Typography>
        <Box sx={{width: 48, display: 'flex', justifyContent: 'flex-end'}}>
          <IconButton onClick={() => handleRightClick()} sx={{color: 'text.primary'}}>
            <PersonOutlineIcon/>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>);
};

export default AppHeader;
