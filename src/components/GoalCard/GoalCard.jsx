import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ProgressBar from '../ProgressBar/ProgressBar';

/**
 * 치매 게임 목표 정보
 *
 * @param title
 * @param percent
 * @param bgUrl
 * @returns {JSX.Element}
 * @constructor
 */
const GoalCard = ({ title = "Today's Goal", percent = 75, bgUrl }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        overflow: 'hidden',
        borderRadius: 4,
        minHeight: 220,
        position: 'relative',
        bgcolor: 'transparent',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%), url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(1.1)',
        }}
      />
      <Box sx={{ position: 'relative', p: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>
          {title}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <ProgressBar value={percent} />
          </Box>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>
            {percent}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GoalCard;
