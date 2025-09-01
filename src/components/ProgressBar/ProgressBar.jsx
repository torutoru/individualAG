import React from 'react';
import { Box } from '@mui/material';

/**
 * 치매 겡미 목표 - 프로그레스바 컴포넌트
 *
 * @param value
 * @returns {JSX.Element}
 * @constructor
 */
const ProgressBar = ({ value = 0 }) => (
  <Box sx={{ width: '100%', bgcolor: '#F4592897', borderRadius: 99, height: 10 }}>
    <Box
      sx={{
        width: `${value}%`,
        height: 10,
        bgcolor: '#267FE0',
        borderRadius: 99,
        transition: 'width .3s ease',
      }}
    />
  </Box>
);

export default ProgressBar;
