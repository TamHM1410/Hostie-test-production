'use client';

/// @hook
import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useButler } from 'src/api/useButler';

import { Box } from '@mui/material';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';

import BulterWorkTable from './work-residence-table';
import ButlerFilter from './filter';

//  @component

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function MyResidenceView() {
  const { getButlerRequest } = useButler();

  const [filter, setFilter] = useState('all');

  const [currentTab, setCurrentTab] = useState('work');

  const result = useQueries({
    queries: [
      {
        queryKey: ['housekeeperRequest', filter],
        queryFn: async () => {
          const res = await getButlerRequest();
          switch (filter) {
            case 'all':
              return res;
            case 'accepted': {
              if (Array.isArray(res)) {
                const rs = res.filter((item) => item?.status === 2);
                return rs;
              }
              return [];
            }
            case 'pending': {
              if (Array.isArray(res)) {
                const rs = res.filter((item) => item?.status === 1);
                return rs;
              }
              return [];
            }
            case 'reject': {
              if (Array.isArray(res)) {
                const rs = res.filter((item) => item?.status === 0);
                return rs;
              }
              return [];
            }

            default:
              return res;
          }
        },
      },
    ],
  });

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Danh sách quản gia của bạn"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Box sx={{ px: 5 }}>
        <ButlerFilter filter={filter} setFilter={setFilter} />
      </Box>
      <Box sx={{ py: 5, px: 5 }}>
        {currentTab === 'work' && <BulterWorkTable data={result[0]?.data ?? []} />}
      </Box>
    </Box>
  );
}
