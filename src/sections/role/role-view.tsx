'use client';

//  @hook

import { useQuery } from '@tanstack/react-query';

//  @mui
import { Box } from '@mui/material';

//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen} from 'src/components/loading-screen';
import { getAllRolesApi } from 'src/api/users';

import RoleTable from './role-table';
import AddNewRoleModal from './role-addnew-modal';

//  @api

export default function RoleView() {
  const { data, isLoading } = useQuery({
    queryKey: ['roleList'],

    queryFn: () => getAllRolesApi(),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Quản lý quyền"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px:5
        }}
      />
      <Box sx={{ px: 5 }}>
        <AddNewRoleModal />
      </Box>
      <Box sx={{ py: 5, px: 5 }}>
        <RoleTable data={data} />
      </Box>
    </Box>
  );
}
