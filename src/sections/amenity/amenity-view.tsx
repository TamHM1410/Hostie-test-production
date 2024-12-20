'use client';

//
///hook
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BookingDetails from '../overview/booking/booking-details';
import { Grid, Typography, Box } from '@mui/material';
import {getAllRolesApi} from 'src/api/users';
import { useSession } from 'next-auth/react';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen} from 'src/components/loading-screen';
import AmenityTable from './amenity-table';
import { finAllAmenity } from 'src/api/amenity';
import AddNewModal from './add-new-modal';
export default function AmenityView() {
  const {data:session}=useSession()
  const { data, isLoading } = useQuery({
    queryKey: ['amenityList'],

    queryFn: () =>  finAllAmenity(),
    
  });

  if (isLoading) {
    return (
      <>
        <LoadingScreen/>
      </>
    );
  }

  return (
    <>
      <Box>
        <CustomBreadcrumbs
          heading="Tiện ích"
          links={[{ name: '' }]}
          sx={{
            mb: { xs: 3, md: 5 },
            px:5
          }}
        />
        <Box sx={{  px: 5 }}>
          <AddNewModal/>
        
        </Box>
        <Box sx={{ py: 5, px: 5 }}>< AmenityTable data={data}/></Box>
      </Box>
    </>
  );
}
