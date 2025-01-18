import React from 'react';
import { Box, Typography, Paper, Divider, DialogActions, Button, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

interface Step4Props {
  images: File[];
  setImages: (files: File[]) => void;
  previousStep: () => void;
  currentStep: number;
  onSubmit: () => void;
}

export default function Step4({
  images,
  setImages,
  previousStep,
  currentStep,
  onSubmit,
}: Step4Props) {
  const minImages = 6;
  const maxTotalSizeMB = 10;

  // Calculate the total size of uploaded images
  const totalSizeMB = images.reduce((sum, file) => sum + file.size / (1024 * 1024), 0);

  const onDrop = (acceptedFiles: File[]) => {
    const newFilesSizeMB = acceptedFiles.reduce((sum, file) => sum + file.size / (1024 * 1024), 0);
    if (totalSizeMB + newFilesSizeMB > maxTotalSizeMB) {
      toast.error('Tổng dung lượng vượt quá 10 MB!', { position: 'top-right' });
    } else {
      setImages([...images, ...acceptedFiles]);
      toast.success('Hình ảnh đã được tải lên!', { position: 'top-right' });
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToDelete);
    setImages(updatedImages);
  };

  const { getRootProps: dropzoneProps, getInputProps: inputProps } = useDropzone({
    onDrop,
    accept: 'image/*' as any,
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 5, width: 1000 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Thêm hình ảnh cho nơi lưu trú
      </Typography>
      <Typography variant="body2" color="textSecondary">
        *Yêu cầu upload tối thiểu 6 hình ảnh và tổng dung lượng không vượt quá 10 MB.
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
        }}
      >
        <input {...inputProps()} />
        <Typography variant="body1">
          Kéo và thả hình ảnh ở đây, hoặc nhấn để chọn tập tin
        </Typography>
        <Typography variant="body2" color="textSecondary">
          (Chỉ chấp nhận hình ảnh)
        </Typography>
        {totalSizeMB > maxTotalSizeMB && (
          <Typography variant="body2" color="error">
            Tổng dung lượng vượt quá 10 MB!
          </Typography>
        )}
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle1">Hình ảnh đã được tải lên:</Typography>
        <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
          {images?.map((file, index) => (
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

      <Divider sx={{ marginTop: 3 }} />
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={previousStep} disabled={currentStep === 0}>
          Trở lại
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={images?.length < minImages || totalSizeMB > maxTotalSizeMB}
        >
          Hoàn tất
        </Button>
      </DialogActions>
    </Box>
  );
}
