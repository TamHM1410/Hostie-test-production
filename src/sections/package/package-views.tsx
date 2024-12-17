'use client';

//
///hook
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BookingDetails from '../overview/booking/booking-details';
import { Grid, Typography, Box } from '@mui/material';
import { getAllRolesApi } from 'src/api/users';
import { useSession } from 'next-auth/react';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen} from 'src/components/loading-screen';
import PackageTable from './package-table';
import { findAllPackage } from 'src/api/pagekages';
import AddNewPackage from './package-addnew-modal';
// import AddNewRoleModal from './role-addnew-modal';
export default function PackageView() {
  const { data: session } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ['packageList'],

    queryFn: () => findAllPackage(),
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
          heading="Gói dịch vụ"
          links={[{ name: '' }]}
          sx={{
            mb: { xs: 3, md: 5 },
            px:5
          }}
        />
        <Box sx={{ px: 5 }}>
          <AddNewPackage />
        </Box>
        <Box sx={{ py: 5, px: 5 }}>
          <PackageTable data={data} />
        </Box>
      </Box>
    </>
  );
}
