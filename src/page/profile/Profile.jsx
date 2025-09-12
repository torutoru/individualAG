/**
 * TODO:
 *  - 이름, 나이 등 프로필 저장 로직 추가
 *
 * @returns {JSX.Element}
 * @constructor
 */
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgDefaultProfile from '../../assets/img/profile-img-default.png';
import { loadUserProfile, saveUserProfile } from '../../storage/profileManager';

const Profile = () => {
  const navigate = useNavigate();
  const userProfile = loadUserProfile();
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(imgDefaultProfile);

  const handleBack = () => navigate(-1);

  const handleAvatarEdit = () => {
    // 파일 선택 다이얼로그 등 열기
    // 예시로 프롬프트 입력
    const url = window.prompt('아바타 이미지 URL을 입력하세요', avatarUrl || '');
    if (url) setAvatarUrl(url);
  };

  const handleSave = () => {
    // TODO: 실제 저장 로직 추가 (API 호출 혹은 전역 상태 업데이트)
    // 예: await saveProfile({ name, age, notifications, sound, avatarUrl });
    console.log('SAVE_PROFILE', { name, age, notifications, sound, avatarUrl });
    // UX: 가벼운 피드백
    // 스낵바/토스트가 있다면 연결해도 좋습니다.
    alert('변경 사항이 저장되었습니다.'); // 필요 시 MUI Snackbar로 교체

    saveUserProfile(age, name);
  };

  return (
    <>
      {/* 상단 AppBar: 뒤로가기 + 타이틀 */}
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          <IconButton edge="start" onClick={handleBack} aria-label="뒤로가기" sx={{ mr: 1, color: 'text.primary' }}>
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 800, textAlign: 'center', flex: 1, pr: 5 }}>
            Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pb: 8, pt: 2 }}>
        {/* 아바타 + 이름/나이 프리뷰 */}
        <Stack alignItems="center" spacing={2} mt={1}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarUrl}
              alt="User avatar"
              sx={{
                width: 128,
                height: 128,
                border: (theme) => `4px solid ${theme.palette.primary.main}`,
              }}
            />
            <IconButton
              size="small"
              onClick={handleAvatarEdit}
              aria-label="아바타 수정"
              sx={{
                position: 'absolute',
                right: 6,
                bottom: 6,
                bgcolor: 'primary.main',
                color: 'background.default',
                '&:hover': { bgcolor: 'success.dark' },
                boxShadow: 2,
              }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={800}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              나이: {age}
            </Typography>
          </Box>
        </Stack>

        {/* 개인 정보 섹션 */}
        <Stack spacing={2.5} mt={4}>
          <Typography variant="subtitle1" fontWeight={800}>
            개인 정보
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  이름
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  나이
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="standard"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  inputProps={{ min: 0 }}
                  InputProps={{ disableUnderline: true }}
                />
              </Box>
            </Stack>
          </Paper>

          {/* 설정 섹션 */}
          <Typography variant="subtitle1" fontWeight={800} mt={1}>
            설정
          </Typography>

          <Paper variant="outlined" sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>Notifications</Typography>
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Switch
                      color="primary"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                    />
                  }
                  label=""
                />
              </Stack>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>Sound</Typography>
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Switch color="primary" checked={sound} onChange={(e) => setSound(e.target.checked)} />
                  }
                  label=""
                />
              </Stack>
            </Box>
          </Paper>

          {/* 저장 버튼 */}
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleSave}
            sx={{
              mt: 1,
              fontWeight: 800,
              borderRadius: 999,
              color: 'black',
            }}
          >
            프로필 저장
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Profile;
