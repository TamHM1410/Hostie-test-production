/* eslint-disable react-hooks/exhaustive-deps */

'use client';

/* eslint-disable radix */

//  @hook
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettingsContext } from 'src/components/settings';
import { useServiceContext } from 'src/auth/context/residences-context/ResidencesContext';
import { useDropzone, Accept } from 'react-dropzone';



//  @mui

import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    Typography,
    Container,
    Box
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';


//  @lib
import { formatDate } from 'src/utils/format-time';
import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';


//  @component
import ServiceCard from './ServiceCard';
import Step0 from './CreateStep0';
import Step1 from './CreateStep1';
import Step3 from './CreateStep3';
import Step2 from './CreateStep2';
import Step4 from './CreateStep4';
import CreatePolicy from './CreateStep3-2';

const policyTemplate = `
🏨 Chính Sách Khách Sạn Paradise

⏰ Thời gian nhận phòng và trả phòng
- Nhận phòng: sau 14:00
- Trả phòng: trước 12:00
`;


const typeOfServices = [
    { value: 1, label: 'Hotel' },
    { value: 2, label: 'Villa' },
    { value: 3, label: 'Apartment' },
];

export default function ServiceView() {

    const router=useRouter()

    const { serviceData, totalPage, isLoading, fetchData } = useServiceContext();

    const settings = useSettingsContext();
    // Upload Image state
    const [images, setImages] = React.useState<File[]>([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImages((prevImages) => [...prevImages, ...acceptedFiles]);
        setSnackbarOpen(true);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*' as unknown as Accept,
    });
    const [isLoading2, setIsLoading2] = useState(false)
    // another state
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [idService, setIdService] = useState('');
    // Amenities state
    const [selectedAmenities, setSelectedAmenities] = React.useState([]);
    // Dialog state
    const [open, setOpen] = React.useState(false);
    // Fetch data from API with pagination and search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchData(currentPage, searchTerm);
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [currentPage, searchTerm]);

    // Pagination handlers
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const [currentStep, setCurrentStep] = React.useState(0);
    // Dialog handlers
    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setCurrentStep(0);
        fetchData(1, '')
        localStorage.removeItem('step3Data');
        localStorage.removeItem('formValues');
        localStorage.removeItem('formValues2');
        setSelectedAmenities([]);
        setImages([]);
    };
    const nextStep = () => {
        if (currentStep < 5) {
            setCurrentStep((prev) => prev + 1);
        }
    };
    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleStep1Submit = async (data: any) => {
        setIsLoading2(true)
        if (!idService) {
            const payload = {
                step: 1,
                name: data.serviceName,
                num_bath_room: data.bathrooms,
                num_bed_room: data.bedrooms,
                num_of_beds: data.numOfBeds,
                max_guests: data.capacity,
                standard_num_guests: data.capacityStander,
                residence_description: data.description,
                extra_guest_fee: data.surcharge,
                type: parseInt(data.serviceType),
            };

            try {
                const response = await axiosClient.post('https://core-api.thehostie.com/residences', payload, {
                });
                setIdService(response.data?.id);
                nextStep();
                toast.success('Hoàn thành bước 1')
            } catch (error) {
                console.error('Error submitting step 1:', error);
                toast.error('Tên nơi lưu trú này đã được sử dụng.')
            } finally {
                setIsLoading2(false)
            }
        } else {
            const payload = {
                step: 1,
                id: parseInt(idService),
                name: data.serviceName,
                num_bath_room: data.bathrooms,
                num_bed_room: data.bedrooms,
                num_of_beds: data.numOfBeds,
                max_guests: data.capacity,
                standard_num_guests: data.capacityStander,
                residence_description: data.description,
                extra_guest_fee: data.surcharge,
                type: parseInt(data.serviceType),
            };

            try {
                const response = await axiosClient.post('https://core-api.thehostie.com/residences', payload, {

                });
                setIdService(response.data?.id);
                nextStep();
                toast.success('Hoàn thành bước 1')
            } catch (error) {
                console.error('Error submitting step 1:', error);
                toast.error('Tên nơi lưu trú này đã được sử dụng.')
            }
            finally {
                setIsLoading2(false)
            }
        }
    };

    const handleStep2Submit = async (data: any) => {
        setIsLoading2(true)
        const payload = {
            step: 2,
            id: parseInt(idService),
            province_code: data.province,
            district_code: data.district,
            ward_code: data.ward,
            address: data.address,
            phones: [data.phones],
        };

        try {
            const response = await axiosClient.post('https://core-api.thehostie.com/residences', payload, {

            });

            nextStep();
            toast.success('Hoàn thành bước 2')
        } catch (error) {
            console.error('Error submitting step 1:', error);
        } finally {
            setIsLoading2(false)
        }
    };

    const handleStep3Submit = async (data: any) => {
        setIsLoading2(true)
        const payload = {
            step: 3,
            id: parseInt(idService),
            amenities: selectedAmenities,
        };

        try {
            const response = await axiosClient.post('https://core-api.thehostie.com/residences', payload, {

            });

            nextStep();
            toast.success('Hoàn thành bước 3')
        } catch (error) {
            console.error('Error submitting step 1:', error);
        } finally {
            setIsLoading2(false)
        }
    };

    const handleStep4Submit = async (data: any) => {
        setIsLoading2(true)
        const payload = {
            step: 4,
            id: parseInt(idService),
            price_default: data.defaultPrice,
            price_weekend: data.weekendEntries.map((entry: any) => ({
                day: entry.weekendFee, // Assuming weekendFee represents the day or type of weekend
                price: parseFloat(entry.weekendSurcharge),
            })),
            price_special: [
                {
                    date: '20-10-2024', // Assuming this is the holiday date
                    price: 43,
                },
            ],
            price_season: data.seasonEntries.map((entry: any) => ({
                start_date: formatDate(entry.seasonFrom), // Adjusted to use entry data
                end_date: formatDate(entry.seasonTo), // Adjusted to use entry data
                price: parseFloat(entry.seasonSurcharge),
            })),
        };

        try {
            const response = await axiosClient.post('https://core-api.thehostie.com/residences', payload, {

            });

            nextStep();
            toast.success('Hoàn thành bước 4')
        } catch (error) {
            console.error('Error submitting step 3:', error);
        } finally {
            setIsLoading2(false)
        }
    };

    const handleStep5Submit = async (data: any) => {
        setIsLoading2(true)
        const formData = new FormData();
        formData.append('step', '5');
        formData.append('id', idService);
        images.forEach((file) => {
            formData.append('files', file);
        });
        try {
            const response = await axiosClient.post('https://core-api.thehostie.com/residences', formData, {

            });
            handleClose();
            fetchData(1, '');
            setIsLoading2(false)
            toast.success('Tạo nơi lưu trú thành công.');

        } catch (error) {
            console.log(error);

            if (error.status === 413) {
                toast.error('Tệp hình quá nặng không thể upload lên server')

            } else {

                toast.error('Đã có lỗi xảy ra')
            }

        }
        finally {
            setIsLoading2(false)
        }
    };

    const handleSavePolicy = async (files: File[]) => {
        setIsLoading2(true)
        const formData = new FormData();
        formData.append('policy', policyTemplate);
        formData.append('residence_id', idService);
        files.forEach((file) => {
            formData.append('files', file);
        });
        try {
            const response = await axiosClient.post('https://core-api.thehostie.com/residences/policy', formData, {

            });

            nextStep();
            toast.success('Hoàn thành bước 5')
        } catch (error) {
            toast.error('Đã có lỗi trong bước tạo chính sách')
        } finally {
            setIsLoading2(false)
        }


    };




    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Step0
                        onSubmit={handleStep1Submit}
                        currencies={typeOfServices}
                        currentStep={currentStep}
                        previousStep={previousStep}
                    />

                );
            case 1:
                return (
                    <Step1
                        onSubmit={handleStep2Submit}
                        currentStep={currentStep}
                        previousStep={previousStep}
                    />

                );

            case 2:
                return (
                    <Step2
                        selectedAmenities={selectedAmenities}
                        setSelectedAmenities={setSelectedAmenities}
                        currentStep={currentStep}
                        previousStep={previousStep}
                        onSubmit={handleStep3Submit}
                    />
                );
            case 3:
                return (
                    <Step3
                        onSubmit={handleStep4Submit}
                        currentStep={currentStep}
                        previousStep={previousStep}
                    />
                );
            case 4:
                return (
                    <CreatePolicy
                        currentStep={currentStep}
                        previousStep={previousStep}
                        onSave={handleSavePolicy}
                    />
                );
            case 5:
                return (
                    <Step4
                        currentStep={currentStep}
                        previousStep={previousStep}
                        images={images}
                        setImages={setImages}
                        snackbarOpen={snackbarOpen}
                        setSnackbarOpen={setSnackbarOpen}
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        onSubmit={handleStep5Submit}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Backdrop open={isLoading || isLoading2} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box display="flex" justifyContent="flex-end" sx={{gap:2}}>
            <Button
                    size="medium"
                    onClick={()=>router.push('/dashboard/service/cancel-policy')}
                    sx={{
                        background:
                            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(74,175,238,1) 0%, rgba(84,155,226,1) 37%, rgba(0,196,255,1) 100%)',
                        color: 'white',
                        '&:hover': {
                            background:
                                'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(74,175,238,1) 0%, rgba(84,155,226,1) 37%, rgba(0,196,255,1) 100%)',
                        },
                        marginBottom: 3,
                        paddingX: 2,
                    }}
                >
                  Chính sách hủy
                </Button>

                <Button
                    size="medium"
                    onClick={handleOpen}
                    sx={{
                        background:
                            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(74,175,238,1) 0%, rgba(84,155,226,1) 37%, rgba(0,196,255,1) 100%)',
                        color: 'white',
                        '&:hover': {
                            background:
                                'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(74,175,238,1) 0%, rgba(84,155,226,1) 37%, rgba(0,196,255,1) 100%)',
                        },
                        marginBottom: 3,
                        paddingX: 2,
                    }}
                >
                    + Thêm nơi lưu trú
                </Button>
            </Box>

            {serviceData.length === 0 ? <Typography sx={{ width: 'full', textAlign: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>Hãy bắt đầu tạo những nơi lưu trú nào !</Typography> :
                <>

                    <Box mb={2}>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm nơi lưu trú..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            fullWidth
                        />
                    </Box>


                    <ServiceCard
                        fetchData={fetchData}
                        currentItems={serviceData}
                        totalPages={totalPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        isLoading={isLoading2}
                        setIsLoading={setIsLoading2}
                    />
                </>
            }

            {/* Dialog */}
            <Dialog open={open} onClose={undefined} maxWidth="md">
                <DialogTitle>
                    <Typography fontSize={30} fontWeight="bold">
                        Tạo nơi lưu trú
                    </Typography>
                    <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 18 }}>
                        <CloseRounded />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <Divider sx={{ marginBottom: 2 }} />
                    {renderStepContent()}
                </DialogContent>
            </Dialog>
        </Container>
    );
}
