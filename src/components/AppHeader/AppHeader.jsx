import React from 'react';
import {Toolbar, IconButton, Typography, Box} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useNavigate} from 'react-router-dom';
import { AppbarContainer } from './styles';

const AppHeader = ({title = '', onBack}) => {

  const navigate = useNavigate();
  const handleRightClick = () => {
    navigate('/profile');
  };

  // 테스트 코드 - 뒤로가기 버튼 숨기기
  const isTest = true;

  return (
    <AppbarContainer position="sticky" elevation={0}>
      <Toolbar>
        {!isTest && onBack && (<IconButton onClick={onBack} edge="start" sx={{ position: 'absolute', left: 8 }} aria-label="뒤로가기">
          <ArrowBackIosNewRoundedIcon/>
        </IconButton>)}
        <Typography
          component="p"
          fontWeight={600}
          sx={{ flexGrow: 1, textAlign: 'center' }}
        >
          {title}
        </Typography>
        <IconButton onClick={() => handleRightClick()} sx={{ position: 'absolute', right: 8 }} aria-label="프로필">
          <AccountCircleIcon/>
        </IconButton>
      </Toolbar>
    </AppbarContainer>);
};

export default AppHeader;
