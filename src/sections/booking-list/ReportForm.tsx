import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    TextField,
    MenuItem,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    IconButton,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';

// Define the schema for validation
const reportSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    reportType: Yup.string().required('Chọn loại báo cáo'),
    severity: Yup.string().required('Chọn mức độ nghiêm trọng'),
    images: Yup.array().of(Yup.mixed()),
});

interface ReportFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any, images: File[]) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ open, onClose, onSubmit }) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(reportSchema),
    });

    const [images, setImages] = useState<File[]>([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const newImages = [...images, ...acceptedFiles];
            setImages(newImages);
            setValue('images', newImages); // Update images in the form
        },
    });

    const handleDeleteImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        setValue('images', updatedImages); // Update images in the form
    };

    const handleFormSubmit = (data: any) => {
        onSubmit(data, images); // Await success flag



    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Báo Cáo Vấn Đề</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {/* Title Field */}
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

                    {/* Report Type Field */}
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

                    {/* Severity Field */}
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

                    {/* Description Field */}
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

                    {/* Image Upload Field (Drag and Drop) */}
                    <div {...getRootProps()} style={{
                        border: '2px dashed #3f51b5',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}>
                        <input {...getInputProps()} />
                        <p>Kéo và thả hình ảnh vào đây, hoặc nhấp để chọn</p>
                    </div>
                    {errors.images && (
                        <FormHelperText error>{errors.images.message}</FormHelperText>
                    )}

                    {/* Image Preview */}
                    <div style={{ marginTop: '20px' }}>
                        {images.map((file, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                    position: 'relative',
                                }}
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    style={{ width: '80px', height: '80px', marginRight: '10px', borderRadius: '5px' }}
                                />
                                <IconButton
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    <CloseIcon color="error" />
                                </IconButton>
                            </div>
                        ))}
                    </div>
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
