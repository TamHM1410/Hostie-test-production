import React from 'react';
import { useEffect, useState } from 'react';
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

const DetailCancelPolicyForm = ({ data, onCancel, isSelected, setIsSelected, type = '' }: any) => {
  const queryClient = useQueryClient();

  const [isEdit, setEdit] = useState(false);

  const cancelPolicySchema = Yup.object().shape({
    id: Yup.number().notRequired(),
    name: Yup.string().required('Tên chính sách là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    cancel_policies: Yup.array().of(
      Yup.object().shape({
        from: Yup.number().nullable().min(0),
        to: Yup.number().nullable().min(0),
        fee: Yup.number()
          .required('Phí hủy là bắt buộc')
          .min(0, 'Phí hủy phải lớn hơn hoặc bằng 0')
          .max(100, 'Phí hủy phải nhỏ hơn hoặc bằng 100'),
        time_unit_from: Yup.string().required('Đơn vị thời gian là bắt buộc'),
        time_unit_to: Yup.string().required('Đơn vị thời gian là bắt buộc'),
        cancelable: Yup.boolean().required('Trường này là bắt buộc'),
      })
    ),
  });

  const defaultValues = {
    id: 0,
    name: '',
    description: '',
    cancel_policies: [
      {
        from: null,
        to: null,
        fee: '',
        time_unit_from: 'hours',
        time_unit_to: 'hours',
        cancelable: false,
      },
    ],
  };

  const methods = useForm({
    resolver: yupResolver(cancelPolicySchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cancel_policies',
  });

  const onSubmit = async (formData: any) => {
    try {
      await create_cancel_policy(formData);
      toast.success('Lưu chính sách thành công');
      queryClient.invalidateQueries(['cancelPolicies'] as any);
      setEdit(!isEdit);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Phát hiện khoảng thời gian chồng chéo giữa các chính sách');
    }
  };

  useEffect(() => {
    if (data) {
      setEdit(true);
      reset({
        id: data.id || 0,
        name: data.name || '',
        description: data.description || '',
        cancel_policies: data.cancel_policies?.map((policy: any) => ({
          from: policy.from || null,
          to: policy.to || null,
          fee: policy.fee || '',
          time_unit_from: policy.time_unit_from || 'hours',
          time_unit_to: policy.time_unit_to || 'hours',
          cancelable: policy.cancelable || false,
        })) || [
          {
            from: null,
            to: null,
            fee: '',
            time_unit_from: 'hours',
            time_unit_to: 'hours',
            cancelable: false,
          },
        ],
      });
    }
  }, [data, reset]);

  const handleAddPolicy = () => {
    append({
      from: null,
      to: null,
      fee: '',
      time_unit_from: 'hours',
      time_unit_to: 'hours',
      cancelable: false,
    });
  };

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
              InputProps={{
                readOnly: isEdit,
              }}
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
              InputProps={{
                readOnly: isEdit,
              }}
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
              <Typography variant="subtitle1">Quy định hủy {index + 1}</Typography>

              {fields.length > 1 && !isEdit && (
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
                  InputProps={{
                    readOnly: isEdit,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Đơn vị"
                  defaultValue="hours"
                  {...register(`cancel_policies.${index}.time_unit_from`)}
                  error={!!errors.cancel_policies?.[index]?.time_unit_from}
                  helperText={errors.cancel_policies?.[index]?.time_unit_from?.message}
                  InputProps={{
                    readOnly: isEdit,
                  }}
                >
                  {timeUnits.map((option) => (
                    <MenuItem key={option.value} value={option.value} disabled={isEdit}>
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
                  InputProps={{
                    readOnly: isEdit,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Đơn vị"
                  defaultValue="hours"
                  {...register(`cancel_policies.${index}.time_unit_to`)}
                  error={!!errors.cancel_policies?.[index]?.time_unit_to}
                  helperText={errors.cancel_policies?.[index]?.time_unit_to?.message}
                  InputProps={{
                    readOnly: isEdit,
                  }}
                >
                  {timeUnits.map((option) => (
                    <MenuItem key={option.value} value={option.value} disabled={isEdit}>
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
                  InputProps={{
                    readOnly: isEdit,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      {...register(`cancel_policies.${index}.cancelable`)}
                      defaultChecked={field.cancelable}
                      disabled={isEdit}
                    />
                  }
                  label="Cho phép hủy"
                />
              </Grid>
            </Grid>
          </Box>
        ))}
        {!isEdit && (
          <Button
            startIcon={<AddCircleIcon />}
            onClick={() => {
              const cancelPolicies = watch('cancel_policies'); // Lấy giá trị mới nhất của cancel_policies
              const lastPolicy = cancelPolicies[cancelPolicies.length - 1]; // Lấy phần tử cuối cùng hiện tại

              console.log(lastPolicy, 'last');

              if (lastPolicy) {
                append({
                  ...lastPolicy, // Sao chép giá trị phần tử cuối
                  from: lastPolicy?.to,
                  to: null,
                  time_unit_from: lastPolicy?.time_unit_to,
                  time_unit_to: '',
                  fee: '',
                });
              }
            }}
          >
            Thêm chính sách
          </Button>
        )}
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
        {isEdit && type !== 'cancelview' ? (
          <>
            <Button type="button" variant="contained" onClick={() => setIsSelected(!isSelected)}>
              Trở về
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={(event) => {
                event.preventDefault();
                setEdit(!isEdit);
              }}
            >
              Chỉnh sửa
            </Button>
          </>
        ) : (
          <>
            {type !== 'cancelview' && (
              <>
                <Button type="button" variant="contained" onClick={() => setEdit(!isEdit)}>
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Lưu chính sách'}
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(DetailCancelPolicyForm);
