import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';

/* 애니메이션 정의 */
export const fall = keyframes`
  0% {
    transform: translate3d(var(--start-x, 0), -120vh, 0) rotate(var(--start-rot, 0deg)) scale(var(--start-scale,1));
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translate3d(var(--end-x, 0), calc(100vh + 60vh), 0) rotate(var(--end-rot, 60deg)) scale(var(--end-scale,1));
    opacity: 0.02;
  }
`;

export const sway = keyframes`
  0% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(18px) rotate(2deg); }
  50% { transform: translateX(-14px) rotate(-1deg); }
  75% { transform: translateX(12px) rotate(1deg); }
  100% { transform: translateX(0) rotate(0deg); }
`;

/* 배경 전체 컨테이너 */
export const NoodleScene = styled('div')({
  pointerEvents: 'none',
  position: 'fixed',
  background: 'linear-gradient(180deg,#081229 0%, #06182a 60%, #04101a 100%)',
  inset: 0,
  zIndex: 10,
  overflow: 'hidden',
  
  a: {
    color: '#fff',
    textDecoration: 'none',
  }
});

/* 각 면의 wrapper */
export const Noodle = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 260,
  height: 360,
  willChange: 'transform, opacity',
  filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
  opacity: 0.95,
  animationName: `${fall}`,
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
  animationFillMode: 'forwards',

  '& svg': {
    width: '100%',
    height: '100%',
    display: 'block',
  },

  '& path': {
    fill: 'none',
    stroke: '#FFCC66',
    strokeWidth: 7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },

  '& g': {
    transformOrigin: '50% 0%',
    animation: `${sway} var(--sway-duration, 3.6s) ease-in-out infinite`,
  },

  [theme.breakpoints.down('sm')]: {
    width: 180,
    height: 260,
  },

}));


export { };
export default {};