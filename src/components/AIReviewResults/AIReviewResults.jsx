import { useState } from 'react';
import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';

// const API_ENDPOINT = "http://172.19.1.128/ai-review";
const API_ENDPOINT = "http://172.19.1.128:3000/ask";
// AI 요청 주소
// const API_ENDPOINT = "http://localhost:3001/ask";

const initialPrompt = `[사용자 신체 정보]
- 성별: 남성
- 나이: 72세
- 키/몸무게: 175cm / 72kg


[치매 예방 게임 결과 정보]
(게임 1) 1초 간격 깜박이는 도형 연속 4회 클릭 게임
- 인지 영역: 작업 기억, 주의 집중, 시공간 기억
- 규칙: 화면에 3×3 또는 4×4 격자 도형이 표시됩니다. 매 1초 간격으로 4개의 도형이 순차적으로 깜박입니다. 
        사용자는 모든 도형이 깜박인 후, 제시된 순서를 기억해 같은 순서로 클릭해야 합니다.
- 난이도: 
  • 기본: 3×3 격자, 4개 순서 기억  
  • 상위 단계: 4×4 격자, 5~6개 순서 기억  
  • 제한 시간: 입력 시작 후 5초 이내
- 측정 지표: 시도 횟수, 성공률, 실패 유형(클릭 위치 오류 / 순서 오류 / 시간 초과), 평균 반응 시간
- 성적: 
  • 시도 횟수: 100회  
  • 성공률: 80%  
  • 실패율: 20% (클릭 미스 10%, 시간 초과 10%)  
  • 평균 반응 시간: 1.2초


(게임 2) 역가위바위보(반응 억제) 게임
- 인지 영역: 억제, 인지 전환, 처리속도
- 규칙: 화면에 가위·바위·보 중 하나가 나타납니다. 라운드마다 "이기기" 또는 "지기기" 규칙이 제시되며,
        사용자는 그 규칙에 맞는 손동작 버튼(가위/바위/보)을 선택해야 합니다.
        예: “가위” 제시 + “지기기” 규칙 → 보 버튼 선택
- 난이도: 
  • 자극 제시 간격: 1500ms → 1000ms → 800ms  
  • 규칙 전환 주기: 5회 → 3회 → 2회  
  • 연속 규칙 노출 여부: 랜덤
- 측정 지표: 시도 횟수, 성공률, 실패 유형(규칙 전환 실패 / 잘못된 손동작 선택 / 시간 초과), 평균 반응 시간
- 성적: 
  • 시도 횟수: 100회  
  • 성공률: 60%  
  • 실패율: 40% (규칙 전환 실패 25%, 반응 지연 15%)  
  • 평균 반응 시간: 1.8초
 

[요청]
- 위 정보를 바탕으로 사용자의 인지 기능과 치매 예방 효과를 평가해 주세요.
- 현재 치매 예방 상태를 위험도(낮음/중간/높음)와 종합 점수(1~5)로 제시해 주세요.
- 추가로 치매 예방을 위해 권장할 수 있는 생활습관이나 게임 활동을 제안해 주세요.

[출력 요구사항]
1. 종합 치매 예방 효과 평가
2. 권장 추가 활동 및 게임 제안
`;

const AIReviewResults = () => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setResult('');

    try {
      // 줄바꿈 제거하여 한 줄로 변환
      const singleLinePrompt = prompt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

      const response = await axios.post(
        API_ENDPOINT,
        { message: singleLinePrompt },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      setResult(response.data.result);
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      setResult('❌ 오류 발생: API 호출 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ margin: '30px 2px 10px 2px', padding: '5px', background: '#E2E5E8', borderRadius : '10px' }}>
      <Typography variant="h4" gutterBottom>
        AI 검진 결과 테스트
      </Typography>
      <Typography variant="caption" gutterBottom>
        TODO : 사용자 정보, 게임 결과들 정보를 조합해서 프롬프트 생성 작업 해야함
      </Typography>

      <TextField
        label="프롬프트 입력"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        multiline
        rows={14}
        fullWidth
        variant="outlined"
        sx={{ mt: 2 }}
      />

      <Box mt={1}>
        <Button variant="contained" sx={{ borderRadius: 1 }} onClick={handleAsk} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : '요청하기'}
        </Button>
      </Box>

      <Box mt={4} sx={{ background: '#28B7CC', borderRadius: 1 }}>
        <Typography variant="h6">AI 검진 결과</Typography>
        <Box
          component="pre"
          sx={{
            mt: 1,
            p: 2,
            bgcolor: '#E5F2FC',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            minHeight: '160px',
          }}
        >
          {result || 'AI 검진 결과가 여기에 표시됩니다.'}
        </Box>
      </Box>
    </Box>
  );
};

export default AIReviewResults;
