import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

type HoldActionDialogProps = {
    open: boolean;
    onClose: () => void;
    actionType: 'accept' | 'cancel' | 'confirmPayment';
    onConfirm: (values: { rejectionReason: string }) => void;
};

const HoldActionDialog: React.FC<HoldActionDialogProps> = ({ open, onClose, actionType, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác Nhận Hành Động</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {actionType === 'accept'
                        ? 'Bạn có chắc chắn muốn xác nhận giữ chỗ này?'
                        : 'Bạn có chắc chắn muốn hủy giữ chỗ này?'}
                </DialogContentText>

                <Formik
                    initialValues={{ rejectionReason: '' }}
                    validationSchema={Yup.object({
                        rejectionReason: Yup.string().when('actionType', {
                            is: 'cancel',
                            then: Yup.string().required('Vui lòng nhập lý do từ chối.'),
                        }),
                    })}
                    onSubmit={(values) => {
                        onConfirm(values);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form>
                            {actionType === 'cancel' && (
                                <Field
                                    as={TextField}
                                    sx={{ marginTop: 2 }}
                                    name="rejectionReason"
                                    label="Lý Do Từ Chối"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    value={values.rejectionReason}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    rows={3}
                                    error={touched.rejectionReason && Boolean(errors.rejectionReason)}
                                    helperText={touched.rejectionReason && errors.rejectionReason}
                                />
                            )}
                            <DialogActions>
                                <Button onClick={onClose} color="primary">
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={actionType === 'cancel' && !values.rejectionReason}
                                >
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

export default HoldActionDialog;
