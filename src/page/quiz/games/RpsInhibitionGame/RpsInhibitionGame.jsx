import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

/** -------------------------------------------
 * 상수·표현 관련
 * ------------------------------------------- */
const HANDS = ["rock", "paper", "scissors"];                  // 선택 가능한 손동작
const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };      // UI용 이모지
const LABEL = { rock: "바위", paper: "보", scissors: "가위" };  // 버튼 라벨

const SESSION_MS = 1 * 60 * 1000;      // 전체 세션 길이(1분)
const FAST_BONUS_MS = 800;             // 빠른 반응 보너스 임계(≤800ms면 +1)
const FEEDBACK_MS = 650;               // 정답/오답/시간초과 메시지 표시 시간

// 라운드 시간(시작값)
const RPS_INTERVAL_MS = 2_500;
// 적응 난이도 하·상한 (2.0s ~ 2.5s)
const MIN_INTERVAL_MS = 2_000;
const MAX_INTERVAL_MS = RPS_INTERVAL_MS;

/** -------------------------------------------
 * 유틸: 보안난수 기반 정수 [min,max], 연속 길이 범위 계산
 * ------------------------------------------- */
function randomInt(min, max) {
  const range = max - min + 1;
  if (window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return min + (arr[0] % range);
  }
  return min + Math.floor(Math.random() * range);
}

// switchWindow(평균 연속 길이 느낌)를 받아 대략적인 하·상한 범위를 만든다
function runBoundsFrom(windowLike) {
  const mean = Math.max(2, Math.round(windowLike)); // 최소 2 보장
  const minRun = Math.max(2, mean - 2);
  const maxRun = Math.max(minRun + 1, mean + 2);
  return { minRun, maxRun };
}

/** -------------------------------------------
 * 메인 컴포넌트
 * ------------------------------------------- */
const RpsInhibitionGame = () => {
  /** 세션 상태 */
  const [running, setRunning] = useState(false);                  // 세션 진행 여부
  const [sessionLeftMs, setSessionLeftMs] = useState(SESSION_MS); // 세션 남은 시간(ms)

  /** 현재 라운드 규칙/자극 */
  const [rule, setRule] = useState("WIN");                        // "WIN"(이기기) | "LOSE"(지기기)
  const [stimulus, setStimulus] = useState("rock");               // 현재 제시된 손동작

  /** 점수/통계 */
  const [score, setScore] = useState(0);                          // 총 점수(정답 +1, 빠르면 +1 추가)
  const [trials, setTrials] = useState(0);                        // 시도 수
  const [corrects, setCorrects] = useState(0);                    // 정답 수
  const [avgRtMs, setAvgRtMs] = useState(null);                   // 평균 반응시간(ms)
  const [lastFeedback, setLastFeedback] = useState(null);         // "correct" | "correct-fast" | "wrong" | "timeout" | null

  /** 난이도(적응) */
  const [intervalMs, setIntervalMs] = useState(MAX_INTERVAL_MS);  // 라운드 시간(적응)
  const [switchWindow, setSwitchWindow] = useState(5);            // 규칙 평균 연속 길이 느낌(작을수록 잦은 전환)
  const [showPreviewHint, setShowPreviewHint] = useState(true);   // 초반 힌트 노출

  /** 라운드 타이밍/토큰 (경쟁 상태 방지용) */
  const stimulusShownAt = useRef(0);                              // 자극 제시 시각(performance.now)
  const deadlineAt = useRef(0);                                   // 라운드 마감 시각(= 제시+intervalMs)
  const reactedThisRound = useRef(false);                         // 이번 라운드에서 입력했는지
  const roundTokenRef = useRef(0);                                // 라운드 고유 토큰(이전 타이머 무시 용도)

  /** 규칙 연속 길이 관리 (run-length 방식) */
  const ruleRunLeftRef = useRef(0);                               // 현재 규칙에서 남은 라운드 수

  /** 카운트다운 표시용(rAF) */
  const [roundLeftMs, setRoundLeftMs] = useState(0);              // 라운드 남은 시간(ms)
  const countdownRaf = useRef(null);                              // rAF 핸들

  /** 타이머 핸들(정리용) */
  const ticker = useRef(null);                                    // 세션 남은시간 업데이트 interval
  const roundTimer = useRef(null);                                // 라운드 타임아웃(미응답)
  const feedbackTimer = useRef(null);                             // 피드백 표시 유지 타이머

  /** 짧은 햅틱 */
  const vibrate = (ms = 30) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch {} };

  /** UI용 파생 값 */
  const sessionProgress = useMemo(
    () => Math.max(0, Math.min(100, ((SESSION_MS - sessionLeftMs) / SESSION_MS) * 100)),
    [sessionLeftMs]
  );
  const accuracy = useMemo(
    () => (trials > 0 ? Math.round((corrects / trials) * 100) : 0),
    [trials, corrects]
  );

  /** 라운드의 정답 손동작 계산 */
  const getCorrectHand = (stim, r) => {
    if (r === "WIN") {                  // 이기기: 제시 손동작을 이기는 수
      if (stim === "rock") return "paper";
      if (stim === "paper") return "scissors";
      return "rock";
    } else {                            // 지기기: 제시 손동작에 지는 수
      if (stim === "rock") return "scissors";
      if (stim === "paper") return "rock";
      return "paper";
    }
  };

  /** 모든 라운드 타이머/루프 정리 (라운드 전환·종료 시 호출) */
  const clearRoundTimers = () => {
    if (roundTimer.current) { clearTimeout(roundTimer.current); roundTimer.current = null; }
    if (feedbackTimer.current) { clearTimeout(feedbackTimer.current); feedbackTimer.current = null; }
    if (countdownRaf.current) { cancelAnimationFrame(countdownRaf.current); countdownRaf.current = null; }
  };

  /** rAF 기반 라운드 카운트다운 시작(토큰으로 루프 유효성 관리) */
  const startRoundCountdown = (token) => {
    if (countdownRaf.current) cancelAnimationFrame(countdownRaf.current);
    const tick = () => {
      if (token !== roundTokenRef.current) return;            // 다른 라운드면 즉시 중단
      const remaining = Math.max(0, deadlineAt.current - performance.now());
      setRoundLeftMs(remaining);
      if (remaining > 0) {
        countdownRaf.current = requestAnimationFrame(tick);
      } else {
        countdownRaf.current = null;
      }
    };
    countdownRaf.current = requestAnimationFrame(tick);
  };

  /** 다음 라운드로 전환 */
  const nextRound = (opts) => {
    const keepRule = opts && opts.keepRule;

    // ★★★ 규칙 전환: 연속 길이(run-length) 기반 ★★★
    setRule((prevRule) => {
      if (keepRule) return prevRule;

      // 현재 규칙에서 남은 라운드 수를 1 줄임
      ruleRunLeftRef.current = Math.max(0, ruleRunLeftRef.current - 1);

      if (ruleRunLeftRef.current > 0) {
        // 아직 연속 구간 소진 전 → 규칙 유지
        return prevRule;
      } else {
        // 연속 구간 소진 → 규칙 전환
        const nextRule = prevRule === "WIN" ? "LOSE" : "WIN";

        // 새 연속 길이 설정(현 switchWindow를 평균처럼 반영)
        const { minRun, maxRun } = runBoundsFrom(switchWindow);
        ruleRunLeftRef.current = randomInt(minRun, maxRun);

        return nextRule;
      }
    });

    // 새 자극 선택
    const nextStim = HANDS[Math.floor(Math.random() * HANDS.length)];
    setStimulus(nextStim);

    // 라운드 토큰 갱신(이 토큰과 일치하는 타이머/카운트다운만 유효)
    const myToken = roundTokenRef.current + 1;
    roundTokenRef.current = myToken;

    // 라운드 타이밍 초기화
    reactedThisRound.current = false;
    stimulusShownAt.current = performance.now();
    deadlineAt.current = stimulusShownAt.current + intervalMs;
    setRoundLeftMs(intervalMs); // 카운트다운 초기값 세팅

    // 기존 타이머 정리 후 새 타이머/카운트다운 시작
    clearRoundTimers();
    startRoundCountdown(myToken);

    // 라운드 타임아웃(미응답 시)
    roundTimer.current = setTimeout(() => {
      if (myToken !== roundTokenRef.current) return;          // 토큰 검증
      if (performance.now() < deadlineAt.current) return;     // 지연깨움 방지

      if (!reactedThisRound.current) {
        setTrials((prev) => prev + 1);
        setLastFeedback("timeout");
        // 피드백 FEEDBACK_MS 후 다음 라운드
        feedbackTimer.current = setTimeout(() => {
          setLastFeedback(null);
          if (running) nextRound();
        }, FEEDBACK_MS);
      }
    }, intervalMs);
  };

  /** 적응 난이도 (정확도 70~85% 목표, 5% 비율 증감, 2.0s~2.5s 범위) */
  useEffect(() => {
    if (!running || trials < 10) return;
    const dec = Math.round(intervalMs * 0.05);                // 5% 감소폭
    const inc = Math.round(intervalMs * 0.05);                // 5% 증가폭
    if (accuracy > 85 && intervalMs > MIN_INTERVAL_MS) {
      setIntervalMs((ms) => Math.max(MIN_INTERVAL_MS, ms - dec));
      setSwitchWindow((w) => Math.max(2, w - 1));             // 규칙 전환은 약간 더 잦게
    } else if (accuracy < 70 && intervalMs < MAX_INTERVAL_MS) {
      setIntervalMs((ms) => Math.min(MAX_INTERVAL_MS, ms + inc));
      setSwitchWindow((w) => Math.min(8, w + 1));             // 규칙 전환은 약간 완화
    }
  }, [accuracy, trials, running, intervalMs]);

  /** (선택) 초반 힌트 자동 해제: 20시도 이상 & 정확도 75%↑ */
  useEffect(() => {
    if (!running) return;
    if (showPreviewHint && trials >= 20 && accuracy >= 75) setShowPreviewHint(false);
  }, [running, trials, accuracy, showPreviewHint]);

  /** 세션 시작 */
  const startSession = () => {
    if (running) return;
    clearRoundTimers();

    // 세션 상태 초기화
    setRunning(true);
    setSessionLeftMs(SESSION_MS);
    setScore(0);
    setTrials(0);
    setCorrects(0);
    setAvgRtMs(null);
    setRule("WIN");
    setIntervalMs(MAX_INTERVAL_MS);     // 시작 간격을 상한(2.5s)으로
    setSwitchWindow(5);
    setShowPreviewHint(true);
    setLastFeedback(null);
    setRoundLeftMs(0);
    roundTokenRef.current = 0;

    // ★ 규칙 연속 길이 초기화
    const { minRun, maxRun } = runBoundsFrom(5);              // 초기 switchWindow(=5) 기준
    ruleRunLeftRef.current = randomInt(minRun, maxRun);

    // 세션 타이머 시작
    const startAt = performance.now();
    ticker.current = setInterval(() => {
      const elapsed = performance.now() - startAt;
      const left = Math.max(0, SESSION_MS - elapsed);
      setSessionLeftMs(left);
      if (left <= 0) stopSession();
    }, 100);

    // 첫 라운드 시작
    nextRound({ keepRule: true }); // 첫 라운드는 규칙 유지(연속 길이 소모 안 함)
  };

  /** 세션 종료/일시정지 */
  const stopSession = () => {
    setRunning(false);
    if (ticker.current) { clearInterval(ticker.current); ticker.current = null; }
    clearRoundTimers();
  };

  /** 사용자 선택 처리 */
  const onChoose = (choice) => {
    if (!running) return;

    const myToken = roundTokenRef.current;
    const now = performance.now();
    const rt = now - stimulusShownAt.current;

    // 마감 이후 입력은 무시(라운드가 이미 끝난 상황 방지)
    if (now > deadlineAt.current) return;

    reactedThisRound.current = true;

    // 정답 판정
    const correctHand = getCorrectHand(stimulus, rule);
    const isCorrect = choice === correctHand;

    // 시도 수/평균 반응시간 갱신(이전 trials 기반으로 안전 갱신)
    setTrials((prevTrials) => {
      if (myToken !== roundTokenRef.current) return prevTrials;
      const newTrials = prevTrials + 1;
      setAvgRtMs((prevAvg) => (prevAvg == null ? rt : (prevAvg * prevTrials + rt) / newTrials));
      return newTrials;
    });

    if (myToken !== roundTokenRef.current) return;

    // 점수/피드백 갱신
    if (isCorrect) {
      let gained = 1;
      const fast = rt <= FAST_BONUS_MS;
      if (fast) gained += 1;            // 빠른 반응 보너스(+1)
      setScore((s) => s + gained);
      setCorrects((c) => c + 1);
      setLastFeedback(fast ? "correct-fast" : "correct");
      vibrate(20);
    } else {
      setLastFeedback("wrong");
      vibrate(10);
    }

    // 라운드 종료: 카운트다운/타이머 정리 후 FEEDBACK_MS 뒤에 다음 라운드
    clearRoundTimers();
    feedbackTimer.current = setTimeout(() => {
      setLastFeedback(null);
      nextRound();
    }, FEEDBACK_MS);
  };

  /** 언마운트/종료 클린업 */
  useEffect(() => {
    return () => {
      if (ticker.current) clearInterval(ticker.current);
      clearRoundTimers();
    };
  }, []);

  /** 라운드 숫자 카운트다운 텍스트(0.1초 단위) */
  const roundCountdownText = useMemo(() => {
    if (lastFeedback) return "";         // 피드백 중에는 숨김
    const sec = roundLeftMs / 1000;
    if (sec <= 0) return "";
    return sec.toFixed(1);               // 예) "2.3"
  }, [roundLeftMs, lastFeedback]);

  /** -------------------------------------------
   * 렌더
   * ------------------------------------------- */
  return (
    <Card sx={{ maxWidth: 540, mx: "auto", borderRadius: "24px", boxShadow: 3 }}>
      <CardContent>
        {/* 헤더 */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" fontWeight={700}>역가위바위보 (반응 억제)</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>세션: 1분</Typography>
        </Stack>

        {/* 세션 진행도 */}
        <Box mb={2}>
          <LinearProgress variant="determinate" value={sessionProgress} sx={{ height: 8, borderRadius: 999 }} />
          <Stack direction="row" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>경과 {Math.round(sessionProgress)}%</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>남은시간 {Math.ceil(sessionLeftMs / 1000)}s</Typography>
          </Stack>
        </Box>

        {/* 상태 바 (점수/정확도/평균 RT/시도) */}
        <Stack direction="row" spacing={2} justifyContent="space-between" mb={1}>
          <Typography variant="body2">점수: <b>{score}</b></Typography>
          <Typography variant="body2">정확도: <b>{accuracy}%</b></Typography>
          <Typography variant="body2">반응속도평균: <b>{avgRtMs == null ? "-" : Math.round(avgRtMs)}ms</b></Typography>
          <Typography variant="body2">시도: <b>{trials}</b></Typography>
        </Stack>

        {/* 현재 규칙/자극 + 카운트다운 + 피드백 */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 3,
            px: 2,
            py: 1.5,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            mb: 2,
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: 1 }}>현재 규칙</Typography>
          <Typography variant="h5" fontWeight={800} mb={0.5}>
            {rule === "WIN" ? "이기기" : "지기기"}
          </Typography>

          <Typography variant="overline" sx={{ letterSpacing: 1 }}>제시 손동작</Typography>
          <Typography variant="h3" component="div" sx={{ userSelect: "none", lineHeight: 1, mt: 0.5 }}>
            {EMOJI[stimulus]}
          </Typography>

          {/* 숫자 카운트다운(우상단) */}
          {roundCountdownText && (
            <Typography
              variant="h4"
              sx={{ position: "absolute", right: 12, top: 12, fontWeight: 800, opacity: 0.75, lineHeight: 1 }}
              aria-label={`남은 시간 ${roundCountdownText}초`}
            >
              {roundCountdownText}
            </Typography>
          )}

          {/* 피드백 메시지 */}
          {lastFeedback && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontWeight: 700,
                color:
                  lastFeedback === "correct" || lastFeedback === "correct-fast"
                    ? "success.main"
                    : lastFeedback === "wrong"
                      ? "error.main"
                      : "warning.main",
              }}
            >
              {lastFeedback === "correct-fast" && "정답! (+2: 빠른 반응 보너스)"}
              {lastFeedback === "correct" && "정답! (+1)"}
              {lastFeedback === "wrong" && "오답"}
              {lastFeedback === "timeout" && "시간 초과"}
            </Typography>
          )}

          {/* 초반 힌트(성능 향상 시 자동 해제) */}
          {showPreviewHint && !lastFeedback && (
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
              힌트: {rule === "WIN" ? "이기는 수" : "지는 수"}를 고르세요
            </Typography>
          )}
        </Box>

        {/* 선택 버튼 */}
        <Stack direction="row" spacing={1.5} justifyContent="space-between">
          {HANDS.map((h) => (
            <Button
              key={h}
              variant="contained"
              onClick={() => onChoose(h)}
              disabled={!running || !!lastFeedback}       // 피드백 표시 중에는 입력 잠금
              sx={{ flex: 1, py: 2.5, borderRadius: 3, textTransform: "none", fontSize: 18, minWidth: 0 }}
            >
              <Box sx={{ fontSize: 28, mr: 1 }}>{EMOJI[h]}</Box>
              {LABEL[h]}
            </Button>
          ))}
        </Stack>

        {/* 컨트롤 버튼 */}
        <Stack direction="row" spacing={1.5} justifyContent="center" mt={2}>
          {!running ? (
            <Button size="large" variant="contained" color="primary" onClick={startSession} sx={{ borderRadius: 3, px: 4 }}>
              시작
            </Button>
          ) : (
            <Button size="large" variant="outlined" color="inherit" onClick={stopSession} sx={{ borderRadius: 3, px: 4 }}>
              일시정지/종료
            </Button>
          )}
        </Stack>

        {/* 디버그(난이도 상태) */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={1.5}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>자극 간격: {intervalMs}ms</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>전환 주기(평균): ~{switchWindow}회</Typography>
          {!showPreviewHint && <Typography variant="caption" sx={{ opacity: 0.7 }}>힌트: 해제됨</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RpsInhibitionGame;
