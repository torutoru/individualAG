import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import ProgressBar from '../ProgressBar/ProgressBar';
import { GoalCardContainer } from './styles';

/**
 * 치매 게임 목표 정보
 *
 * @param title
 * @param percent
 * @param goalImgUrl
 * @returns {JSX.Element}
 * @constructor
 */
const GoalCard = ({ title = "Today's Goal", percent = 75, goalImgUrl }) => {
  return (
    <GoalCardContainer sx={{ mt: 2,}}>
      <img src={goalImgUrl} alt="" />
      <Stack flexDirection="row" justifyContent="space-between" alignItems="end" sx={{ mt: -6 }}>
        <Typography variant="h1" align="left">
          {title}
        </Typography>
        <Typography variant="h4" aligh="right" colo="highlight.dark">
          {percent}%
        </Typography>
      </Stack>
      <Box sx={{ mt: 2, display: 'flex' }}>
        <Box sx={{ flex: 1 }}>
          <ProgressBar value={percent} />
        </Box>
      </Box>
    </GoalCardContainer>
  );
};

export default GoalCard;
