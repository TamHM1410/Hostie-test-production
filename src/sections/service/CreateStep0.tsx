import React, { useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Button,
  Divider,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { NumericFormat } from 'react-number-format';

// Define validation schema using Yup
const validationSchema = Yup.object({
  serviceName: Yup.string()
    .required('Tên lưu trú là bắt buộc')
    .min(3, 'Tên lưu trú phải có ít nhất 3 ký tự')
    .max(100, 'Tên lưu trú không được vượt quá 100 ký tự'),
  serviceType: Yup.number().required('Loại lưu trú là bắt buộc'),
  numOfBeds: Yup.number()
    .required('Số giường ngủ là bắt buộc')
    .min(1, 'Phải có ít nhất 1 giường ngủ')
    .typeError('Số giường ngủ phải là một số hợp lệ'),
  bedrooms: Yup.number()
    .required('Số phòng ngủ là bắt buộc')
    .min(1, 'Phải có ít nhất 1 phòng ngủ')
    .typeError('Số phòng ngủ phải là một số hợp lệ'),
  bathrooms: Yup.number()
    .required('Số phòng tắm là bắt buộc')
    .min(1, 'Phải có ít nhất 1 phòng tắm')
    .typeError('Số phòng tắm phải là một số hợp lệ'),
  capacityStander: Yup.number()
    .required('Số lượng khách tiêu chuẩn là bắt buộc')
    .min(1, 'Số lượng khách tiêu chuẩn phải ít nhất là 1 người')
    .typeError('Số lượng khách tiêu chuẩn phải là một số hợp lệ'),
  capacity: Yup.number()
    .required('Số lượng khách tối đa là bắt buộc')
    .typeError('Số lượng khách tối đa phải là một số hợp lệ')
    .when('capacityStander', (capacityStander, schema) =>
      schema.min(
        capacityStander,
        'Số lượng khách tối đa phải lớn hơn hoặc bằng số lượng khách tiêu chuẩn'
      )
    ),
  surcharge: Yup.number()
    .min(1, 'Số tiền phụ thu nếu quá số lượng khách tiêu chuẩn phải ít nhất là 1 VNĐ')
    .typeError('Số tiền phụ thu nếu quá số lượng khách tiêu chuẩn phải là một số hợp lệ'),
  description: Yup.string()
    .required('Miêu tả hoặc ghi chú là bắt buộc')
    .min(10, 'Miêu tả hoặc ghi chú phải có ít nhất 10 ký tự')
    .max(1000, 'Miêu tả không được vượt quá 1000 ký tự'),
}).noUnknown();

const serviceTypes = [
  { value: 1, label: 'Villa' },
  { value: 2, label: 'Homestay' },
  { value: 3 , label: 'Căn hộ' },

];

interface InitialValues {
  serviceName: string;
  serviceType: number;
  bedrooms: number;
  numOfBeds: number;
  bathrooms: number;
  surcharge: number;
  capacityStander: number;
  capacity: number;
  description: string;
}

interface Step0Props {
  onSubmit: (values: any) => void;
  previousStep: () => void;
  currentStep: number;
  initialValues?: InitialValues;
}

export default function Step0({ onSubmit, previousStep, currentStep, initialValues }: Step0Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InitialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues || {
      serviceName: '',
      serviceType: 1,
      bedrooms: null,
      numOfBeds: null,
      bathrooms: null,
      capacityStander: null,
      capacity: null,
      surcharge: null,
      description: '',
    },
  });

  useEffect(() => {
    const savedValues = localStorage.getItem('formValues');
    const parsedValues = savedValues ? JSON.parse(savedValues) : null;

    if (parsedValues) {
      Object.keys(parsedValues).forEach((key) => {
        setValue(key as keyof InitialValues, parsedValues[key]);
      });
    } else if (initialValues) {
      Object.keys(initialValues).forEach((key) => {
        setValue(key as keyof InitialValues, initialValues[key]);
      });
    }
  }, [initialValues, setValue]);

  const serviceTypeValue = watch('serviceType');

  const onFormSubmit = (data: InitialValues) => {
    localStorage.setItem('formValues', JSON.stringify(data));
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      autoComplete="off"
      sx={{ maxWidth: 800, mx: 'auto', p: 2, px: 5, width: 1200 }}
    >
      <Typography variant="h6">Thông tin của nơi lưu trú</Typography>

      <Box display="flex" flexWrap="nowrap" gap={2} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <TextField
          label="Tên lưu trú"
          fullWidth
          {...register('serviceName')}
          error={!!errors.serviceName}
          helperText={errors.serviceName?.message}
          margin="normal"
        />
        <TextField
          select
          label="Loại lưu trú"
          fullWidth
          value={serviceTypeValue || ''}
          onChange={(e) => setValue('serviceType', Number(e.target.value))}
          error={!!errors.serviceType}
          helperText={errors.serviceType?.message}
          margin="normal"
        >
          {serviceTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box display="flex" gap={2} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <TextField
          label="Số phòng ngủ"
          fullWidth
          type="number"
          {...register('bedrooms')}
          error={!!errors.bedrooms}
          helperText={errors.bedrooms?.message}
          margin="normal"
        />
        <TextField
          label="Số giường ngủ"
          fullWidth
          type="number"
          {...register('numOfBeds')}
          error={!!errors.numOfBeds}
          helperText={errors.numOfBeds?.message}
          margin="normal"
        />
        <TextField
          label="Số phòng tắm"
          fullWidth
          type="number"
          {...register('bathrooms')}
          error={!!errors.bathrooms}
          helperText={errors.bathrooms?.message}
          margin="normal"
        />
      </Box>

      <Box display="flex" gap={2} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <TextField
          label="Số khách tiêu chuẩn"
          fullWidth
          type="number"
          {...register('capacityStander')}
          error={!!errors.capacityStander}
          helperText={errors.capacityStander?.message}
          margin="normal"
        />
        <TextField
          label="Số khách tối đa"
          fullWidth
          type="number"
          {...register('capacity')}
          error={!!errors.capacity}
          helperText={errors.capacity?.message}
          margin="normal"
        />
      </Box>

      <NumericFormat
        value={watch('surcharge')}
        thousandSeparator=","
        prefix="VNĐ "
        customInput={TextField}
        fullWidth
        onValueChange={(values) => setValue('surcharge', values.floatValue || 0)}
        error={!!errors.surcharge}
        helperText={errors.surcharge?.message}
        label="Số tiền phụ thu mỗi khách trên 1 đêm"
        margin="normal"
      />

      <TextField
        label="Miêu tả hoặc ghi chú"
        fullWidth
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        margin="normal"
        multiline
        rows={4}
      />

      <Divider sx={{ marginTop: 3 }} />
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={previousStep} disabled={currentStep === 0}>
          Trở lại
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Tiếp theo
        </Button>
      </DialogActions>
    </Box>
  );
}
