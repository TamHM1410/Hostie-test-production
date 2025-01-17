import {
  Dialog,
  DialogContent,
  DialogTitle,
  Card,
  Divider,
  DialogActions,
  Button,
} from '@mui/material';

import { useState } from 'react';

import { LoadingButton } from '@mui/lab';

import toast from 'react-hot-toast';

import goAxiosClient from 'src/utils/goAxiosClient';

import { useQueryClient } from '@tanstack/react-query';

const confirmReceiveRefunded = async (booking_id: any) => {
  const res = await goAxiosClient.post('/booking/seller-receive-refund', {
    id: booking_id,
    is_received: true,
  });
  return res;
};

export default function SellerConfirmRefunded({ open, setOpen, booking_id }: any) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmReceiveRefunded = async () => {
    try {
      setIsLoading(!isLoading);
      await confirmReceiveRefunded(booking_id);
      queryClient.invalidateQueries(['booking'] as any);
    } catch (error) {
      console.log(error,'err')
      toast.error('Đã xảy ra lỗi');
      setIsLoading(false);

    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Xác nhận đã nhận tiền</DialogTitle>
      <DialogContent>
        <Divider sx={{ my: 2 }} />

        <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
          <DialogTitle>
            Bạn xác nhận đã nhận tiền hoàn trả từ chủ nhà,<h1></h1>ành động không thể thực hiện lại
          </DialogTitle>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(!open)} color="primary">
          Đóng
        </Button>
        <LoadingButton
          color="error"
          type="button"
          loading={isLoading}
          onClick={handleConfirmReceiveRefunded}
        >
          Xác Nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
