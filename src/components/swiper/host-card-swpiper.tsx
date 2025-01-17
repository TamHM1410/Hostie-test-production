/// @hook
import React, { useRef, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
/// @next
import Image from 'next/image';

//  @mui
import { Box } from '@mui/material';
/// @swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, EffectCards } from 'swiper/modules';
/// @api
import { findAllPackage } from 'src/api/pagekages';
//  @component
import PricingCard from 'src/sections/pricing/pricing-card';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import './swiper-card.css';

export default function HostPackageCard() {
  const { data = [] } = useQuery({
    queryKey: ['packageList'],
    queryFn: async () => {
      const rs = await findAllPackage();
      return rs?.data?.result;
    },
  });

  const listPack = useMemo(() => {
    if (data && Array.isArray(data)) {
      const rs: any = data.filter(
        (item: any) => typeof item?.name === 'string' && item?.name?.includes('HOST')
      );
      return rs;
    }
  }, [data]);

  return (
    <>
      <Box>
        <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]} className="mySwiper">
          {listPack &&
            Array.isArray(listPack) &&
            listPack.length > 0 &&
            listPack.map((item: any, index: any) => {
              return (
                <SwiperSlide className="    " key={item?.id || index}>
                  <PricingCard
                    card={item}
                    index={index}
                    style={{ backgroundColor: 'rgb(192 221 255)', width: '100%' }}
                    packageId={item?.id}
                    type="normal"
                  />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </Box>
    </>
  );
}
