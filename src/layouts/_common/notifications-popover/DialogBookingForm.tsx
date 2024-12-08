import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, Button } from '@mui/material';
import { Autocomplete } from '@mui/lab';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

interface BookingDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    notification: any; // Replace `any` with a proper type if available
    customerList: { data: Array<{ id: string; name: string }> };
    handleBookingSubmit: (values: any) => Promise<void>; // Replace `any` with a proper type if available
}

const BookingDialog: React.FC<BookingDialogProps> = ({
    isOpen,
    handleClose,
    notification,
    customerList,
    handleBookingSubmit,
}) => {
    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Đặt Chỗ Cho {notification?.entity_details.residence_name}</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        paddingBottom: 2,
                        borderBottom: '1px solid #e0e0e0',
                        marginBottom: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Tổng Giá:</Typography>
                        <Typography variant="body1" color="primary">
                            {notification.entity_details.total_amount || 0} VND
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Hoa Hồng Nhận Được:</Typography>
                        <Typography variant="body1" color="secondary">
                            {notification.entity_details.commission_rate || 0}%
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Số ngày:</Typography>
                        <Box>
                            <Typography variant="body1" color="green">
                                {notification.entity_details.total_days || 0} ngày
                            </Typography>
                            <Typography variant="body1" color="green">
                                {notification.entity_details.total_nights || 0} đêm
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Formik
                    initialValues={{
                        guest_id: '',
                        guest_count: 1,
                        start_date: notification?.entity_details.checkin,
                        end_date: notification?.entity_details.checkout,
                        residence_id: notification?.entity_details?.residence_id || '',
                        hold_id: notification?.entity_details?.id,
                        note: '',
                    }}
                    validationSchema={Yup.object({
                        guest_id: Yup.string().required('Tên khách hàng là bắt buộc.'),
                        guest_count: Yup.number()
                            .min(1, 'Số lượng khách phải lớn hơn 0.')
                            .required('Số lượng khách là bắt buộc.'),
                        note: Yup.string().optional(),
                    })}
                    onSubmit={async (values, { setSubmitting, setFieldError }) => {
                        try {
                            await handleBookingSubmit(values);
                            setSubmitting(false);
                        } catch (error) {
                            setFieldError('guest_id', 'Có lỗi xảy ra khi đặt chỗ. Vui lòng thử lại.');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, values, errors, touched, setFieldValue }) => (
                        <Form>
                            <Autocomplete
                                options={customerList?.data || []}
                                getOptionLabel={(option: any) => option.name}
                                onChange={(event, newValue) => {
                                    setFieldValue('guest_id', newValue ? newValue.id : '');
                                }}
                                sx={{ marginTop: '10px' }}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tên Khách Hàng"
                                        error={touched.guest_id && Boolean(errors.guest_id)}
                                        helperText={touched.guest_id && errors.guest_id}
                                    />
                                )}
                            />
                            <TextField
                                label="Số Lượng Khách"
                                type="number"
                                name="guest_count"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                margin="dense"
                                value={values.guest_count}
                                error={touched.guest_count && Boolean(errors.guest_count)}
                                helperText={touched.guest_count && errors.guest_count}
                            />
                            <TextField
                                label="Ngày Bắt Đầu"
                                value={notification?.entity_details.checkin}
                                disabled
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                label="Ngày Kết Thúc"
                                value={notification?.entity_details.checkout}
                                disabled
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                label="Ghi Chú"
                                name="note"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                margin="dense"
                                value={values.note}
                            />
                            <DialogActions>
                                <Button onClick={handleClose}>Hủy</Button>
                                <Button type="submit" color="primary">
                                    Đặt
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default BookingDialog;
