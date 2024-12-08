/* eslint-disable react-hooks/exhaustive-deps */

import { Drawer, Box, Typography, TextField, Button, Grid, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import { useBooking } from 'src/auth/context/service-context/BookingContext';
import { differenceInMinutes, parseISO } from 'date-fns';
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
    isEditing: boolean; // Additional prop to control edit mode
}

const BookingDetailSidebar: React.FC<BookingDetailSidebarProps> = ({
    open,
    onClose,
    bookingDetails,
    onSave,
    isEditing,
}: BookingDetailSidebarProps) => {
    const [editableDetails, setEditableDetails] = useState<Partial<BookingData>>({});
    const { customerList, fetchListCustomer }: any = useBooking();

    useEffect(() => {
        fetchListCustomer();
        if (bookingDetails) {
            setEditableDetails(bookingDetails);
        } else {
            setEditableDetails({});
        }
    }, [bookingDetails]);

    const handleSave = () => {
        onSave(editableDetails);
    };

    const handleCustomerChange = (event: any, newValue: any) => {
        if (newValue) {
            const selectedCustomerId = newValue.id;
            setEditableDetails({ ...editableDetails, guest_id: selectedCustomerId });
        }
    };
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            variant="temporary"
            sx={{ '& .MuiDrawer-paper': { width: '100%', maxWidth: 500 } }}
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p={3}
                height="100%"
            >
                <Typography variant="h6" gutterBottom align="center" marginBottom={3}>
                    Thông tin chi tiết đặt nơi lưu trú
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tên nơi lưu trú"
                            value={editableDetails?.residence_name || ''}
                            onChange={(e) =>
                                setEditableDetails({ ...editableDetails, residence_name: e.target.value })
                            }
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="SĐT Chủ nhà"
                            value={editableDetails?.host_phone || ''}
                            onChange={(e) =>
                                setEditableDetails({ ...editableDetails, host_phone: e.target.value })
                            }
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={customerList?.data || []}
                            getOptionLabel={(option) => option?.name || ''}
                            onChange={handleCustomerChange}
                            renderInput={(params) => {
                                const selectedCustomer = customerList?.data?.find(
                                    (customer: any) => customer?.id === editableDetails?.guest_id
                                );
                                return <TextField {...params} label="Tên khách hàng" disabled={!isEditing} />;
                            }}
                            disabled={!isEditing}
                            value={
                                customerList.data?.find((customer: any) => customer?.id == editableDetails?.guest_id) ||
                                null
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Số lượng khách"
                            value={editableDetails?.guest_count || ''}
                            onChange={(e) =>
                                setEditableDetails({ ...editableDetails, guest_count: Number(e.target.value) })
                            }
                            fullWidth
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tổng số tiền"
                            value={editableDetails?.total_amount || ''}
                            onChange={(e) =>
                                setEditableDetails({ ...editableDetails, total_amount: Number(e.target.value) })
                            }
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Số tiền cần thanh toán"
                            value={editableDetails?.paid_amount || ''}
                            // onChange={(e) =>
                            //     setEditableDetails({ ...editableDetails, paid_amount: Number(e.target.value) })
                            // }
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ngày nhận phòng"
                            value={editableDetails?.checkin || ''}
                            onChange={(e) => setEditableDetails({ ...editableDetails, checkin: e.target.value })}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ngày trả phòng"
                            value={editableDetails?.checkout || ''}
                            onChange={(e) => setEditableDetails({ ...editableDetails, checkout: e.target.value })}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Số đêm"
                            value={editableDetails?.total_nights || ''}
                            onChange={(e) =>
                                setEditableDetails({ ...editableDetails, total_nights: Number(e.target.value) })
                            }
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Số ngày"
                            value={editableDetails?.total_days || ''}
                            onChange={(e) =>
                                setEditableDetails({ ...editableDetails, total_days: Number(e.target.value) })
                            }
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Địa chỉ chỗ ở"
                            value={editableDetails?.residence_address || ''}
                            onChange={(e) =>
                                setEditableDetails({ ...editableDetails, residence_address: e.target.value })
                            }
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ngày hết hạn"
                            value={
                                editableDetails?.expire
                                    ? (() => {
                                        const now = new Date();
                                        const expireDate = parseISO(editableDetails.expire);
                                        const minutesLeft = differenceInMinutes(expireDate, now);

                                        if (minutesLeft > 0) {
                                            return `${minutesLeft} phút còn lại`;
                                        }
                                        return 'Đã hết hạn';
                                    })()
                                    : ''
                            }
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            minRows={4}
                            disabled={!isEditing}
                            placeholder="Nhập mô tả ở đây..."
                            value={editableDetails?.description || ''}
                            onChange={(e) =>
                                setEditableDetails({ ...editableDetails, description: e.target.value })
                            }
                            style={{ width: '100%' }} // Ensure it takes full width
                        />
                    </Grid>
                </Grid>
                <Box mt={3} width="100%">
                    {isEditing && (
                        <Box mt={3} width="100%">
                            <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
                                Lưu
                            </Button>
                        </Box>
                    )}
                </Box>
                {editableDetails?.housekeeper_transaction && (
                    <Box mt={4} width="100%" textAlign="center">
                        <Typography variant="h6" mb={2}>
                            Hình ảnh giao dịch của quản gia
                        </Typography>
                        <Box
                            component="img"
                            src={editableDetails.housekeeper_transaction}
                            alt={`Transaction ${editableDetails.housekeeper_transaction}`}
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
