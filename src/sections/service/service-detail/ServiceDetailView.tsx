import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import {
    BathroomOutlined,
    BedOutlined,
    BedroomParentOutlined,
    LinkOutlined,
    PhoneOutlined,
    VerifiedUserOutlined,
} from '@mui/icons-material';
import { Divider, Typography, Link as MUILink, Box, Grid, Paper } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axiosClient from 'src/utils/axiosClient';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

interface ResidenceAddress {
    address: string;
}
interface ResidenceData {
    residence_name: string;
    phones: { phone: string }[];
    residence_address: string;
    num_of_bedrooms: number;
    max_guests: number;
    residence_website: string;
    num_of_bathrooms: number;
    num_of_beds: number;

}
interface ServiceDetailViewProps {
    id: any; // Assuming `id` is a number; change to string if needed.
}
export default function ServiceDetailView({ id }: ServiceDetailViewProps) {
    const [residenceData, setResidenceData] = useState<ResidenceData | null | any>(null);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    const [images, setImages] = useState<string[]>([]); // Changed to string array type

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axiosClient.get(
                    `https://core-api.thehostie.com/residences/${id}/images`,
                    {
                        params: {
                            page_size: 99,
                            last_id: 0,
                        },
                    }
                );

                const data1 = response.data;

                if (data1.success) {
                    const fetchedImages = data1.data.images.map((image: { image: string }) => image.image);
                    setImages(fetchedImages);
                } else {
                    console.error(data1.msg);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };



        const fetchResidenceData = async () => {
            try {
                const response = await axiosClient.get(`https://core-api.thehostie.com/residences/${id}`, {});

                if (response.status === 200) {
                    const data1 = response.data;
                    console.log(data1.data);
                    setResidenceData(data1.data);
                } else {
                    console.error('Failed to fetch residence data');
                }
            } catch (error) {
                console.error('Error fetching residence data:', error);
            }
        };

        fetchResidenceData();
        fetchImages();
    }, [id]);

    console.log(residenceData);

    return (
        <div>
            <CustomBreadcrumbs
                heading="Thông tin chi tiết nơi lưu trú"
                links={[{ name: '' }]}
                sx={{
                    mb: { xs: 3, md: 5 },
                    px: 1,
                }}
            />
            {residenceData ? (
                <Paper style={{
                    padding: '20px',
                    margin: '20px 0',
                    border: '1px solid #E0E0E0', // Light grey border
                    borderRadius: '8px', // Rounded corners
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
                }}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12} lg={6}>
                            <Box flex={1}>
                                <Typography fontWeight='bold' fontSize='20px' sx={{ display: 'flex', gap: 1, }} >
                                    Tên nơi cư trú :   <Typography fontSize='20px' > {residenceData.residence_name}</Typography>
                                </Typography>
                                <Box display="flex" alignItems="center" gap={4} mt={4}>
                                    <MUILink
                                        href="/"
                                        variant="body1"
                                        underline="hover"
                                        sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                                    >
                                        {residenceData.phones[0]?.phone} <PhoneOutlined style={{ color: '#2152FF' }} />
                                    </MUILink>
                                    <Divider orientation="vertical" flexItem />
                                    <MUILink
                                        href={residenceData.residence_website}
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
                                    <MUILink
                                        href="/"
                                        underline="hover"
                                        sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                                    >
                                        <Typography fontWeight='bold'>Địa chỉ :</Typography >  {residenceData.residence_address} <LinkOutlined style={{ color: '#2152FF' }} />
                                    </MUILink>
                                </Typography>
                                <Grid container spacing={2} mt={2}>
                                    {residenceData?.amenities?.map((ani: any, index: any) => (
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
                                            <BedroomParentOutlined color='primary' /> {residenceData.num_of_bedrooms}{' '}
                                            phòng ngủ
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                            <BedOutlined color='primary' />{residenceData.num_of_beds} giường ngủ
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                            <BathroomOutlined color='primary' />  {residenceData.num_of_bathrooms} phòng tắm
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                                            <VerifiedUserOutlined color='primary' /> Tiêu chuẩn :{' '}
                                            {residenceData.max_guests} người
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Box width="100%" mt={2} overflow="hidden" borderRadius="8px" height="250px">
                                <Slider {...settings}>
                                    <div>
                                        <Box display="flex">
                                            {images.slice(0, 2).map((image, index) => (
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
                                            {images.slice(3, 2).map((image, index) => (
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
                </Paper >
            ) : (
                <p>Loading...</p>
            )
            }
        </div >
    );
}
