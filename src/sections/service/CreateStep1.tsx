import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, MenuItem, DialogActions, Button, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';

// Define API base URL
const API_BASE_URL = 'http://34.81.244.146:5005/region';

// Fetch provinces, districts, and wards
const fetchProvinces = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/provinces`);
        return response.data.data; // Assuming the data is in the response body
    } catch (error) {
        console.error('Error fetching provinces:', error);
        return [];
    }
};

const fetchDistricts = async (provinceCode: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/districts/${provinceCode}`);
        return response.data.data; // Assuming the data is in the response body
    } catch (error) {
        console.error('Error fetching districts:', error);
        return [];
    }
};

const fetchWards = async (districtCode: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/wards/${districtCode}`);
        return response.data.data; // Assuming the data is in the response body
    } catch (error) {
        console.error('Error fetching wards:', error);
        return [];
    }
};

// Define validation schema using Yup
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
    onSubmit: (data: any) => void; // Callback to handle form submission
    previousStep: () => void; // Function to go back to the previous step
    currentStep: number;
    initialValues?: any;
}

export default function Step1({ onSubmit, previousStep, currentStep, initialValues }: Step1Props) {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    // Fetch provinces on component mount
    useEffect(() => {
        const loadProvinces = async () => {
            const data = await fetchProvinces();
            setProvinces(data);
        };
        loadProvinces();
    }, []);

    // Load initial values from local storage if available
    useEffect(() => {
        const savedValues = localStorage.getItem('formValues2');
        if (savedValues) {
            const parsedValues = JSON.parse(savedValues);
            reset(parsedValues);
            setValue('province', parsedValues.province || '');
            setValue('district', parsedValues.district || '');
            setValue('ward', parsedValues.ward || '');
            setValue('address', parsedValues.address || '');
            setValue('phones', parsedValues.phones || '');

            // Fetch districts based on saved province
            const loadDistricts = async () => {
                const districtsData = await fetchDistricts(parsedValues.province);
                setDistricts(districtsData);
                // Fetch wards based on saved district
                const wardsData = await fetchWards(parsedValues.district);
                setWards(wardsData);
            };
            loadDistricts();
        } else if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const handleProvinceChange = async (e: React.ChangeEvent<{ value: unknown }>) => {
        const provinceCode = e.target.value as string;
        setValue('province', provinceCode);
        setValue('district', ''); // Reset district and ward
        setValue('ward', '');
        const data = await fetchDistricts(provinceCode);
        setDistricts(data);
        setWards([]); // Clear wards when province changes
    };

    const handleDistrictChange = async (e: React.ChangeEvent<{ value: unknown }>) => {
        const districtCode = e.target.value as string;
        setValue('district', districtCode);
        setValue('ward', ''); // Reset ward
        const data = await fetchWards(districtCode);
        setWards(data);
    };

    const handleWardChange = async (e: React.ChangeEvent<{ value: unknown }>) => {
        const wardCode = e.target.value as string;
        setValue('ward', wardCode);
    };
    useEffect(() => {
        const subscription = watch((value) => {
            localStorage.setItem('formValues2', JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const onFormSubmit = (data: any) => {
        onSubmit(data);
    };

    const provinceValue = watch('province');
    const districtValue = watch('district');
    const wardValue = watch('ward');

    return (
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate autoComplete="off">
            <Typography variant="h6">Địa chỉ nơi lưu trú</Typography>
            <Box display="flex" flexWrap="nowrap" gap={2} width="100%">
                <TextField
                    select
                    label="Tỉnh/ Thành Phố"
                    value={provinceValue || ''}
                    error={!!errors.province}
                    helperText={errors.province?.message}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: 150 }}
                    onChange={handleProvinceChange} // Handle change event
                >
                    {provinces.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Quận/ Huyện"
                    value={districtValue || ''}
                    error={!!errors.district}
                    helperText={errors.district?.message}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: 150 }}
                    onChange={handleDistrictChange} // Handle change event
                >
                    {districts.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Xã/ Phường"
                    value={wardValue || ''}
                    error={!!errors.ward}
                    helperText={errors.ward?.message}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: 150 }}
                    onChange={handleWardChange}
                >
                    {wards.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

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
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={previousStep} disabled={currentStep === 0}>
                    Trở lại
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={Object.keys(errors).length > 0}>
                    Tiếp theo
                </Button>
            </DialogActions>
        </Box>
    );
}
