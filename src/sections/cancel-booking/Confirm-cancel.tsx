import React from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const CancelReservationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác Nhận Hủy Đặt Căn Hộ</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          Bạn có chắc chắn muốn hủy đặt căn hộ này? Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="primary">
          Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CancelBookingCard: React.FC = ({ open, setOpen }: any) => {
  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    // Thực hiện hủy đặt căn hộ ở đây
    console.log('Đã hủy đặt căn hộ');
    setOpen(false);
  };

  return (
    <Card sx={{ width: 400, margin: 'auto', padding: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" color="error" gutterBottom>
          Xác Nhận Hủy Đặt Căn Hộ
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Bạn có chắc chắn muốn hủy đặt căn hộ này? Hành động này không thể hoàn tác.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Chủ nhà sẽ hoàn tiền cho bạn theo chính sách hoàn tiền của họ .
        </Typography>
     
      </CardContent>

      <CancelReservationDialog open={open} onClose={handleDialogClose} onConfirm={handleConfirm} />
    </Card>
  );
};

export default CancelBookingCard;
