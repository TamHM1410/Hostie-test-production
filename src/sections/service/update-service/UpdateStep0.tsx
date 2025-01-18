import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Divider,
  DialogActions,
  Backdrop,
  CircularProgress,
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
    .required('Số lượng khách tiêu chuẩn là bắt buộc')
    .typeError('Số lượng khách tối đa phải là một số hợp lệ')
    .when('capacityStander', (capacityStander, schema) =>
      schema.min(
        capacityStander,
        'Số lượng khách tối đa phải lớn hơn hoặc bằng số lượng khách tiêu chuẩn'
      )
    ),
  surcharge: Yup.number()
    .min(1, 'Số tiền phụ thu nếu quá số lượng khách tiêu chuẩn phải ít nhất là 1.000 VNĐ')
    .typeError('Số tiền phụ thu nếu quá số lượng khách tiêu chuẩn  phải là một số hợp lệ'),
  description: Yup.string()
    .required('Miêu tả hoặc ghi chú là bắt buộc')
    .min(10, 'Miêu tả hoặc ghi chú phải có ít nhất 10 ký tự')
    .max(1000, 'Miêu tả không được vượt quá 1000 ký tự'),
}).noUnknown();

// List of service types
const serviceTypes = [
  { value: 1, label: 'Hotel' },
  { value: 2, label: 'Villa' },
];

// Initial values interface
interface InitialValues {
  serviceName: string;
  serviceType: number;
  email: string;
  website?: string | null;
  bedrooms: number;
  numOfBeds: number;
  bathrooms: number;
  surcharge: number;
  capacityStander: number;
  capacity: number;
  description: string;
}

// Props interface
interface Step0Props {
  onSubmit: (values: any) => void;
  initialValues?: InitialValues;
}
export default function UpdateStep0({ onSubmit, initialValues }: Step0Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<InitialValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(true);
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, value]) => {
        setValue(key as keyof InitialValues, value);
        setIsLoading(false);
      });
    }
  }, [initialValues, setValue]);
  const onFormSubmit = (data: InitialValues) => {
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
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box display="flex" flexWrap="nowrap" gap={2} width="100%">
        <TextField
          label="Tên lưu trú"
          variant="outlined"
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
          {...register('serviceType')}
          error={!!errors.serviceType}
          helperText={errors.serviceType?.message}
          margin="normal"
          defaultValue={initialValues?.serviceType} // Ensure the value is controlled
          onChange={(e) => setValue('serviceType', Number(e.target.value))} // Update state on change
        >
          {serviceTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box display="flex" flexWrap="nowrap" gap={2} width="100%">
        <TextField
          label="Số phòng ngủ"
          variant="outlined"
          fullWidth
          type="number"
          {...register('bedrooms')}
          error={!!errors.bedrooms}
          helperText={errors.bedrooms?.message}
          margin="normal"
        />
        <TextField
          label="Số giường ngủ"
          variant="outlined"
          fullWidth
          type="number"
          {...register('numOfBeds')}
          error={!!errors.numOfBeds}
          helperText={errors.numOfBeds?.message}
          margin="normal"
        />

        <TextField
          label="Số phòng tắm"
          variant="outlined"
          fullWidth
          type="number"
          {...register('bathrooms')}
          error={!!errors.bathrooms}
          helperText={errors.bathrooms?.message}
          margin="normal"
        />
      </Box>

      <Box display="flex" flexWrap="nowrap" gap={2} width="100%">
        <TextField
          label="Số khách tiêu chuẩn"
          variant="outlined"
          fullWidth
          type="number"
          {...register('capacityStander')}
          error={!!errors.capacityStander}
          helperText={errors.capacityStander?.message}
          margin="normal"
        />
        <TextField
          label="Số khách tối đa"
          variant="outlined"
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
        label="Số tiền phụ thu nếu quá số lượng khách tiêu chuẩn mỗi người trên đêm "
        margin="normal"
      />

      <TextField
        label="Miêu tả hoặc ghi chú cho nơi lưu trú"
        variant="outlined"
        fullWidth
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        margin="normal"
      />
      <Divider sx={{ marginTop: 3 }} />
      <DialogActions>
        <Button type="submit" variant="contained" color="primary">
          Cập nhật
        </Button>
      </DialogActions>
    </Box>
  );
}
