import React from "react";
import { Box, Button, Card, CardContent, Stack, Typography, Divider } from "@mui/material";

const EmojiMatch = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          이모티콘 짝 맞추기
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              게임 방식
            </Typography>
            <Typography variant="body1">
              카드 뒤집기 변형. 다양한 감정 이모티콘(😊😢😠)을 같은 짝으로 맞춥니다.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              시나리오
            </Typography>
            <Typography variant="body1">
              감정을 기억하고 같은 표정을 가진 카드를 찾아보세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              키워드 타입
            </Typography>
            <Typography variant="body1">기억력, 정서 및 사회성, 주의력</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>
              개발 메모
            </Typography>
            <Typography variant="body2">
              • 1단계: 3×3 → 4×4 → 5×5 격자 확장, 제한시간 단계별 축소<br/>
              • 2단계: 틀린 짝/시간초과 기록, 평균 반응시간 집계<br/>
              • 3단계: 난이도별 감정 범주(기쁨/슬픔/분노/놀람 등) 다양화
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

export default EmojiMatch;
