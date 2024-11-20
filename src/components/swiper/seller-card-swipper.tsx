/// @hook
import React, { useRef, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
/// @next

// @mui
import { Box } from '@mui/material';
/// @swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative ,EffectCards} from 'swiper/modules';

/// @api
import { findAllPackage } from 'src/api/pagekages';
// @component
import PricingCard from 'src/sections/pricing/pricing-card';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import './swiper-card.css';
import { width } from '@mui/system';

export default function SellerPackageCard() {
  const [listPackage, setListPackage] = useState<any>([
    {
      subscription: '',
      price: 0,
      caption: '',
      lists: [''],
      labelAction: '',
    },
  ]);

  const { data = [], isLoading } = useQuery({
    queryKey: ['packageList'],
    queryFn: async () =>{
      const rs=await  findAllPackage()
      return rs
    },
  });

  const card = {
    subscription: 'basic',
    price: 2000,
    caption: '6g chill',
    lists: ['jdosjdos', 'vltk'],
    labelAction: 'choose',
  };

  const listPack = useMemo(() => {
    if (data && Array.isArray(data)) {
      let rs = data.filter(
        (item:any) => typeof item?.name === 'string' && item?.name?.includes('SELLER')
      );
      return rs;
    }
  }, [data]);

  return (
    <>
      <Box sx={{width:'100%'}}>
        <Swiper
     
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
        >
          
          {listPack&&Array.isArray(listPack)&&listPack.length>0 && listPack.map((item:any,index:any)=>{
            return <>
             <SwiperSlide className="    " >
            <PricingCard card={item} index={index} style={{ backgroundColor: '#CAF4FF' ,width:'100%'}} packageId={item?.id}/>
          </SwiperSlide>
            
            
            </>
          })}
         
     
        </Swiper>
      </Box>
    </>
  );
}
