import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useButlerBooking } from 'src/zustand/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
//  @component
import { confirm_checkout, addCharge } from 'src/api/butler';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from 'src/components/hook-form';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface Charge {
  amount: number;
  reason: string;
  quantity: number;
}

interface CheckoutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, setOpen }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoadingFile, setLoadingFile] = useState(false);
  const { butler } = useButlerBooking();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (id) => confirm_checkout(id),
    onSuccess: () => {
      setOpen(false);
      toast.success('Cập nhật thành công');
      queryClient.invalidateQueries(['butlerBooking'] as any);
    },
    onError: () => {
      toast.error('Đã có lỗi xảy ra');
    },
  });

  // Yup schema for validation
  const chargeSchema = Yup.object().shape({
    charges: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number().required('Số tiền là bắt buộc').min(1, 'Số tiền phải lớn hơn 0'),
        reason: Yup.string().required('Lý do là bắt buộc'),
        quantity: Yup.number()
          .min(1, 'Số lượng phải lớn hơn hoặc bằng 1')
          .required('Số lượng là bắt buộc'),
      })
    ),
  });

  const methods = useForm({
    resolver: yupResolver(chargeSchema),
    defaultValues: {
      charges: [{ amount: 0, reason: '', quantity: 0 }],
    },
  });

  // Create image previews when files change
  useEffect(() => {
    // Revoke previous previews to free up memory
    previews.forEach((preview) => URL.revokeObjectURL(preview));

    // Create new previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup function to revoke object URLs
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [files]);

  const onDrop = async (acceptedFiles: File[]) => {
    setLoadingFile(true);
    try {
      // Check file type and size
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      const validFiles = acceptedFiles.filter(
        (file) => allowedTypes.includes(file.type) && file.size <= maxSize
      );

      if (validFiles.length === 0) {
        toast.error('Vui lòng chọn ảnh hợp lệ (JPEG, PNG, GIF) dưới 5MB');
        setLoadingFile(false);
        return;
      }

      // Update files state
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);

      // Commented out API call for file upload
      // const res = await checkInUploadFile(formData);
      setLoadingFile(false);
    } catch (error) {
      console.log(error, 'err');
      setLoadingFile(false);
      toast.error('Lỗi tải ảnh');
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      return newFiles;
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'charges',
  });

  const handleAddCharge = () => {
    append({ amount: 0, reason: '', quantity: 0 });
  };

  const handleRemoveCharge = (index: number) => {
    remove(index);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      if (Array.isArray(data.charges) && data.charges.length > 0) {
        formData.append('file', files[0]);
        formData.append('booking_id', butler?.id);
        data.charges.forEach((item: any) => {
          formData.append('charges[]', item);
        });

        const res = await addCharge(formData);
      }
      mutate(butler?.id);
    } catch (error) {
      console.log(error,'err')
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  });

  // Check if upload is valid - files exist and previews match
  const isUploadValid = files.length > 0 && files.length === previews.length;

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
          width: 'auto',
          minWidth: 450,
          height: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography id="modal-title" variant="h6" component="h2">
                  Xác nhận khách đã trả phòng
                </Typography>
                <Box sx={{ py: 5 }}>
                  <Button
                    onClick={handleAddCharge}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    Thêm phụ thu
                  </Button>

                  {fields.map((item, index) => (
                    <Box
                      key={item.id}
                      sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                    >
                      <RHFTextField
                        name={`charges[${index}].amount`}
                        label="Số tiền"
                        type="number"
                      />
                      <RHFTextField name={`charges[${index}].reason`} label="Lý do" />
                      <RHFTextField
                        name={`charges[${index}].quantity`}
                        label="Số lượng"
                        type="number"
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveCharge(index)}
                      >
                        Xóa
                      </Button>
                    </Box>
                  ))}
                </Box>
                {fields.length > 0 && (
                  <Box>
                    <div
                      {...getRootProps()}
                      style={{
                        border: '2px dashed gray',
                        padding: '20px',
                        marginTop: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <input {...getInputProps()} />
                      <Typography>Hình chuyển khoản phụ thu (Tối đa 5MB, JPEG/PNG/GIF)</Typography>
                    </div>

                    {files.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 2,
                          mt: 2,
                          justifyContent: 'center',
                        }}
                      >
                        {files.map((file, index) => (
                          <Box
                            key={file.name}
                            sx={{
                              position: 'relative',
                              width: 200,
                              height: 250,
                            }}
                          >
                            <Image
                              src={previews[index]}
                              alt={`Uploaded file ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                              style={{ borderRadius: '5px' }}
                            />
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
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={isSubmitting}
                    disabled={fields.length > 0 ? !isUploadValid : false}
                  >
                    Xác nhận
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default CheckoutModal;
