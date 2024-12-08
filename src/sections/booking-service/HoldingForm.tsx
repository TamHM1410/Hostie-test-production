/* eslint-disable arrow-body-style */
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, InputAdornment } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

interface HoldingFormDialogProps {
    isHoldingForm: boolean;
    setIsHoldingForm: (value: boolean) => void;
    selectedVillaName: string;
    startDate: string;
    endDate: string;
    onSubmitHolding: (values: any) => void;
}

const HoldingFormDialog: React.FC<HoldingFormDialogProps> = ({
    isHoldingForm,
    setIsHoldingForm,
    selectedVillaName,
    startDate,
    endDate,
    onSubmitHolding
}) => {
    return (
        <Dialog open={isHoldingForm} onClose={() => setIsHoldingForm(false)}>
            <DialogTitle>Giữ Chỗ Cho {selectedVillaName}</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        start_date: startDate,
                        end_date: endDate,
                        expire: 15,
                    }}
                    validationSchema={Yup.object({
                        expire: Yup.number()
                            .min(1, 'Hạn giữ chỗ phải lớn hơn 0.')
                            .max(30, 'Hạn giữ chỗ phải nhỏ hơn 100 phút.')
                            .required('Hạn giữ chỗ là bắt buộc.')
                    })}
                    onSubmit={(values: any) => {
                        onSubmitHolding(values); // Ensure this function handles the submission
                    }}
                >
                    {({ handleChange, handleBlur, values, errors, touched }) => (
                        <Form>
                            <TextField
                                label="Ngày Bắt Đầu"
                                value={startDate}
                                fullWidth
                                margin="dense"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Ngày Kết Thúc"
                                value={endDate}
                                fullWidth
                                margin="dense"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                label="Hạn Giữ Chỗ"
                                type="number"
                                name="expire"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.expire}
                                fullWidth
                                margin="dense"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">phút</InputAdornment>,
                                }}
                                error={touched.expire && Boolean(errors.expire)}
                                helperText={touched.expire && errors.expire}
                            />
                            <DialogActions>
                                <Button onClick={() => setIsHoldingForm(false)} color="primary">
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

export default HoldingFormDialog;
