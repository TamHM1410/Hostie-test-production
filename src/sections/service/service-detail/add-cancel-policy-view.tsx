import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

//  @api
import { create_cancel_policy } from 'src/api/cancelPolicy';

const timeUnits = [
  { value: 'hours', label: 'Giờ' },
  { value: 'days', label: 'Ngày' },
];

const CancellationPolicyForm = ({ isAddNew, setAddNew }: any) => {
  const queryClient = useQueryClient();

  const cancelPolicySchema = Yup.object().shape({
    name: Yup.string().required('Tên chính sách là bắt buộc '),
    description: Yup.string().required('Mô tả là bắt buộc'),
    cancel_policies: Yup.array().of(
      Yup.object().shape({
        from: Yup.number().nullable().notRequired(),
        to: Yup.number().nullable().notRequired(),
        fee: Yup.number()
          .required('Phí hủy là bắt buộc')
          .min(0, 'Phí hủy phải lớn hơn hoặc bằng 0')
          .max(100, 'Phí hủy phải nhỏ hơn hoặc bằng 100'),
        time_unit_from: Yup.string().nullable().notRequired(),
        time_unit_to: Yup.string().nullable().notRequired(),
        cancelable: Yup.boolean().required('Trường này là bắt buộc'),
      })
    ),
  });

  const defaultValues = {
    name: '',
    description: '',
    cancel_policies: [
      {
        from: null,
        to: null,
        fee: '100',
        time_unit_from: '',
        time_unit_to: '',
        cancelable: true,
      }
    ],
  };

  const methods = useForm({
    resolver: yupResolver(cancelPolicySchema),
    defaultValues,
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'cancel_policies',
  });

  const onSubmit = async (data: any) => {
    try {
      await create_cancel_policy(data);
      toast.success('Thêm chính sách thành công');
      reset();
      queryClient.invalidateQueries(['cancelPolicies'] as any);
      // Add your API call here
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Không thành công');
    }
  };

  useEffect(() => {
    const cancelPolicies = watch('cancel_policies');

    if (cancelPolicies.length >= 2) {
      for (let i = 1; i < cancelPolicies.length; i++) {
        setValue(`cancel_policies.${i}.from`, cancelPolicies[i - 1].to);
      }
    }
  }, [watch('cancel_policies'), fields]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-4" sx={{ padding: 5 }}>
        <Typography variant="h6" className="mb-4">
          Thông tin chính sách hủy
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên chính sách"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>
        </Grid>
      </Card>

      <Card className="p-4" sx={{ padding: 5, mt: 2 }}>
        <Stack direction="row" justifyContent="space-between" className="mb-4">
          <Typography variant="h6">Chi tiết chính sách hủy</Typography>
        </Stack>

        {fields.map((field, index) => (
          <Box key={field.id} className="mb-4 p-4 border rounded" sx={{ py: 2 }}>
            <Stack direction="row" justifyContent="space-between" className="mb-2">
              <Typography variant="subtitle1">Chính sách {index + 1}</Typography>

              {fields.length > 1 && (
                <IconButton onClick={() => remove(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Từ"
                  {...register(`cancel_policies.${index}.from`)}
                  error={!!errors.cancel_policies?.[index]?.from}
                  helperText={errors.cancel_policies?.[index]?.from?.message}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Đơn vị"
                  {...register(`cancel_policies.${index}.time_unit_from`)}
                  value={watch(`cancel_policies.${index}.time_unit_from`)} // Thêm dòng này
                  error={!!errors.cancel_policies?.[index]?.time_unit_from}
                  helperText={errors.cancel_policies?.[index]?.time_unit_from?.message}
                >
                  {timeUnits.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Đến"
                  {...register(`cancel_policies.${index}.to`)}
                  error={!!errors.cancel_policies?.[index]?.to}
                  helperText={errors.cancel_policies?.[index]?.to?.message}
                  disabled={index === fields.length-1 && fields.length>1}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Đơn vị"
                  {...register(`cancel_policies.${index}.time_unit_to`)}
                  error={!!errors.cancel_policies?.[index]?.time_unit_to}
                  helperText={errors.cancel_policies?.[index]?.time_unit_to?.message}
                >
                  {timeUnits.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Phí hủy (%)"
                  {...register(`cancel_policies.${index}.fee`)}
                  error={!!errors.cancel_policies?.[index]?.fee}
                  helperText={errors.cancel_policies?.[index]?.fee?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      {...register(`cancel_policies.${index}.cancelable`)}
                      defaultChecked={field.cancelable}
                    />
                  }
                  label="Cho phép hủy"
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          startIcon={<AddCircleIcon />}
          onClick={() => {
            const cancelPolicies = watch('cancel_policies'); // Lấy giá trị mới nhất của cancel_policies
            const lastPolicy = cancelPolicies[cancelPolicies.length - 1]; // Lấy phần tử cuối cùng hiện tại

            if (lastPolicy) {
              append({
                ...lastPolicy, // Sao chép giá trị phần tử cuối
                from: lastPolicy?.to,
                to: null,
                time_unit_from: lastPolicy?.time_unit_to,
                time_unit_to: '',
                fee: '0',
              });
            }
          }}
        >
          Thêm chính sách
        </Button>
      </Card>

      <Box
        className="flex justify-end"
        sx={{
          display: 'flex',
          flexDirection: 'flex-end',
          marginTop: 5,
          justifyContent: ' flex-end',
          gap: 2,
          paddingX: 5,
        }}
      >
        <Button type="button" variant="contained" onClick={() => setAddNew(!isAddNew)}>
          Hủy bỏ
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : 'Lưu chính sách'}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(CancellationPolicyForm);
