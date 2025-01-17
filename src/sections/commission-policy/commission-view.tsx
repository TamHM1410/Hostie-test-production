'use client';

//  @hook
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'src/hooks/use-debounce';
import { useCommissionPolicy } from 'src/api/useCommissionPolicy';

//  @mui
import { Box, Grid } from '@mui/material';

//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CommissionPolicyTable from './commission-policy-table';
import { LoadingScreen } from 'src/components/loading-screen';
import AddNewCommissionPolicy from './add-new-commission-policy';

//  @api

export default function CommissionView() {
const {findAllCommissionPolicy}=useCommissionPolicy()

  const [value, setValue] = useState('');

  const debouncedSearchTerm = useDebounce(value, 600);

  const { data, isLoading } = useQuery({
    queryKey: ['listCommissionPolicy', debouncedSearchTerm],
    queryFn: async () => {
        const rs = await findAllCommissionPolicy();
        return rs;
    },
  });
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Chính sách hoa hồng"
        links={[{ name: '' }]}
        sx={{
          pt: 5,
          px: 5,
        }}
      />
      <Box sx={{ px: 5 }}>
        <AddNewCommissionPolicy />
      </Box>
      <Box sx={{ py: 5, px: 5 }}>
        <CommissionPolicyTable />
      </Box>
    </Box>
  );
}
