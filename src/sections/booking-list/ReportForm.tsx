import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// Define the schema for validation
const reportSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    reportType: Yup.string().required('Chọn loại báo cáo'),
    severity: Yup.string().required('Chọn mức độ nghiêm trọng'),
});

interface ReportFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ open, onClose, onSubmit }) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(reportSchema),
    });

    const handleFormSubmit = (data: any) => {
        onSubmit(data); // Send data to parent component
        onClose(); // Close the dialog after submission
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Báo Cáo Vấn Đề</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Controller
                        name="title"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Tiêu đề"
                                fullWidth
                                margin="normal"
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        )}
                    />
                    <Controller
                        name="reportType"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Loại Báo Cáo"
                                fullWidth
                                margin="normal"
                                error={!!errors.reportType}
                                helperText={errors.reportType?.message}
                            >
                                <MenuItem value="PAYMENT_ISSUE">Vấn đề thanh toán</MenuItem>
                                <MenuItem value="RESIDENCE_ISSUE">Vấn đề nơi lưu trú</MenuItem>
                                <MenuItem value="HOST_ISSUE">Vấn đề chủ nhà</MenuItem>
                                <MenuItem value="SERVICE_ISSUES">Vấn đề dịch vụ</MenuItem>
                                <MenuItem value="OTHER">Vấn đề khác</MenuItem>
                            </TextField>
                        )}
                    />
                    <Controller
                        name="severity"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Mức Độ Nghiêm Trọng"
                                fullWidth
                                margin="normal"
                                error={!!errors.severity}
                                helperText={errors.severity?.message}
                            >
                                <MenuItem value="LOW">Thấp</MenuItem>
                                <MenuItem value="MEDIUM">Trung Bình</MenuItem>
                                <MenuItem value="HIGH">Cao</MenuItem>
                                <MenuItem value="URGENT">Cấp bách</MenuItem>
                            </TextField>
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Mô tả"
                                fullWidth
                                margin="normal"
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                multiline
                                rows={4}
                            />
                        )}
                    />

                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Hủy
                </Button>
                <Button onClick={handleSubmit(handleFormSubmit)} color="primary">
                    Gửi Báo Cáo
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportForm;
