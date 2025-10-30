// src/pages/quiz/QuizLayout.jsx
import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {
  Box,
  Container,
} from '@mui/material';
import BottomBar from '../../components/BottomBar/BottomBar';
import AppHeader from '../../components/AppHeader/AppHeader'
import { MainContainer } from './styles';

const QuizLayout = () => {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState('home');

  const handleChangeBottomBar = (next) => {
    let path = '/quiz-home';
    if (next === 'leaderboard') {
      path = '/quiz/leader-board';
    }
    if (next === 'stats') {
      path = '/quiz/stats';
    }
    if (next === 'settings') {
      path = '/quiz/settings';
    }
    setTab(next);
    navigate(path);
  };

  return (
    <Box
      sx={{
        minWidth: '375px',
        minHeight: '100dvh',
        bgcolor: 'background.default',
      }}
    >
      {/* 상단 헤더 */}
      <AppHeader title={tab.toUpperCase()} onBack={() => window.history.back()}/>

      {/* 메인 컨텐츠 (AppBar와 BottomBar 사이 여백 확보) */}
      <MainContainer>
        <Outlet/>
      </MainContainer>

      {/* 하단 바 */}
      <BottomBar value={tab} onChange={handleChangeBottomBar}/>
    </Box>
  );
};

export default QuizLayout;
