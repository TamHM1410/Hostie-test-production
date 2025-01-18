import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    DialogActions,
    IconButton,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

interface PolicyProps {
    onSave: (files: File[]) => void;
    dataFiles: any;
    setDeletePolicy: (deletedIds: string[]) => void;
}

const UpdatePolicy: React.FC<PolicyProps> = ({ onSave, dataFiles, setDeletePolicy }) => {
    const [uploadedFiles, setUploadedFiles] = useState<any>(dataFiles || []);

    // Handle file drop
    const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
        if (uploadedFiles.length + acceptedFiles.length > 1) {
            toast.error('Chỉ được tải lên một hình ảnh!');
            return;
        }

        if (fileRejections.length > 0) {
            toast.error('Tệp không hợp lệ. Vui lòng tải lên tệp có định dạng .jpg, .jpeg, hoặc .png!');
            return;
        }

        setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
        toast.success('Tải lên thành công!');
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
        },
    });

    // Handle delete file
    const handleDeleteFile = (fileId: string) => {
        setUploadedFiles(uploadedFiles?.filter((file: any) => file.id !== fileId));
        setDeletePolicy(fileId);
        toast.success('Đã xóa tệp!');
    };

    // Handle save
    const handleSave = () => {
        onSave(uploadedFiles);
        toast.success('Đã cập nhật thành công!');
    };

    return (
        <Box>
            {/* Toast container for displaying notifications */}


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
            {uploadedFiles?.length > 0 && (
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
                        {(() => {
                            const firstFile = uploadedFiles[0];
                            const fileUrl =
                                firstFile instanceof File
                                    ? URL.createObjectURL(firstFile)
                                    : firstFile?.file_url;

                            return (
                                <Paper
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
                                        alt="Uploaded"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: 150,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleDeleteFile(firstFile.id)} // Pass the file ID
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
                        })()}
                    </Box>
                </Box>
            )}

            <Divider sx={{ marginTop: 3 }} />
            <DialogActions>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={uploadedFiles?.length === 0}
                >
                    Cập nhật
                </Button>
            </DialogActions>
        </Box>
    );
};

export default UpdatePolicy;
