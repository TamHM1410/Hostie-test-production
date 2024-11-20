import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box,
} from '@mui/material';

// Define the type for a single QR detail
interface QRDetail {
    account_no: string;
    account_holder: string;
    fullname_bank: string;
    shortname_bank: string;
    qr: string;
}

// Define the props for your Dialog component
interface QRDialogProps {
    open: boolean;
    onClose: () => void;
    qrDetails: QRDetail[];
    onTransfer: any

}
const QRDialog: React.FC<QRDialogProps> = ({ open, onClose, qrDetails, onTransfer, }: { open: any, onClose: any, qrDetails: any, onTransfer: any }) => (


    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Thông tin QR Code và Chi tiết Ngân hàng</DialogTitle>
        <DialogContent dividers>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">

                <Box mb={3} textAlign="center">
                    <Typography variant="h6">{qrDetails?.fullname_bank}</Typography>
                    <Typography>Chủ tài khoản: {qrDetails?.account_holder}</Typography>
                    <Typography>Số tài khoản: {qrDetails?.account_no}</Typography>
                    <Typography>Số phần trăm hoa hồng: {qrDetails?.commission_rate}%</Typography>
                    <Typography>Tên viết tắt ngân hàng: {qrDetails?.shortname_bank}</Typography>
                    <Box mt={2}>
                        <img
                            src={qrDetails?.qr}
                            alt={`QR Code cho ${qrDetails?.account_holder}`}
                            style={{ width: '100%', maxWidth: '300px' }}
                        />
                    </Box>

                </Box>

                <Typography variant="body2" textAlign="center" mt={2}>
                    Quý khách vui lòng ấn <b>"Xác nhận đã chuyển khoản"</b> khi đã chuyển khoản thành công nếu không sẽ không được công nhận là đã chuyển khoản rồi.
                </Typography>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Đóng
            </Button>
            <Button onClick={onTransfer} color="primary">
                Xác nhận đã chuyển khoản
            </Button>
        </DialogActions>
    </Dialog>
);
export default QRDialog;
