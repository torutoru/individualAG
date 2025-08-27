import React from 'react';
import { NoodleScene, Noodle } from './noddleStyles';

/* 라면 path 공용 함수 */
const NoodlePath = () => (
  <svg viewBox="0 0 120 280" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M10 10
               C 40 40, 20 80, 50 100
               C 90 120, 40 160, 60 190
               C 80 220, 30 240, 90 270" />
    </g>
  </svg>
);

// 가닥 개수 조절
const NOODLE_COUNT = 12;

// 랜덤 범위 함수
const random = (min, max) => Math.random() * (max - min) + min;

const noodleConfigs = Array.from({ length: NOODLE_COUNT }, (_, i) => {
  const left = `${8 + i * (80 / NOODLE_COUNT) + random(-2, 2)}%`;
  
  return {
    left,
    style: {
      '--start-x': `${random(-8, -2)}vw`,
      '--end-x': `${random(-18, -5)}vw`,
      '--start-rot': `${random(-12, -4)}deg`,
      '--end-rot': `${random(15, 35)}deg`,
      '--start-scale': random(0.8, 1.1),
      '--end-scale': random(0.85, 1.05),
      animationDuration: `${random(9, 13)}s`,
      '--sway-duration': `${random(3, 5)}s`,
      animationDelay: `${random(0, 2)}s`,
    }
  };
});

function NoodleBackground() {
  return (
    <NoodleScene aria-hidden="true">
      {noodleConfigs.map((cfg, idx) => (
        <Noodle key={idx} sx={{ left: cfg.left, ...cfg.style }}>
          <NoodlePath />
        </Noodle>
      ))}
    </NoodleScene>
  );
}

export default NoodleBackground;