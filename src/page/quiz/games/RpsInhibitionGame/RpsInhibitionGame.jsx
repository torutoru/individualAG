import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

const HANDS = ["rock", "paper", "scissors"];
const EMOJI = {rock: "✊", paper: "✋", scissors: "✌️"};
const LABEL = {rock: "바위", paper: "보", scissors: "가위"};

const SESSION_MS = 2 * 60 * 1000; // 2분
const FAST_BONUS_MS = 800;
const FEEDBACK_MS = 650;

function beats(a, b) {
  return (
    (a === "rock" && b === "scissors") ||
    (a === "scissors" && b === "paper") ||
    (a === "paper" && b === "rock")
  );
}

const RpsInhibitionGame = () => {
  // 세션 상태
  const [running, setRunning] = useState(false);
  const [sessionLeftMs, setSessionLeftMs] = useState(SESSION_MS);

  // 라운드/자극
  const [rule, setRule] = useState("WIN");
  const [stimulus, setStimulus] = useState("rock");
  const [roundIdx, setRoundIdx] = useState(0);

  // 점수/통계
  const [score, setScore] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [trials, setTrials] = useState(0);
  const [corrects, setCorrects] = useState(0);
  const [avgRtMs, setAvgRtMs] = useState(null);
  const [lastFeedback, setLastFeedback] = useState(null); // "correct" | "correct-fast" | "wrong" | "timeout" | null

  // 난이도(적응)
  const [intervalMs, setIntervalMs] = useState(1500);
  const [switchWindow, setSwitchWindow] = useState(5);
  const [showPreviewHint, setShowPreviewHint] = useState(true);

  // 라운드 타이밍/토큰
  const stimulusShownAt = useRef(0);
  const deadlineAt = useRef(0);
  const reactedThisRound = useRef(false);
  const roundTokenRef = useRef(0);

  // 라운드 카운트다운 표시용
  const [roundLeftMs, setRoundLeftMs] = useState(0);
  const countdownRaf = useRef(null);

  // 타이머 핸들
  const ticker = useRef(null);
  const roundTimer = useRef(null);
  const feedbackTimer = useRef(null);

  const vibrate = (ms = 30) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch {} };

  const sessionProgress = useMemo(() =>
      Math.max(0, Math.min(100, ((SESSION_MS - sessionLeftMs) / SESSION_MS) * 100))
    , [sessionLeftMs]);

  const accuracy = useMemo(() =>
      (trials > 0 ? Math.round((corrects / trials) * 100) : 0)
    , [trials, corrects]);

  const getCorrectHand = (stim, r) => {
    if (r === "WIN") {
      if (stim === "rock") return "paper";
      if (stim === "paper") return "scissors";
      return "rock";
    } else {
      if (stim === "rock") return "scissors";
      if (stim === "paper") return "rock";
      return "paper";
    }
  };

  const clearRoundTimers = () => {
    if (roundTimer.current) { clearTimeout(roundTimer.current); roundTimer.current = null; }
    if (feedbackTimer.current) { clearTimeout(feedbackTimer.current); feedbackTimer.current = null; }
    if (countdownRaf.current) { cancelAnimationFrame(countdownRaf.current); countdownRaf.current = null; }
  };

  // rAF로 라운드 남은 시간 갱신
  const startRoundCountdown = () => {
    if (countdownRaf.current) cancelAnimationFrame(countdownRaf.current);
    const tick = () => {
      const remaining = Math.max(0, deadlineAt.current - performance.now());
      setRoundLeftMs(remaining);
      if (remaining > 0 && running && !lastFeedback) {
        countdownRaf.current = requestAnimationFrame(tick);
      } else {
        countdownRaf.current = null;
      }
    };
    countdownRaf.current = requestAnimationFrame(tick);
  };

  const nextRound = (opts) => {
    const keepRule = opts && opts.keepRule;

    // 규칙 전환
    const shouldSwitch = keepRule ? false : Math.random() < 1 / Math.max(2, switchWindow);
    setRule((prev) => (shouldSwitch ? (prev === "WIN" ? "LOSE" : "WIN") : prev));

    // 자극 선택
    const nextStim = HANDS[Math.floor(Math.random() * HANDS.length)];
    setStimulus(nextStim);

    // 라운드 토큰 갱신
    const myToken = roundTokenRef.current + 1;
    roundTokenRef.current = myToken;

    // 라운드 타이밍 초기화
    reactedThisRound.current = false;
    stimulusShownAt.current = performance.now();
    deadlineAt.current = stimulusShownAt.current + intervalMs;
    setRoundIdx((i) => i + 1);
    setRoundLeftMs(intervalMs); // 초기값

    // 타이머 초기화 및 새 타임아웃 설정
    clearRoundTimers();
    startRoundCountdown();

    roundTimer.current = setTimeout(() => {
      // 토큰/데드라인 검증
      if (myToken !== roundTokenRef.current) return;
      if (performance.now() < deadlineAt.current) return;

      if (!reactedThisRound.current) {
        setTrials((prev) => prev + 1);
        setLastFeedback("timeout");
        // 피드백 표시 후 다음 라운드
        feedbackTimer.current = setTimeout(() => {
          setLastFeedback(null);
          if (running) nextRound();
        }, FEEDBACK_MS);
      }
    }, intervalMs);
  };

  // 난이도 적응
  useEffect(() => {
    if (!running || trials < 10) return;
    if (accuracy > 85 && intervalMs > 800) {
      setIntervalMs((ms) => Math.max(700, ms - 100));
      setSwitchWindow((w) => Math.max(2, w - 1));
    } else if (accuracy < 70 && intervalMs < 1700) {
      setIntervalMs((ms) => ms + 100);
      setSwitchWindow((w) => Math.min(8, w + 1));
    }
    if (showPreviewHint && trials >= 20 && accuracy >= 75) {
      setShowPreviewHint(false);
    }
  }, [accuracy, trials, running, intervalMs, showPreviewHint]);

  const startSession = () => {
    if (running) return;
    clearRoundTimers();

    setRunning(true);
    setSessionLeftMs(SESSION_MS);
    setScore(0);
    setBonus(0);
    setTrials(0);
    setCorrects(0);
    setAvgRtMs(null);
    setRule("WIN");
    setIntervalMs(1500);
    setSwitchWindow(5);
    setShowPreviewHint(true);
    setLastFeedback(null);
    setRoundIdx(0);
    setRoundLeftMs(0);
    roundTokenRef.current = 0;

    const startAt = performance.now();
    ticker.current = setInterval(() => {
      const elapsed = performance.now() - startAt;
      const left = Math.max(0, SESSION_MS - elapsed);
      setSessionLeftMs(left);
      if (left <= 0) stopSession();
    }, 100);

    nextRound({keepRule: true});
  };

  const stopSession = () => {
    setRunning(false);
    if (ticker.current) { clearInterval(ticker.current); ticker.current = null; }
    clearRoundTimers();
  };

  const onChoose = (choice) => {
    if (!running) return;

    const myToken = roundTokenRef.current;
    const now = performance.now();
    const rt = now - stimulusShownAt.current;

    // 마감 후 입력 무시
    if (now > deadlineAt.current) return;

    reactedThisRound.current = true;

    const correctHand = getCorrectHand(stimulus, rule);
    const isCorrect = choice === correctHand;

    // trials/avgRtMs 갱신
    setTrials((prevTrials) => {
      if (myToken !== roundTokenRef.current) return prevTrials;
      const newTrials = prevTrials + 1;
      setAvgRtMs((prevAvg) => (prevAvg == null ? rt : (prevAvg * prevTrials + rt) / newTrials));
      return newTrials;
    });

    if (myToken !== roundTokenRef.current) return;

    if (isCorrect) {
      let gained = 1;
      let fast = false;
      if (rt <= FAST_BONUS_MS) { gained += 1; fast = true; setBonus((b) => b + 1); }
      setScore((s) => s + gained);
      setCorrects((c) => c + 1);
      setLastFeedback(fast ? "correct-fast" : "correct");
      vibrate(20);
    } else {
      setLastFeedback("wrong");
      vibrate(10);
    }

    // 라운드 종료: 카운트다운/타이머 정리 후 FEEDBACK_MS 유지
    clearRoundTimers();
    feedbackTimer.current = setTimeout(() => {
      setLastFeedback(null);
      nextRound();
    }, FEEDBACK_MS);
  };

  useEffect(() => {
    return () => {
      if (ticker.current) clearInterval(ticker.current);
      clearRoundTimers();
    };
  }, []);

  // 숫자 카운트다운 표시용: 1/10초 단위로 보여주면 직관적
  const roundCountdownText = useMemo(() => {
    // 피드백 중엔 카운트다운 숨김
    if (lastFeedback) return "";
    const sec = roundLeftMs / 1000;
    if (sec <= 0) return "";
    // 0.1초 단위 반올림(ceil로 초반 촉박감 방지 가능)
    return sec.toFixed(1); // 예: "1.4"
  }, [roundLeftMs, lastFeedback]);

  return (
    <Card sx={{maxWidth: 540, mx: "auto", borderRadius: "24px", boxShadow: 3}}>
      <CardContent>
        {/* 헤더 */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" fontWeight={700}>
            역가위바위보 (반응 억제)
          </Typography>
          <Typography variant="body2" sx={{opacity: 0.7}}>
            세션: 2분
          </Typography>
        </Stack>

        {/* 세션 진행도 */}
        <Box mb={2}>
          <LinearProgress
            variant="determinate"
            value={sessionProgress}
            sx={{height: 8, borderRadius: 999}}
          />
          <Stack direction="row" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" sx={{opacity: 0.7}}>
              경과 {Math.round(sessionProgress)}%
            </Typography>
            <Typography variant="caption" sx={{opacity: 0.7}}>
              남은시간 {Math.ceil(sessionLeftMs / 1000)}s
            </Typography>
          </Stack>
        </Box>

        {/* 상태 바 */}
        <Stack direction="row" spacing={2} justifyContent="space-between" mb={1}>
          <Typography variant="body2">점수: <b>{score}</b></Typography>
          <Typography variant="body2">정확도: <b>{accuracy}%</b></Typography>
          <Typography variant="body2">
            반응속도평균: <b>{avgRtMs ? Math.round(avgRtMs) : "-"}ms</b>
          </Typography>
          <Typography variant="body2">시도: <b>{trials}</b></Typography>
        </Stack>

        {/* 규칙 / 자극 + 라운드 카운트다운 */}
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
          <Typography variant="overline" sx={{letterSpacing: 1}}>
            현재 규칙
          </Typography>
          <Typography variant="h5" fontWeight={800} mb={0.5}>
            {rule === "WIN" ? "이기기" : "지기기"}
          </Typography>

          <Typography variant="overline" sx={{letterSpacing: 1}}>
            제시 손동작
          </Typography>
          <Typography
            variant="h3"
            component="div"
            sx={{userSelect: "none", lineHeight: 1, mt: 0.5}}
          >
            {EMOJI[stimulus]}
          </Typography>

          {/* 숫자 카운트다운 (피드백 중에는 숨김) */}
          {roundCountdownText && (
            <Typography
              variant="h4"
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                fontWeight: 800,
                opacity: 0.75,
                lineHeight: 1,
              }}
              aria-label={`남은 시간 ${roundCountdownText}초`}
            >
              {roundCountdownText}
            </Typography>
          )}

          {/* 피드백 */}
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

          {/* 초반 힌트 */}
          {showPreviewHint && !lastFeedback && (
            <Typography variant="body2" sx={{mt: 1, opacity: 0.7}}>
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
              disabled={!running || !!lastFeedback} // 피드백 중 입력 잠금
              sx={{
                flex: 1,
                py: 2.5,
                borderRadius: 3,
                textTransform: "none",
                fontSize: 18,
                minWidth: 0,
              }}
            >
              <Box sx={{fontSize: 28, mr: 1}}>{EMOJI[h]}</Box>
              {LABEL[h]}
            </Button>
          ))}
        </Stack>

        {/* 컨트롤 */}
        <Stack direction="row" spacing={1.5} justifyContent="center" mt={2}>
          {!running ? (
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={startSession}
              sx={{borderRadius: 3, px: 4}}
            >
              시작
            </Button>
          ) : (
            <Button
              size="large"
              variant="outlined"
              color="inherit"
              onClick={stopSession}
              sx={{borderRadius: 3, px: 4}}
            >
              일시정지/종료
            </Button>
          )}
        </Stack>

        {/* 난이도 디버그 */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={1.5}>
          <Typography variant="caption" sx={{opacity: 0.7}}>
            자극 간격: {intervalMs}ms
          </Typography>
          <Typography variant="caption" sx={{opacity: 0.7}}>
            전환 주기: ~{switchWindow}회
          </Typography>
          {!showPreviewHint && (
            <Typography variant="caption" sx={{opacity: 0.7}}>
              힌트: 해제됨
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RpsInhibitionGame;
