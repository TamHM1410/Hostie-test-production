import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, TextField, Button, Autocomplete } from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { formatCurrency } from './Booking';

interface BookingFormDialogProps {
    isBookingForm: boolean;
    setIsBookingForm: (value: boolean) => void;
    selectedVillaName: string;
    priceQuotation: any; // Adjust the type as necessary
    customerList: any[]; // Adjust the type as necessary
    startDate: string;
    endDate: string;
    selectionRange: any; // Adjust the type as necessary
    handleBookingSubmit: (values: any) => void;
}

const BookingFormDialog: React.FC<BookingFormDialogProps> = ({
    isBookingForm,
    setIsBookingForm,
    selectedVillaName,
    priceQuotation,
    customerList,
    startDate,
    endDate,
    selectionRange,
    handleBookingSubmit
}) => {
    // Ensure that customerList is always an array before passing it to Autocomplete


    return (
        <Dialog open={isBookingForm} onClose={() => setIsBookingForm(false)}>
            <DialogTitle>Đặt Chỗ Cho {selectedVillaName}</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        paddingBottom: 2,
                        borderBottom: '1px solid #e0e0e0',
                        marginBottom: 3
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Tổng Giá:</Typography>
                        <Typography variant="body1" color="primary">{formatCurrency(priceQuotation?.total_price) || 0} VND</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Hoa Hồng Nhận Được:</Typography>
                        <Typography variant="body1" color="secondary">{priceQuotation?.commission_rate || 0}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Số ngày:</Typography>
                        <Box>
                            <Typography variant="body1" color="green">
                                {priceQuotation ? priceQuotation.total_days + 1 : 0} ngày
                            </Typography>
                            <Typography variant="body1" color="green">
                                {priceQuotation?.total_days || 0} đêm
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Formik
                    initialValues={{
                        guest_id: '',
                        guest_count: 1,
                        start_date: startDate,
                        end_date: endDate,
                        residence_id: selectionRange?.residence_id || '',
                        note: ''
                    }}
                    validationSchema={Yup.object({
                        guest_id: Yup.string().required('Tên khách hàng là bắt buộc.'),
                        guest_count: Yup.number()
                            .min(1, 'Số lượng khách phải lớn hơn 0.')
                            .required('Số lượng khách là bắt buộc.'),
                        note: Yup.string().optional(),
                    })}
                    onSubmit={(values) => {
                        if (!selectionRange) return;
                        handleBookingSubmit(values);
                        setIsBookingForm(false);
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
                                error={touched.guest_count && Boolean(errors.guest_count)}
                                helperText={touched.guest_count && errors.guest_count}
                            />
                            <TextField
                                label="Ngày Bắt Đầu"
                                value={startDate}
                                InputProps={{ readOnly: true }}
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                label="Ngày Kết Thúc"
                                value={endDate}
                                InputProps={{ readOnly: true }}
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
                                multiline
                                rows={4}
                            />

                            <DialogActions>
                                <Button onClick={() => setIsBookingForm(false)} color="primary">
                                    Hủy
                                </Button>
                                <Button type="submit" color="primary">
                                    Xác Nhận
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default BookingFormDialog;
