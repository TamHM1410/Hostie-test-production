// @hook
import * as React from 'react';
import { useState } from 'react';
import { useButlerBooking } from 'src/zustand/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, FormControl } from '@mui/material';
import toast from 'react-hot-toast';
// @component
import { LoadingButton } from '@mui/lab';
import { confirm_checkin, checkInUploadFile } from 'src/api/butler';
import { LoadingScreen } from 'src/components/loading-screen';

// @dropzone & image
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const CheckinModal = (props: any) => {
  const { open, setOpen } = props;
  const { butler } = useButlerBooking();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoadingFile, setLoadingFile] = useState(false);

  const { mutate }: any = useMutation({
    mutationFn: (payload: any) => {
      return confirm_checkin(payload);
    },
    onSuccess: () => {
      setOpen(false);
      toast.success('Cập nhật thành công');
      queryClient.invalidateQueries(['butlerBooking'] as any);
    },
    onError: () => {
      toast.error('Error');
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('booking_id', butler.id);

    setLoadingFile(true);
    try {
      const res = await checkInUploadFile(formData);
      setLoadingFile(false);
      if (res) {
        setFiles(acceptedFiles);
      }
    } catch (error) {
    }
  };
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSubmit = async () => {
    try {
      // const formData = new FormData();
      // formData.append('booking_id', butler?.id);
      // files.forEach((file) => formData.append('File', file));
      // await checkInUploadFile(formData)
      mutate(butler?.id);
      setFiles([])
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350,
          height: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <FormControl sx={{ width: '100%' }}>
          <Grid md={12} xs={8}>
            <Typography id="modal-title" variant="h6" component="h2">
              Xác nhận khách đã nhận phòng
            </Typography>

            {/* Dropzone */}
       {files.length ===0 && <div
              {...getRootProps()}
              style={{ border: '2px dashed gray', padding: '20px', marginTop: '20px' }}
            >
              <input {...getInputProps()} />
              <Typography>Chọn ảnh từ máy</Typography>
            </div> }    
            {/* Hiển thị file đã chọn */}
            <Box sx={{ py: 2, fontWeight: 700 }}>
              Ảnh chuyển khoản(
              <span style={{ color: 'red', fontSize: 12, fontWeight: 500 }}>*bắt buộc </span>)
            </Box>
            {isLoadingFile === true ? (
              <LoadingScreen />
            ) : (
              <ul
                style={{
                  listStyleType: 'none',
                  padding: 0,
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {files.map((file, index) => (
                  <li
                    key={index}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      marginRight: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <Box sx={{ width: 'full' }}>
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded file ${index + 1}`}
                        width={200}
                        height={250}
                        style={{ borderRadius: '5px' }}
                        onLoad={() => URL.revokeObjectURL(file)}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      sx={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        minWidth: '30px',
                        minHeight: '30px',
                        padding: '5px',
                      }}
                    >
                      X
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <Stack direction="column" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Box sx={{ gap: 5 }}>
                <Button variant="contained" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <LoadingButton
                  variant="contained"
                  color="error"
                  type="button"
                  onClick={() => onSubmit()}
                  sx={{ ml: 2 }}
                  disabled={files.length === 0 ? true : false}
                >
                  Xác nhận
                </LoadingButton>
              </Box>
            </Stack>
          </Grid>
        </FormControl>
      </Box>
    </Modal>
  );
};

export default CheckinModal;
