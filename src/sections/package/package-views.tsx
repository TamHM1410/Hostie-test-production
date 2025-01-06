'use client';

//  @hook
import { useQuery } from '@tanstack/react-query';
import {  Box } from '@mui/material';
import { usePackage } from 'src/api/usePackage';

//  @component

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PackageTable from './package-table';
import AddNewPackage from './package-addnew-modal';
import { LoadingScreen} from 'src/components/loading-screen';

// import AddNewRoleModal from './role-addnew-modal';
export default function PackageView() {

  const {findAllPackage}=usePackage()
  const { data, isLoading } = useQuery({
    queryKey: ['packageList'],

    queryFn: () => findAllPackage(),
  });

  if (isLoading) {
    return (
      <>
        <LoadingScreen/>
      </>
    );
  }


  return (
    <>
      <Box>
        <CustomBreadcrumbs
          heading="Gói dịch vụ"
          links={[{ name: '' }]}
          sx={{
            mb: { xs: 3, md: 5 },
            px:5
          }}
        />
        <Box sx={{ px: 5 }}>
          <AddNewPackage />
        </Box>
        <Box sx={{ py: 5, px: 5 }}>
          <PackageTable data={data} />
        </Box>
      </Box>
    </>
  );
}
