/* eslint-disable no-nested-ternary */
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Autocomplete, InputAdornment } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';




type ActionDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (values: { bank: string, commission: number, rejectionReason: string }) => void;
    actionType: 'accept' | 'cancel' | 'confirmPayment';
    bankList: Bank[];
    notification: any
};

// Export as a function component
export default function ActionDialog({ open, onClose, onConfirm, actionType, bankList, notification }: ActionDialogProps) {

    const validationSchema = Yup.object({
        bank: Yup.string().required('Vui lòng chọn ngân hàng'),
        commission: Yup.number()
            .required('Vui lòng nhập hoa hồng')
            .min(notification?.entity_details?.commission_rate || 10, 'Lớn hơn 10')
            .max(100, 'Không vượt quá 100'),
    });

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác Nhận Thao Tác</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Bạn có chắc chắn muốn{' '}
                    {actionType === 'accept'
                        ? 'chấp nhận'
                        : actionType === 'cancel'
                            ? 'hủy'
                            : 'xác nhận đã nhận tiền'}{' '}
                    cho đơn đặt nơi lưu trú này? Thao tác này không thể hoàn tác.
                </DialogContentText>

                {actionType === 'cancel' && (
                    <Formik
                        initialValues={{ rejectionReason: '' }}
                        validationSchema={Yup.object({
                            rejectionReason: Yup.string().required('Vui lòng nhập lý do từ chối.'),
                        })}
                        onSubmit={onConfirm}
                    >
                        {({ errors, touched, handleSubmit, handleChange, values }) => (
                            <Form onSubmit={handleSubmit}>
                                <TextField
                                    name="rejectionReason"
                                    label="Lý Do Từ Chối"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    error={touched.rejectionReason && Boolean(errors.rejectionReason)}
                                    helperText={touched.rejectionReason && errors.rejectionReason}
                                />
                                <DialogActions>
                                    <Button onClick={onClose}>Hủy</Button>
                                    <Button type="submit" color="primary" autoFocus>
                                        Xác Nhận
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                )}

                {actionType !== 'cancel' && actionType === 'accept' && (
                    <Formik
                        initialValues={{ bank: '', commission: 200 }}
                        validationSchema={validationSchema}
                        onSubmit={onConfirm}
                    >
                        {({ errors, touched, handleSubmit, setFieldValue, handleChange }) => (
                            <Form onSubmit={handleSubmit}>
                                <Autocomplete
                                    id="bank-autocomplete"
                                    options={bankList || []}
                                    getOptionLabel={(option) => option.bank.vnName || ''}
                                    onChange={(event, value) => {
                                        setFieldValue('bank', value?.id || '');
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Ngân hàng"
                                            fullWidth
                                            margin="normal"
                                            error={touched.bank && Boolean(errors.bank)}
                                            helperText={touched.bank && errors.bank}
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                />
                                <TextField
                                    name="commission"
                                    label="Hoa hồng"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChange}
                                    error={touched.commission && Boolean(errors.commission)}
                                    helperText={touched.commission && errors.commission}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                />
                                <DialogActions>
                                    <Button onClick={onClose}>Hủy</Button>
                                    <Button type="submit" color="primary" autoFocus>
                                        Xác Nhận
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                )}

                {actionType === 'confirmPayment' && (
                    <DialogActions>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button onClick={() => onConfirm({ bank: '', commission: 0, rejectionReason: '' })} color="primary" autoFocus>
                            Xác Nhận
                        </Button>
                    </DialogActions>
                )}
            </DialogContent>
        </Dialog>
    );
}
