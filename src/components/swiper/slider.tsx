import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './swiper-slider.css';
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';

export default function SwiperSlider({images}:any) {
  return (
    <Box sx={{ height: 'auto' }}>
      <Swiper
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {Array.isArray(images) && images.length > 0 && images.map((item, index) => (
          <SwiperSlide key={index}>
            <Image 
              src={item?.url} 
              alt=''
              width={800}    // Tăng kích thước ảnh
              height={600}   // Tăng kích thước ảnh
              quality={100}  // Tăng chất lượng ảnh (0-100)
              priority      // Ưu tiên tải ảnh này
              style={{
                objectFit: 'contain',  // hoặc 'cover' tùy nhu cầu
                width: '100%',
                height: '100%'
              }}
            />
          </SwiperSlide>
        ))}
        {Array.isArray(images) && images.length === 0 && 
          <SwiperSlide>Chưa có hình ảnh chứng minh</SwiperSlide>
        }
      </Swiper>
    </Box>
  );
}