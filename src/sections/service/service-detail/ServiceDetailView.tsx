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
import { Divider, Typography, Link as MUILink, Box, Grid, Paper, Tooltip } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axiosClient from 'src/utils/axiosClient';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { formattedAmount } from 'src/utils/format-time';

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
export default function ServiceDetail({ id }: ServiceDetailViewProps) {
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
  const [policy, setPolicy] = useState();
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

        const fetchedImages = response.data?.images.map((image: { image: string }) => image.image);
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    const fetchPolicy = async () => {
      try {
        const response = await axiosClient.get(
          `https://core-api.thehostie.com/residences/${id}/policy`,
          {}
        );

        if (response.status === 200) {
          const data1 = response.data;
          setPolicy(data1.data);
        } else {
          console.error('Failed to fetch residence data');
        }
      } catch (error) {
        console.error('Error fetching residence data:', error);
      }
    };

    const fetchResidenceData = async () => {
      try {
        const response = await axiosClient.get(
          `https://core-api.thehostie.com/residences/${id}`,
          {}
        );
        setResidenceData(response.data);
      } catch (error) {
        console.error('Error fetching residence data:', error);
      }
    };

    fetchResidenceData();
    fetchImages();
    fetchPolicy();
  }, [id]);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (residenceData?.phones[0]?.phone) {
      navigator.clipboard.writeText(residenceData?.phones[0]?.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset trạng thái sau 2 giây
    }
  };
  const handleCopy2 = () => {
    if (residenceData?.residence_address) {
      navigator.clipboard.writeText(residenceData?.residence_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset trạng thái sau 2 giây
    }
  };

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
        <Paper
          style={{
            padding: '20px',
            margin: '20px 0',
            border: '1px solid #E0E0E0', // Light grey border
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
          }}
        >
          <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Grid item xs={12} lg={6}>
              <Box flex={1}>
                <Typography fontWeight="bold" fontSize="20px" sx={{ display: 'flex', gap: 1 }}>
                  Tên nơi cư trú :{' '}
                  <Typography fontSize="20px"> {residenceData?.residence_name}</Typography>
                </Typography>
                <Box display="flex" flexWrap="wrap" alignItems="center" gap={4} mt={2}>
                  <Tooltip title={copied ? 'Đã sao chép' : 'Sao chép số điện thoại'}>
                    <Typography
                      onClick={handleCopy}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        color: 'inherit',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'transparent', // Xóa background khi hover vào số điện thoại/ Chỉ hiển thị gạch chân khi hover
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'inherit',
                          '&:hover': {
                            textDecoration: 'underline', // Chỉ hiển thị gạch chân khi hover
                          },
                        }}
                      >
                        {residenceData?.phones[0]?.phone}
                      </Typography>
                      <PhoneOutlined sx={{ color: '#2152FF' }} />
                    </Typography>
                  </Tooltip>
                  <Divider orientation="vertical" flexItem />
                  <MUILink
                    href={residenceData.residence_website || 'https://www.facebook.com/'}
                    variant="body1"
                    underline="hover"
                    sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                    target="_blank" // Mở liên kết trong tab mới
                    rel="noopener noreferrer" // Bảo mật khi dùng target="_blank"
                  >
                    Link hình ảnh <LinkOutlined style={{ color: '#2152FF' }} />
                  </MUILink>
                  <Divider orientation="vertical" flexItem />
                  <MUILink
                    href={policy?.files?.[0]?.file_url || 'https://www.facebook.com/'} // Đúng cú pháp
                    variant="body1"
                    underline="hover"
                    sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                    target="_blank" // Mở liên kết trong tab mới
                    rel="noopener noreferrer" // Bảo mật khi dùng target="_blank"
                  >
                    Chính sách <LinkOutlined style={{ color: '#2152FF' }} />
                  </MUILink>
                </Box>

                <Tooltip
                  title={copied ? 'Đã sao chép địa chỉ' : 'Sao chép địa chỉ'}
                  placement="left"
                >
                  <Typography
                    onClick={handleCopy2}
                    sx={{
                      display: 'flex',
                      gap: 1,
                      color: 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'transparent', // Xóa background khi hover vào số điện thoại/ Chỉ hiển thị gạch chân khi hover
                      },
                    }}
                  >
                    <Typography variant="body1" mt={2}>
                      <Typography
                        sx={{
                          display: 'flex',
                          gap: 1,
                          color: 'inherit',
                          '&:hover': {
                            textDecoration: 'underline', // Chỉ hiển thị gạch chân khi hover
                          },
                        }}
                      >
                        <Typography fontWeight="bold">Địa chỉ :</Typography>{' '}
                        {residenceData?.residence_address}
                      </Typography>
                    </Typography>
                  </Typography>
                </Tooltip>
                <Typography variant="body1" mt={2}>
                  <Typography sx={{ display: 'flex', gap: 1, color: 'inherit' }}>
                    <Typography fontWeight="bold">Loại lưu trú :</Typography>{' '}
                    {residenceData?.residence_type}
                  </Typography>
                </Typography>
                <Typography
                  variant="body1"
                  mt={2}
                  sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                >
                  <Typography fontWeight="bold">Mã giới thiệu cho quản gia:</Typography>{' '}
                  {residenceData?.housekeeper_registration_code}
                </Typography>
                <Typography
                  variant="body1"
                  mt={2}
                  sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                >
                  <Typography fontWeight="bold">
                    Phụ thu nếu quá số lượng khách tiêu chuẩn :
                  </Typography>{' '}
                  {formattedAmount(residenceData?.extra_guest_fee)} / 1 người
                </Typography>
                <Typography
                  variant="body1"
                  mt={2}
                  sx={{ display: 'flex', gap: 1, color: 'inherit' }}
                >
                  <Typography fontWeight="bold">Ghi chú và miêu tả :</Typography>{' '}
                  {residenceData?.residence_description}
                </Typography>
                <Grid container spacing={2} mt={1}>
                  {residenceData?.amenities?.map((ani: any, index: any) => (
                    <Grid item key={index}>
                      <Typography
                        variant="body1"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <img src={ani.icon} height={25} alt={ani.name} /> {ani.name}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                <Grid container spacing={1} mt={2} columns={12}>
                  {/* Phòng ngủ */}
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                      <BedroomParentOutlined color="primary" /> {residenceData.num_of_bedrooms}{' '}
                      Phòng ngủ
                    </Typography>
                  </Grid>

                  {/* Giường ngủ */}
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                      <BedOutlined color="primary" /> {residenceData.num_of_beds} Giường ngủ
                    </Typography>
                  </Grid>

                  {/* Phòng tắm */}
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                      <BathroomOutlined color="primary" /> {residenceData.num_of_bathrooms} Phòng tắm

                    </Typography>
                  </Grid>

                  {/* Tiêu chuẩn */}
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                      <VerifiedUserOutlined color="primary" /> Tiêu chuẩn:{' '}
                      {residenceData.standard_num_guests} người
                    </Typography>
                  </Grid>

                  {/* Tối đa */}
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
                      <VerifiedUserOutlined color="primary" /> Tối đa: {residenceData.max_guests}{' '}
                      Người
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
                      {images.slice(0, 3).map((image, index) => (
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
                      {images.slice(3, 6).map((image, index) => (
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
        </Paper>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
