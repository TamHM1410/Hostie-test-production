import React from 'react';
import { Box, Typography, Snackbar, Paper, Divider, DialogActions, Button, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';

interface Step4Props {
    images: File[];
    setImages: (files: File[]) => void;
    snackbarOpen: boolean;
    setSnackbarOpen: (open: boolean) => void;
    previousStep: () => void; // Function to go back to the previous step
    currentStep: number;
    onSubmit: () => void; // Updated onSubmit type
}

export default function Step4({
    images,
    setImages,
    snackbarOpen,
    setSnackbarOpen,
    previousStep,
    currentStep,
    onSubmit,
}: Step4Props) {
    // Define minimum and maximum upload limits
    const minImages = 6;
    const maxImages = 12;

    // Function to handle file drop
    const onDrop = (acceptedFiles: File[]) => {
        if (images.length + acceptedFiles.length <= maxImages) {
            setImages([...images, ...acceptedFiles]);
            setSnackbarOpen(true); // Show snackbar for success
        } else {
            setSnackbarOpen(true); // Show snackbar for exceeding limit
        }
    };
    const handleDeleteImage = (indexToDelete: number) => {
        const updatedImages = images.filter((_, index) => index !== indexToDelete);
        setImages(updatedImages); // Cập nhật danh sách hình ảnh
    };
    const { getRootProps: dropzoneProps, getInputProps: inputProps } = useDropzone({
        onDrop,
        accept: 'image/*' as any,
        maxFiles: maxImages - images.length,
    });

    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Thêm hình ảnh cho nơi lưu trú</Typography>
            <Typography variant="body2" color="textSecondary">
                *Yêu cầu upload tối thiểu 6 hình ảnh.
            </Typography>
            <Box
                {...dropzoneProps()}
                sx={{
                    border: '2px dashed #1976d2',
                    borderRadius: 2,
                    padding: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: 2,
                    backgroundColor: images.length >= maxImages ? '#f0f0f0' : 'transparent',
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
                        <Paper
                            key={index}
                            sx={{
                                padding: 1,
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                maxWidth: 200,
                                textAlign: 'center',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Uploaded"
                                style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
                            />
                            <IconButton
                                onClick={() => handleDeleteImage(index)}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                }}
                            >
                                <DeleteIcon color="error" fontSize="small" />
                            </IconButton>
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={
                    images.length < maxImages
                        ? "Hình ảnh đã được tải lên!"
                        : "Đã đạt giới hạn tải lên hình ảnh!"
                }
            />
            <Divider sx={{ marginTop: 3 }} />
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={previousStep} disabled={currentStep === 0}>
                    Trở lại
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    color="primary"
                    disabled={images.length < minImages} // Disable button if less than 6 images
                >
                    Hoàn tất
                </Button>
            </DialogActions>
        </Box>
    );
}
