import React from "react";
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

const StopwatchSense = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          스톱워치 감각
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>게임 방식</Typography>
            <Typography variant="body1">
              “3초가 되면 멈추세요” — 사용자가 버튼을 눌러 시간 감각을 측정합니다.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>시나리오</Typography>
            <Typography variant="body1">
              몸으로 시간을 재는 훈련을 통해 시간 감각을 키워보세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>키워드 타입</Typography>
            <Typography variant="body1">처리속도, 주의력</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>개발 메모</Typography>
            <Typography variant="body2">
              • 목표 시간 2~5초 랜덤, 편차 제한(±0.5→0.3→0.2s)<br/>
              • 지표: 시도/성공률/평균 절대 오차(ms)/빠름·늦음 비율
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
(게임) 스톱워치 감각
- 인지 영역: 처리속도, 주의력
- 규칙: 목표 시간에 맞춰 버튼 클릭
- 난이도: 목표 시간 {{목표시간목록_초}}초, 허용 편차 ±{{허용편차_초}}초
- 측정 지표: 시도 횟수, 성공률, 실패 유형(빠름/늦음), 평균 오차(ms)
- 성적:
  • 시도 횟수: {{시도}}회
  • 성공률: {{성공률}}%
  • 평균 오차: {{평균오차_ms}}ms
  • 실패율: {{실패율}}% (빠름 {{빠름}}%, 늦음 {{늦음}}%)

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

export default StopwatchSense;
