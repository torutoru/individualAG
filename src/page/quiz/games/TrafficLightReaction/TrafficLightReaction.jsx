import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Button, Card, CardContent, Divider, LinearProgress, Stack, Switch, FormControlLabel,
  ToggleButton, ToggleButtonGroup, Typography, Chip
} from "@mui/material";

/** =========================================
 * 설정
 * ========================================= */
const SESSION_MS = 60_000;              // 세션 길이(1분)
const TUTORIAL_ROUNDS = 3;              // 튜토리얼 라운드 수(5초 고정)
const TUTORIAL_INTERVAL_MS = 5000;      // 튜토리얼 간격
const BASE_INTERVAL_MS = 1600;          // 본게임 기본 간격
const MIN_INTERVAL_MS  = 800;           // 하한
const MAX_INTERVAL_MS  = 2200;          // 상한
const JITTER = 0.2;                     // ±20% 지터
const FEEDBACK_MS = 650;                // 피드백 노출
const SIGNALS = ["RED", "YELLOW", "GREEN"];
const SIGNAL_LABEL = { RED: "빨간불", YELLOW: "노란불", GREEN: "초록불" };

/** 초록 비율을 조금 높여 클릭 기회 확보 */
function nextSignal() {
  const r = Math.random();
  if (r < 0.35) return "RED";
  if (r < 0.55) return "YELLOW";
  return "GREEN";
}
/** 지터 적용 */
function withJitter(ms) {
  const f = 1 + (Math.random() * 2 - 1) * JITTER; // 0.8~1.2
  return Math.max(MIN_INTERVAL_MS, Math.min(MAX_INTERVAL_MS, Math.round(ms * f)));
}

/** =========================================
 * 플레이 컴포넌트 (페이지 하단에서 사용)
 * ========================================= */
function TrafficLightPlay() {
  // 모드: one(초록만 클릭) | three(3버튼 매핑)
  const [mode, setMode] = useState("three");
  const [tutorialEnabled, setTutorialEnabled] = useState(true);

  const [running, setRunning] = useState(false);
  const [sessionLeftMs, setSessionLeftMs] = useState(SESSION_MS);

  const [signal, setSignal] = useState("RED");
  const [intervalMs, setIntervalMs] = useState(BASE_INTERVAL_MS);

  const [inTutorial, setInTutorial] = useState(true);
  const [tutorialRoundLeft, setTutorialRoundLeft] = useState(TUTORIAL_ROUNDS);

  // 지표
  const [trials, setTrials] = useState(0);
  const [corrects, setCorrects] = useState(0);
  const [avgRtMs, setAvgRtMs] = useState(null);
  const [failWrongAction, setFailWrongAction] = useState(0);
  const [failMiss, setFailMiss] = useState(0);

  const [lastFeedback, setLastFeedback] = useState(null); // "correct" | "wrong" | "timeout" | null
  const [roundLeftMs, setRoundLeftMs] = useState(0);

  // 타이밍
  const stimulusShownAt = useRef(0);
  const deadlineAt = useRef(0);
  const reactedThisRound = useRef(false);
  const roundTokenRef = useRef(0);
  const raf = useRef(null);
  const roundTimer = useRef(null);
  const feedbackTimer = useRef(null);
  const ticker = useRef(null);

  const sessionProgress = useMemo(
    () => Math.max(0, Math.min(100, ((SESSION_MS - sessionLeftMs) / SESSION_MS) * 100)),
    [sessionLeftMs]
  );
  const accuracy = useMemo(() => (trials > 0 ? Math.round((corrects / trials) * 100) : 0), [trials, corrects]);

  const clearTimers = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (roundTimer.current) clearTimeout(roundTimer.current);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    raf.current = roundTimer.current = feedbackTimer.current = null;
  };

  const startCountdown = (token) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const tick = () => {
      if (token !== roundTokenRef.current) return;
      const remain = Math.max(0, deadlineAt.current - performance.now());
      setRoundLeftMs(remain);
      if (remain > 0) raf.current = requestAnimationFrame(tick);
      else raf.current = null;
    };
    raf.current = requestAnimationFrame(tick);
  };

  const startRound = () => {
    const token = ++roundTokenRef.current;
    reactedThisRound.current = false;

    // 튜토리얼 여부/간격
    const isTutorial = tutorialEnabled && inTutorial && tutorialRoundLeft > 0;
    const s = nextSignal();
    setSignal(s);

    const base = isTutorial ? TUTORIAL_INTERVAL_MS : intervalMs;
    const useMs = isTutorial ? base : withJitter(base);

    stimulusShownAt.current = performance.now();
    deadlineAt.current = stimulusShownAt.current + useMs;

    clearTimers();
    setRoundLeftMs(useMs);
    startCountdown(token);

    roundTimer.current = setTimeout(() => {
      if (token !== roundTokenRef.current) return;
      if (!reactedThisRound.current) {
        if (mode === "one") {
          // one-버튼: GREEN에서만 시도 집계
          if (s === "GREEN") {
            setTrials(t => t + 1);
            setFailMiss(v => v + 1);
            setLastFeedback("timeout");
          }
        } else {
          // three-버튼: 모든 라운드를 시도로 침
          setTrials(t => t + 1);
          // 무응답은 오답/미스 처리(둘 중 하나 정책 선택) - 여기선 미스
          setFailMiss(v => v + 1);
          setLastFeedback("timeout");
        }
        feedbackTimer.current = setTimeout(() => {
          setLastFeedback(null);
          // 튜토리얼 카운트 다운
          if (isTutorial) setTutorialRoundLeft(n => Math.max(0, n - 1));
          if (running) startRound();
        }, FEEDBACK_MS);
      }
    }, useMs);
  };

  const startSession = () => {
    if (running) return;
    setRunning(true);
    setSessionLeftMs(SESSION_MS);

    // 지표 초기화
    setTrials(0); setCorrects(0); setAvgRtMs(null);
    setFailWrongAction(0); setFailMiss(0);
    setLastFeedback(null); setRoundLeftMs(0);

    // 튜토리얼 상태 초기화
    setInTutorial(!!tutorialEnabled);
    setTutorialRoundLeft(tutorialEnabled ? TUTORIAL_ROUNDS : 0);

    // 본게임 기본 간격
    setIntervalMs(BASE_INTERVAL_MS);

    // 세션 타이머
    const startAt = performance.now();
    ticker.current = setInterval(() => {
      const elapsed = performance.now() - startAt;
      const left = Math.max(0, SESSION_MS - elapsed);
      setSessionLeftMs(left);
      if (left <= 0) stopSession();
    }, 100);

    // 첫 라운드
    startRound();
  };

  const stopSession = () => {
    setRunning(false);
    if (ticker.current) clearInterval(ticker.current);
    clearTimers();
  };

  // 적응 난이도: 정확도 70~85% 타겟
  useEffect(() => {
    if (!running || inTutorial) return;
    if (trials < 12) return;
    const faster = Math.round(intervalMs * 0.08);
    const slower = Math.round(intervalMs * 0.08);
    if (accuracy > 85 && intervalMs > MIN_INTERVAL_MS) {
      setIntervalMs(ms => Math.max(MIN_INTERVAL_MS, ms - faster));
    } else if (accuracy < 70 && intervalMs < MAX_INTERVAL_MS) {
      setIntervalMs(ms => Math.min(MAX_INTERVAL_MS, ms + slower));
    }
  }, [accuracy, trials, running, inTutorial, intervalMs]);

  // 튜토리얼 종료 감지
  useEffect(() => {
    if (!running) return;
    if (tutorialEnabled && inTutorial && tutorialRoundLeft <= 0) {
      setInTutorial(false); // 다음 라운드부터 본게임 간격(+지터)로
    }
  }, [tutorialRoundLeft, tutorialEnabled, inTutorial, running]);

  useEffect(() => {
    return () => {
      if (ticker.current) clearInterval(ticker.current);
      clearTimers();
    };
  }, []);

  /** 액션 처리
   * mode=one: GREEN에서 클릭만 정답, RED/YELLOW 클릭은 오답. RED/YELLOW 무응답은 집계X
   * mode=three: RED=STOP, YELLOW=WAIT, GREEN=GO 각 버튼 필요. 모든 라운드 시도 집계.
   */
  const onAction = (action) => {
    if (!running) return;
    const now = performance.now();
    if (now > deadlineAt.current) return;

    reactedThisRound.current = true;
    const rt = now - stimulusShownAt.current;

    if (mode === "one") {
      // 클릭 가능한 상황(GREEN)에서만 시도/평균RT
      if (signal === "GREEN") {
        setTrials(t => t + 1);
        setAvgRtMs(prev => (prev == null ? rt : (prev * (trials) + rt) / (trials + 1)));
        const correct = action === "GO";
        if (correct) {
          setCorrects(c => c + 1);
          setLastFeedback("correct");
        } else {
          setFailWrongAction(v => v + 1);
          setLastFeedback("wrong");
        }
      } else {
        // 금지 신호에서 눌렀으면 오답
        setFailWrongAction(v => v + 1);
        setLastFeedback("wrong");
      }
    } else {
      // three 버튼 모드: 항상 시도 집계
      setTrials(t => t + 1);
      setAvgRtMs(prev => (prev == null ? rt : (prev * (trials) + rt) / (trials + 1)));
      const correct =
        (signal === "RED"    && action === "STOP") ||
        (signal === "YELLOW" && action === "WAIT") ||
        (signal === "GREEN"  && action === "GO");
      if (correct) setCorrects(c => c + 1);
      else setFailWrongAction(v => v + 1);
      setLastFeedback(correct ? "correct" : "wrong");
    }

    clearTimers();
    feedbackTimer.current = setTimeout(() => {
      setLastFeedback(null);
      startRound();
    }, FEEDBACK_MS);
  };

  const roundCountdownText = useMemo(() => {
    if (lastFeedback) return "";
    const sec = roundLeftMs / 1000;
    return sec > 0 ? sec.toFixed(1) : "";
  }, [roundLeftMs, lastFeedback]);

  return (
    <Card sx={{ mt: 2, borderRadius: 3 }}>
      <CardContent>
        {/* 상단 상태/옵션 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight={700}>플레이</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControlLabel
              control={<Switch size="small" checked={tutorialEnabled} onChange={(_,v)=>setTutorialEnabled(v)} />}
              label={<Typography variant="caption">튜토리얼</Typography>}
            />
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_,v)=> v && setMode(v)}
              size="small"
              color="primary"
            >
              <ToggleButton value="one">1버튼</ToggleButton>
              <ToggleButton value="three">3버튼</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        {/* 세션 진행도 */}
        <Box mb={1}>
          <LinearProgress variant="determinate" value={sessionProgress} sx={{ height: 8, borderRadius: 999 }} />
          <Stack direction="row" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>경과 {Math.round(sessionProgress)}%</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>남은 {Math.ceil(sessionLeftMs / 1000)}s</Typography>
          </Stack>
        </Box>

        {/* 지표 */}
        <Stack direction="row" spacing={2} justifyContent="space-between" mb={1}>
          <Typography variant="body2">시도: <b>{trials}</b></Typography>
          <Typography variant="body2">정확도: <b>{accuracy}%</b></Typography>
          <Typography variant="body2">평균 RT: <b>{avgRtMs == null ? "-" : Math.round(avgRtMs)}ms</b></Typography>
          <Typography variant="body2">오답: <b>{failWrongAction}</b></Typography>
          <Typography variant="body2">미스: <b>{failMiss}</b></Typography>
        </Stack>

        {/* 신호등 + 카운트다운 + 튜토리얼 배지 */}
        <Stack alignItems="center" spacing={1}>
          {inTutorial && tutorialEnabled && (
            <Chip size="small" color="warning" label={`튜토리얼 진행 중 (${tutorialRoundLeft}회 남음)`} />
          )}
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              my: 1,
              width: 160,
              p: 2,
              borderRadius: 3,
              border: "2px solid",
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            <Box sx={{ width: 32, height: 32, borderRadius: "50%", mx: "auto", mb: 1.5,
              bgcolor: signal === "RED" ? "error.main" : "grey.500",
              boxShadow: signal === "RED" ? 4 : 0 }} />
            <Box sx={{ width: 32, height: 32, borderRadius: "50%", mx: "auto", mb: 1.5,
              bgcolor: signal === "YELLOW" ? "warning.main" : "grey.500",
              boxShadow: signal === "YELLOW" ? 4 : 0 }} />
            <Box sx={{ width: 32, height: 32, borderRadius: "50%", mx: "auto",
              bgcolor: signal === "GREEN" ? "success.main" : "grey.500",
              boxShadow: signal === "GREEN" ? 4 : 0 }} />

            {roundCountdownText && (
              <Typography variant="h4"
                          sx={{ position: "absolute", right: 8, top: 8, fontWeight: 800, opacity: 0.75, lineHeight: 1 }}>
                {roundCountdownText}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* 피드백 */}
        {lastFeedback && (
          <Typography align="center" sx={{
            fontWeight: 700, mb: 1,
            color: lastFeedback === "correct" ? "success.main" :
              lastFeedback === "timeout" ? "warning.main" : "error.main"
          }}>
            {lastFeedback === "correct" && "정답!"}
            {lastFeedback === "wrong" && "오답"}
            {lastFeedback === "timeout" && "미응답"}
          </Typography>
        )}

        {/* 행동 버튼 */}
        <Stack direction="row" spacing={1.5} justifyContent="center" mt={1}>
          {!running ? (
            <Button size="large" variant="contained" color="primary" onClick={startSession} sx={{ borderRadius: 3, px: 4 }}>
              시작
            </Button>
          ) : mode === "one" ? (
            <>
              <Button size="large" variant="contained" color="success" onClick={()=>onAction("GO")} sx={{ borderRadius: 3, px: 6 }}>
                🟩 클릭
              </Button>
              <Button size="large" variant="outlined" color="inherit" onClick={stopSession} sx={{ borderRadius: 3, px: 4 }}>
                종료
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="error"   onClick={()=>onAction("STOP")} sx={{ borderRadius: 3 }}>🟥 멈춤</Button>
              <Button variant="contained" color="warning" onClick={()=>onAction("WAIT")} sx={{ borderRadius: 3 }}>🟨 기다림</Button>
              <Button variant="contained" color="success" onClick={()=>onAction("GO")}   sx={{ borderRadius: 3 }}>🟩 클릭</Button>
              <Button variant="outlined"  color="inherit" onClick={stopSession} sx={{ borderRadius: 3 }}>종료</Button>
            </>
          )}
        </Stack>

        {/* 상태 표시 */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={1.5}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            간격: {inTutorial && tutorialEnabled ? TUTORIAL_INTERVAL_MS : intervalMs}ms {inTutorial && tutorialEnabled ? "(튜토리얼)" : ""}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>현재 신호: {SIGNAL_LABEL[signal]}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>모드: {mode === "one" ? "1버튼(초록만 클릭)" : "3버튼(색상별 행동)"}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

/** =========================================
 * 정보 + 프롬프트 + 플레이
 * ========================================= */
const TrafficLightReaction = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          신호등 반응 훈련
        </Typography>

        <Stack spacing={2}>
          {/* 설명 */}
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>게임 방식</Typography>
            <Typography variant="body1">
              빨간불은 멈춤, 초록불은 클릭, 노란불은 기다림. 신호등이 랜덤하게 바뀝니다.
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>시나리오</Typography>
            <Typography variant="body1">
              횡단보도를 건널 때 신호를 보고 즉시 올바른 행동을 하세요.
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>키워드 타입</Typography>
            <Typography variant="body1">주의력, 처리속도, 시공간</Typography>
          </Box>

          <Divider />

          {/* 메모 */}
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>개발 메모</Typography>
            <Typography variant="body2">
              • 튜토리얼(5초 고정, 3회) → 본게임(가변 간격 + ±20% 지터 + 적응 난이도)<br/>
              • 모드: 1버튼(초록만 클릭) / 3버튼(색상별 행동) 토글 지원<br/>
              • 지표: 시도/정확도/평균RT/오답/미스
            </Typography>
          </Box>

          <Divider />

          {/* 프롬프트 (나중에 제거 가능) */}
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
(게임) 신호등 반응 훈련
- 인지 영역: 주의력, 처리속도, 시공간
- 규칙: 신호등 랜덤 전환 (빨간불 금지 / 초록불 클릭 / 노란불 대기)
- 난이도: 튜토리얼 5초 고정(3회) 후, 본게임 간격 {{간격_ms}}ms(±20% 지터) 적응 조정
- 측정 지표: 시도 횟수, 성공률, 실패 유형(잘못된 반응/미응답), 평균 반응 시간
- 성적:
  • 시도 횟수: {{시도}}회
  • 성공률: {{성공률}}%
  • 실패율: {{실패율}}% (잘못된 반응 {{오답}}회, 미응답 {{미스}}회)
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

          {/* 실제 플레이 */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="overline" sx={{ opacity: 0.7 }}>플레이</Typography>
          <TrafficLightPlay />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TrafficLightReaction;
