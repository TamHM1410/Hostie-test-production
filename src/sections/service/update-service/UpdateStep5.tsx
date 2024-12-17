import React, { useState } from 'react';
import { Box, Typography, Paper, Divider, DialogActions, Button, IconButton } from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';
import toast from 'react-hot-toast';


interface Step4Props {
    images: { id?: string; image: File }[]; // Add optional id for images
    setImages: (files: { id?: string; image: File }[]) => void;
    getRootProps: () => any;
    getInputProps: () => any;
    onSubmit: () => void;
    setImageDelete: (removedIds: string[]) => void;
}

export default function UpdateStep5({
    images,
    setImages,
    getRootProps,
    getInputProps,
    onSubmit,
    setImageDelete,
}: Step4Props) {
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    const minImages = 6;

    // State to store IDs of removed images
    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

    const handleRemoveImage = (index: number) => {
        const imageToRemove = images[index];

        // Create a new array excluding the image at the given index
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        // If the image has an ID, add it to the removedImageIds array
        if (imageToRemove.id) {
            setRemovedImageIds((prev) => {
                const updatedRemovedImageIds = [...prev, imageToRemove.id];
                setImageDelete(updatedRemovedImageIds); // Update external state with the latest removed IDs
                return updatedRemovedImageIds;
            });
        }
    };

    const handleOnSubmit = () => {
        // Validate before submitting
        const totalSize = images.reduce((acc, file) => acc + (file.image ? file.image.size : file.size), 0);
        if (images.length < minImages) {
            toast.error('Yêu cầu tải lên ít nhất 6 hình ảnh!');
            return;
        }
        if (totalSize > maxSize) {
            toast.error('Tổng dung lượng đã vượt quá giới hạn 50MB!');
            return;
        }
        onSubmit(); // Call the parent submission handler
    };

    const totalSize = images.reduce((acc, file) => acc + (file.image ? file.image.size : file.size), 0);

    return (
        <Box>
            <Typography variant="body2" color="textSecondary">
                *Yêu cầu upload tối thiểu 6 hình ảnh, tổng dung lượng không vượt quá 50MB.
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
                    backgroundColor: totalSize > maxSize ? '#f0f0f0' : 'transparent',
                }}
            >
                <input {...getInputProps()} />
                <Typography variant="body1">
                    Kéo và thả hình ảnh ở đây, hoặc nhấn để chọn tập tin
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    (Chỉ chấp nhận hình ảnh)
                </Typography>
                {totalSize > maxSize && (
                    <Typography variant="body2" color="error">
                        Tổng dung lượng đã vượt quá giới hạn 50MB!
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
                                width: 100,
                                height: 100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={file instanceof File ? URL.createObjectURL(file.image || file) : file?.image}
                                alt="Uploaded"
                                style={{ maxWidth: '75px', maxHeight: '75px' }}
                            />
                            <IconButton
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                onClick={() => handleRemoveImage(index)}
                            >
                                <RemoveCircleOutline fontSize="small" />
                            </IconButton>
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Divider sx={{ marginTop: 3 }} />
            <DialogActions>
                <Button
                    onClick={handleOnSubmit}
                    variant="contained"
                    color="primary"
                    disabled={images.length < minImages || totalSize > maxSize}
                >
                    Cập nhật
                </Button>
            </DialogActions>

            {/* ToastContainer to display toast notifications */}

        </Box>
    );
}
