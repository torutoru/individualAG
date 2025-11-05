import React, { useEffect } from "react";
import { Box, styled, GlobalStyles } from "@mui/material";
import AwardsImg from '../../../assets/img/awards-img.png';

export const Scene = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '500px',
  margin: 'calc(var(--content-padding-small) * -1)',
  background: '#2f2f2f',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    margin: 'calc(var(--content-padding-large) * -1)',
  },
  img: {
    width: '80%',
    maxWidth: '500px',
    marginTop: '-100px',
  }
}));

/* 회전하는 광선 */
const Rays = styled('div')({
  position: 'absolute',
  width: '1200px',
  height: '1200px',
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(0deg)',
  background: `
    conic-gradient(
      from 0deg,
      rgba(255,255,255,0.1) 0deg,
      rgba(255,255,255,0.02) 15deg,
      rgba(255,255,255,0) 30deg,
      rgba(255,255,255,0.1) 45deg,
      rgba(255,255,255,0) 60deg,
      rgba(255,255,255,0.05) 90deg,
      rgba(255,255,255,0) 120deg,
      rgba(255,255,255,0.1) 150deg,
      rgba(255,255,255,0) 180deg,
      rgba(255,255,255,0.1) 210deg,
      rgba(255,255,255,0) 240deg,
      rgba(255,255,255,0.1) 270deg,
      rgba(255,255,255,0) 300deg,
      rgba(255,255,255,0.1) 330deg,
      rgba(255,255,255,0) 360deg
    )
  `,
  filter: 'blur(12px)',
  animation: 'rotateRays 20s linear infinite',
  '@keyframes rotateRays': {
    from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
    to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
  },
});

/* 폭죽 (위쪽 흰색 입자) */
const Fireworks = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 4,
  pointerEvents: 'none',
});

/* 폭죽 애니메이션 전역 스타일 */
const globalStyles = (
  <GlobalStyles
    styles={{
      '@keyframes firework': {
        '0%': {
          transform: 'translateY(0) scale(0)',
          opacity: 1,
        },
        '70%': {
          transform: 'translateY(150px) scale(1)',
          opacity: 1,
        },
        '100%': {
          transform: 'translateY(250px) scale(0.2)',
          opacity: 0,
        },
      },
      '.spark': {
        position: 'absolute',
        borderRadius: '50%',
        background:
          'radial-gradient(circle at center, #ffffff 0%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        boxShadow: '0 0 6px rgba(255,255,255,0.6)',
        opacity: 0,
        animation: 'firework 2s ease-out forwards',
      },
    }}
  />
);

export default function AwardScene() {
  useEffect(() => {
    const container = document.getElementById("fireworks");
    if (!container) return;

    const createSpark = () => {
      const spark = document.createElement("div");
      spark.classList.add("spark");
      const size = 2 + Math.random() * 4;
      const left = Math.random() * 100;
      const delay = Math.random() * 1.5;
      Object.assign(spark.style, {
        left: `${left}%`,
        top: `${Math.random() * 10 + 5}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
      });
      container.appendChild(spark);
      setTimeout(() => spark.remove(), 2000);
    };

    const interval = setInterval(createSpark, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {globalStyles}
      <Scene>
        <img src={AwardsImg} alt="" />
        <Rays />
        <Fireworks id="fireworks" />
      </Scene>
    </>
  );
}
