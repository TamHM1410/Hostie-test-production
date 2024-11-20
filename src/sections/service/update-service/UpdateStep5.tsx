// Step4.tsx
import React from 'react';
import { Box, Typography, Snackbar, Paper, Divider, DialogActions, Button, IconButton } from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';

interface Step4Props {
    images: File[];
    setImages: (files: File[]) => void;
    snackbarOpen: boolean;
    setSnackbarOpen: (open: boolean) => void;
    getRootProps: () => any;
    getInputProps: () => any;
    onSubmit: any; // New onSubmit prop
}
export default function UpdateStep5({
    images,
    setImages,
    snackbarOpen,
    setSnackbarOpen,
    getRootProps,
    getInputProps,
    onSubmit // Destructure onSubmit
}: Step4Props) {
    const handleRemoveImage = (index: number) => {
        // Create a new array excluding the image at the given index
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };
    return (
        <Box>
            <Typography variant="body2" color="textSecondary">
                *Yêu cầu upload hình ảnh rõ nét, tối đa 50mb. Không sử dụng hình ảnh không rõ xác thực
            </Typography>
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed #1976d2',
                    borderRadius: 2,
                    padding: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: 2,
                }}
            >
                <input {...getInputProps()} />
                <Typography variant="body1">
                    Kéo và thả hình ảnh ở đây, hoặc nhấn để chọn tập tin
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    (Chỉ chấp nhận hình ảnh)
                </Typography>
            </Box>
            <Box mt={2}>
                <Typography variant="subtitle1">Hình ảnh đã được tải lên:</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {images.map((file, index) => (
                        <Paper key={index} sx={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <img
                                src={file instanceof File ? URL.createObjectURL(file) : file}
                                alt="Uploaded"
                                style={{ maxWidth: '75px', maxHeight: '75px' }}
                            />
                            <IconButton
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                onClick={() => handleRemoveImage(index)} // Call remove function on click
                            >
                                <RemoveCircleOutline fontSize="small" />
                            </IconButton>
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Hình ảnh đã được tải lên!"
            />
            <Divider sx={{ marginTop: 3 }} />
            <DialogActions>
                <Button onClick={onSubmit} variant="contained" color="primary">
                    Cập nhật
                </Button>
            </DialogActions>
        </Box>
    );
}
