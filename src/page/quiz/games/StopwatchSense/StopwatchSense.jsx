import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, Divider, LinearProgress,
  MenuItem, Select, Stack, Switch, FormControlLabel, Typography
} from "@mui/material";

/** =========================================
 * 설정
 * ========================================= */
const SESSION_MS = 60_000;                 // 세션 길이(1분)
const FEEDBACK_MS = 700;                   // 피드백 노출 시간
const DEFAULT_TOLERANCE_MS = 500;          // 기본 허용 편차(±0.5s)
const MIN_TOLERANCE_MS = 150;
const MAX_TOLERANCE_MS = 800;
const TARGET_CHOICES_SEC = [2, 3, 4, 5];   // 기본 목표시간 후보

/** 보조 */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmtMs = (ms) => `${Math.round(ms)}ms`;

/** =========================================
 * 플레이 컴포넌트
 * - 모드: 목표시간 랜덤 or 고정
 * - 옵션: 허용 편차(±) 조절, 적응 난이도 ON/OFF, 시간표시 숨김 ON/OFF
 * - 지표: 시도/성공률/평균 절대 오차/오차 편향(빠름-늦음)/빠름/늦음/미응답
 * ========================================= */
function StopwatchPlay() {
  // 세션 상태
  const [running, setRunning] = useState(false);
  const [sessionLeftMs, setSessionLeftMs] = useState(SESSION_MS);

  // 라운드 상태
  const [targetMode, setTargetMode] = useState("random");  // "random" | "fixed"
  const [fixedTarget, setFixedTarget] = useState(3);       // 고정 목표(초)
  const [targetSec, setTargetSec] = useState(3);
  const [toleranceMs, setToleranceMs] = useState(DEFAULT_TOLERANCE_MS);
  const [adaptive, setAdaptive] = useState(true);
  const [showTimer, setShowTimer] = useState(false);       // 카운트업 표시

  const [roundRunning, setRoundRunning] = useState(false);
  const [roundElapsedMs, setRoundElapsedMs] = useState(0);

  // 지표
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [avgAbsErrMs, setAvgAbsErrMs] = useState(null);
  const [meanSignedErrMs, setMeanSignedErrMs] = useState(0); // (+늦음, -빠름)
  const [earlyCount, setEarlyCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [timeoutCount, setTimeoutCount] = useState(0);

  const [lastFeedback, setLastFeedback] = useState(null); // "success"|"early"|"late"|"timeout"|null

  // 타이밍
  const sessionTicker = useRef(null);
  const raf = useRef(null);
  const roundStartedAt = useRef(0);
  const roundDeadlineAt = useRef(0);

  const successRate = useMemo(
    () => (attempts > 0 ? Math.round((successes / attempts) * 100) : 0),
    [attempts, successes]
  );
  const sessionProgress = useMemo(
    () => Math.max(0, Math.min(100, ((SESSION_MS - sessionLeftMs) / SESSION_MS) * 100)),
    [sessionLeftMs]
  );

  const pickTarget = () => {
    if (targetMode === "fixed") return fixedTarget;
    return TARGET_CHOICES_SEC[(Math.random() * TARGET_CHOICES_SEC.length) | 0];
  };

  const clearTimers = () => {
    if (sessionTicker.current) { clearInterval(sessionTicker.current); sessionTicker.current = null; }
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
  };

  const startRound = () => {
    const T = pickTarget();
    setTargetSec(T);
    setRoundRunning(true);
    setRoundElapsedMs(0);

    // 라운드 시작/마감 기준
    const now = performance.now();
    roundStartedAt.current = now;
    // 최대 대기: 목표+3s (너무 오래 기다리는 것 방지)
    const windowMs = T * 1000 + 3000;
    roundDeadlineAt.current = now + windowMs;

    // rAF로 경과 갱신(표시만)
    const loop = () => {
      const t = performance.now();
      setRoundElapsedMs(t - roundStartedAt.current);
      if (roundRunning && t < roundDeadlineAt.current) {
        raf.current = requestAnimationFrame(loop);
      } else {
        raf.current = null;
      }
    };
    if (showTimer) raf.current = requestAnimationFrame(loop);

    // 라운드 타임아웃(미응답)
    setTimeout(() => {
      // 이미 라운드가 끝났다면 무시
      if (!roundRunning) return;
      onClickStop(true); // timeout 처리
    }, windowMs);
  };

  const startSession = () => {
    if (running) return;
    setRunning(true);
    setSessionLeftMs(SESSION_MS);

    // 지표 초기화
    setAttempts(0); setSuccesses(0);
    setAvgAbsErrMs(null); setMeanSignedErrMs(0);
    setEarlyCount(0); setLateCount(0); setTimeoutCount(0);
    setLastFeedback(null);

    // 세션 타이머
    const startedAt = performance.now();
    sessionTicker.current = setInterval(() => {
      const left = Math.max(0, SESSION_MS - (performance.now() - startedAt));
      setSessionLeftMs(left);
      if (left <= 0) stopSession();
    }, 100);

    // 첫 라운드
    startRound();
  };

  const stopSession = () => {
    setRunning(false);
    setRoundRunning(false);
    clearTimers();
  };

  const applyAdaptive = (newAttempts, newSuccessRate) => {
    if (!adaptive || newAttempts < 10) return;
    // 목표: 성공률 70~85%
    if (newSuccessRate > 85) {
      setToleranceMs(ms => clamp(Math.round(ms - 50), MIN_TOLERANCE_MS, MAX_TOLERANCE_MS));
    } else if (newSuccessRate < 70) {
      setToleranceMs(ms => clamp(Math.round(ms + 50), MIN_TOLERANCE_MS, MAX_TOLERANCE_MS));
    }
  };

  /** 사용자의 "지금!" 클릭 */
  const onClickStop = (fromTimeout = false) => {
    if (!roundRunning) return;

    const now = performance.now();
    const elapsed = now - roundStartedAt.current; // 실제 경과
    const targetMs = targetSec * 1000;

    setRoundRunning(false);

    // 지표 업데이트
    setAttempts(a => a + 1);
    const signedErr = elapsed - targetMs;         // +늦음, -빠름
    const absErr = Math.abs(signedErr);

    setAvgAbsErrMs(prev => (prev == null ? absErr : (prev * attempts + absErr) / (attempts + 1)));
    setMeanSignedErrMs(prev => (prev * attempts + signedErr) / (attempts + 1));

    if (fromTimeout) {
      setTimeoutCount(c => c + 1);
      setLastFeedback("timeout");
    } else if (absErr <= toleranceMs) {
      setSuccesses(s => s + 1);
      setLastFeedback("success");
    } else if (signedErr < 0) {
      setEarlyCount(c => c + 1);
      setLastFeedback("early");
    } else {
      setLateCount(c => c + 1);
      setLastFeedback("late");
    }

    // 피드백 후 다음 라운드
    setTimeout(() => {
      setLastFeedback(null);
      if (!running) return;

      // 적응 난이도
      const nextAttempts = attempts + 1;
      const nextSuccessRate = Math.round(((successes + (fromTimeout ? 0 : (Math.abs(signedErr) <= toleranceMs ? 1 : 0))) / nextAttempts) * 100);
      applyAdaptive(nextAttempts, nextSuccessRate);

      startRound();
    }, FEEDBACK_MS);
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <Card sx={{ mt: 2, borderRadius: 3 }}>
      <CardContent>
        {/* 상단 옵션 */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight={700}>플레이</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControlLabel
              control={<Switch size="small" checked={adaptive} onChange={(_,v)=>setAdaptive(v)} />}
              label={<Typography variant="caption">적응 난이도</Typography>}
            />
            <FormControlLabel
              control={<Switch size="small" checked={showTimer} onChange={(_,v)=>setShowTimer(v)} />}
              label={<Typography variant="caption">시간 표시</Typography>}
            />
            <Select size="small" value={targetMode} onChange={e=>setTargetMode(e.target.value)} sx={{ minWidth: 120 }}>
              <MenuItem value="random">랜덤(2~5s)</MenuItem>
              <MenuItem value="fixed">고정</MenuItem>
            </Select>
            <Select size="small" value={fixedTarget} onChange={e=>setFixedTarget(Number(e.target.value))} disabled={targetMode!=="fixed"} sx={{ minWidth: 90 }}>
              {TARGET_CHOICES_SEC.map(t => <MenuItem key={t} value={t}>{t}s</MenuItem>)}
            </Select>
            <Select size="small" value={toleranceMs} onChange={e=>setToleranceMs(Number(e.target.value))} sx={{ minWidth: 120 }}>
              {[800,700,600,500,400,300,200,150].map(v => <MenuItem key={v} value={v}>±{v}ms</MenuItem>)}
            </Select>
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
          <Typography variant="body2">시도: <b>{attempts}</b></Typography>
          <Typography variant="body2">성공률: <b>{successRate}%</b></Typography>
          <Typography variant="body2">평균 절대 오차: <b>{avgAbsErrMs == null ? "-" : fmtMs(avgAbsErrMs)}</b></Typography>
          <Typography variant="body2">오차 편향: <b>{meanSignedErrMs === 0 ? "0ms" : (meanSignedErrMs > 0 ? `+${fmtMs(meanSignedErrMs)}` : `${fmtMs(meanSignedErrMs)}`)}</b></Typography>
          <Typography variant="body2">빠름: <b>{earlyCount}</b></Typography>
          <Typography variant="body2">늦음: <b>{lateCount}</b></Typography>
          <Typography variant="body2">미응답: <b>{timeoutCount}</b></Typography>
        </Stack>

        {/* 현재 라운드 정보 */}
        <Stack alignItems="center" spacing={1} mb={1}>
          <Chip label={`목표: ${targetSec}s`} color="primary" />
          <Chip label={`허용: ±${toleranceMs}ms`} />
          {showTimer && (
            <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.1 }}>
              {(roundElapsedMs/1000).toFixed(2)}s
            </Typography>
          )}
          {lastFeedback === null && <Chip color="info" label="" />}
          {lastFeedback === "success" && <Chip color="success" label="성공!" />}
          {lastFeedback === "early" && <Chip color="warning" label="빠름" />}
          {lastFeedback === "late" && <Chip color="warning" label="늦음" />}
          {lastFeedback === "timeout" && <Chip color="error" label="미응답" />}
        </Stack>

        {/* 컨트롤 버튼 */}
        <Stack direction="row" spacing={1.5} justifyContent="center" mt={1}>
          {!running ? (
            <Button size="large" variant="contained" onClick={startSession} sx={{ borderRadius: 3, px: 4 }}>
              시작
            </Button>
          ) : (
            <>
              <Button size="large" variant="contained" color="success" onClick={()=>onClickStop(false)} disabled={!roundRunning}
                      sx={{ borderRadius: 3, px: 6 }}>
                지금!
              </Button>
              <Button size="large" variant="outlined" color="inherit" onClick={stopSession} sx={{ borderRadius: 3, px: 4 }}>
                종료
              </Button>
            </>
          )}
        </Stack>

        {/* 상태 텍스트 */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={1.5}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>모드: {targetMode==="random" ? "랜덤(2~5s)" : `고정(${fixedTarget}s)`}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>적응 난이도: {adaptive ? "ON" : "OFF"}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>시간 표시: {showTimer ? "ON" : "OFF"}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

/** =========================================
 * 정보 + 프롬프트 + 플레이
 * ========================================= */
const StopwatchSense = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          스톱워치 감각
        </Typography>

        <Stack spacing={2}>
          {/* 설명 */}
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>게임 방식</Typography>
            <Typography variant="body1">
              “목표 시간에 맞춰 버튼을 누르기”로 시간 감각을 훈련합니다. (예: 3초가 되면 ‘지금!’ 버튼 클릭)
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>시나리오</Typography>
            <Typography variant="body1">
              몸으로 시간을 재는 훈련을 통해 시간 추정 능력과 주의집중을 키워보세요.
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>키워드 타입</Typography>
            <Typography variant="body1">처리속도, 주의력</Typography>
          </Box>

          <Divider />

          {/* 개발 메모 */}
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>개발 메모</Typography>
            <Typography variant="body2">
              • 목표시간: 랜덤(2~5s) 또는 고정, 허용 편차(±150~800ms) 조절, 적응 난이도/시간표시 토글<br/>
              • 지표: 시도/성공률/평균 절대 오차/오차 편향(빠름-늦음)/빠름/늦음/미응답
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
(게임) 스톱워치 감각
- 인지 영역: 처리속도, 주의력
- 규칙: 목표 시간에 맞춰 버튼 클릭
- 난이도: 목표 시간 {{목표시간목록_초}}초, 허용 편차 ±{{허용편차_ms}}ms, 시간 표시 {{시간표시_ONOFF}}
- 측정 지표: 시도 횟수, 성공률, 실패 유형(빠름/늦음/미응답), 평균 절대 오차(ms), 오차 편향(ms)
- 성적:
  • 시도 횟수: {{시도}}회
  • 성공률: {{성공률}}%
  • 평균 절대 오차: {{평균오차_ms}}ms
  • 오차 편향(빠름-늦음): {{편향_ms}}ms
  • 실패: 빠름 {{빠름}}회, 늦음 {{늦음}}회, 미응답 {{미응답}}회

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
          <StopwatchPlay />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StopwatchSense;
