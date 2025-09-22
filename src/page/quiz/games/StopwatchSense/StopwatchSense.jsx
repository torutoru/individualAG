import React from "react";
import { Box, Button, Card, CardContent, Stack, Typography, Divider } from "@mui/material";

const StopwatchSense = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          스톱워치 감각
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              게임 방식
            </Typography>
            <Typography variant="body1">
              “3초가 되면 멈추세요” — 사용자가 버튼을 눌러 시간 감각을 측정합니다.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              시나리오
            </Typography>
            <Typography variant="body1">
              몸으로 시간을 재는 훈련을 통해 시간 감각을 키워보세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              키워드 타입
            </Typography>
            <Typography variant="body1">처리속도, 주의력</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              개발 메모
            </Typography>
            <Typography variant="body2">
              • 1단계: 기본 목표 3초 → 성공 편차(±0.5s) 적용<br/>
              • 2단계: 목표 시간 2~5초 랜덤 제시, 편차 제한 단계별 축소<br/>
              • 3단계: 평균 오차(ms), 빠름/늦음 비율, 성공률 기록
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

export default StopwatchSense;
