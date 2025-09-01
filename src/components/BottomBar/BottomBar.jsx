import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';

/**
 * 하단 메뉴
 *
 * @param value
 * @param onChange
 * @returns {JSX.Element}
 * @constructor
 */
const BottomBar = ({ value = 'home', onChange }) => {


  return (
    <Paper
      elevation={0}
      sx={{
        position: 'sticky',
        bottom: 0,
        borderTop: '1px solid',
        borderColor: 'secondary.main',
        bgcolor: 'background.paper',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(_, v) => onChange(v)}
        sx={{
          bgcolor: 'background.paper',
          '& .MuiBottomNavigationAction-root': { color: 'text.secondary', minWidth: 0 },
          '& .Mui-selected': { color: 'primary.main' },
        }}
      >
        <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Leaderboard" value="leaderboard" icon={<EmojiEventsIcon />} />
        <BottomNavigationAction label="Stats" value="stats" icon={<QueryStatsIcon />} />
        <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomBar;
