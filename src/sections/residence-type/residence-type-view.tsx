'use client';

/// @hook
import { useQuery } from '@tanstack/react-query';
import { useResidence } from 'src/api/useResidence';

//  @mui
import { Box } from '@mui/material';

//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

import ResidenceTable from './residence-type-table';
import ResidenceTypeAddNewModal from './residence-type-addnew';

//  @api function

export default function ResidenceView() {
  const { getAllResidenceType } = useResidence();

  const { data, isLoading } = useQuery({
    queryKey: ['residenceTypeList'],
    queryFn: () => getAllResidenceType(),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Loại căn hộ"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px: 5,
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
