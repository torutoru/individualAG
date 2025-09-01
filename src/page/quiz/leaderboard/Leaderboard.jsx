import React from 'react';
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const medalColor = {
  1: '#ffd700', // gold
  2: '#c0c0c0', // silver
  3: '#cd7f32', // bronze
};

/** 상단 1~3위: 트로피 아이콘 + 날짜 + 점수 */
const TopRank = ({ rank, dateLabel, score, size = 96 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
    <Box sx={{ position: 'relative' }}>
      {/* 트로피가 들어간 원형 배지 */}
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: 'background.default',
          border: '4px solid',
          borderColor: medalColor[rank] || 'transparent',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <EmojiEventsIcon
          sx={{
            fontSize: size * 0.55,
            color: medalColor[rank] || 'text.secondary',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.25))',
          }}
        />
      </Avatar>

      {/* 랭크 배지 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -8,
          right: -8,
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: medalColor[rank] || 'secondary.main',
          color: 'background.default',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800,
        }}
      >
        {rank}
      </Box>
    </Box>

    {/* 날짜 라벨 */}
    <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'center' }}>
      {dateLabel}
    </Typography>

    {/* 점수 */}
    <Typography variant="body1" sx={{ fontWeight: 700 }}>
      {score}점
    </Typography>
  </Box>
);

/** 4위 이상: 아바타 제거, 왼쪽 등수 + 가운데 날짜 + 오른쪽 점수 */
const Row = ({ rank, dateLabel, score, highlight = false }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      bgcolor: highlight ? 'secondary.main' : 'background.paper',
      border: highlight ? '2px solid' : '1px solid',
      borderColor: highlight ? 'primary.main' : 'divider',
      borderRadius: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography
        sx={{
          width: 28,
          textAlign: 'center',
          color: highlight ? 'text.primary' : 'text.secondary',
          fontWeight: 800,
        }}
      >
        {rank}
      </Typography>

      {/* 날짜만 표기 */}
      <Typography sx={{ fontWeight: highlight ? 800 : 600 }}>
        {dateLabel}
      </Typography>
    </Box>

    <Typography sx={{ fontWeight: 900, color: 'primary.main' }}>{score}</Typography>
  </Paper>
);

const Leaderboard = () => {
  // 데모용 더미 데이터 (날짜/점수)
  const podium = [
    { rank: 2, dateLabel: '2025-08-31 (일)', score: 1200 },
    { rank: 1, dateLabel: '2025-09-01 (월)', score: 1250 },
    { rank: 3, dateLabel: '2025-08-28 (목)', score: 1150 },
  ];

  const others = [
    { rank: 4, dateLabel: '2025-08-26 (화)', score: 1100 },
    { rank: 5, dateLabel: '2025-08-24 (일)', score: 1050 },
    { rank: 6, dateLabel: '2025-08-20 (수)', score: 1000 },
    { rank: 7, dateLabel: '2025-08-18 (월)', score: 950 },
    { rank: 8, dateLabel: '2025-08-19 (월)', score: 850 },
    { rank: 9, dateLabel: '2025-08-20 (화)', score: 750 },
    { rank: 10, dateLabel: '2025-08-21 (수)', score: 650, highlight: true }, // 예: 개인 베스트 주간 하이라이트
  ];

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Container sx={{ pb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h5" fontWeight={800}>
            홍길동, 72세 성적표
          </Typography>
        </Box>

        {/* 상단 타이틀 바 */}
        <Box
          sx={{
            mt: 1,
            p: '10px',
            bgcolor: '#267FE0',
            display: 'flex',
            justifyContent: 'center',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <Typography variant="h5" fontWeight={800} color="black">
            최고의 성적
          </Typography>
        </Box>

        {/* 1~3위 트로피 그리드 */}
        <Grid
          container
          spacing={3}
          sx={{
            bgcolor: '#267FE0',
            display: 'flex',
            justifyContent: 'center',
            px: 0,
            py: 1,
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TopRank rank={podium[0].rank} dateLabel={podium[0].dateLabel} score={podium[0].score} size={80} />
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TopRank rank={podium[1].rank} dateLabel={podium[1].dateLabel} score={podium[1].score} size={96} />
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TopRank rank={podium[2].rank} dateLabel={podium[2].dateLabel} score={podium[2].score} size={80} />
          </Grid>
        </Grid>

        {/* 4위 이하 목록 */}
        <Box sx={{ mt: 3, display: 'grid', gap: 1.25 }}>
          {others.map((item) => (
            <Row
              key={item.rank}
              rank={item.rank}
              dateLabel={item.dateLabel}
              score={item.score}
              highlight={item.highlight}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Leaderboard;
