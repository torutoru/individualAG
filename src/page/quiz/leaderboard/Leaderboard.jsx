import React from 'react';
import {
  Box,
  List,
  ListItem,
  Grid,
  Typography,
} from '@mui/material';
import { loadUserProfile } from '../../../storage/profileManager';
import AwardScene from './AwardsScene';

const medalColor = {
  1: '1st', // gold
  2: '2nd', // silver
  3: '3rd', // bronze
};

/** 상단 1~3위: 트로피 아이콘 + 날짜 + 점수 */
const TopRank = ({ rank, dateLabel, score, size = 96 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
    <Box sx={{ position: 'relative', color: 'white', p: {margin: 0}, textAlign: 'center' }}>
      {/* 랭크 */}
      <Typography variant='h3' sx={{ fontSize: '1.2rem', fontWeight: '700' }}>
        {medalColor[rank]} Place
      </Typography>
      {/* 점수 */}
      <Typography>
        <strong>{score}</strong> Points
      </Typography>
      {/* 날짜 라벨 */}
      <Typography variant="body2">
        {dateLabel}
      </Typography>
    </Box>
  </Box>
);

/** 4위 이상: 아바타 제거, 왼쪽 등수 + 가운데 날짜 + 오른쪽 점수 */
const Row = ({ rank, dateLabel, score, highlight = false }) => (
  <ListItem
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '72px',
      borderWidth: '1px',
      borderBottomStyle: 'solid',
      borderColor: (theme)=>theme.palette.neutrallight.dark,
      // '.MuiTypography-root': { fontWeight: highlight ? '700' : undefined },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography sx={{ width: '30px', fontWeight: 600, textAlign: 'center' }}>
        {rank}
      </Typography>
      {/* 날짜만 표기 */}
      <Typography>
        <strong>{dateLabel}</strong>
      </Typography>
    </Box>
    <Typography>{score}</Typography>
  </ListItem>
);

const Leaderboard = () => {
  const userProfile = loadUserProfile();
  // 데모용 더미 데이터 (날짜/점수)
  const podium = [
    { rank: 2, dateLabel: '2025.08.31 (일)', score: 1200 },
    { rank: 1, dateLabel: '2025.09.01 (월)', score: 1250 },
    { rank: 3, dateLabel: '2025.08.28 (목)', score: 1150 },
  ];

  const others = [
    { rank: 4, dateLabel: '2025.08.26 (화)', score: 1100 },
    { rank: 5, dateLabel: '2025.08.24 (일)', score: 1050 },
    { rank: 6, dateLabel: '2025.08.20 (수)', score: 1000 },
    { rank: 7, dateLabel: '2025.08.18 (월)', score: 950 },
    { rank: 8, dateLabel: '2025.08.19 (월)', score: 850 },
    { rank: 9, dateLabel: '2025.08.20 (화)', score: 750 },
    { rank: 10, dateLabel: '2025.08.21 (수)', score: 650, highlight: true }, // 예: 개인 베스트 주간 하이라이트
  ];

  return (
    <>
      <Box sx={{ display: 'none', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={800}>
          {`${userProfile.name}, ${userProfile.age}세 성적표`}
        </Typography>
      </Box>
      {/* 1~3위 트로피 그리드 */}
      <AwardScene />
      <Grid container spacing={1} sx={{ position:'relative', width: {xs:'95%', sm:'80%'}, maxWidth: '500px', margin: {xs: '-150px auto 90px', sm: '-120px auto 70px'}, color: 'white'}}>
        <Grid size={4}>
          <TopRank rank={podium[0].rank} dateLabel={podium[0].dateLabel} score={podium[0].score} size={80} />
        </Grid>
        <Grid size={4}>
          <TopRank rank={podium[1].rank} dateLabel={podium[1].dateLabel} score={podium[1].score} size={96} />
        </Grid>
        <Grid size={4}>
          <TopRank rank={podium[2].rank} dateLabel={podium[2].dateLabel} score={podium[2].score} size={80} />
        </Grid>
      </Grid>
      {/* 4위 이하 목록 */}
      <List>
        {others.map((item) => (
          <Row
            key={item.rank}
            rank={item.rank}
            dateLabel={item.dateLabel}
            score={item.score}
            highlight={item.highlight}
          />
        ))}
      </List>
    </>
  );
};

export default Leaderboard;
