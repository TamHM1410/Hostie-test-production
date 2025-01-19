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
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import { differenceInMinutes, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import goAxiosClient from 'src/utils/goAxiosClient';
import { formattedAmount } from 'src/utils/format-time';

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
  point: number;
  guest_phone: string;
  host_phone: string | null;
  residence_address: string | null;
  description: string;
  expire: string | null;
  is_host_accept: boolean;
  is_seller_transfer: boolean;
  is_host_receive: boolean;
  status: number;
  commission_rate?: number;
  extra_guest_fee?: number;
  seller_name?: string;
  commission?: number;
  reason_reject?: string;
  housekeeper_transaction?: string;
  additional_transaction?: string;
}

interface BookingDetailSidebarProps {
  open: boolean;
  onClose: () => void;
  bookingDetails: BookingData | null;
  onSave: (updatedDetails: Partial<BookingData>) => void;
  isEditing: boolean;
  bookingId: number;
}

const getDetailbooking = async (booking_id: number) => {
  return await goAxiosClient.get(`/booking/${booking_id}`);
};

const BookingDetailSidebar: React.FC<BookingDetailSidebarProps> = ({
  open,
  onClose,
  bookingId,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['bookingDetail', bookingId],
    queryFn: async () => {
      const res = await getDetailbooking(Number(bookingId));
      return res?.data || null;
    },
  });

  const getExpireStatus = (expire: string | null, status: number, isSellerTransfer: boolean) => {
    if (!expire) return 'Đã hết hạn';
    if (status === 0) return 'Đã bị từ chối';
    if (isSellerTransfer) return 'Đã thanh toán thành công';

    const minutesLeft = differenceInMinutes(parseISO(expire), new Date());
    return minutesLeft > 0 ? `${minutesLeft} phút còn lại` : 'Đã hết hạn';
  };

  if (isLoading) {
    return null;
  }

  console.log(data, 'data');
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 700,
          bgcolor: '#f5f5f5',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold">
          Chi Tiết Hóa Đơn Đặt Nơi Lưu Trú
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Thông Tin Đặt Phòng
                </Typography>
                <Box sx={{ '& > *': { mt: 1 } }}>
                  <Typography>
                    <strong>ID Đặt Phòng:</strong> {data?.booking?.id}
                  </Typography>
                  <Typography>
                    <strong>Ngày Nhận Phòng:</strong> {data?.booking?.checkin}
                  </Typography>
                  <Typography>
                    <strong>Ngày Trả Phòng:</strong> {data?.booking?.checkout}
                  </Typography>
                  <Typography>
                    <strong>Tổng đêm:</strong> {data?.booking?.total_nights}
                  </Typography>
                  <Typography>
                    <strong>Tên Khách:</strong> {data?.booking?.guest_name}
                  </Typography>
                  <Typography>
                    <strong>Số Điện Thoại:</strong> {data?.booking?.guest_phone}
                  </Typography>
                  <Typography>
                    <strong>Chỗ Nghỉ:</strong> {data?.booking?.residence_name}
                  </Typography>
                  <Typography>
                    <strong>Tổng Tiền:</strong> {formattedAmount(data?.booking?.total_amount)}
                  </Typography>
                  <Typography>
                    <strong>Số Tiền Cọc:</strong> {formattedAmount(data?.booking?.paid_amount)}
                  </Typography>
                  <Typography>
                    <strong>Tỷ Lệ Hoa Hồng:</strong> {data?.booking?.commission_rate}%
                  </Typography>
                  <Typography>
                    <strong>Phí Thêm Khách:</strong>{' '}
                    {formattedAmount(
                      data?.booking?.extra_guest_fee *
                        data?.booking?.extra_guest_count *
                        data?.booking?.total_nights
                    )}
                  </Typography>
                  <Typography>
                    <strong>Số khách :</strong> {data?.booking?.guest_count}
                  </Typography>
                  <Typography>
                    <strong>Số khách vượt:</strong> {data?.booking?.extra_guest_count}
                  </Typography>
                  <Typography>
                    <strong>Điểm:</strong> {data?.booking?.point}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Thông tin người đặt
                </Typography>
                <Box sx={{ '& > *': { mt: 1 } }}>
                  <Typography>
                    <strong>Tên :</strong> {data?.booking?.seller_name || 'Chưa Cung Cấp'}
                  </Typography>
                  <Typography>
                    <strong>Số Điện Thoại:</strong> {data?.booking?.host_phone || 'Chưa Cung Cấp'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 3 }} elevation={0}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Chi Tiết Đặt Phòng
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày</TableCell>
                    <TableCell align="right">Giá</TableCell>
                    <TableCell align="right">Trạng Thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.details?.map((detail: any) => (
                    <TableRow key={detail.id}>
                      <TableCell>{new Date(detail.date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{formattedAmount(detail.price)}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={detail.status === 1 ? 'Đã Xác Nhận' : 'Chờ Xác Nhận'}
                          color={detail.status === 1 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }} elevation={0}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Thông Tin Bổ Sung
            </Typography>
            <Box sx={{ '& > *': { mt: 1 } }}>
              <Typography>
                <strong>Mô Tả:</strong> {data?.booking?.description}
              </Typography>
              <Typography>
                <strong>Hoa Hồng:</strong> {formattedAmount(data?.booking?.commission)}
              </Typography>
              <Typography>
                <strong>Ngày Hết Hạn:</strong>{' '}
                {getExpireStatus(
                  data?.booking?.expire,
                  data?.booking?.status,
                  data?.booking?.is_seller_transfer
                )}
              </Typography>
              {data?.booking?.reason_reject && (
                <Typography>
                  <strong>Lý do từ chối:</strong> {data?.booking?.reason_reject}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {(data?.booking?.housekeeper_transaction || data?.booking?.additional_transaction) && (
          <Card sx={{ mt: 3 }} elevation={0}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Hình Ảnh Giao Dịch
              </Typography>

              {data?.booking?.housekeeper_transaction && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Giao dịch khi khách tới
                  </Typography>
                  <Box
                    component="img"
                    src={data?.booking?.housekeeper_transaction}
                    alt="Transaction arrival"
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              )}

              {data?.booking?.additional_transaction && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Giao dịch khi khách rời đi
                  </Typography>
                  <Box
                    component="img"
                    src={data?.booking?.additional_transaction}
                    alt="Transaction departure"
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Drawer>
  );
};

export default BookingDetailSidebar;
