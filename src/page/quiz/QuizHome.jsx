import React from 'react';
import { Box, Chip, Container, Divider, Stack, Typography } from '@mui/material';
import GoalCard from '../../components/GoalCard/GoalCard';
import GameListItem from '../../components/GameListItem/GameListItem';
import SearchIcon from '@mui/icons-material/Search';
// import PsychologyIcon from '@mui/icons-material/Psychology';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PanoramaIcon from '@mui/icons-material/Panorama';
import TranslateIcon from '@mui/icons-material/Translate';
import ExtensionIcon from '@mui/icons-material/Extension';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Spellcheck from '@mui/icons-material/Spellcheck';
import StyleIcon from '@mui/icons-material/Style';
import TrafficIcon from '@mui/icons-material/Traffic';           // 신호등 반응 훈련
import AvTimerIcon from '@mui/icons-material/AvTimer';           // 스톱워치 감각
import AccessTimeIcon from '@mui/icons-material/AccessTime';     // 시계 바늘 맞추기
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; // 이모티콘 짝 맞추기
import Fontdownload from '@mui/icons-material/FontDownload'; // 워들 퍼즐

// 홈 상단 이미지
import topImgHomeMain from '../../assets/img/top-img-home-main.png';
import {useNavigate} from 'react-router-dom'
import { loadUserProfile } from '../../storage/profileManager';
import { getSkillTypeName, SkillTypes } from '../../common/cognitiveSkillsManager';
import { GameData } from '../../common/gameManager';

/**
 * TODO:
 *  - 이름, 나이 필드 저장
 *  - 추가 게임 연동
 *
 * @returns {JSX.Element}
 * @constructor
 */
const QuizHome = () => {
  const userProfile = loadUserProfile();
  const navigate = useNavigate();

  const bgUrl = topImgHomeMain;

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h6"
        sx={{ flex: 1, textAlign: 'center', fontWeight: 700, color: 'text.primary' }}
      >
        {`${userProfile.name}, ${userProfile.age}세`}
      </Typography>
      <Container sx={{ py: 2, flex: 1 }}>
        <GoalCard title="오늘의 목표" percent={75} bgUrl={bgUrl} />
        <Stack spacing={1.5} sx={{ mt: 2, pb: 8 }}>
          <GameListItem
            icon={<DashboardIcon />}
            title="Blink 기억력 게임(V2)"
            subtitle="기억력"
            onClick={() => handleClick('/quiz/blink-v2')}
            score={58}
          />
          <GameListItem
            icon={<FaceRetouchingNaturalIcon />}
            title="얼굴 인식"
            subtitle="기억력"
            onClick={() => handleClick('/quiz/recognition')}
            score={92}
          />
          <GameListItem
            icon={<SportsKabaddiIcon />}
            title="역가위바위보"
            subtitle="주의력, 처리속도, 시공간"
            onClick={() => handleClick('/quiz/rps-reverse')}
            score={92}
          />
          <GameListItem
            icon={<TrafficIcon />}
            title="신호등 반응 훈련"
            subtitle="처리속도, 주의력"
            onClick={() => handleClick('/quiz/traffic')}
            score={92}
          />
          <GameListItem
            icon={<AvTimerIcon />}
            title="스톱워치 감각"
            subtitle="시공간, 기억력"
            onClick={() => handleClick('/quiz/stopwatch')}
            score={92}
          />
          <GameListItem
            icon={<AccessTimeIcon />}
            title="시계 바늘 맞추기"
            subtitle="인지 영역"
            onClick={() => handleClick('/quiz/clock')}
            score={92}
          />
          <GameListItem
            icon={<EmojiEmotionsIcon />}
            title="이모티콘 짝 맞추기"
            subtitle="기억력, 정서 및 사회성, 주의력"
            onClick={() => handleClick('/quiz/emoji')}
            score={92}
          />

          {/* Temp List */}
          <GameListItem
            icon={<StyleIcon />}
            title="카드 페어 매칭"
            subtitle="기억력"
            onClick={() => handleClick('/quiz/rock-paper')}
            score={32}
          />
          <GameListItem
            icon={<SearchIcon />}
            title="단어 찾기"
            subtitle="기억력"
            onClick={() => handleClick('/quiz/word-search')}
            score={85}
          />
          <GameListItem
            icon={<TranslateIcon />}
            title="영어문장 완성"
            subtitle="언어"
            onClick={() => handleClick('/quiz/english')}
            score={78}
          />
          <GameListItem
            icon={<PanoramaIcon />}
            title="사진 선택"
            subtitle="기억력"
            onClick={() => handleClick('/quiz/photo')}
            score={65}
          />
          <GameListItem
            icon={<ExtensionIcon />}
            title="퍼즐 맞추기"
            subtitle="기억력"
            onClick={() => handleClick('/quiz/puzzle')}
            score={65}
          />
          <Divider textAlign='center' sx={{ borderColor: 'black' }}>
            <Chip label="철우" />
          </Divider>
          <GameListItem
            icon={<DashboardIcon />}
            title="Blink 기억력 게임"
            subtitle={GameData.BLINK.skillTypes.map((type) => getSkillTypeName(type)).join(', ')}
            onClick={() => handleClick(GameData.BLINK.gameLink)}
            score={0}
          />
          <GameListItem
            icon={<FaceRetouchingNaturalIcon />}
            title="얼굴 인식"
            subtitle={GameData.HUMAN_IMAGE.skillTypes.map((type) => getSkillTypeName(type)).join(', ')}
            onClick={() => handleClick(GameData.HUMAN_IMAGE.gameLink)}
            score={0}
          />
          <GameListItem
            icon={<Spellcheck />}
            title="워들 퍼즐"
            subtitle={GameData.BLANK_WORDLE.skillTypes.map((type) => getSkillTypeName(type)).join(', ')}
            onClick={() => handleClick(GameData.BLANK_WORDLE.gameLink)}
            score={0}
          />
          <GameListItem
            icon={<Fontdownload />}
            title="단어 맞추기"
            subtitle={GameData.BLANK_WORD.skillTypes.map((type) => getSkillTypeName(type)).join(', ')}
            onClick={() => handleClick(GameData.BLANK_WORD.gameLink)}
            subtitle="기억력"
            onClick={() => handleClick(GameData.BLINK_WORDLE.gameLink)}
            score={0}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default QuizHome;
