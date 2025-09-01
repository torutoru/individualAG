// src/pages/quiz/QuizLayout.jsx
import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {
  Box,
  Container,
} from '@mui/material';
import BottomBar from '../../components/BottomBar/BottomBar';
import AppHeader from '../../components/AppHeader/AppHeader'

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
        minHeight: '100dvh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 상단 헤더 */}
      <AppHeader title={tab.toUpperCase()} onBack={() => window.history.back()}/>

      {/* 메인 컨텐츠 (AppBar와 BottomBar 사이 여백 확보) */}
      <Container sx={{flex: 1, width: '100%', pt: 2, pb: 10}}>
        <Outlet/>
      </Container>

      {/* 하단 바 */}
      <BottomBar value={tab} onChange={handleChangeBottomBar}/>
    </Box>
  );
};

export default QuizLayout;
