import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './swiper-card.css';

import { Pagination, Navigation, HashNavigation } from 'swiper/modules';

export default function ImageSlider() {
  return (
   
   <Box sx={{width:50,height:50}}>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
    <SwiperSlide>Slide 1</SwiperSlide>
    <SwiperSlide>Slide 2</SwiperSlide>
   
  </Swiper>
   </Box>
    
  );
}
