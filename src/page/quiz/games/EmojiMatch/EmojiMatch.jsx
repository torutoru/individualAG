import React from "react";
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

const EmojiMatch = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          이모티콘 짝 맞추기
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>게임 방식</Typography>
            <Typography variant="body1">
              카드 뒤집기 변형. 다양한 감정 이모티콘(😊😢😠)을 같은 짝으로 맞춥니다.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>시나리오</Typography>
            <Typography variant="body1">
              감정을 기억하고 같은 표정을 가진 카드를 찾아보세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>키워드 타입</Typography>
            <Typography variant="body1">기억력, 정서 및 사회성, 주의력</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>개발 메모</Typography>
            <Typography variant="body2">
              • 3×3 → 4×4 → 5×5 격자 확장, 제한시간 단계별 축소<br/>
              • 지표: 시도/성공률/평균 RT/실패(틀린 짝·시간 초과)
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>프롬프트 예시</Typography>
            <Box
              component="pre"
              sx={{
                m: 0, p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid",
                borderColor: "divider", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                whiteSpace: "pre-wrap", wordBreak: "break-word"
              }}
            >
              {`[사용자 신체 정보]
- 성별: {{성별}}
- 나이: {{나이}}세
- 키/몸무게: {{키}}cm / {{몸무게}}kg

[치매 예방 게임 결과 정보]
(게임) 이모티콘 짝 맞추기
- 인지 영역: 기억력, 정서 및 사회성, 주의력
- 규칙: 감정 이모티콘 카드를 뒤집어 같은 짝 맞추기
- 난이도: 격자 {{격자}}(예: 3×3/4×4/5×5), 제한 시간 {{제한시간_초}}초
- 측정 지표: 시도 횟수, 성공률, 실패 유형(틀린 짝/시간 초과), 평균 반응 시간
- 성적:
  • 시도 횟수: {{시도}}회
  • 성공률: {{성공률}}%
  • 실패율: {{실패율}}% (틀린 짝 {{틀린짝}}%, 시간 초과 {{시간초과}}%)
  • 평균 반응 시간: {{평균RT_초}}초

[요청]
- 위 정보를 바탕으로 사용자의 인지 기능과 치매 예방 효과를 평가해 주세요.
- 현재 치매 예방 상태를 위험도(낮음/중간/높음)와 종합 점수(1~5)로 제시해 주세요.
- 추가로 치매 예방을 위해 권장할 수 있는 생활습관이나 게임 활동을 제안해 주세요.

[출력 요구사항]
1. 종합 치매 예방 효과 평가
2. 권장 추가 활동 및 게임 제안`}
            </Box>
          </Box>

          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" color="primary" disabled>게임 시작(준비 중)</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EmojiMatch;
