//  @hooks
import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoleManagement } from 'src/api/useRoleManagement';

//  @lib
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCommissionPolicy } from 'src/api/useCommissionPolicy';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';

//  @type

const AddNewCommissionPolicy = (props: any) => {
  const { createCommissionPolicy } = useCommissionPolicy();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const UpdateUserSchema = Yup.object().shape({
    validFrom: Yup.string().required('Chưa nhập thông tin'),
    minPoint: Yup.number().notRequired().default(0),
    maxCommission: Yup.number().notRequired().default(0),
    policyDescription: Yup.string().required('Chưa nhập thông tin'),
  });

  const defaultValues: any = {
    validFrom: '',
    minPoint: 0,
    maxCommission: 0,
    policyDescription: '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await createCommissionPolicy(data);
      reset()
      setOpen(false)
    } catch (error) {}
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2 }}>
        <AddIcon /> Thêm mới chính sách hoa hồng
      </Button>
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
            height: 'auto',
            minWidth: { xs: 300, md: 500, lg: 800 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Thêm mới quyền
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid md={12} xs={8}>
              <Card sx={{ p: 3, mt: 2 }}>
                <Box
                  rowGap={3}
                  columnGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(0, 1fr)',
                    sm: 'repeat(0, 1fr)',
                  }}
                >
                  <RHFTextField name="validFrom" label=" Hiệu lực từ" type="date" />
                  <RHFTextField name="minPoint" label=" Điểm tối thiểu" />

                  <RHFTextField name="maxCommission" label=" Tỷ lệ hoa hồng" />

                  <RHFTextField name="policyDescription" label=" Mô tả" />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Thêm
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
};

export default AddNewCommissionPolicy;
