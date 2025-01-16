import {
  Drawer,
  Box,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from '@mui/material';
import { differenceInMinutes, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useBooking } from 'src/auth/context/service-context/BookingContext';
import goAxiosClient from 'src/utils/goAxiosClient';
import { formattedAmount } from 'src/utils/format-time';
import { useQuery } from '@tanstack/react-query';

interface BookingData {
  id: number;
  residence_id: number;
  guest_id: number;
  seller_id: number;
  residence_name: string;
  total_amount: number;
  paid_amount: number;
  checkin: string;
  checkout: string;
  total_nights: number;
  total_days: number;
  guest_name: string;
  guest_count: number;
  guest_phone: string;
  host_phone: string | null;
  residence_address: string | null;
  description: string;
  expire: string | null;
  is_host_accept: boolean;
  is_seller_transfer: boolean;
  is_host_receive: boolean;
  status: number;
}

interface BookingDetailSidebarProps {
  open: boolean;
  onClose: () => void;
  bookingDetails: BookingData | null;
  onSave: (updatedDetails: Partial<BookingData>) => void;
  isEditing: boolean;
}

const getDetailbooking = async (booking_id: any) => {
  return await goAxiosClient.get(`/booking/${booking_id}`);
};
const BookingDetailSidebar: React.FC<BookingDetailSidebarProps> = ({
  open,
  onClose,
  bookingDetails,
  onSave,
  isEditing,
  bookingId,
}: BookingDetailSidebarProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['bookingDetail', bookingId],
    queryFn: async () => {
      const res = await getDetailbooking(Number(bookingId));

      if (res) {
        return res?.data;
      }
      return '';
    },
  });
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 700,
          padding: '24px',
          backgroundColor: '#f4f6f8',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 800, marginBottom: 2, fontSize: '1.45rem', color: '#333' }}
        >
          Chi Tiết Hóa Đơn Đặt Nơi Lưu Trú
        </Typography>

        <Grid container spacing={3}>
          {' '}
          {/* Adjusted gap here */}
          {/* Thông tin đặt phòng */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, marginBottom: 1, fontSize: '1.1rem' }}
            >
              Thông Tin Đặt Phòng:
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>ID Đặt Phòng :</strong> {data?.booking?.id}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Ngày Nhận Phòng :</strong> {data?.booking?.checkin}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Ngày Trả Phòng :</strong> {data?.booking?.checkout}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Tên Khách :</strong> {data?.booking?.guest_name}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Số Điện Thoại Khách :</strong> {data?.booking?.guest_phone}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Chỗ Nghỉ :</strong> {data?.booking?.residence_name}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Tổng Tiền :</strong> {formattedAmount(data?.booking?.total_amount)}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Số Tiền Cọc :</strong> {formattedAmount(data?.booking?.paid_amount)}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Tỷ Lệ Hoa Hồng :</strong> {data?.booking?.commission_rate}%
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Phí Thêm Khách :</strong> {formattedAmount(data?.booking?.extra_guest_fee)}
            </Typography>
          </Grid>
          {/* Thông tin chủ nhà */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, marginBottom: 1, fontSize: '1.1rem' }}
            >
              Thông Tin Chủ Nhà:
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Tên Chủ Nhà :</strong> {data?.booking?.seller_name || 'Chưa Cung Cấp'}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>ID Chủ Nhà :</strong> {data?.booking?.seller_id || 'Chưa Cung Cấp'}
            </Typography>
            <Typography sx={{ marginTop: 1 }}>
              <strong>Số Điện Thoại Chủ Nhà :</strong>{' '}
              {data?.booking?.host_phone || 'Chưa Cung Cấp'}
            </Typography>
          </Grid>
        </Grid>

        {/* Bảng Chi Tiết Đặt Phòng */}
        <Box marginTop={3}>
          <Typography variant="h6" sx={{ fontWeight: 500, marginBottom: 1, fontSize: '1.2rem' }}>
            Chi Tiết Đặt Phòng:
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ marginTop: 2, boxShadow: 'none', borderRadius: '8px' }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 500, padding: '12px' }}>Ngày</TableCell>{' '}
                  {/* Increased padding */}
                  <TableCell align="right" sx={{ fontWeight: 500, padding: '12px' }}>
                    Giá
                  </TableCell>{' '}
                  {/* Increased padding */}
                  <TableCell align="right" sx={{ fontWeight: 500, padding: '12px' }}>
                    Trạng Thái
                  </TableCell>{' '}
                  {/* Increased padding */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.details?.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell sx={{ padding: '16px' }}>
                      {new Date(detail.date).toLocaleDateString()}
                    </TableCell>{' '}
                    {/* Increased padding */}
                    <TableCell align="right" sx={{ padding: '16px' }}>
                      {formattedAmount(detail.price)}
                    </TableCell>{' '}
                    {/* Increased padding */}
                    <TableCell align="right" sx={{ padding: '16px' }}>
                      {detail.status === 1 ? 'Đã Xác Nhận' : 'Chờ Xác Nhận'}
                    </TableCell>{' '}
                    {/* Increased padding */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Thông Tin Bổ Sung */}
        <Box marginTop={3}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, marginBottom: 1, fontSize: '1.1rem' }}
          >
            Thông Tin Bổ Sung:
          </Typography>
          <Typography sx={{ marginTop: 1 }}>
            <strong>Mô Tả :</strong> {data?.booking?.description}
          </Typography>
          <Typography sx={{ marginTop: 1 }}>
            <strong>Hoa Hồng :</strong> {formattedAmount(data?.booking?.commission)}
          </Typography>
          <Typography sx={{ marginTop: 1 }}>
            <strong>Ngày Hết Hạn :</strong>
            {data?.booking?.expire
              ? (() => {
                  const now = new Date();
                  const expireDate = parseISO(data?.booking?.expire);
                  const minutesLeft = differenceInMinutes(expireDate, now);
                  if (data?.booking?.status === 0) {
                    return 'Đã bị từ chối';
                  }
                  if (data?.booking?.is_seller_transfer === true) {
                    return 'Đã thanh toán thành công';
                  }
                  if (minutesLeft > 0) {
                    return `${minutesLeft} phút còn lại`;
                  }

                  return 'Đã hết hạn';
                })()
              : 'Đã hết hạn'}
          </Typography>
          {data?.booking?.reason_reject && (
            <Typography sx={{ marginTop: 1 }}>
              <strong>Lý do từ chối :</strong>{' '}
              {data?.booking?.reason_reject || 'Không có lý do rõ ràng'}
            </Typography>
          )}
        </Box>
        {data?.booking?.housekeeper_transaction && (
          <Box mt={4} width="100%" textAlign="center">
            <Typography variant="h6" mb={2}>
              Hình ảnh giao dịch của quản gia khi khách tới
            </Typography>
            <Box
              component="img"
              src={data?.booking?.housekeeper_transaction}
              alt={`Transaction ${data?.booking?.housekeeper_transaction}`}
              sx={{
                maxWidth: '100%',
                height: '20%',
                borderRadius: 4,
                boxShadow: 3,
              }}
            />
          </Box>
        )}
        {data?.booking?.additional_transaction && (
          <Box mt={4} width="100%" textAlign="center">
            <Typography variant="h6" mb={2}>
              Hình ảnh giao dịch thêm của quản gia khi khách rời đi
            </Typography>
            <Box
              component="img"
              src={data?.booking?.additional_transaction}
              alt={`Transaction ${data?.booking?.additional_transaction}`}
              sx={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: 3,
              }}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default BookingDetailSidebar;
