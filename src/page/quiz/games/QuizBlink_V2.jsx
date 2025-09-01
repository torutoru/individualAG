// /src/page/quiz/games/QuizBlink.jsx
import {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  LinearProgress,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ReplayIcon from '@mui/icons-material/Replay';
import GridOnIcon from '@mui/icons-material/GridOn';
import {makeBlinkQuizData} from '../../../ai/gameAI';

/**
 * Blink 기억력 게임
 * - 정답 시퀀스를 순서대로 "깜박여서 보여준" 뒤
 * - 사용자가 동일한 순서로 셀을 클릭하면 라운드 클리어
 * - 레벨(2x2/3x3/4x4)에 따라 보드 크기/난이도 변경
 */
const QuizBlink = () => {
  /** 현재 라운드 인덱스(0-based) */
  const [gameIndex, setGameIndex] = useState(0);
  /** 생성된 전체 게임 데이터(라운드 배열) */
  const [gameData, setGameData] = useState(null);
  /** 사용자가 현재 라운드에서 클릭한 셀 인덱스 목록(순서 중요) */
  const [clickPositionList, setClickPositionList] = useState([]);
  /**
   * 깜박이고 있는 셀의 인덱스
   * - -1이면 "깜박임이 끝났고, 사용자 입력 단계"라는 뜻
   * - -1이 아니면 "시퀀스 재생 중" → 클릭 금지
   */
  const [blinkIndex, setBlinkIndex] = useState(-1);
  /** 보드 레벨(한 변의 길이) 2 | 3 | 4 */
  const [gameLevel, setGameLevel] = useState(2);

  /** 재생(setTimeout) 타이머 ID 보관 → 라운드 변경/언마운트 시 모두 취소 */
  const timersRef = useRef([]);

  /** 깜박임 여부 */
  const isBlinking = blinkIndex !== -1;

  /**
   * 현재 라운드 데이터 추출
   * - gameData가 로드된 뒤에만 유효
   * - { row, correct: number[], blinkTime: ms } 등 구조 가정
   */
  const current = useMemo(
    () => (gameData ? gameData[gameIndex] : null),
    [gameData, gameIndex]
  );

  /** 현재 라운드의 클릭 기록 초기화 */
  const resetClick = () => setClickPositionList([]);

  // 다음 페인트 이후에 콜백 실행 (더블 RAF로 페인트 보장)
  const afterPaint = useCallback((cb) => {
    requestAnimationFrame(() => requestAnimationFrame(cb));
  }, []);

  /**
   * (중요) 모든 타이머 클리어
   * - 깜박임 재생 중 라운드가 변경되거나 컴포넌트가 언마운트되면
   *   남은 타이머를 모두 취소해 메모리 누수/의도치 않은 setState를 방지
   */
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  /**
   * 레벨 변경
   * - 보드 크기/난이도 바뀌므로 상태 초기화 + 타이머 정리
   * - 깜박임 인덱스도 -1로(입력상태) 리셋
   */
  const changeGameLevel = (level) => {
    setGameLevel(level);
    setGameIndex(0);
    resetClick();
    setBlinkIndex(-1);
    clearAllTimers();
  };

  /**
   * (핵심) 깜박임 시퀀스 재생
   * - current.correct 배열에 담긴 셀 인덱스를 순서대로 깜박이게 함
   * - 각 단계는 blinkTime 간격으로 setTimeout 등록
   * - 마지막에 blinkIndex를 -1로 내려 입력 단계로 전환
   */
  const playBlink = useCallback(() => {
    if (!current) return;
    clearAllTimers();

    // 정답 시퀀스를 하나씩 보여줌
    current.correct.forEach((idx, i) => {
      const t = setTimeout(() => setBlinkIndex(idx), current.blinkTime * (i + 1));
      timersRef.current.push(t);
    });

    // 시퀀스가 끝나면 입력 단계로 전환
    const end = setTimeout(
      () => setBlinkIndex(-1),
      current.blinkTime * (current.correct.length + 1)
    );
    timersRef.current.push(end);
  }, [current, clearAllTimers]);

  /**
   * 사용자 셀 클릭
   * - 깜박임 중엔 클릭 무시
   * - 같은 셀 중복 클릭 방지
   * - 정답 길이 이상은 입력 못 하도록 제한
   */
  const handleCellClick = (index) => {
    if (isBlinking || !current) return;
    if (clickPositionList.includes(index)) return;
    if (clickPositionList.length >= current.correct.length) return;

    setClickPositionList((prev) => [...prev, index]);
  };

  // ---- 피드백 UI 상태 (alert 대체용) ----
  const [snack, setSnack] = useState({ open: false, severity: 'info', message: '' });
  const [completeOpen, setCompleteOpen] = useState(false);

  /**
   * (핵심) 정답 판정 & 라운드 진행
   * - 사용자가 정답 길이만큼 클릭하면, 순서대로 맞는지 체크
   * - 틀리면 클릭 내역만 초기화하고 같은 라운드 반복
   * - 맞으면 다음 라운드로 이동(마지막 라운드는 축하 후 처음으로)
   */
  useEffect(() => {
    if (!current) return;

    if (clickPositionList.length >= current.correct.length) {
      // 입력 완료 → 정답 체크
      const isCorrect = clickPositionList.every((v, i) => v === current.correct[i]);

      if (!isCorrect) {
        // (선택) 모바일에서 진동 피드백
        try {
          if (navigator.vibrate) navigator.vibrate(200);
        } catch (_) {
        }
        // 페인트 후 얼럿: 마지막 클릭 색상 먼저 렌더링되게 함
        //  └ 실제 구현: 동기 alert() 대신 비동기 Snackbar 사용 (alert는 페인트를 블로킹하기 때문)
        afterPaint(() => {
          setSnack({ open: true, severity: 'error', message: '틀렸습니다!' });
          // 얼럿 닫힌 뒤 초기화 → Snackbar가 잠시 표시된 다음 클릭 내역 초기화
          setTimeout(() => resetClick(), 150);
        });
        return;
      }

      // 모든 라운드 완료
      if (gameIndex === gameData.length - 1) {
        // 페인트 후 얼럿: 마지막 클릭 색상 먼저 렌더링되게 함
        //  └ 실제 구현: 축하는 Dialog로 비동기 표시 (alert 블로킹 회피)
        afterPaint(() => {
          setCompleteOpen(true);
        });
        return;
      }

      // 페인트 후 얼럿: 마지막 클릭 색상 먼저 렌더링되게 함
      //  └ 실제 구현: 다음 라운드로 부드럽게 전환
      afterPaint(() => {
        // 다음 라운드로
        resetClick();
        setGameIndex((i) => i + 1);
      });
    }
  }, [clickPositionList, current, gameData, gameIndex, afterPaint]);

  /**
   * 라운드가 바뀌거나 데이터가 로드되면
   * - blinkIndex 초기화(-1) 후 깜박임 시퀀스 자동 재생
   * - cleanup에서 타이머 정리(라운드 전환/언마운트 안전)
   */
  useEffect(() => {
    if (gameData && current) {
      setBlinkIndex(-1);
      playBlink();
    }
    return clearAllTimers;
  }, [gameData, current, playBlink, clearAllTimers]);

  /**
   * 레벨 변경 시 새로운 게임 데이터 생성
   * - 최초 마운트 시에도 실행됨
   * - 데이터 적용 후 상태 초기화 및 타이머 정리
   *
   * ⚠️ 참고: 의존성에 clearAllTimers 추가를 고려할 수 있음.
   *   (현재 구현은 레벨 변경으로만 실행되므로 큰 문제는 없음)
   */
  useEffect(() => {
    let mounted = true;
    makeBlinkQuizData(gameLevel).then((data) => {
      if (!mounted) return;
      setGameData(data);
      setGameIndex(0);
      resetClick();
      setBlinkIndex(-1);
      clearAllTimers();
    });
    return () => {
      mounted = false;
      clearAllTimers();
    };
  }, [gameLevel]); // 필요 시 [gameLevel, clearAllTimers] 로 확장 가능

  /** 진행률(%) 계산: 현재 라운드 위치를 전체 길이로 나눠 백분율 */
  const progressValue = useMemo(() => {
    if (!gameData) return 0;
    return Math.round(((gameIndex + 1) / gameData.length) * 100);
  }, [gameIndex, gameData]);

  /** 보드 그리드 설정 */
  const gridCols = current?.row ?? gameLevel; // 행/열 수
  const totalCells = gridCols * gridCols;     // 전체 셀 개수

  return (
    <Container sx={{py: 2, pb: 12}}>
      {/* 상단: 타이틀 + 레벨 선택 */}
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* 타이틀 영역 */}
          <Stack direction="row" spacing={1} alignItems="center">
            <GridOnIcon sx={{color: 'primary.main'}}/>
            <Typography variant="h6" sx={{fontWeight: 800}}>
              Blink 기억력
            </Typography>
          </Stack>

          {/* 레벨 선택: 깜박임 동안은 변경 비활성화 */}
          <ToggleButtonGroup
            size="small"
            value={gameLevel}
            exclusive
            onChange={(_, v) => v && changeGameLevel(v)}
            disabled={isBlinking}
            color="primary"
          >
            <ToggleButton value={2}>2×2</ToggleButton>
            <ToggleButton value={3}>3×3</ToggleButton>
            <ToggleButton value={4}>4×4</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* 진행 상태 표시: 라운드 N/N + 진행률 바 + 다시보기 */}
        {gameData && (
          <Paper variant="outlined" sx={{p: 1.5, bgcolor: 'background.paper'}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              {/* 현재 라운드/총 라운드 */}
              <Chip
                label={`${gameIndex + 1} / ${gameData.length}`}
                color="primary"
                variant="outlined"
                sx={{fontWeight: 700}}
              />

              {/* 다시보기: 깜박임 중에는 비활성화 */}
              <Tooltip title="시퀀스를 다시 보여줍니다" arrow disableInteractive>
                {/* disabled일 때 버튼에 직접 onClick이 남아있으면 경고가 떠서 <span> 래핑 */}
                <span>
                  <Button
                    size="small"
                    startIcon={<ReplayIcon/>}
                    onClick={playBlink}
                    disabled={isBlinking || !current}
                    variant="contained"
                    color="primary"
                    sx={{
                      fontWeight: 800,
                      color: 'black',
                      borderRadius: 999,
                      '&:disabled': {opacity: 0.5},
                    }}
                  >
                    다시보기
                  </Button>
                </span>
              </Tooltip>
            </Stack>

            {/* 라운드 진행률 바 */}
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{mt: 1.25, height: 8, borderRadius: 999}}
              color="primary"
            />
          </Paper>
        )}

        {/* 게임 보드 */}
        {current && (
          <Paper
            elevation={0}
            sx={{
              p: {xs: 1.25, sm: 2},
              borderRadius: 3,
            }}
          >
            {/* CSS Grid 보드
                - repeat(gridCols, 1fr)로 정사각형 셀을 균등 배치
                - aspect-ratio로 셀 정사각형 보장(모바일 친화)
            */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                gap: {xs: 1, sm: 1.25},
                maxWidth: 480, // 모바일 중심 레이아웃을 위해 폭 제한
                mx: 'auto',
              }}
            >
              {Array.from({length: totalCells}).map((_, index) => {
                const isFlash = index === blinkIndex;                 // 현재 깜박이는 셀 여부
                const isChosen = clickPositionList.includes(index);    // 사용자가 이미 누른 셀 여부

                return (
                  <Box
                    key={index}
                    role="button"                 // 접근성: 스크린리더에서 버튼처럼 읽히도록
                    aria-label={`cell-${index}`} // 접근성: 셀 인덱스 레이블
                    tabIndex={0}                  // 키보드 포커스 허용
                    onClick={() => handleCellClick(index)}
                    onKeyDown={(e) => {
                      // 접근성: Enter/Space로도 클릭 가능
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCellClick(index);
                      }
                    }}
                    sx={{
                      position: 'relative',
                      aspectRatio: '1 / 1', // 정사각형
                      borderRadius: 2,
                      outline: 'none',
                      userSelect: 'none',
                      // 배경색: 깜박임(초록) > 선택됨(딥그린) > 기본(배경)
                      bgcolor: isFlash
                        ? 'primary.main'
                        : isChosen
                          ? '#A5C064'
                          : 'background.default',
                      border: '1px solid',
                      borderColor: isFlash
                        ? 'primary.main'
                        : isChosen
                          ? '#A5C064'
                          : 'secondary.main',
                      // 깜박일 때 테두리 글로우
                      boxShadow: isFlash ? `0 0 0 3px rgba(56,224,123,.35)` : 'none',
                      transition:
                        'transform .08s ease, background-color .15s ease, box-shadow .15s ease',
                      '&:active': {
                        transform: 'scale(.98)', // 터치 피드백
                      },
                      // 깜박임 키프레임 (짧고 선명)
                      '@keyframes blinkPulse': {
                        '0%': {filter: 'brightness(1)'},
                        '50%': {filter: 'brightness(1.25)'},
                        '100%': {filter: 'brightness(1)'},
                      },
                      animation: isFlash ? 'blinkPulse .28s ease-in-out' : 'none',
                    }}
                  />
                );
              })}
            </Box>

            {/* 안내문구 */}
            <Typography
              variant="body2"
              sx={{color: 'text.secondary', textAlign: 'center', mt: 1.5}}
            >
              깜박임이 끝나면 같은 순서로 칸을 눌러보세요.
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* ---- 틀림 안내 스낵바 (alert 대체) ---- */}
      <Snackbar
        open={snack.open}
        autoHideDuration={1500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          elevation={6}
          sx={{ fontWeight: 700 }}
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>

      {/* ---- 완료 다이얼로그 (alert 대체) ---- */}
      <Dialog open={completeOpen} onClose={() => setCompleteOpen(false)}>
        <DialogTitle>축하합니다! 🎉</DialogTitle>
        <DialogContent>
          <Typography>모든 라운드를 완료했습니다.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCompleteOpen(false);
              setGameIndex(0);
              resetClick();
            }}
            variant="contained"
          >
            다시 시작
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuizBlink;
