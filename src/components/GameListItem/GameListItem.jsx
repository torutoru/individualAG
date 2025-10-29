import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { GamesListItem } from './styles';

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
    <GamesListItem
      onClick={onClick}
      elevation={0}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Avatar variant="rounded">
        {icon}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h3" noWrap>
          {title}
        </Typography>
        <Typography variant="body-medium" component="p" sx={{ color: 'text.secondary' }} noWrap>
          {subtitle}
        </Typography>
        <Typography variant="body-large" component="p" align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {score}%
        </Typography>
      </Box>
    </GamesListItem>
  );
};

export default GameListItem;
