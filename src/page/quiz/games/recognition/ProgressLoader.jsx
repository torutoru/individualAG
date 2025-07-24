import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const ProgressLoader = ({ open }) => {

  return (
    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 9999,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default ProgressLoader;