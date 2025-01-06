'use client';

//  @hook
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

/// @component
import ServiceDetail from './ServiceDetailView';
import ServicePolicyList from './service-policy-list';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

//  @api
import { get_all_policy } from 'src/api/cancelPolicy';

//  @mui
import { Box, Button } from '@mui/material';

const NoDataCancelPolicy = () => {
  const { id } = useParams();

  const [isMapCancel, setIsMapCancel] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['cancelPolicies'],
    queryFn: () => get_all_policy(),
  });

  return (
    <>
      <Box>
        <Box sx={{ textAlign: 'center' }}>Hiện tại căn hộ chưa có chính sách hủy</Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 5 }}>
          {isMapCancel && <ServicePolicyList data={data} type="update" id={id} />}

          <Button
            type="button"
            onClick={() => setIsMapCancel(!isMapCancel)}
            color="primary"
            variant="contained"
          >
            {!isMapCancel ? 'Thêm chính sách hủy cho căn hộ' : 'Hủy '}{' '}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default function ServiceDetailView() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['residencePolicy'],
    queryFn: () => get_all_policy(id),
  });
  
  if (isLoading) return <LoadingScreen />;

  console.log(data,'data')

  return (
    <>
      <ServiceDetail id={id} />
      <CustomBreadcrumbs
        heading="Chính sách hủy của căn hộ"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px: 1,
        }}
      />


      {Array.isArray(data) && data.length > 0 ? (
        <ServicePolicyList data={data} type="h" />
      ) : (
        <NoDataCancelPolicy />
      )}
    </>
  );
}
