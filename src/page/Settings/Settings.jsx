import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Container,
  Paper, List, ListItemButton, ListItemText, ListItemSecondaryAction,
  Switch, Divider, Stack, Box
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const nav = useNavigate();

  // 토글 상태 (샘플)
  const [contrastMode, setContrastMode] = useState(false);
  const [soundVibration, setSoundVibration] = useState(true);
  const [captionsAudio, setCaptionsAudio] = useState(false);
  const [vibrationFeedback, setVibrationFeedback] = useState(true);
  const [pushNoti, setPushNoti] = useState(true);

  // 공용 섹션 카드 스타일
  const cardSx = {
    p: 0,
    overflow: 'hidden',
    borderRadius: 3,
    bgcolor: 'background.paper',
    border: (theme) => `1px solid ${theme.palette.divider}`,
  };

  return (
    <>
      <Container sx={{ maxWidth: 720, mx: 'auto', py: 2, pb: 8 }}>
        <Stack spacing={3}>
          {/* 계정 및 프로필 */}
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              계정 및 프로필
            </Typography>
            <Paper variant="outlined" sx={cardSx}>
              <List disablePadding>
                <ListItemButton onClick={() => {/* 이동: 이름/나이 편집 */}}>
                  <ListItemText primary="이름/나이" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 보호자 연결 */}}>
                  <ListItemText primary="보호자 연결" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 프로필 사진 변경 */}}>
                  <ListItemText primary="프로필 사진 변경" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
              </List>
            </Paper>
          </Box>

          {/* 접근성 */}
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              접근성
            </Typography>
            <Paper variant="outlined" sx={cardSx}>
              <List disablePadding>
                <ListItemButton onClick={() => {/* 이동: 글자 크기 */}}>
                  <ListItemText primary="글자 크기" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton disableRipple>
                  <ListItemText primary="고대비 모드" />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={contrastMode}
                      onChange={(e) => setContrastMode(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 버튼 크기 */}}>
                  <ListItemText primary="버튼 크기" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 애니메이션/깜박임 강도 */}}>
                  <ListItemText primary="애니메이션/깜박임 강도" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton disableRipple>
                  <ListItemText primary="소리/진동" />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={soundVibration}
                      onChange={(e) => setSoundVibration(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
                <Divider />
                <ListItemButton disableRipple>
                  <ListItemText primary="자막/음성 안내" />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={captionsAudio}
                      onChange={(e) => setCaptionsAudio(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
            </Paper>
          </Box>

          {/* 게임 환경 */}
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              게임 환경
            </Typography>
            <Paper variant="outlined" sx={cardSx}>
              <List disablePadding>
                <ListItemButton onClick={() => {/* 이동: 기본 난이도 */}}>
                  <ListItemText primary="기본 난이도" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 힌트 사용 */}}>
                  <ListItemText primary="힌트 사용" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 세션 길이 */}}>
                  <ListItemText primary="세션 길이" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 사운드(음악/효과음) */}}>
                  <ListItemText primary="사운드(음악/효과음)" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton disableRipple>
                  <ListItemText primary="진동 피드백" />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={vibrationFeedback}
                      onChange={(e) => setVibrationFeedback(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 그리드 색상 테마 */}}>
                  <ListItemText primary="그리드 색상 테마" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
              </List>
            </Paper>
          </Box>

          {/* 목표 및 알림 */}
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              목표 및 알림
            </Typography>
            <Paper variant="outlined" sx={cardSx}>
              <List disablePadding>
                <ListItemButton onClick={() => {/* 이동: 오늘의 목표 설정 */}}>
                  <ListItemText primary="오늘의 목표 설정" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton disableRipple>
                  <ListItemText primary="푸시 알림" />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={pushNoti}
                      onChange={(e) => setPushNoti(e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 미완료 리마인드 간격 */}}>
                  <ListItemText primary="미완료 리마인드 간격" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
              </List>
            </Paper>
          </Box>

          {/* 언어 및 지역 */}
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              언어 및 지역
            </Typography>
            <Paper variant="outlined" sx={cardSx}>
              <List disablePadding>
                <ListItemButton onClick={() => {/* 이동: 앱 언어 */}}>
                  <ListItemText primary="앱 언어" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 날짜/시간 형식 */}}>
                  <ListItemText primary="날짜/시간 형식" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
              </List>
            </Paper>
          </Box>

          {/* 정보 및 지원 */}
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              정보 및 지원
            </Typography>
            <Paper variant="outlined" sx={cardSx}>
              <List disablePadding>
                <ListItemButton onClick={() => {/* 이동: 버전/릴리즈 노트 */}}>
                  <ListItemText primary="버전/릴리즈 노트" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 약관/개인정보 처리방침 */}}>
                  <ListItemText primary="약관/개인정보 처리방침" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 문의/버그 신고 */}}>
                  <ListItemText primary="문의/버그 신고" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => {/* 이동: 피드백 보내기 */}}>
                  <ListItemText primary="피드백 보내기" />
                  <ChevronRightRoundedIcon color="action" />
                </ListItemButton>
              </List>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Settings;
