import React from "react";
import { Box, Button, Card, CardContent, Stack, Typography, Divider } from "@mui/material";

const ClockHandMatch = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          시계 바늘 맞추기
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              게임 방식
            </Typography>
            <Typography variant="body1">
              문제 제시 “3시 30분” → 시계 바늘을 드래그해서 맞추기.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              시나리오
            </Typography>
            <Typography variant="body1">
              시계의 바늘을 올바른 위치에 맞춰 시간을 표현하세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              키워드 타입
            </Typography>
            <Typography variant="body1">시공간, 기억력</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              개발 메모
            </Typography>
            <Typography variant="body2">
              • 1단계: 정시/30분 → 5분 → 1분 단위 난이도 확장<br/>
              • 2단계: 아날로그/디지털 혼합 출제, 제한시간 적용<br/>
              • 3단계: 분침/시침 오류 카운트, 평균 반응시간 기록
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

export default ClockHandMatch;
