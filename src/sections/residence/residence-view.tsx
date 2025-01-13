'use client';

//  @hook

import { useQuery } from '@tanstack/react-query';
import { useResidence } from 'src/api/useResidence';

//  @mui
import { Box } from '@mui/material';

//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import ResidenceTable from './residence-table';

export default function ResidenceManagementView() {
  const {getAllResidence}=useResidence() 

  const {data,isLoading}=useQuery({
    queryKey:["residences"],
    queryFn:()=>getAllResidence()
  })

  if(isLoading) return <LoadingScreen/>

    return (
    <Box>
      <CustomBreadcrumbs
        heading="Quản lý căn hộ"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px: 5,
        }}
      />
      <ResidenceTable data={data} />
    </Box>
  );
}
