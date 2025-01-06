//  @hook
import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useButler } from 'src/api/useButler';
//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, FormControl } from '@mui/material';
import toast from 'react-hot-toast';
//  @component
import { LoadingButton } from '@mui/lab';
import { hostAcceptHouseKeeper, hostRejectHouseKeeper } from 'src/api/host';

//  @api

const ConfirmModal = (props: any) => {
  const { host_accept, host_reject } = useButler();

  const { open, setOpen, modalType, setModalType, selectedButler } = props;

  const queryClient = useQueryClient();

  const onSubmit = async () => {
    try {
      const payload = {
        houseKeeperId: selectedButler?.houseKeeperId,
        residenceId: selectedButler?.residenceId,
      };
      if (modalType === 'accept') {
        await host_accept(payload);
        queryClient.invalidateQueries(['housekeeperRequest'] as any);
        setOpen(!open);
      }

      if (modalType === 'reject') {
        await host_reject(payload);
        queryClient.invalidateQueries(['housekeeperRequest'] as any);
        setOpen(!open);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          height: 'auto',
          minWidth: { xs: 300, md: 500, lg: 800 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <FormControl onSubmit={onSubmit} sx={{ width: '100%' }}>
          <Grid md={12} xs={8}>
            <Typography id="modal-title" variant="h6" component="h2">
              {modalType === 'accept' && 'Người dùng này sẽ trở thành quản gia của bạn'}
              {modalType === 'reject' && 'Từ chối người dùng này làm quản gia cho bạn'}
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpen(false);
                  setModalType('');
                }}
              >
                Hủy
              </Button>
              <LoadingButton
                variant="contained"
                color="error"
                type="submit"
                onClick={() => onSubmit()}
              >
                xác nhận
              </LoadingButton>
            </Stack>
          </Grid>
        </FormControl>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
