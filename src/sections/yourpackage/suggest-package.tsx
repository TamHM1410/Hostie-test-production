// components/SuggestPackage.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';
import { Box, Typography } from '@mui/material';
// import SuggestPackage from './suggest-package';
import PricingCard from '../pricing/pricing-card';

const SuggestPackage = ({ data }: any) => {
  return (
    <>
      <Box sx={{ pb: 5, px: 8 }}>
        <Typography variant="h4"> Gói có thể nâng cấp</Typography>
      </Box>
      <Box sx={{ px: 5 }}>
        <Swiper
          spaceBetween={30}
          navigation={true} // Kích hoạt Navigation
          pagination={{
            type: 'progressbar',
          }} // Kết hợp với Progress Pagination
          modules={[Navigation, Pagination]}
          className="navigationSwiper"
        >
          {Array.isArray(data) &&
            data.length > 0 &&
            data.map((item: any, index: any) => {
              return (
                <SwiperSlide>
                  {' '}
                  <PricingCard
                    card={item?.newPackage}
                    packageId={item?.newPackage?.id}
                    upgradeCost={item?.upgradeCost}
                    type="upgrade"
                  />
                </SwiperSlide>
              );
            })} 
            {Array.isArray(data) &&
            data.length === 0 && <Box sx={{px:3}}>
              Hiện không có gói phù hợp cho bạn
            </Box>
              
            }
        </Swiper>
      </Box>
    </>
  );
};

export default SuggestPackage;
