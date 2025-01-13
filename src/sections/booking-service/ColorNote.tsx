import React, { useState } from 'react';
import { Box, Typography, Grid, IconButton, Popover, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const ColorNotes = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Hàm để mở/đóng popover
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Hàm đóng popover
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Kiểm tra nếu popover đang mở
    const open = Boolean(anchorEl);

    return (
        <Box sx={{ padding: 2, textAlign: 'right' }}>
            {/* Đưa chữ "Ghi chú" gần với icon */}
            <Typography variant="h6" gutterBottom sx={{ display: 'inline', marginRight: 1 }}>
                Ghi chú:
            </Typography>
            1 số thông tin cần thiết ở đây
            <IconButton
                sx={{
                    width: 24, // Kích thước nhỏ hơn
                    height: 24,
                    borderRadius: '50%', // Hình tròn
                    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Màu nền nhẹ cho icon
                    padding: 0, // Xóa padding mặc định để giảm kích thước
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Hiệu ứng hover nhẹ
                    },
                }}
                onClick={handleClick}
            >
                <InfoIcon sx={{ fontSize: 18 }} /> {/* Kích thước icon nhỏ */}
            </IconButton>

            {/* Popover chứa tất cả các ghi chú */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ padding: 2, minWidth: 200 }}>
                    <Typography variant="h6" gutterBottom>
                        Các ghi chú:
                    </Typography>
                    <Box sx={{ marginTop: 2 }}>
                        {/* Các box ghi chú */}
                        <Box
                            sx={{
                                backgroundColor: 'rgb(191 242 253) ',
                                color: '#000',
                                padding: 2,
                                borderRadius: 1,
                                marginBottom: 2,
                            }}
                        >
                            <Typography>Ô này đã có người đặt. Bạn không thể đặt lại.</Typography>
                        </Box>

                        <Box
                            sx={{
                                backgroundColor: 'rgb(222, 255, 225)',
                                color: '#000',
                                padding: 2,
                                borderRadius: 1,
                                marginBottom: 2,
                            }}
                        >
                            <Typography>Ô này đã bị khóa và không thể thay đổi.</Typography>
                        </Box>

                        <Box
                            sx={{
                                backgroundColor: 'rgb(255 212 112 / 62%)',
                                color: '#000',
                                padding: 2,
                                borderRadius: 1,
                            }}
                        >
                            <Typography>Ô này đã có người giữ, bạn không thể thay đổi trạng thái.</Typography>
                        </Box>

                        <Box
                        sx={{
                            py:2
                        }}
                           
                        >
                            <Typography>Đơn vị hiển thị trên lịch :<br/>  k = 1.000 vnd</Typography>
                            
                        </Box>
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
};

export default ColorNotes;
