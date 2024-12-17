/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, MenuItem, DialogActions, Button, Divider, CircularProgress, Backdrop } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from 'src/app/dashboard/loading';

// Define the shape of the initial values
interface InitialValues {
    province: string;
    district: string;
    ward: string;
    address: string;
    phones: string;
}

const API_BASE_URL = 'https://core-api.thehostie.com/region';

// Fetch provinces
const fetchProvinces = async () => {
    const response = await axios.get(`${API_BASE_URL}/provinces`);
    return response.data.data || [];
};

// Fetch districts based on province code
const fetchDistricts = async (provinceCode: string) => {
    const response = await axios.get(`${API_BASE_URL}/districts/${provinceCode}`);
    return response.data.data || [];
};

// Fetch wards based on district code
const fetchWards = async (districtCode: string) => {
    const response = await axios.get(`${API_BASE_URL}/wards/${districtCode}`);
    return response.data.data || [];
};

// Validation schema
const validationSchema = Yup.object().shape({
    province: Yup.string().required('Tỉnh/ Thành Phố là bắt buộc'),
    district: Yup.string().required('Quận/ Huyện là bắt buộc'),
    ward: Yup.string().required('Xã/ Phường là bắt buộc'),
    address: Yup.string().required('Địa chỉ cụ thể là bắt buộc'),
    phones: Yup.string()
        .required('Số điện thoại cụ thể là bắt buộc')
        .matches(/^0\d{9}$/, 'Số điện thoại không hợp lệ, vui lòng nhập lại!'),
});

interface Step1Props {
    onSubmit: (data: InitialValues) => void;
    initialValues?: InitialValues;
}

export default function UpdateStep1({ onSubmit, initialValues }: Step1Props) {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<InitialValues>({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
    });
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const selectedProvince = useDebouncedValue(watch('province'), 300);
    const selectedDistrict = useDebouncedValue(watch('district'), 300);
    // Custom hook for debouncing values
    function useDebouncedValue(value: any, delay: number) {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const handler = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(handler); // Cleanup on unmount
        }, [value, delay]);

        return debouncedValue;
    }
    // Fetch all data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const provincesData = await fetchProvinces();
                setProvinces(provincesData);
                if (initialValues?.province) {
                    const districtsData = await fetchDistricts(initialValues.province);
                    setDistricts(districtsData);
                    if (initialValues.district) {
                        const wardsData = await fetchWards(initialValues.district);
                        setWards(wardsData);
                    }
                }
            } catch (err: any) {
                setError('Có lỗi xảy ra khi tải dữ liệu.');
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [initialValues]);
    // Fetch istricts when the province changes
    useEffect(() => {
        const loadDistricts = async () => {
            if (!selectedProvince || selectedProvince === initialValues?.province) return; // Avoid refetching

            try {
                const districtsData = await fetchDistricts(selectedProvince);
                setDistricts(districtsData);
                setWards([]); // Reset wards when province changes
                setValue('district', ''); // Reset district
                setValue('ward', ''); // Reset ward
            } catch (err: any) {
                console.error('Error fetching districts:', err);
            }
        };
        loadDistricts();
    }, [selectedProvince, setValue]);

    // Fetch wards when the district changes
    useEffect(() => {
        const loadWards = async () => {
            if (!selectedDistrict || selectedDistrict === initialValues?.district) return; // Avoid refetching

            try {
                const wardsData = await fetchWards(selectedDistrict);
                setWards(wardsData);
                setValue('ward', ''); // Reset ward when district changes
            } catch (err: any) {
                console.error('Error fetching wards:', err);
            }
        };

        loadWards();
    }, [selectedDistrict, setValue]);

    // Handle form submission
    const onFormSubmit = (data: InitialValues) => {
        onSubmit(data);
    };
    return (
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate autoComplete="off">
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box display="flex" flexWrap="nowrap" gap={2} width="100%" sx={{
                '@media (max-width: 600px)': { flexWrap: 'wrap' },
            }}>
                {/* Province Selection */}
                <TextField
                    select
                    label="Tỉnh/ Thành Phố"
                    error={!!errors.province}
                    helperText={errors.province?.message}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: 150 }}
                    {...register('province')}
                    defaultValue={selectedProvince || ''}
                >
                    <MenuItem value="" disabled>
                        Chọn Tỉnh/ Thành Phố
                    </MenuItem>
                    {provinces.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            {option.full_name}
                        </MenuItem>
                    ))}
                </TextField>

                {/* District Selection */}
                <TextField
                    select
                    label="Quận/ Huyện"
                    error={!!errors.district}
                    helperText={errors.district?.message}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: 150 }}
                    {...register('district')}
                    defaultValue={initialValues?.district || ''}
                    onChange={(e) => setValue('district', (e.target.value))}
                >
                    <MenuItem value="" disabled>
                        Chọn Quận/ Huyện
                    </MenuItem>
                    {districts.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            {option.full_name}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Ward Selection */}
                <TextField
                    select
                    label="Xã/ Phường"
                    error={!!errors.ward}
                    helperText={errors.ward?.message}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: 150 }}
                    {...register('ward')}
                    defaultValue={initialValues?.ward || ''}
                    onChange={(e) => setValue('ward', (e.target.value))}
                >
                    <MenuItem value="" disabled>
                        Chọn Xã/ Phường
                    </MenuItem>
                    {wards.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            {option.full_name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Address and Phone Fields */}
            <TextField
                label="Địa chỉ cụ thể"
                variant="outlined"
                fullWidth
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                margin="normal"
            />

            <TextField
                label="Số điện thoại cụ thể"
                variant="outlined"
                fullWidth
                {...register('phones')}
                error={!!errors.phones}
                helperText={errors.phones?.message}
                margin="normal"
            />

            <Divider sx={{ marginTop: 3 }} />
            <DialogActions >
                <Button type="submit" variant="contained" color="primary">
                    Cập nhật
                </Button>
            </DialogActions>
        </Box>
    );
}
