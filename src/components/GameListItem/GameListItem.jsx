import React from 'react';
import { Avatar, Box, Paper, Typography } from '@mui/material';

/**
 * 치매 게임 리스트 아이템 컴포넌트
 * 
 * @param icon
 * @param title
 * @param subtitle
 * @param score
 * @param onClick
 * @returns {JSX.Element}
 * @constructor
 */
const GameListItem = ({ icon, title, subtitle, score, onClick }) => {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'background.paper',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': { bgcolor: '#C0E3E6' },
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 48,
          height: 48,
          bgcolor: '#FEE0A5',
          color: 'text.primary',
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {subtitle}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {score}
        </Typography>
        <Box component="span" sx={{ color: 'text.secondary' }}>{'%'}</Box>
      </Box>
    </Paper>
  );
};

export default GameListItem;
