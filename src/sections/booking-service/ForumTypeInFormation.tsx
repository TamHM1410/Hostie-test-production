import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { BathroomOutlined, BedOutlined, BedroomParentOutlined, LinkOutlined, PhoneOutlined, VerifiedUserOutlined } from "@mui/icons-material";
import { Divider, Typography, Link as MUILink, Box, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useBooking } from 'src/auth/context/service-context/BookingContext';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BookingFormDialog from './BookingDialogForm';
import HoldingFormDialog from './HoldingForm';

const data = {
    name: "Luxury Villa by the Sea",
    phoneNumber: "0773828226",
    address: {
        address: "123 Ocean Drive, Beach City, BC 12345",
    },
    num_of_bedrooms: 3,
    max_guests: 6,
    images: [
        "https://tuankietvilla.com/wp-content/uploads/2022/12/villa-la-gi-01.jpg",
        "https://xaydungsaoviet.com.vn/wp-content/uploads/2023/04/biet-thu-dep.jpg",
        "https://tuankietvilla.com/wp-content/uploads/2022/12/villa-la-gi-01.jpg",
        "https://xaydungsaoviet.com.vn/wp-content/uploads/2023/04/biet-thu-dep.jpg",
        "https://tuankietvilla.com/wp-content/uploads/2022/12/villa-la-gi-01.jpg",
        "https://xaydungsaoviet.com.vn/wp-content/uploads/2023/04/biet-thu-dep.jpg",
    ],
};

export default function ForumTypeInFormation() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    const { fetchResidenceInfor, residenceInfor, fetchPolicy, policy, customerList, priceQuotation, fetchPriceQuotation, handleBookingSubmit, handleHoldingSubmit } = useBooking()
    const [actionType, setActionType] = useState<'book' | 'hold' | null>(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    const formik = useFormik({
        initialValues: {
            checkin: null,
            checkout: null,

        },
        validationSchema: Yup.object({
            checkin: Yup.date().nullable().required('Vui lòng chọn ngày đến.'),
            checkout: Yup.date()
                .nullable()
                .required('Vui lòng chọn ngày rời đi.')
                .min(
                    Yup.ref('checkin'),
                    'Ngày rời đi phải sau ngày đến.'
                ),
        }),
        onSubmit: (values) => {
            console.log('Form values:', values);
            alert(
                actionType === 'book'
                    ? 'Đặt ngay thành công!'
                    : 'Giữ ngay thành công!'
            );
            setOpenForm(false);
        },
    });

    const handleAction = (type: 'book' | 'hold') => {
        setActionType(type);
        setOpenDatePicker(true);
    };
    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0'); // Lấy ngày, đảm bảo 2 chữ số
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng, đảm bảo 2 chữ số
        const year = date.getFullYear(); // Lấy năm
        return `${day}-${month}-${year}`; // Kết hợp thành định dạng dd-mm-yyyy
    };

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const handleNext = async () => {
        setOpenDatePicker(false);
        await fetchPriceQuotation(startDate, endDate, residenceInfor?.residence_id)
        setOpenForm(true);
    };

    const onSubmitHolding = (values: { expire: number }) => {
        if (!startDate && !endDate) return;

        // Extract the necessary data
        const { expire } = values;

        // Pass all necessary values to the submission handler
        handleHoldingSubmit(residenceInfor.residence_id, startDate, endDate, expire);

        // Close the dialog after successful submission
        setOpenForm(false);
    };
    useEffect(() => {
        fetchResidenceInfor(149)
        fetchPolicy(188)
    }, [])

    return (
        <Paper style={{
            padding: '20px',
            margin: '20px 0',
            border: '1px solid #E0E0E0', // Light grey border
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} lg={6}>
                    <Box flex={1}>
                        <Typography fontWeight='bold' fontSize='20px' sx={{ display: 'flex', gap: 1, }} >
                            Tên nơi lưu trú :   <Typography fontSize='20px' > {residenceInfor?.residence_name}</Typography>
                        </Typography>
                        <Box display="flex" alignItems="center" gap={4} mt={4}>
                            <MUILink
                                href="/"
                                variant="body1"
                                underline="hover"
                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                            >
                                {residenceInfor?.phones[0]?.phone} <PhoneOutlined style={{ color: '#2152FF' }} />
                            </MUILink>
                            <Divider orientation="vertical" flexItem />
                            <MUILink
                                href={residenceInfor?.residence_website}
                                variant="body1"
                                underline="hover"
                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                                target="_blank"  // Mở liên kết trong tab mới
                                rel="noopener noreferrer"  // Bảo mật khi dùng target="_blank"
                            >
                                Google Drive <LinkOutlined style={{ color: '#2152FF' }} />
                            </MUILink>
                            <Divider orientation="vertical" flexItem />
                            <MUILink
                                href={policy?.files?.[0]?.file_url || "https://www.facebook.com/"} // Đúng cú pháp
                                variant="body1"
                                underline="hover"
                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                                target="_blank"  // Mở liên kết trong tab mới
                                rel="noopener noreferrer"  // Bảo mật khi dùng target="_blank"
                            >
                                Chính sách <LinkOutlined style={{ color: '#2152FF' }} />
                            </MUILink>
                        </Box>
                        <Typography variant="body1" mt={4}>
                            <Typography

                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                            >
                                <Typography fontWeight='bold'>Địa chỉ :</Typography >  {residenceInfor?.residence_address}
                            </Typography>
                        </Typography>
                        <Typography variant="body1" mt={4}>
                            <Typography

                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                            >
                                <Typography fontWeight='bold'>Loại lưu trú :</Typography >  {residenceInfor?.residence_type}
                            </Typography>
                        </Typography>
                        <Grid container spacing={2} mt={2}>
                            {residenceInfor?.amenities?.map((ani: any, index: any) => (
                                <Grid item key={index}>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <img src={ani.icon} height={25} alt={ani.name} /> {ani.name}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                        <Grid container spacing={2} mt={2}>


                            <Grid item>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <BedroomParentOutlined color='primary' /> {residenceInfor?.num_of_bedrooms}{' '}
                                    phòng ngủ
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <BedOutlined color='primary' />{residenceInfor?.num_of_beds} giường ngủ
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <BathroomOutlined color='primary' />  {residenceInfor?.num_of_bathrooms} phòng tắm
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <VerifiedUserOutlined color='primary' /> Tiêu chuẩn :{' '}
                                    {residenceInfor?.max_guests} người
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} mt={2}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAction('book')}
                                >
                                    Đặt ngay
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleAction('hold')}
                                >
                                    Giữ ngay
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Box
                        width="100%"
                        mt={2}
                        overflow="hidden"
                        borderRadius="8px"
                        height='250px'
                    >
                        <Slider {...settings}>
                            <div>
                                <Box display="flex">
                                    {data.images.slice(0, 3).map((image, index) => (
                                        <Box key={index} flex={1} px={1}>
                                            <img
                                                src={image}
                                                alt={`tag ${index + 1}`}
                                                style={{
                                                    objectFit: "cover",
                                                    objectPosition: "center",
                                                    width: "100%",
                                                    height: '250px'
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </div>
                            <div>
                                <Box display="flex">
                                    {data.images.slice(3, 6).map((image, index) => (
                                        <Box key={index} flex={1} px={1}>
                                            <img
                                                src={image}
                                                alt={`tag ${index + 1}`}
                                                style={{
                                                    objectFit: "cover",
                                                    objectPosition: "center",
                                                    width: "100%",
                                                    height: '250px'
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </div>
                        </Slider>
                    </Box>
                </Grid>
            </Grid>
            <Dialog open={openDatePicker} onClose={() => setOpenDatePicker(false)}>
                <DialogTitle>Chọn ngày</DialogTitle>
                <DialogContent sx={{ marginTop: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
                    {/* DatePicker for Checkin */}
                    <DatePicker
                        label="Ngày đến"
                        value={formik.values.checkin}
                        onChange={(date) => {
                            formik.setFieldValue('checkin', date, true);
                            setStartDate(formatDate(date)); // Update startDate variable
                        }}
                        onBlur={formik.handleBlur}  // Mark the field as touched
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name="checkin"  // Ensure the name matches the field in initialValues
                                error={Boolean(formik.touched.checkin && formik.errors.checkin)}
                                helperText={formik.touched.checkin && formik.errors.checkin}
                                fullWidth
                                margin="normal"
                                sx={{

                                    '& .MuiInputBase-root': {
                                        borderRadius: '8px',
                                    },

                                }}
                            />
                        )}
                    />

                    {/* DatePicker for Checkout */}
                    <DatePicker
                        label="Ngày rời đi"
                        value={formik.values.checkout}
                        onChange={(date) => {
                            formik.setFieldValue('checkout', date, true);
                            setEndDate(formatDate(date)); // Update endDate variable
                        }}
                        onBlur={formik.handleBlur}  // Mark the field as touched
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name="checkout"  // Ensure the name matches the field in initialValues
                                error={Boolean(formik.touched.checkout && formik.errors.checkout)}
                                helperText={formik.touched.checkout && formik.errors.checkout}
                                fullWidth
                                margin="normal"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: '8px',
                                    },
                                }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => setOpenDatePicker(false)} color="secondary">
                        Hủy
                    </Button>
                    <Button
                        onClick={async () => {
                            // Trigger validation first
                            const isValid = await formik.validateForm();

                            // If the form is valid, proceed with the next step
                            if (Object.keys(isValid).length === 0) {
                                handleNext();
                            }
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Tiếp theo
                    </Button>
                </DialogActions>
            </Dialog>



            {/* Dialog form đặt hoặc giữ */}

            {actionType === 'book' && (
                <BookingFormDialog
                    isBookingForm={openForm}
                    setIsBookingForm={setOpenForm}
                    selectedVillaName={residenceInfor?.residence_name}
                    priceQuotation={priceQuotation}
                    customerList={customerList}
                    startDate={startDate}
                    endDate={endDate}
                    selectionRange={residenceInfor}
                    handleBookingSubmit={handleBookingSubmit}
                />
            )}


            {actionType === 'hold' && (

                <HoldingFormDialog
                    isHoldingForm={openForm}
                    setIsHoldingForm={setOpenForm}
                    selectedVillaName={residenceInfor?.residence_name}
                    startDate={startDate}
                    endDate={endDate}
                    onSubmitHolding={onSubmitHolding}
                />

            )}

        </Paper>
    );
}
