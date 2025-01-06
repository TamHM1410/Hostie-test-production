'use client';

//  @hook
import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { useAmenity } from 'src/api/useAmenity';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AmenityTable from './amenity-table';
import AddNewModal from './add-new-modal';
import { LoadingScreen } from 'src/components/loading-screen';
export default function AmenityView() {
  const { findAllAmenity } = useAmenity();
  const { data, isLoading } = useQuery({
    queryKey: ['amenityList'],

    queryFn: () => findAllAmenity(),
  });

  if (isLoading) {
    return (
      <>
        <LoadingScreen />
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
            px: 5,
          }}
        />
        <Box sx={{ px: 5 }}>
          <AddNewModal />
        </Box>
        <Box sx={{ py: 5, px: 5 }}>
          <AmenityTable data={data} />
        </Box>
      </Box>
    </>
  );
}
