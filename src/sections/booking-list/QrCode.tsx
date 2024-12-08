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
import { formattedAmount } from 'src/utils/format-time';

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
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ padding: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 2 }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {qrDetails?.fullname_bank || 'Tên ngân hàng'}
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
                        marginBottom: 2
                    }}
                >
                    <Typography variant="body1" gutterBottom>
                        <strong>Chủ tài khoản:</strong> {qrDetails?.account_holder || '---'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Số tài khoản:</strong> {qrDetails?.account_no || '---'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Hoa hồng nhận được:</strong> {qrDetails?.commission_rate || 0}%
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Số tiền cần thanh toán:</strong> {formattedAmount(qrDetails?.paid_amount) || 0}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Ngân hàng:</strong> {qrDetails?.shortname_bank || '---'}
                    </Typography>
                </Box>
                <Box
                    mt={3}
                    sx={{
                        textAlign: 'center',
                        padding: 2,
                        borderRadius: 2,
                        border: '1px solid #ddd',
                        backgroundColor: '#fff'
                    }}
                >
                    <Typography variant="body1" gutterBottom>
                        <strong>Quét mã QR để thanh toán</strong>
                    </Typography>
                    <img
                        src={qrDetails?.qr || '/placeholder.png'}
                        alt={`QR Code cho ${qrDetails?.account_holder}`}
                        style={{ width: '100%', maxWidth: '250px', borderRadius: '10px' }}
                    />
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
            <Button onClick={onTransfer} color="success">
                Xác nhận đã chuyển khoản
            </Button>
        </DialogActions>
    </Dialog>
);
export default QRDialog;
