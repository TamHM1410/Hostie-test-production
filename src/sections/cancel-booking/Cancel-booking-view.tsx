'use client'

import { Box,Step } from "@mui/material";

import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import HorizontalLinearStepper from "./Step";

export default function CancelBookingView() {
  return <>
  <Box>
    <CustomBreadcrumbs  heading="Chi tiết hủy đặt phòng"
        links={[{ name: '' }]}
        sx={{
          pt: 5,
          px: 5,
        }}/>
   <Box sx={{px:5}}>
    <HorizontalLinearStepper/>
     
    
   </Box>    


    
  </Box>
  </>;
}
