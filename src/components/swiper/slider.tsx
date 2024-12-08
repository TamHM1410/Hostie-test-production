import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box } from '@mui/material';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './swiper-slider.css';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';

export default function SwiperSlider({images}:any) {
  return (
    <>
    <Box sx={{
        height:'40vh'
    }}>

    <Swiper
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {
            Array.isArray(images) && images.length >0 && images.map((item,index)=>{
                return (      
                  <SwiperSlide>
                    <Image src={item?.url} alt='' width={200} height={300} loading="eager"/>

                </SwiperSlide>
                )
            })
        }
        {
            Array.isArray(images) && images.length ===0 &&  <SwiperSlide>Chưa có hình ảnh chứng minh</SwiperSlide>
        }
       
      
     
      </Swiper>

    </Box>
     
    </>
  );
}
