import React from 'react';
import { Box, Typography, Snackbar, Paper, Divider, DialogActions, Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';

interface Step4Props {
    images: File[];
    setImages: (files: File[]) => void;
    snackbarOpen: boolean;
    setSnackbarOpen: (open: boolean) => void;
    getRootProps: () => any;
    getInputProps: () => any;
    previousStep: () => void; // Function to go back to the previous step
    currentStep: number;
    onSubmit: any; // New onSubmit prop
}

export default function Step4({
    images,
    setImages,
    snackbarOpen,
    setSnackbarOpen,
    getRootProps,
    getInputProps,
    previousStep,
    currentStep,
    onSubmit, // Destructure onSubmit
}: Step4Props) {
    // Limit for uploaded images
    const maxImages = 6;

    // Function to handle file drop
    const onDrop = (acceptedFiles: File[]) => {
        // Only add files if the current number of images is less than the maximum
        if (images.length + acceptedFiles.length <= maxImages) {
            setImages([...images, ...acceptedFiles]);
            setSnackbarOpen(true); // Show snackbar
        } else {
            // You can show an error message or snackbar here if needed
            setSnackbarOpen(true); // This can be replaced with a custom message
        }
    };

    const { getRootProps: dropzoneProps, getInputProps: inputProps }  = useDropzone({
        onDrop,
        accept: 'image/*' as any, // Accept only images
        maxFiles: maxImages - images.length, // Limit number of files based on current images
    }) ;

    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Thêm hình ảnh cho nơi lưu trú</Typography>
            <Typography variant="body2" color="textSecondary">
                *Yêu cầu upload hình ảnh rõ nét, tối đa 50mb. Không sử dụng hình ảnh không rõ xác thực
            </Typography>
            <Box
                {...dropzoneProps()} // Use the dropzone props here
                sx={{
                    border: '2px dashed #1976d2',
                    borderRadius: 2,
                    padding: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: 2,
                    backgroundColor: images.length >= maxImages ? '#f0f0f0' : 'transparent', // Change background if limit reached
                }}
            >
                <input {...inputProps()} />
                <Typography variant="body1">
                    Kéo và thả hình ảnh ở đây, hoặc nhấn để chọn tập tin
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    (Chỉ chấp nhận hình ảnh)
                </Typography>
                {images.length >= maxImages && (
                    <Typography variant="body2" color="error">
                        Đã đạt giới hạn tải lên hình ảnh!
                    </Typography>
                )}
            </Box>
            <Box mt={2}>
                <Typography variant="subtitle1">Hình ảnh đã được tải lên:</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {images.map((file, index) => (
                        <Paper key={index} sx={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Uploaded"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={images.length < maxImages ? "Hình ảnh đã được tải lên!" : "Đã đạt giới hạn tải lên hình ảnh!"}
            />
            <Divider sx={{ marginTop: 3 }} />
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={previousStep} disabled={currentStep === 0}>
                    Trở lại
                </Button>
                <Button onClick={onSubmit} variant="contained" color="primary">
                    Hoàn tất
                </Button>
            </DialogActions>
        </Box>
    );
}
