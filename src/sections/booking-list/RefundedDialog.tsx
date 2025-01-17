import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  CardContent,
  DialogActions,
  Button,
} from '@mui/material';

import goAxiosClient from 'src/utils/goAxiosClient';

import { formattedAmount } from 'src/utils/format-time';

import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';

import { LoadingScreen } from 'src/components/loading-screen';

import { LoadingButton } from '@mui/lab';

import toast from 'react-hot-toast';

const getQr = async (user_id = 0, amount = 0, message = '', bill_number = 0) => {
  const res = await goAxiosClient.get(
    `/booking/qrs?user_id=${user_id}&amount=${amount}&message=${message}&bill_number=${bill_number}`
  );
  if (Array.isArray(res.data) && res.data.length > 0) {
    return res?.data[0];
  }
  return res?.data;
};
const host_cofirm_refunded = async (id: any) => {
  const res = await goAxiosClient.post('/booking/host-refund', {
    id: id,
  });

  return res;
};
export default function RefundDialog({ open, setOpen, bookingSelected, refunded }: any) {
  const [isLoadingButton, setIsLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['qrcode', bookingSelected],
    queryFn: () =>
      getQr(
        bookingSelected?.seller_id,
        refunded?.host_refund,
        'Chuyen khoan hoan tien',
        bookingSelected?.id
      ),
  });

  const handleConfirmRefunded = async () => {
    try {
      setIsLoading(!isLoadingButton);
      await host_cofirm_refunded(bookingSelected?.id);
      toast.success('Đã xác nhận chuyển tiền');

      setOpen(!open);
    } catch (error) {
      toast.error('Da co loi xay ra');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
      <DialogContent>
        <Divider sx={{ my: 2 }} />

        <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
          <DialogTitle>Thông tin QR Code và Chi tiết Ngân hàng của Môi giới</DialogTitle>
          {isLoading && <LoadingScreen />}
          {!isLoading && Array(data?.qr) && data?.qr.length > 0 && (
            <DialogContent dividers>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 2 }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {data?.fullname_bank || 'Tên ngân hàng'}
                </Typography>
                <Box
                  sx={{
                    textAlign: 'left',
                    width: '100%',
                    maxWidth: '400px',
                    padding: 2,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    <strong>Chủ tài khoản:</strong> {data?.account_holder || '---'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Số tài khoản:</strong> {data?.account_no || '---'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Hoa hồng nhận được:</strong> {data?.commission_rate || 0}%
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Số tiền cần thanh toán:</strong> {data?.paid_amount || 0}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ngân hàng:</strong> {data?.shortname_bank || '---'}
                  </Typography>
                  <Typography>
                    {' '}
                    <strong>Số tiền hoàn :</strong> {formattedAmount(refunded?.host_refund)}
                  </Typography>
                </Box>
                <Box
                  mt={3}
                  sx={{
                    textAlign: 'center',
                    padding: 2,
                    borderRadius: 2,
                    border: '1px solid #ddd',
                    backgroundColor: '#fff',
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    <strong>Quét mã QR để thanh toán</strong>
                  </Typography>
                  <img
                    src={data?.qr || '/placeholder.png'}
                    alt={`QR Code cho ${data?.account_holder}`}
                    style={{ width: '100%', maxWidth: '250px', borderRadius: '10px' }}
                  />
                </Box>
                <Typography variant="body2" textAlign="center" mt={2}>
                  Quý khách vui lòng ấn <b>"Xác nhận đã chuyển khoản"</b> khi đã chuyển khoản thành
                  công nếu không sẽ không được công nhận là đã chuyển khoản rồi.
                </Typography>
              </Box>
            </DialogContent>
          )}
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(!open)} color="primary">
          Đóng
        </Button>
        <LoadingButton
          color="error"
          onClick={handleConfirmRefunded}
          type="button"
          loading={isLoadingButton}
        >
          Xác Nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
