//  @hook
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

//  @Mui
import { Box, Button } from '@mui/material';

//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { LoadingScreen } from 'src/components/loading-screen';
import ServicePolicyList from './service-policy-list';

//  @api
import { get_all_policy } from 'src/api/cancelPolicy';

export default function CancelPolicyView() {
  const { data, isLoading } = useQuery({
    queryKey: ['cancelPolicies'],
    queryFn: () => get_all_policy(),
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Box>
        <CustomBreadcrumbs
          heading="Chính sách hủy"
          links={[{ name: '' }]}
          sx={{
            mb: { xs: 3, md: 5 },
            px: 1,
          }}
        />

        <ServicePolicyList data={data} />
      </Box>
    </>
  );
}
