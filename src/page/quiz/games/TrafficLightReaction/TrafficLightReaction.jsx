import React from "react";
import { Box, Button, Card, CardContent, Stack, Typography, Divider } from "@mui/material";

const TrafficLightReaction = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          신호등 반응 훈련
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              게임 방식
            </Typography>
            <Typography variant="body1">
              빨간불은 멈춤, 초록불은 클릭, 노란불은 기다림. 신호등이 랜덤하게 바뀝니다.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              시나리오
            </Typography>
            <Typography variant="body1">
              횡단보도를 건널 때 신호를 보고 즉시 올바른 행동을 하세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              키워드 타입
            </Typography>
            <Typography variant="body1">주의력, 처리속도, 시공간</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              개발 메모
            </Typography>
            <Typography variant="body2">
              • 1단계: 정보 페이지 → 시작 버튼으로 플레이 화면 라우팅 연결<br/>
              • 2단계: 반응 시간·실패 유형(잘못된 반응/지연/누락) 집계 로직 추가<br/>
              • 3단계: 난이도(자극 간격 2000→1500→1000→700ms) 점진 조정
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" color="primary" disabled>
              게임 시작(준비 중)
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TrafficLightReaction;
