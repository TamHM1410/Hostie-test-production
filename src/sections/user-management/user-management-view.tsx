'use client';

/// hooks
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'src/hooks/use-debounce';
import { useUserManagement } from 'src/api/useUserManagement';

//  @component
import { Box } from '@mui/material';
import { LoadingScreen } from 'src/components/loading-screen';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import UserFilter from './user-filter-modal';
import UserTable from './user-table';

export default function UserManagementView() {
  const { getAllUsers } = useUserManagement();

  const [filter, setFilter] = useState('all');

  const [value, setValue] = useState('');

  const debouncedSearchTerm = useDebounce(value, 600);

  const { data, isLoading } = useQuery({
    queryKey: ['usersList', filter, debouncedSearchTerm],

    queryFn: async () => {
      const res = await getAllUsers({ search: debouncedSearchTerm });
      switch (filter) {
        case 'all':
          return res;
        case 'accepted': {
          if (Array.isArray(res)) {
            const rs = res.filter((item) => item?.isActive === true);
            return rs;
          }
          return [];
        }
        case 'pending': {
          if (Array.isArray(res)) {
            const rs = res.filter((item) => item?.isActive === false);
            return rs;
          }
          return [];
        }

        default:
          return res;
      }
    },
  });

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Quản lý tài khoản"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px: 5,
        }}
      />
      <UserFilter filter={filter} setFilter={setFilter} value={value} setValue={setValue} />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box sx={{ py: 5, px: 5 }}>
          <UserTable data={data} />
        </Box>
      )}
    </Box>
  );
}
