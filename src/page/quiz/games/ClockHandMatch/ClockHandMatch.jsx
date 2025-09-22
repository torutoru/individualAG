import React from "react";
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

const ClockHandMatch = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          시계 바늘 맞추기
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>게임 방식</Typography>
            <Typography variant="body1">
              문제 제시 “3시 30분” → 시계 바늘을 드래그해서 맞추기.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>시나리오</Typography>
            <Typography variant="body1">
              시계의 바늘을 올바른 위치에 맞춰 시간을 표현하세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>키워드 타입</Typography>
            <Typography variant="body1">시공간, 기억력</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>개발 메모</Typography>
            <Typography variant="body2">
              • 정시/30분 → 5분 → 1분 단위 확장, 아날로그/디지털 혼합<br/>
              • 지표: 시도/성공률/평균 RT/오류(분침·시침)
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
(게임) 시계 바늘 맞추기
- 인지 영역: 시공간, 기억력
- 규칙: 제시된 시간에 맞춰 아날로그 바늘을 드래그해 위치를 맞춤
- 난이도: 문제 단위 {{단위}}(예: 정시/30분/5분/1분), 혼합(아날로그/디지털) {{혼합여부}}
- 측정 지표: 시도 횟수, 성공률, 실패 유형(분침 오류/시침 오류/반전), 평균 반응 시간
- 성적:
  • 시도 횟수: {{시도}}회
  • 성공률: {{성공률}}%
  • 실패율: {{실패율}}% (분침 오류 {{분침}}%, 시침 오류 {{시침}}%)
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

export default ClockHandMatch;
