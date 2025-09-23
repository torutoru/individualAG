import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, Divider, Grid, LinearProgress, MenuItem, Select,
  Stack, Switch, FormControlLabel, Typography
} from "@mui/material";

/** =========================================
 * 설정
 * ========================================= */
const SESSION_SEC_DEFAULT = 60;               // 기본 제한시간(초)
const FLIP_BACK_MS = 700;                     // 불일치 시 뒤집히는 시간
const FEEDBACK_MS = 650;                      // 피드백 라벨 노출 시간

const EMOJI_POOL = [
  "😊","😢","😠","😮","😂","😎","😍","😴",
  "🤔","😇","😵","🤗","🥳","😭","😡","😙",
  "🤩","😌","😶","😓","😤","🤤","🤠","😬",
]; // 충분한 수의 감정 이모지

const WILD_CARD = "🃏"; // 3×3 등 홀수 셀일 때 추가되는 '빈 카드' (점수/검사 제외)

/** 카드 생성: 셀 수에 맞게 pair 구성 후 셔플.
 * - 홀수 셀일 경우 WILD_CARD 1장 추가 (매칭 제외)
 */
function makeDeck(cellCount) {
  const pairCount = Math.floor(cellCount / 2);
  const emojis = shuffle(EMOJI_POOL).slice(0, pairCount);
  let deck = [];
  emojis.forEach((e, i) => {
    deck.push({ key: `c${i}a`, emoji: e, matched: false, faceUp: false, wild: false });
    deck.push({ key: `c${i}b`, emoji: e, matched: false, faceUp: false, wild: false });
  });
  if (cellCount % 2 === 1) {
    deck.push({ key: `wild`, emoji: WILD_CARD, matched: false, faceUp: false, wild: true });
  }
  return shuffle(deck);
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function gridToCells(grid) {
  const [r, c] = grid.split("x").map(Number);
  return r * c;
}

/** =========================================
 * 플레이 컴포넌트
 * - 격자: 3x3 / 4x4 / 5x5
 * - 제한시간: 토글 가능
 * - 지표: 시도(턴), 성공률(완료한 페어/총 페어), 평균 반응시간(페어 성립까지), 실패(틀린 짝/시간초과)
 * ========================================= */
function EmojiMatchPlay() {
  const [grid, setGrid] = useState("4x4");
  const [useTimer, setUseTimer] = useState(true);
  const [sessionSec, setSessionSec] = useState(SESSION_SEC_DEFAULT);

  const [running, setRunning] = useState(false);
  const [leftSec, setLeftSec] = useState(sessionSec);

  const [deck, setDeck] = useState([]);
  const [openKeys, setOpenKeys] = useState([]); // 현재 뒤집힌 2장까지
  const [lock, setLock] = useState(false);      // 애니메이션 중 입력 잠금

  // 지표
  const [turns, setTurns] = useState(0);             // 시도(두 장 뒤집힌 후 1턴)
  const [pairsFound, setPairsFound] = useState(0);   // 맞춘 페어 수
  const [avgPairRtMs, setAvgPairRtMs] = useState(null);
  const [wrongPairs, setWrongPairs] = useState(0);
  const [timeoutCount, setTimeoutCount] = useState(0);

  const [lastFeedback, setLastFeedback] = useState(null); // "correct" | "wrong" | "timeout" | null

  const firstFlipAtRef = useRef(0);
  const ticker = useRef(null);

  const cellCount = useMemo(() => gridToCells(grid), [grid]);
  const totalPairs = useMemo(() => Math.floor(cellCount / 2), [cellCount]);

  const progress = useMemo(() => {
    if (!useTimer) return 0;
    return Math.max(0, Math.min(100, ((sessionSec - leftSec) / sessionSec) * 100));
  }, [useTimer, sessionSec, leftSec]);

  const successRate = useMemo(() => {
    return totalPairs > 0 ? Math.round((pairsFound / totalPairs) * 100) : 0;
  }, [pairsFound, totalPairs]);

  const allMatched = useMemo(() => pairsFound >= totalPairs && totalPairs > 0, [pairsFound, totalPairs]);

  // 세션 시작
  const startSession = () => {
    if (running) return;
    const newDeck = makeDeck(cellCount);
    setDeck(newDeck);
    setOpenKeys([]);
    setLock(false);

    // 지표 초기화
    setTurns(0);
    setPairsFound(0);
    setAvgPairRtMs(null);
    setWrongPairs(0);
    setTimeoutCount(0);
    setLastFeedback(null);

    setRunning(true);
    if (useTimer) {
      setLeftSec(sessionSec);
      // 타이머
      if (ticker.current) clearInterval(ticker.current);
      ticker.current = setInterval(() => {
        setLeftSec(prev => {
          if (prev <= 1) {
            clearInterval(ticker.current);
            setRunning(false);
            setLastFeedback("timeout");
            setTimeoutCount(c => c + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setLeftSec(0);
    }
  };

  const stopSession = () => {
    setRunning(false);
    if (ticker.current) clearInterval(ticker.current);
  };

  useEffect(() => () => { if (ticker.current) clearInterval(ticker.current); }, []);

  const onCardClick = (key) => {
    if (!running || lock) return;
    const idx = deck.findIndex(c => c.key === key);
    if (idx < 0) return;
    const card = deck[idx];
    if (card.matched || card.faceUp) return;

    // 첫 장 뒤집기: 타임스탬프 기록
    if (openKeys.length === 0) {
      firstFlipAtRef.current = performance.now();
    }

    // 뒤집기
    const nextDeck = deck.map(c => c.key === key ? { ...c, faceUp: true } : c);
    setDeck(nextDeck);
    const nextOpen = [...openKeys, key];
    setOpenKeys(nextOpen);

    if (nextOpen.length === 2) {
      // 두 장 비교
      setLock(true);
      const [k1, k2] = nextOpen;
      const c1 = nextDeck.find(c => c.key === k1);
      const c2 = nextDeck.find(c => c.key === k2);

      // WILD 카드가 포함되면 자동 불일치 처리(점수X, 즉시 닫힘)
      const isWild = c1.wild || c2.wild;
      const isMatch = !isWild && c1.emoji === c2.emoji;

      // 턴 집계
      setTurns(t => t + 1);

      if (isMatch) {
        // 반응시간 집계(첫장 뒤집기~매칭 순간)
        const rt = performance.now() - firstFlipAtRef.current;
        setAvgPairRtMs(prev => (prev == null ? rt : (prev * (turns) + rt) / (turns + 1)));

        // 페어 고정
        setTimeout(() => {
          setDeck(d => d.map(c =>
            c.key === k1 || c.key === k2 ? { ...c, matched: true } : c
          ));
          setPairsFound(p => p + 1);
          setOpenKeys([]);
          setLock(false);
          setLastFeedback("correct");
          setTimeout(() => setLastFeedback(null), FEEDBACK_MS);
        }, 120);
      } else {
        setWrongPairs(w => w + 1);
        setTimeout(() => {
          setDeck(d => d.map(c =>
            c.key === k1 || c.key === k2 ? { ...c, faceUp: false } : c
          ));
          setOpenKeys([]);
          setLock(false);
          setLastFeedback("wrong");
          setTimeout(() => setLastFeedback(null), FEEDBACK_MS);
        }, FLIP_BACK_MS);
      }
    }
  };

  // 자동 종료: 모든 페어 완성 시
  useEffect(() => {
    if (running && allMatched) {
      setRunning(false);
      if (ticker.current) clearInterval(ticker.current);
    }
  }, [running, allMatched]);

  // 격자 행/열 계산
  const [rows, cols] = useMemo(() => grid.split("x").map(Number), [grid]);

  return (
    <Card sx={{ mt: 2, borderRadius: 3 }}>
      <CardContent>
        {/* 상단 옵션 */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight={700}>플레이</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControlLabel
              control={<Switch size="small" checked={useTimer} onChange={(_,v)=>{setUseTimer(v); setLeftSec(v?sessionSec:0);}} />}
              label={<Typography variant="caption">시간 제한</Typography>}
            />
            <Select size="small" value={grid} onChange={e=>setGrid(e.target.value)} sx={{ minWidth: 92 }}>
              <MenuItem value="3x3">3×3</MenuItem>
              <MenuItem value="4x4">4×4</MenuItem>
              <MenuItem value="5x5">5×5</MenuItem>
            </Select>
            <Select size="small" value={sessionSec} onChange={e=>setSessionSec(Number(e.target.value))} disabled={!useTimer} sx={{ minWidth: 92 }}>
              <MenuItem value={45}>45s</MenuItem>
              <MenuItem value={60}>60s</MenuItem>
              <MenuItem value={90}>90s</MenuItem>
            </Select>
          </Stack>
        </Stack>

        {/* 타이머 진행 */}
        {useTimer && (
          <Box mb={1}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 999 }} />
            <Stack direction="row" justifyContent="space-between" mt={0.5}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>경과 {Math.round(progress)}%</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>남은 {leftSec}s</Typography>
            </Stack>
          </Box>
        )}

        {/* 지표 */}
        <Stack direction="row" spacing={2} justifyContent="space-between" mb={1}>
          <Typography variant="body2">턴: <b>{turns}</b></Typography>
          <Typography variant="body2">성공률: <b>{successRate}%</b></Typography>
          <Typography variant="body2">평균 RT(페어): <b>{avgPairRtMs == null ? "-" : Math.round(avgPairRtMs)}ms</b></Typography>
          <Typography variant="body2">틀린 짝: <b>{wrongPairs}</b></Typography>
          {useTimer && <Typography variant="body2">시간초과: <b>{timeoutCount}</b></Typography>}
        </Stack>

        {/* 완료/피드백 라벨 */}
        <Stack alignItems="center" mb={1}>
          {lastFeedback === null && <Chip color="info" label="이모티콘 짝 맞추기" />}
          {lastFeedback === "correct" && <Chip color="success" label="정답!" />}
          {lastFeedback === "wrong" && <Chip color="error" label="오답" />}
          {lastFeedback === "timeout" && <Chip color="warning" label="시간 초과" />}
          {allMatched && <Chip color="primary" label="모든 짝을 맞췄습니다!" sx={{ mt: 1 }} />}
        </Stack>

        {/* 카드 격자 */}
        <Grid container spacing={1.2} sx={{ maxWidth: 460, mx: "auto", mt: 1 }}>
          {deck.map((card, i) => (
            <Grid key={card.key} item xs={12 / cols}>
              <Button
                onClick={() => onCardClick(card.key)}
                disabled={!running || lock || card.matched || card.faceUp}
                sx={{
                  width: "100%", aspectRatio: "1 / 1",
                  borderRadius: 2, border: "1px solid", borderColor: "divider",
                  bgcolor: card.matched ? "success.light" : "background.paper",
                  fontSize: 28
                }}
              >
                {card.faceUp || card.matched ? card.emoji : "❓"}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* 컨트롤 버튼 */}
        <Stack direction="row" spacing={1.5} justifyContent="center" mt={2}>
          {!running ? (
            <Button size="large" variant="contained" onClick={startSession} sx={{ borderRadius: 3, px: 4 }}>
              시작
            </Button>
          ) : (
            <Button size="large" variant="outlined" color="inherit" onClick={stopSession} sx={{ borderRadius: 3, px: 4 }}>
              일시정지/종료
            </Button>
          )}
          {!running && (
            <Button size="large" variant="outlined" onClick={() => {
              // 덱만 새로고침
              setDeck(makeDeck(cellCount));
              setOpenKeys([]); setLock(false);
              setTurns(0); setPairsFound(0); setAvgPairRtMs(null); setWrongPairs(0); setTimeoutCount(0); setLastFeedback(null);
            }} sx={{ borderRadius: 3, px: 4 }}>
              덱 새로고침
            </Button>
          )}
        </Stack>

        {/* 상태 텍스트 */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={1.5}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>격자: {grid}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>총 페어: {totalPairs}</Typography>
          {useTimer && <Typography variant="caption" sx={{ opacity: 0.7 }}>제한시간: {sessionSec}s</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}

/** =========================================
 * 정보 + 프롬프트 + 플레이
 * ========================================= */
const EmojiMatch = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          이모티콘 짝 맞추기
        </Typography>

        <Stack spacing={2}>
          {/* 설명 */}
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

          {/* 개발 메모 */}
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>개발 메모</Typography>
            <Typography variant="body2">
              • 3×3(빈 카드 1장 포함) / 4×4 / 5×5 격자 지원, 제한시간 토글<br/>
              • 지표: 턴/성공률(완료 페어)/평균 RT(페어)/틀린 짝/시간 초과
            </Typography>
          </Box>

          <Divider />

          {/* 프롬프트 예시 */}
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
- 측정 지표: 턴(두 장 뒤집기 1회), 성공률(완료 페어/총 페어), 실패 유형(틀린 짝/시간 초과), 평균 반응 시간(페어)
- 성적:
  • 턴: {{턴}}회
  • 성공률: {{성공률}}%
  • 실패: 틀린 짝 {{틀린짝}}회, 시간 초과 {{시간초과}}회
  • 평균 반응 시간(페어): {{평균RT_ms}}ms

[요청]
- 위 정보를 바탕으로 사용자의 인지 기능과 치매 예방 효과를 평가해 주세요.
- 현재 치매 예방 상태를 위험도(낮음/중간/높음)와 종합 점수(1~5)로 제시해 주세요.
- 추가로 치매 예방을 위해 권장할 수 있는 생활습관이나 게임 활동을 제안해 주세요.

[출력 요구사항]
1. 종합 치매 예방 효과 평가
2. 권장 추가 활동 및 게임 제안`}
            </Box>
          </Box>

          {/* 실제 플레이 */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="overline" sx={{ opacity: 0.7 }}>플레이</Typography>
          <EmojiMatchPlay />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EmojiMatch;
