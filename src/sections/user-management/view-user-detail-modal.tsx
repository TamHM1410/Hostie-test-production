import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { _userAbout } from 'src/_mock';


import UserDetail from './userdetail-view';

const UserDetailModal = (props: any) => {
  const { open, setOpen } = props;

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2 }}>
        <VisibilityIcon /> Xem
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {xs:'screen',sx:'auto'},
            height: {xs:'screen',sx:'auto'},
            maxHeight:{xs:'100%'},
            maxWidth:{xs:'100%',sm:'100%'},
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            overflow:{xs:'scroll'}
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Thông tin người dùng
          </Typography>
          <UserDetail open={open} setOpen={setOpen}/>
        </Box>
      </Modal>
    </>
  );
};

export default UserDetailModal;
