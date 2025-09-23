import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, Divider, Grid, LinearProgress,
  MenuItem, Select, Stack, Switch, FormControlLabel, Typography
} from "@mui/material";

/** ===============================
 * 설정
 * =============================== */
const SESSION_MS = 60_000;   // 세션 길이(1분)
const FEEDBACK_MS = 700;     // 피드백 표시 시간

// 난이도(스냅 단위)
const GRAN_OPTS = [
  { key: "30", label: "30분 단위", minutes: 30 },
  { key: "5",  label: "5분 단위",  minutes: 5  },
  { key: "1",  label: "1분 단위",  minutes: 1  },
];

// 허용 오차(분)
const TOLERANCE_OPTS = [10, 5, 2, 1];

/** ===============================
 * 유틸
 * =============================== */
const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const hourToDeg = (h, m) => ((h % 12) * 30) + (m * 0.5);
const minuteToDeg = (m) => (m % 60) * 6;

const hmToTotal = (h, m) => ((h % 12) * 60 + m + 720) % 720; // 0~719
const totalToHM = (total) => {
  total = ((total % 720) + 720) % 720;
  const h0 = Math.floor(total / 60); // 0~11
  const m = total % 60;
  const h = h0 === 0 ? 12 : h0;
  return { h, m };
};
const normHour12 = (h) => {
  let r = h % 12;
  if (r <= 0) r += 12;
  return r;
};

// 12h 원형에서 총 분 차이(0~360)
const circDiffTotalMin = (a, b) => {
  let d = a - b;                           // 분
  d = ((d % 720) + 720) % 720;             // 0~719
  if (d > 360) d -= 720;                   // -360~360
  return Math.abs(d);
};

// 스냅(난이도)에 맞게 분 보정
const snapMinute = (m, granMin) => {
  const snapped = Math.round(m / granMin) * granMin;
  return ((snapped % 60) + 60) % 60;
};

// 무작위 시간(분은 스냅 격자에 맞춰 출제)
function randomTime(granMin) {
  const h = 1 + Math.floor(Math.random() * 12);
  const steps = Math.floor(60 / granMin);
  const m = granMin * Math.floor(Math.random() * steps);
  return { h, m };
}

// 분 가감(시 롤오버)
function addMinuteWithHour(hour, minute, delta) {
  let total = hour * 60 + minute + delta;
  total = ((total % 720) + 720) % 720;
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return { hour: normHour12(newH === 0 ? 12 : newH), minute: newM };
}

/** ===============================
 * 플레이(버튼 조작)
 * =============================== */
function ClockHandPlayButtons() {
  // 옵션
  const [gran, setGran] = useState("5");
  const granMin = useMemo(
    () => GRAN_OPTS.find(g => g.key === gran)?.minutes ?? 5,
    [gran]
  );
  const [tolerance, setTolerance] = useState(2);
  const [showHint, setShowHint] = useState(false);

  // 세션/라운드/타이머
  const [running, setRunning] = useState(false);
  const [sessionLeftMs, setSessionLeftMs] = useState(SESSION_MS);
  const sessionTimerRef = useRef(null);

  const [target, setTarget] = useState(() => randomTime(granMin)); // 정답 시간
  const [time, setTime] = useState(() => randomTime(granMin));     // 사용자 바늘(h,m)

  const [roundStartAt, setRoundStartAt] = useState(0);
  const [lastFeedback, setLastFeedback] = useState(null); // "correct" | "wrong" | null

  // 지표
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [avgRtMs, setAvgRtMs] = useState(null);
  const [avgAbsErrMin, setAvgAbsErrMin] = useState(null);
  const [hourErrCount, setHourErrCount] = useState(0);
  const [minuteErrCount, setMinuteErrCount] = useState(0);

  const successRate = useMemo(
    () => (attempts > 0 ? Math.round((successes / attempts) * 100) : 0),
    [attempts, successes]
  );
  const sessionProgress = useMemo(
    () => Math.max(0, Math.min(100, ((SESSION_MS - sessionLeftMs) / SESSION_MS) * 100)),
    [sessionLeftMs]
  );

  /** 난이도(스냅) 변경 시: 타깃만 새 격자에 스냅, 사용자는 보존 */
  useEffect(() => {
    setTarget(prev => ({ h: prev.h, m: snapMinute(prev.m, granMin) }));
    // setTime은 보존(사용자 입력 흐름 유지)
  }, [granMin]);

  /** 새 라운드 */
  const newRound = () => {
    const t = randomTime(granMin);
    setTarget(t);

    // 정답과 다른 무작위 시작점(±1~6시간 차이)
    const shiftSteps = [60, 90, 120, 150, 180, 210, 240, 300, 330, 360];
    const pick = shiftSteps[(Math.random() * shiftSteps.length) | 0] * (Math.random() < 0.5 ? -1 : 1);
    const initTotal = hmToTotal(t.h, t.m) + pick;
    const init = totalToHM(initTotal);
    setTime({ h: init.h, m: init.m }); // 초기값은 스냅 없이 시작(사용자가 미세 조정 가능)

    setRoundStartAt(performance.now());
  };

  /** 세션 시작/종료 */
  const startSession = () => {
    // 지표 리셋
    setAttempts(0); setSuccesses(0);
    setAvgRtMs(null); setAvgAbsErrMin(null);
    setHourErrCount(0); setMinuteErrCount(0);
    setLastFeedback(null);
    setSessionLeftMs(SESSION_MS);

    // 라운드 초기화
    newRound();

    // 타이머 시작
    setRunning(true);
    const started = performance.now();
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    sessionTimerRef.current = setInterval(() => {
      const left = Math.max(0, SESSION_MS - (performance.now() - started));
      setSessionLeftMs(left);
      if (left <= 0) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
        setRunning(false);
      }
    }, 100);
  };

  const stopSession = () => {
    setRunning(false);
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, []);

  /** 시간 버튼 (세션 여부와 무관하게 동작) */
  const adjustHour = (deltaHour) => {
    setTime(prev => ({ h: normHour12(prev.h + deltaHour), m: prev.m }));
  };

  /** 분 버튼
   * - ±1분: 정밀 이동(스냅 적용 안 함)
   * - ±10/±30분: 이동 후 난이도 스냅 적용
   */
  const adjustMinute = (deltaMin) => {
    setTime(prev => {
      const moved = addMinuteWithHour(prev.h, prev.m, deltaMin); // 롤오버 우선
      if (Math.abs(deltaMin) === 1) {
        // 정밀 이동(스냅 해제)
        return { h: moved.hour, m: moved.minute };
      }
      // 큰 스텝은 스냅 적용
      const snapped = snapMinute(moved.minute, granMin);
      const total2 = hmToTotal(moved.hour, snapped);
      const norm = totalToHM(total2);
      return { h: norm.h, m: norm.m };
    });
  };

  /** 제출 판정 */
  const onSubmit = () => {
    const userTotal = hmToTotal(time.h, time.m);
    const targetTotal = hmToTotal(target.h, target.m);

    const diffMin = circDiffTotalMin(userTotal, targetTotal);   // 0~360
    const correct = diffMin <= tolerance;

    // 지표
    const rt = performance.now() - roundStartAt;
    setAttempts(a => a + 1);
    setAvgRtMs(prev => (prev == null ? rt : (prev * attempts + rt) / (attempts + 1)));
    setAvgAbsErrMin(prev => (prev == null ? diffMin : (prev * attempts + diffMin) / (attempts + 1)));

    // 오류 유형(분침은 원형 최소차 적용)
    const rawMinDiff = Math.abs(time.m - target.m);
    const minCirc = rawMinDiff > 30 ? 60 - rawMinDiff : rawMinDiff;
    const minuteCorrect = minCirc <= tolerance;
    const hourCorrect = (time.h % 12) === (target.h % 12);
    if (!hourCorrect) setHourErrCount(c => c + 1);
    if (!minuteCorrect) setMinuteErrCount(c => c + 1);

    setLastFeedback(correct ? "correct" : "wrong");

    setTimeout(() => {
      setLastFeedback(null);
      if (running) newRound();
    }, FEEDBACK_MS);
  };

  // 아날로그 바늘 각도(즉시 반영)
  const hourDeg = useMemo(() => hourToDeg(time.h, time.m), [time.h, time.m]);
  const minDeg  = useMemo(() => minuteToDeg(time.m),       [time.m]);

  return (
    <Card sx={{ mt: 2, borderRadius: 3 }}>
      <CardContent>
        {/* 옵션 */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight={700}>플레이</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Select size="small" value={gran} onChange={e=>setGran(e.target.value)} sx={{ minWidth: 120 }}>
              {GRAN_OPTS.map(opt => <MenuItem key={opt.key} value={opt.key}>{opt.label}</MenuItem>)}
            </Select>
            <Select size="small" value={tolerance} onChange={e=>setTolerance(Number(e.target.value))} sx={{ minWidth: 110 }}>
              {TOLERANCE_OPTS.map(v => <MenuItem key={v} value={v}>허용 ±{v}분</MenuItem>)}
            </Select>
            <FormControlLabel
              control={<Switch size="small" checked={showHint} onChange={(_,v)=>setShowHint(v)} />}
              label={<Typography variant="caption">현재 시간 힌트</Typography>}
            />
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
          <Typography variant="body2">평균 RT: <b>{avgRtMs == null ? "-" : Math.round(avgRtMs)}ms</b></Typography>
          <Typography variant="body2">평균 절대 오차: <b>{avgAbsErrMin == null ? "-" : `${avgAbsErrMin.toFixed(1)}분`}</b></Typography>
          <Typography variant="body2">시침 오류: <b>{hourErrCount}</b></Typography>
          <Typography variant="body2">분침 오류: <b>{minuteErrCount}</b></Typography>
        </Stack>

        {/* 문제(항상 노출) & 현재(힌트 토글) & 피드백 */}
        <Stack alignItems="center" spacing={0.5} mb={1}>
          {/* 문제는 항상 표시 */}
          <Chip
            color="primary"
            label={`문제: ${target.h}시 ${pad2(target.m)}분`}
            sx={{ fontWeight: 700 }}
          />

          {/* 현재 설정 시간은 힌트 켜졌을 때만 표시 */}
          {showHint && (
            <Chip
              variant="outlined"
              label={`현재: ${time.h}시 ${pad2(time.m)}분`}
            />
          )}

          {lastFeedback === "correct" && <Chip color="success" label="정답!" />}
          {lastFeedback === "wrong" && <Chip color="error" label="오답" />}
        </Stack>


        {/* 아날로그 시계(표시) */}
        <Box sx={{ position: "relative", width: 260, height: 260, mx: "auto", my: 1 }}>
          <Box sx={{
            position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid", borderColor: "divider",
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03), transparent 60%)"
          }} />
          {new Array(60).fill(0).map((_, i) => (
            <Box key={i} sx={{
              position: "absolute", left: "50%", top: "50%",
              width: i % 5 === 0 ? 4 : 2, height: i % 5 === 0 ? 14 : 8,
              bgcolor: "text.primary", opacity: 0.8,
              transform: `translate(-50%, -100%) rotate(${i * 6}deg) translateY(-112px)`,
              borderRadius: 2
            }} />
          ))}
          {/* 시침 */}
          <Box sx={{
            position: "absolute", width: 6, height: 70, left: "50%", top: "50%",
            transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
            transformOrigin: "50% 100%", backgroundColor: "#333", borderRadius: 999
          }} />
          {/* 분침 */}
          <Box sx={{
            position: "absolute", width: 4, height: 100, left: "50%", top: "50%",
            transform: `translate(-50%, -100%) rotate(${minDeg}deg)`,
            transformOrigin: "50% 100%", backgroundColor: "#1976d2", borderRadius: 999
          }} />
          {/* 중심 */}
          <Box sx={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
            width: 10, height: 10, borderRadius: "50%", bgcolor: "text.primary"
          }} />
        </Box>

        {/* 조작 버튼 */}
        <Stack spacing={1.5} alignItems="center" mt={1}>
          <Typography variant="overline" sx={{ opacity: 0.7 }}>시간 조절</Typography>
          <Grid container spacing={1} justifyContent="center">
            <Grid item><Button variant="contained" onClick={()=>adjustHour(-2)}>−2시간</Button></Grid>
            <Grid item><Button variant="contained" onClick={()=>adjustHour(-1)}>−1시간</Button></Grid>
            <Grid item><Button variant="contained" onClick={()=>adjustHour(+1)}>+1시간</Button></Grid>
            <Grid item><Button variant="contained" onClick={()=>adjustHour(+2)}>+2시간</Button></Grid>
          </Grid>

          <Typography variant="overline" sx={{ opacity: 0.7, mt: 1 }}>
            분 조절(±1분: 정밀 이동, ±10/±30분: 스냅 {granMin}분)
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            <Grid item><Button variant="outlined" onClick={()=>adjustMinute(-30)}>−30분</Button></Grid>
            <Grid item><Button variant="outlined" onClick={()=>adjustMinute(-10)}>−10분</Button></Grid>
            <Grid item><Button variant="outlined" onClick={()=>adjustMinute(-1)}>−1분</Button></Grid>
            <Grid item><Button variant="outlined" onClick={()=>adjustMinute(+1)}>+1분</Button></Grid>
            <Grid item><Button variant="outlined" onClick={()=>adjustMinute(+10)}>+10분</Button></Grid>
            <Grid item><Button variant="outlined" onClick={()=>adjustMinute(+30)}>+30분</Button></Grid>
          </Grid>
        </Stack>

        {/* 컨트롤 */}
        <Stack direction="row" spacing={1.5} justifyContent="center" mt={2}>
          {!running ? (
            <Button size="large" variant="contained" onClick={startSession} sx={{ borderRadius: 3, px: 4 }}>
              시작
            </Button>
          ) : (
            <>
              <Button size="large" variant="contained" color="success" onClick={onSubmit} sx={{ borderRadius: 3, px: 6 }}>
                제출
              </Button>
              <Button size="large" variant="outlined" color="inherit" onClick={stopSession} sx={{ borderRadius: 3, px: 4 }}>
                종료
              </Button>
            </>
          )}
        </Stack>

        {/* 상태 텍스트 */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={1.5}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>단위: {granMin}분</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>허용오차: ±{tolerance}분</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>힌트: {showHint ? "ON" : "OFF"}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

/** ===============================
 * 정보 + 프롬프트 + 플레이(버튼)
 * =============================== */
const ClockHandMatch = () => {
  return (
    <Card sx={{ maxWidth: 720, mx: "auto", borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          시계 바늘 맞추기
        </Typography>

        <Stack spacing={2}>
          {/* 설명 */}
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>게임 방식</Typography>
            <Typography variant="body1">
              제시된 시간(예: 3시 30분)에 맞춰 <b>버튼으로 시/분을 증감</b>해 바늘을 맞춥니다.
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>시나리오</Typography>
            <Typography variant="body1">
              아날로그 시계 감각을 통해 시공간 처리 및 시간 개념을 강화하세요.
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>키워드 타입</Typography>
            <Typography variant="body1">시공간, 기억력</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="overline" sx={{ opacity: 0.7 }}>플레이</Typography>
          <ClockHandPlayButtons />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ClockHandMatch;
