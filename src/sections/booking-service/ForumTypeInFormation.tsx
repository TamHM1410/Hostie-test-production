import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { BathroomOutlined, BedOutlined, BedroomParentOutlined, LinkOutlined, PhoneOutlined, VerifiedUserOutlined } from "@mui/icons-material";
import { Divider, Typography, Link as MUILink, Box, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Tooltip, IconButton } from "@mui/material";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useBooking } from 'src/auth/context/service-context/BookingContext';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BookingFormDialog from './BookingDialogForm';
import HoldingFormDialog from './HoldingForm';
import DatePickerForm from './BooingFormOnInFor';
import { formattedAmount } from 'src/utils/format-time';


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
    const { fetchResidenceInfor, residenceInfor, fetchPolicy, policy, customerList, fetchImages, images, priceQuotation, fetchPriceQuotation, handleBookingSubmit, handleHoldingSubmit } = useBooking()
    const [actionType, setActionType] = useState<'book' | 'hold' | null>(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    const handleAction = (type: 'book' | 'hold') => {
        setActionType(type);
        setOpenDatePicker(true);
    };

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleNext = async () => {

        setOpenDatePicker(false);
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
        fetchResidenceInfor(219)
        fetchPolicy(219)
        fetchImages(219)
    }, [])
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (residenceInfor?.phones[0]?.phone) {
            navigator.clipboard.writeText(residenceInfor?.phones[0]?.phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset trạng thái sau 2 giây
        }
    };
    const handleCopy2 = () => {
        if (residenceInfor?.residence_address) {
            navigator.clipboard.writeText(residenceInfor?.residence_address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset trạng thái sau 2 giây
        }
    };

    return (
        <Paper style={{
            padding: '20px',
            margin: '20px 0',
            border: '1px solid #E0E0E0', // Light grey border
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}>
            <Grid container spacing={0} justifyContent="center" alignItems="center">
                <Grid item xs={12} lg={6}>
                    <Box flex={1}>
                        <Typography fontWeight='bold' fontSize='20px' sx={{ display: 'flex', gap: 1, }} >
                            Tên nơi lưu trú :   <Typography fontSize='20px' > {residenceInfor?.residence_name}</Typography>
                        </Typography>
                        <Box display="flex" flexWrap="wrap" alignItems="center" gap={4} mt={2}>
                            <Tooltip
                                title={copied ? 'Đã sao chép' : 'Sao chép số điện thoại'}
                            >
                                <Typography onClick={handleCopy} sx={{
                                    display: 'flex', gap: 1, color: 'inherit',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'transparent', // Xóa background khi hover vào số điện thoại/ Chỉ hiển thị gạch chân khi hover

                                    },
                                }} >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'inherit',
                                            '&:hover': {
                                                textDecoration: 'underline', // Chỉ hiển thị gạch chân khi hover

                                            },
                                        }}
                                    >
                                        {residenceInfor?.phones[0]?.phone}
                                    </Typography>
                                    <PhoneOutlined sx={{ color: '#2152FF' }} />
                                </Typography>
                            </Tooltip>

                            <Divider orientation="vertical" flexItem />
                            <MUILink
                                href={residenceInfor?.residence_website || "https://www.facebook.com/"}
                                variant="body1"
                                underline="hover"
                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                                target="_blank"  // Mở liên kết trong tab mới
                                rel="noopener noreferrer"  // Bảo mật khi dùng target="_blank"
                            >
                                Link hình ảnh  <LinkOutlined style={{ color: '#2152FF' }} />
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

                        <Tooltip
                            title={copied ? 'Đã sao chép địa chỉ' : 'Sao chép địa chỉ'}
                            placement='left'
                        >
                            <Typography onClick={handleCopy2} sx={{
                                display: 'flex', gap: 1, color: 'inherit', cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'transparent', // Xóa background khi hover vào số điện thoại/ Chỉ hiển thị gạch chân khi hover

                                },
                            }} >
                                <Typography variant="body1" mt={2}>
                                    <Typography

                                        sx={{
                                            display: 'flex', gap: 1, color: 'inherit',
                                            '&:hover': {
                                                textDecoration: 'underline', // Chỉ hiển thị gạch chân khi hover

                                            },
                                        }}

                                    >
                                        <Typography fontWeight='bold' >Địa chỉ :</Typography  >  {residenceInfor?.residence_address}
                                    </Typography>
                                </Typography>
                            </Typography>
                        </Tooltip>
                        <Typography variant="body1" mt={2}>
                            <Typography

                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                            >
                                <Typography fontWeight='bold'>Loại lưu trú :</Typography >  {residenceInfor?.residence_type}
                            </Typography>
                        </Typography>

                        <Typography variant="body1" mt={2} sx={{ display: 'flex', gap: 1, color: 'inherit' }}>
                            <Typography fontWeight='bold'>Phụ thu nếu quá số lượng khách tiêu chuẩn :</Typography >  {formattedAmount(residenceInfor?.extra_guest_fee)} / 1 người
                        </Typography>
                        <Typography variant="body1" mt={2} sx={{ display: 'flex', gap: 1, color: 'inherit' }}>
                            <Typography fontWeight='bold'>Ghi chú và miêu tả :</Typography >  {residenceInfor?.residence_description || 'Không có'}
                        </Typography>
                        <Grid container spacing={2} mt={1}>
                            {residenceInfor?.amenities?.map((ani: any, index: any) => (
                                <Grid item key={index}>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <img src={ani.icon} height={25} alt={ani.name} /> {ani.name}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                        <Grid container spacing={1} mt={2} columns={12}>
                            {/* Phòng ngủ */}
                            <Grid item xs={4}>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <BedroomParentOutlined color="primary" /> {residenceInfor?.num_of_bedrooms} phòng ngủ
                                </Typography>
                            </Grid>

                            {/* Giường ngủ */}
                            <Grid item xs={4}>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <BedOutlined color="primary" /> {residenceInfor?.num_of_beds} giường ngủ
                                </Typography>
                            </Grid>

                            {/* Phòng tắm */}
                            <Grid item xs={4}>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <BathroomOutlined color="primary" /> {residenceInfor?.num_of_bathrooms} Nhà vệ sinh
                                </Typography>
                            </Grid>

                            {/* Tiêu chuẩn */}
                            <Grid item xs={4}>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <VerifiedUserOutlined color="primary" /> Tiêu chuẩn: {residenceInfor?.standard_num_guests} người
                                </Typography>
                            </Grid>

                            {/* Tối đa */}
                            <Grid item xs={4}>
                                <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                    <VerifiedUserOutlined color="primary" /> Tối đa: {residenceInfor?.max_guests} người
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
                    <Box width="100%" mt={2} overflow="hidden" borderRadius="8px" height="250px">
                        <Slider {...settings}>
                            <div>
                                <Box display="flex">
                                    {images?.slice(0, 3).map((image, index) => (
                                        <Box key={index} flex={1} px={1}>
                                            <img
                                                src={image}
                                                alt={`tag ${index + 1}`}
                                                style={{
                                                    objectFit: 'cover',
                                                    objectPosition: 'center',
                                                    width: '100%',
                                                    height: '250px',
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </div>
                            <div>
                                <Box display="flex">
                                    {images?.slice(3, 6).map((image, index) => (
                                        <Box key={index} flex={1} px={1}>
                                            <img
                                                src={image}
                                                alt={`tag ${index + 1}`}
                                                style={{
                                                    objectFit: 'cover',
                                                    objectPosition: 'center',
                                                    width: '100%',
                                                    height: '250px',
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


            <DatePickerForm fetchPriceQuotation={fetchPriceQuotation} residence_id={residenceInfor?.residence_id} setEndDate={setEndDate} setStartDate={setStartDate} openDatePicker={openDatePicker} handleNext={handleNext} setOpenDatePicker={setOpenDatePicker} />



            {/* Dialog form đặt hoặc giữ */}

            {actionType === 'book' && (
                <BookingFormDialog
                    fetchPriceQuotation={fetchPriceQuotation}
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
