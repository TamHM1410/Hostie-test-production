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
    dataFiles: any
}

const UpdatePolicy: React.FC<PolicyProps> = ({ onSave, dataFiles }) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([dataFiles]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

    // Handle file drop
    const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        // Nếu người dùng tải lên nhiều hơn 1 file
        if (uploadedFiles.length + acceptedFiles.length > 1) {
            setErrorSnackbarOpen(true); // Hiển thị thông báo lỗi
            return;
        }

        // Nếu có tệp không hợp lệ
        if (fileRejections.length > 0) {
            setErrorSnackbarOpen(true); // Hiển thị thông báo lỗi
            return;
        }

        // Thêm tệp hợp lệ vào danh sách
        setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
        setSnackbarOpen(true); // Hiển thị thông báo thành công
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
        }, // Chỉ chấp nhận các loại hình ảnh được liệt kê
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
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            maxWidth: 200,
                            margin: '0 auto',
                            position: 'relative',
                        }}
                    >
                        {uploadedFiles.map((file, index) => {

                            const fileUrl = file instanceof File ? URL.createObjectURL(file) : file

                            return (
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
                                        src={fileUrl}
                                        alt={`${index}`}
                                        style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
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
                open={errorSnackbarOpen}
                autoHideDuration={3000}
                onClose={() => setErrorSnackbarOpen(false)}
                message="Chỉ được tải lên một hình ảnh!"
            />
            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={3000}
                onClose={() => setErrorSnackbarOpen(false)}
                message={
                    uploadedFiles.length >= 1
                        ? "Chỉ được tải lên một hình ảnh!"
                        : "Tệp không hợp lệ. Vui lòng tải lên tệp có định dạng .jpg, .jpeg, hoặc .png!"
                }
            />

            <Divider sx={{ marginTop: 3 }} />
            <DialogActions >

                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={uploadedFiles.length === 0}
                >
                    Cập nhật
                </Button>
            </DialogActions>
        </Box>
    );
};

export default UpdatePolicy;
