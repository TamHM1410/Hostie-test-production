'use client';

/// @hook
import { useQuery } from '@tanstack/react-query';

//  @mui
import { Box } from '@mui/material';

//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { SplashScreen } from 'src/components/loading-screen';
import { findAllResidenceType } from 'src/api/residence';

import ResidenceTable from './residence-type-table';
import ResidenceTypeAddNewModal from './residence-type-addnew';

//  @api function

export default function ResidenceView() {
  const { data, isLoading } = useQuery({
    queryKey: ['residenceTypeList'],
    queryFn: () => findAllResidenceType(),
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Loại căn hộ"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px:5
        }}
      />
      <Box sx={{ px: 5 }}>
        <ResidenceTypeAddNewModal />
      </Box>
      <Box sx={{ py: 5, px: 5 }}>
        <ResidenceTable data={data} />
      </Box>
    </Box>
  );
}
