import React from "react";
import {Box, Button, Card, CardContent, Divider, Stack, Typography} from "@mui/material";

const TrafficLightReaction = () => {
  return (
    <Card sx={{maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3}}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          신호등 반응 훈련
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{opacity: 0.7}}>게임 방식</Typography>
            <Typography variant="body1">
              빨간불은 멈춤, 초록불은 클릭, 노란불은 기다림. 신호등이 랜덤하게 바뀝니다.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{opacity: 0.7}}>시나리오</Typography>
            <Typography variant="body1">
              횡단보도를 건널 때 신호를 보고 즉시 올바른 행동을 하세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{opacity: 0.7}}>키워드 타입</Typography>
            <Typography variant="body1">주의력, 처리속도, 시공간</Typography>
          </Box>

          <Divider/>

          <Box>
            <Typography variant="overline" sx={{opacity: 0.7}}>개발 메모</Typography>
            <Typography variant="body2">
              • 자극 간격 단계: 2000→1500→1000→700ms (정확도 기반 적응)<br/>
              • 지표: 시도/정확도/평균 RT/실패 유형(잘못된 반응·지연·누락)
            </Typography>
          </Box>

          <Divider/>

          <Box>
            <Typography variant="overline" sx={{opacity: 0.7}}>프롬프트 예시</Typography>
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
(게임) 신호등 반응 훈련
- 인지 영역: 주의력, 처리속도, 시공간
- 규칙: 신호등 랜덤 전환 (빨간불 금지 / 초록불 클릭 / 노란불 대기)
- 난이도: 자극 전환 속도 단계 {{자극속도단계_ms}} (예: 2000→1500→1000→700ms)
- 측정 지표: 시도 횟수, 성공률, 실패 유형(잘못된 반응/반응 지연/클릭 누락), 평균 반응 시간
- 성적:
  • 시도 횟수: {{시도}}회
  • 성공률: {{성공률}}%
  • 실패율: {{실패율}}% (잘못된 반응 {{잘반}}%, 반응 지연 {{지연}}%, 클릭 누락 {{누락}}%)
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

export default TrafficLightReaction;
