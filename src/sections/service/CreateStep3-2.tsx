import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    DialogActions,
    Snackbar,
    IconButton,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';

interface PolicyProps {
    onSave: (files: File[]) => void;
    previousStep: any;
    currentStep: any
}

const CreatePolicy: React.FC<PolicyProps> = ({ onSave, previousStep, currentStep }) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

    // Handle file drop
    const onDrop = (acceptedFiles: File[]) => {
        if (uploadedFiles.length >= 1) {
            setErrorSnackbarOpen(true); // Hiển thị thông báo lỗi
            return;
        }
        setUploadedFiles([...uploadedFiles, ...acceptedFiles.slice(0, 1)]); // Chỉ thêm 1 hình ảnh
        setSnackbarOpen(true); // Hiển thị thông báo thành công
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*', // Chỉ chấp nhận hình ảnh
    });

    // Handle delete file
    const handleDeleteFile = () => {
        setUploadedFiles([]); // Xóa tất cả tệp đã tải
    };

    // Handle save
    const handleSave = () => {
        onSave(uploadedFiles);
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Thêm hình ảnh chính sách nơi lưu trú
            </Typography>
            <Typography variant="body2" color="textSecondary">
                *Chỉ chấp nhận tải lên một hình ảnh.
            </Typography>

            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed #1976d2',
                    borderRadius: 2,
                    padding: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: 3,
                }}
            >
                <input {...getInputProps()} />
                <Typography variant="body1">Kéo thả ảnh ở đây, hoặc nhấn để chọn ảnh</Typography>
                <Typography variant="body2" color="textSecondary">
                    (Chỉ chấp nhận một hình ảnh)
                </Typography>
            </Box>

            {uploadedFiles.length > 0 && (
                <Box mt={2}>
                    <Typography variant="subtitle1">Ảnh đã tải lên:</Typography>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        {uploadedFiles.map((file, index) => {
                            const fileUrl = URL.createObjectURL(file);

                            return (
                                <Paper
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        padding: 1,
                                        border: '1px solid #ddd',
                                        borderRadius: 1,
                                        maxWidth: 200,
                                        textAlign: 'center',
                                    }}
                                >
                                    <img
                                        src={fileUrl}
                                        alt={file.name}
                                        style={{ maxWidth: '100%', maxHeight: 150 }}
                                    />
                                    <IconButton
                                        onClick={handleDeleteFile}
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
                            );
                        })}
                    </Box>
                </Box>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Tệp đã được tải lên!"
            />

            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={3000}
                onClose={() => setErrorSnackbarOpen(false)}
                message="Chỉ được tải lên một hình ảnh!"
            />

            <Divider sx={{ marginTop: 3 }} />
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={previousStep} disabled={currentStep === 0}>
                    Trở lại
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={uploadedFiles.length === 0}
                >
                    Tiếp theo
                </Button>
            </DialogActions>
        </Box>
    );
};

export default CreatePolicy;
