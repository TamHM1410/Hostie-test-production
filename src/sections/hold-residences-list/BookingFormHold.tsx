import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    TextField,
    Autocomplete,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { formattedAmount } from 'src/utils/format-time';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Customer {
    id: number;
    name: string;
}

interface PriceQuotation {
    total_price: number;
    commission_rate: number;
    total_days: number;
}

interface Detail {
    residence_name: string;
    residence_id: string;
    id: string;
    checkin: string;
    checkout: string;
}

interface BookingFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customerList: { data: Customer[] } | null;
    priceQuotation: PriceQuotation | null;
    detail: Detail | null;
    handleBookingSubmit: (values: any) => Promise<void>;
    fetchData: () => void;
    fetchPriceQuotation: any
}

export const BookingFormDialog: React.FC<BookingFormDialogProps> = ({
    isOpen,
    onClose,
    customerList,
    priceQuotation,
    detail,
    handleBookingSubmit,
    fetchData,
    fetchPriceQuotation,


}) => {
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State for confirm dialog
    const [formValues, setFormValues] = useState<any>({}); // Store form values for confirmation



    return (

        <>

            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>Đặt Chỗ Cho {detail?.residence_name}</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            paddingBottom: 2,
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: 3,
                        }}
                    >
                        {/* Tổng giá */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Tổng Giá:</Typography>
                            <Typography variant="body2" color="primary">
                                {formattedAmount(priceQuotation?.booking_price) || 0}
                            </Typography>
                        </Box>

                        {/* Giá chi tiết (Sử dụng Accordion) */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
                                <Typography variant="body2">Xem Giá Chi Tiết</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {priceQuotation?.price_details?.map((detail, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography variant="body2">
                                            Ngày {detail.date}:
                                        </Typography>
                                        <Typography variant="body2" color="primary">
                                            {formattedAmount(detail.price)}
                                        </Typography>
                                    </Box>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                        {/* Số tiền cần thanh toán */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Số phần trăm hoa hồng nhận được :</Typography>
                            <Typography variant="body2" color="primary">
                                {priceQuotation?.commission_rate + '%' || 0 + '%'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Số lượng khách tiêu chuẩn</Typography>
                            <Typography variant="body2" color="primary">
                                {priceQuotation?.standard_num_guests + " " + 'người' || 0}
                            </Typography>
                        </Box>
                        {/* Phụ phí khách phát sinh */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Khách Phát Sinh(nếu có):</Typography>
                            <Typography variant="body2" color="secondary">
                                {formattedAmount(priceQuotation?.extra_guest_fee) + '/1 người' || 0}
                            </Typography>
                        </Box>

                    </Box>

                    <Formik
                        initialValues={{
                            guest_id: '',
                            guest_count: 1,
                            start_date: detail?.checkin || '',
                            end_date: detail?.checkout || '',
                            residence_id: detail?.residence_id || '',
                            hold_id: detail?.id,
                            note: '',
                        }}
                        validationSchema={Yup.object({
                            guest_id: Yup.string().required('Tên khách hàng là bắt buộc.'),
                            guest_count: Yup.number()
                                .min(1, 'Số lượng khách phải lớn hơn 0.')
                                .max(priceQuotation?.max_guests, `Số lượng khách phải bé hơn ${priceQuotation?.max_guests}.`)
                                .required('Số lượng khách là bắt buộc.'),
                            note: Yup.string().optional(),
                        })}
                        onSubmit={async (values, { setSubmitting, setFieldError }) => {
                            fetchPriceQuotation(values.start_date, values.end_date, values.residence_id, values.guest_count)
                            setFormValues(values); // Save form values
                            setIsConfirmDialogOpen(true); // Open confirmation dialog
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
                                    value={detail?.checkin}
                                    disabled
                                    fullWidth
                                    margin="dense"
                                />
                                <TextField
                                    label="Ngày Kết Thúc"
                                    value={detail?.checkout}
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
                                    <Button onClick={onClose} color="primary">
                                        Hủy
                                    </Button>
                                    <Button type="submit" color="success">
                                        Đặt
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
            <Dialog
                open={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
            >
                <DialogTitle>
                    <Typography variant="h6" color="primary">
                        Xác Nhận Đặt Chỗ
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            paddingTop: 2,
                            width: 400
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: 1,
                            }}
                        >
                            <Typography variant="body2">Tên khách hàng:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {customerList?.data?.find((n) => n.id === parseInt(formValues.guest_id))?.name || 'N/A'}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: 1,
                            }}
                        >
                            <Typography variant="body2">Số lượng khách:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formValues?.guest_count}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: 1,
                            }}
                        >
                            <Typography variant="body2">Ngày bắt đầu:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formValues?.start_date}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: 1,
                            }}
                        >
                            <Typography variant="body2">Ngày kết thúc:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formValues?.end_date}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: 1,
                            }}
                        >
                            <Typography variant="body2">Giá đặt {priceQuotation?.total_days} ngày {priceQuotation?.total_nights} đêm</Typography>
                            <Typography variant="body2" fontWeight="bold" color="secondary">
                                {formattedAmount(priceQuotation?.booking_price) || '0'}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: 1,
                            }}
                        >
                            <Typography variant="body2">Phụ phí vượt số khách tiêu chuẩn:</Typography>
                            <Typography variant="body2" fontWeight="bold" color="secondary">
                                {formattedAmount(priceQuotation?.charge_price) + '' + `\\${priceQuotation?.guest_count - priceQuotation?.standard_num_guests} người\\${priceQuotation?.total_nights} đêm` || '0'}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: 1,
                            }}
                        >
                            <Typography variant="body2">Tiền hoa hồng bạn nhận được (có thể thay đổi):</Typography>
                            <Typography variant="body2" fontWeight="bold" color="secondary">
                                {formattedAmount(priceQuotation?.commission) || '0'}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: 1,
                            }}
                        >
                            <Typography variant="body2">Số tiền cần cọc:</Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                                {formattedAmount(priceQuotation?.paid_amount) || '0'}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" fontWeight='bold' sx={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        width: 400
                    }} marginTop={2}>Số tiền cần cọc được tính theo : (Tiền đặt nơi lưu trú + tiền phụ thu) /2 - tiền hoa hồng</Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                    <Button
                        onClick={() => setIsConfirmDialogOpen(false)}
                        color="secondary"
                        variant="outlined"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            handleBookingSubmit(formValues);
                            fetchData();
                            setIsConfirmDialogOpen(false);
                            onClose();
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Xác Nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};



