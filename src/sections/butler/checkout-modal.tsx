import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import * as React from 'react';
import { useState } from 'react';
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
  const onDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('booking_id', butler.id);

    setLoadingFile(true);
    try {
      // const res = await checkInUploadFile(formData);
      setLoadingFile(false);
      // if (res) {
      //   setFiles(acceptedFiles);
      // }
    } catch (error) {
      console.log(error, 'err');
    }
  };
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'charges', // name should match the path in defaultValues
  });

  const handleAddCharge = () => {
    append({ amount: 0, reason: '', quantity: 0 });
  };

  const handleRemoveCharge = (index: number) => {
    remove(index);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (Array.isArray(data.charges) && data.charges.length > 0) {
        const payload = {
          charge: data.charges,
          booking_id: butler?.id,
        };
        await addCharge(payload);
      }
      mutate(butler?.id);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  });

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
                <Box>
                  <ul
                    style={{
                      listStyleType: 'none',
                      padding: 0,
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      {...getRootProps()}
                      style={{ border: '2px dashed gray', padding: '20px', marginTop: '20px' }}
                    >
                      <input {...getInputProps()} />
                      <Typography>Chọn ảnh từ máy</Typography>
                    </div>
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
                </Box>
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
