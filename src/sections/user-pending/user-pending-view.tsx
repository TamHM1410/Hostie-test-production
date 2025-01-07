'use client';

/// hooks
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'src/hooks/use-debounce';
import { useUserManagement } from 'src/api/useUserManagement';

//  @component
import { Box } from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';

import UserPendingTable from './user-pending-table';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// import UserFilter from './user-filter-modal';
// import UserTable from './user-table';

export default function UserPendingView() {
  const { getAllUsers,getPendingUser } = useUserManagement();

  const [filter, setFilter] = useState('all');

  const [value, setValue] = useState('');

  const debouncedSearchTerm = useDebounce(value, 600);

  const { data, isLoading } = useQuery({
    queryKey: ['usersPendingList'],
    queryFn:()=>getPendingUser({})

   
  });

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Danh sách tài khoản cần duyệt"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px: 5,
        }}
      />
      <UserPendingTable data={data}/>
      
      {/* <UserFilter filter={filter} setFilter={setFilter} value={value} setValue={setValue} />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box sx={{ py: 5, px: 5 }}>
          <UserTable data={data} />
        </Box>
      )} */}
    </Box>
  );
}
