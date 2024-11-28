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
import { confirm_checkout,addCharge } from 'src/api/butler';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from 'src/components/hook-form';

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
  const { butler } = useButlerBooking();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (id: { id: any }) => confirm_checkout(id),
    onSuccess: () => {
      setOpen(false);
      toast.success('Cập nhật thành công');
      queryClient.invalidateQueries(['butlerBooking'] as any);
    },
    onError: () => {
      toast.error('Đã có lỗi xảy ra');
    },
  });
  console.log(butler?.id,'booking id')
  // Yup schema for validation
  const chargeSchema = Yup.object().shape({
    charges: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number()
          .required('Số tiền là bắt buộc')
          .min(1, 'Số tiền phải lớn hơn 0'),
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

  const { handleSubmit, control, setValue, formState: { isSubmitting } } = methods;
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
      if(Array.isArray(data.charges)&&data.charges.length >0){
        const payload={
          charge:data.charges,
          booking_id:butler?.id 
        }
        await addCharge(payload)

      }
      mutate({ id: butler?.id });
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
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <RHFTextField name={`charges[${index}].amount`} label="Số tiền" type="number" />
                      <RHFTextField name={`charges[${index}].reason`} label="Lý do" />
                      <RHFTextField name={`charges[${index}].quantity`} label="Số lượng" type="number" />
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
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton variant="contained" color="primary" type="submit" loading={isSubmitting}>
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
