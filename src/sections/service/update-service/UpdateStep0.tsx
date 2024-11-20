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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// Define validation schema using Yup
const validationSchema = Yup.object({
    serviceName: Yup.string()
        .required('Tên lưu trú là bắt buộc')
        .min(3, 'Tên lưu trú phải có ít nhất 3 ký tự')
        .max(100, 'Tên lưu trú không được vượt quá 100 ký tự'),
    serviceType: Yup.number()
        .required('Loại lưu trú là bắt buộc'),
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc')
        .max(255, 'Email không được vượt quá 255 ký tự'),
    website: Yup.string()
        .url('Website không hợp lệ')
        .nullable()
        .max(255, 'URL không được vượt quá 255 ký tự'),
    bedrooms: Yup.number()
        .required('Số phòng ngủ là bắt buộc')
        .min(1, 'Phải có ít nhất 1 phòng ngủ')
        .max(100, 'Số phòng ngủ không được vượt quá 100')
        .typeError('Số phòng ngủ phải là một số hợp lệ'),
    bathrooms: Yup.number()
        .required('Số phòng tắm là bắt buộc')
        .min(1, 'Phải có ít nhất 1 phòng tắm')
        .max(100, 'Số phòng tắm không được vượt quá 100')
        .typeError('Số phòng tắm phải là một số hợp lệ'),
    capacity: Yup.number()
        .required('Sức chứa là bắt buộc')
        .min(1, 'Sức chứa phải ít nhất là 1 người')
        .max(1000, 'Sức chứa không được vượt quá 1000 người')
        .typeError('Sức chứa phải là một số hợp lệ'),
    description: Yup.string()
        .required('Miêu tả là bắt buộc')
        .min(10, 'Miêu tả phải có ít nhất 10 ký tự')
        .max(1000, 'Miêu tả không được vượt quá 1000 ký tự'),
}).noUnknown();


// List of service types
const serviceTypes = [
    { value: 1, label: 'Hotel' },
    { value: 2, label: 'Villa' },
    { value: 3, label: 'Apartment' },
];

// Initial values interface
interface InitialValues {
    serviceName: string;
    serviceType: number;
    email: string;
    website?: string | null;
    bedrooms: number;
    bathrooms: number;
    capacity: number;
    description: string;
}

// Props interface
interface Step0Props {
    onSubmit: (values: any) => void;
    initialValues?: InitialValues;
}
export default function UpdateStep0({ onSubmit, initialValues }: Step0Props) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<InitialValues>({
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
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate autoComplete="off" maxWidth={450}>
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
                    defaultValue={initialValues?.serviceType}  // Ensure the value is controlled
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
                    label="Email"
                    variant="outlined"
                    fullWidth
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    margin="normal"
                />
                <TextField
                    label="Website"
                    variant="outlined"
                    fullWidth
                    {...register('website')}
                    error={!!errors.website}
                    helperText={errors.website?.message}
                    margin="normal"
                />
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
                    label="Số phòng tắm"
                    variant="outlined"
                    fullWidth
                    type="number"
                    {...register('bathrooms')}
                    error={!!errors.bathrooms}
                    helperText={errors.bathrooms?.message}
                    margin="normal"
                />
                <TextField
                    label="Sức chứa"
                    variant="outlined"
                    fullWidth
                    type="number"
                    {...register('capacity')}
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                    margin="normal"
                />
            </Box>

            <TextField
                label="Miêu tả nơi lưu trú"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
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
