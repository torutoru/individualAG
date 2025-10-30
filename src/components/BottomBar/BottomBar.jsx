import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { BottomNavigationContainer } from './styles';

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
    <BottomNavigationContainer elevation={0}>
      <BottomNavigation
        value={value}
        onChange={(_, v) => onChange(v)}
        sx={{
          bgcolor: 'background.paper',
          '& .MuiBottomNavigationAction-root': { color: 'text.secondary', minWidth: 0 },
          '& .Mui-selected': { color: 'primary.main' },
        }}
      >
        <BottomNavigationAction label="홈" value="Home" icon={<HomeFilledIcon />} />
        <BottomNavigationAction label="리더보드" value="leaderboard" icon={<EmojiEventsIcon />} />
        <BottomNavigationAction label="통계" value="stats" icon={<LeaderboardIcon />} />
        <BottomNavigationAction label="설정" value="settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </BottomNavigationContainer>
  );
};

export default BottomBar;
