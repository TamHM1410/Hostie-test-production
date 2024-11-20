//  @hook
import * as React from 'react';
import { useState } from 'react';
import { useButlerBooking} from 'src/zustand/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card, FormControl } from '@mui/material';
import toast from 'react-hot-toast';
//  @component
import { confirm_checkout } from 'src/api/butler';
import { LoadingButton } from '@mui/lab';

//  @api

const CheckoutModal = (props: any) => {
  const { open, setOpen } = props;

  const {butler} = useButlerBooking();


    const queryClient = useQueryClient();

    const { mutate }: any = useMutation({
      mutationFn: (payload: any) => confirm_checkout(payload),
      onSuccess: () => {
        setOpen(!open);
        toast.success('Cập nhật thành công');
        queryClient.invalidateQueries(['butlerBooking'] as any);
      },
      onError: (error) => {
        toast.error('Đã có lỗi xảy ra');
      },
    });

  const onSubmit = async () => {
    try {
        mutate(butler?.id)
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
          width: 350,
          height: 150,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <FormControl onSubmit={onSubmit} sx={{ width: '100%' }}>
          <Grid md={12} xs={8}>
           
              <Typography id="modal-title" variant="h6" component="h2">
                Xác nhận khách đã trả phòng
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button variant="contained" onClick={() => setOpen(false)}>
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

export default CheckoutModal;
