import React from 'react';
import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MemoryIcon from '@mui/icons-material/Memory';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import {useNavigate} from 'react-router-dom';

const MyProgress = () => {
  const navigate = useNavigate();

  // 데모 데이터 (필요 시 실제 데이터로 교체)
  const score = 75; // 75/100
  const trendPercent = 15; // +15%
  const stats = [
    {label: '플레이한 게임', value: '120'},
    {label: '평균 점수', value: '85'},
    {label: '소요 시간', value: '25h'},
  ];
  const gameTypes = [
    {icon: <MemoryIcon/>, label: '메모리 게임'},
    {icon: <PsychologyIcon/>, label: '인지 게임'},
    {icon: <FlashOnRoundedIcon/>, label: '반응 게임'},
  ];

  return (
    <>
      {/* 상단 헤더 */}
      <Container sx={{py: 2, pb: 10}}>
        {/* Overall Progress */}
        <Stack spacing={2} mb={4}>
          <Typography variant="h5" fontWeight={800}>
            전반적인 진행 상황
          </Typography>

          <Paper variant="outlined" sx={{p: 2, borderRadius: 3}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body1" fontWeight={600}>
                치매 예방 점수
              </Typography>
              <Typography variant="body1" fontWeight={700} color="primary">
                {score}/100
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={score}
              color="primary"
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: (t) => t.palette.action.hover,
              }}
            />
          </Paper>
        </Stack>

        {/* Score Over Time */}
        <Stack spacing={2} mb={4}>
          <Paper variant="outlined" sx={{p: 2, borderRadius: 3}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  시간 경과에 따른 점수
                </Typography>
                <Typography variant="h4" fontWeight={800} lineHeight={1.2}>
                  +{trendPercent}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 30 Days
                </Typography>
              </Box>
              <Chip
                color="primary"
                variant="outlined"
                label={`+${trendPercent}%`}
                sx={{fontWeight: 800}}
              />
            </Stack>

            {/* SVG 영역 그래프 (샘플과 동일 형태) */}
            <Box sx={{height: 192}}>
              <svg
                viewBox="0 0 300 100"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="scoreArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.28"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* 영역(그라데이션) */}
                <path
                  d="M 0 80 C 30 80, 20 20, 50 20 C 80 20, 70 40, 100 40 C 130 40, 120 90, 150 90 C 180 90, 170 30, 200 30 C 230 30, 220 60, 250 60 C 280 60, 270 100, 300 100 L 300 100 L 0 100 Z"
                  fill="url(#scoreArea)"
                />
                {/* 추세선 */}
                <path
                  d="M 0 80 C 30 80, 20 20, 50 20 C 80 20, 70 40, 100 40 C 130 40, 120 90, 150 90 C 180 90, 170 30, 200 30 C 230 30, 220 60, 250 60 C 280 60, 270 100, 300 100"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </Box>

            <Stack direction="row" justifyContent="space-between" sx={{mt: 1}}>
              {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w) => (
                <Typography key={w} variant="caption" color="text.secondary">
                  {w}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Stack>

        {/* Game Statistics */}
        <Stack spacing={2} mb={4}>
          <Typography variant="h5" fontWeight={800}>
            치매 예방 게임 통계
          </Typography>
          <Grid container spacing={2}>
            {stats.map((s) => (
              <Grid key={s.label} item xs={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <Typography variant="h4" fontWeight={800} lineHeight={1}>
                    {s.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* Game Types Played */}
        <Stack spacing={2} sx={{mt: 8}}>
          <Typography variant="h5" fontWeight={800}>
            플레이된 게임 유형
          </Typography>
          <Grid container spacing={2}>
            {gameTypes.map((g) => (
              <Grid key={g.label} item xs={12} sm={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: '999px',
                      bgcolor: (t) => (t.palette.mode === 'dark' ? t.palette.action.hover : t.palette.action.selected),
                      display: 'inline-flex',
                    }}
                  >
                    {g.icon}
                  </Box>
                  <Typography fontWeight={700}>{g.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </>
  );
};

export default MyProgress;
