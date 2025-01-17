//  @hooks
import * as React from 'react';
import {  useEffect } from 'react';
import {  useQueryClient } from '@tanstack/react-query';

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

//  @type

const EditCommission = (props: any) => {
  const { selectedItem, open, setOpen } = props;
  const { updateCommissionPolicy } = useCommissionPolicy();
  const queryClient = useQueryClient();

  const UpdateUserSchema = Yup.object().shape({
    validFrom: Yup.string().required('Chưa nhập thông tin'),
    minPoint: Yup.number().required().default(0).min(0, 'Phải lớn hơn 0'),
    commissionRate: Yup.number()
      .required()
      .default(0)
      .max(100, 'Tỉ lệ tối đa 100')
      .min(0, 'Phải lớn hơn 0'),
    maxCommission: Yup.number()
      .required()
      .default(0)
      .max(100, 'Tỉ lệ tối đa 100')
      .min(0, 'Phải lớn hơn 0'),
    policyDescription: Yup.string().required('Chưa nhập thông tin'),
  });

  const defaultValues: any = {
    validFrom: '',
    minPoint: 0,
    maxCommission: 0,
    policyDescription: '',
    commissionRate: 0,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await updateCommissionPolicy(data,selectedItem?.policyId);
      reset();
      setOpen(false);
      queryClient.invalidateQueries(['listCommissionPolicy'] as any);
    } catch (error) {}
  };
  useEffect(() => {
    setValue('validFrom', selectedItem?.validFrom);
    setValue('minPoint', selectedItem?.minPoint);

    setValue('policyDescription', selectedItem?.policyDescription);

    setValue('maxCommission', selectedItem?.maxCommission);

    setValue('commissionRate', selectedItem?.commissionRate);
  }, [selectedItem]);
  return (
    <>
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
            Chỉnh sửa
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

                  <RHFTextField name="commissionRate" label=" Tỷ lệ hoa hồng (%)" />

                  <RHFTextField name="maxCommission" label=" Tỷ lệ hoa hồng tối đa (%)" />

                  <RHFTextField name="policyDescription" label=" Mô tả" />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(!open)}>
                    Hủy
                  </Button>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Cập nhật
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

export default EditCommission;
