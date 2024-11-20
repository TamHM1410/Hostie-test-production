import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { BathroomOutlined, BedOutlined, BedroomParentOutlined, FireTruckOutlined, HomeOutlined, LinkOutlined, PhoneOutlined, VerifiedUserOutlined } from "@mui/icons-material";
import { Divider, Typography, Link as MUILink, Box, Grid, Paper } from "@mui/material";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useBooking } from 'src/auth/context/service-context/BookingContext';

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
    const { fetchResidenceInfor, residenceInfor } = useBooking()
    console.log(residenceInfor);


    useEffect(() => {
        fetchResidenceInfor(149)
    }, [])

    return (
        <Paper style={{ padding: '20px', margin: '20px 0' }}>
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
                            >
                                Google Drive <LinkOutlined style={{ color: '#2152FF' }} />
                            </MUILink>
                            <Divider orientation="vertical" flexItem />
                            <MUILink
                                href="/"
                                variant="body1"
                                underline="hover"
                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                            >
                                Zalo <LinkOutlined style={{ color: '#2152FF' }} />
                            </MUILink>
                        </Box>
                        <Typography variant="body1" mt={4}>
                            <Typography

                                sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                            >
                                <Typography fontWeight='bold'>Địa chỉ :</Typography >  {residenceInfor?.residence_address}
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
        </Paper>
    );
}
