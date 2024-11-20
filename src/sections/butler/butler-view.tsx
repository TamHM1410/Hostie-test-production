'use client';

//  @hook

import { useQuery, useQueries } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';

//  @mui
import { Box, Input, TextField, IconButton, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { butler_add_residence } from 'src/api/butler';
//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { SplashScreen } from 'src/components/loading-screen';
import { getButlerResidence, getButlerBooking } from 'src/api/butler';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Iconify from 'src/components/iconify';
import toast from 'react-hot-toast';

import ButlerFilter from './bulter-filter';
import ButlerTable from './bulter-table';
import ButlerBookingTable from './butler-booking-table';

// import RoleTable from './role-table';
// import AddNewRoleModal from './role-addnew-modal';

//  @api

const TABS = [
  {
    value: 'all',
    label: 'Căn hộ đang quản lý',
    icon: <Iconify icon="maki:village" width={24} />,
  },

  {
    value: 'booking',
    label: 'Danh sách booking',
    icon: <Iconify icon="fluent-mdl2:calendar-work-week" width={24} />,
  },
];

export default function ButlerView() {
  const [currentTab, setCurrentTab] = useState('all');

  const [filter, setFilter] = useState('all');
  const [residencesList, setResidenceList] = useState<any>([]);

  const [refCode, setHousekeeperRegistrationCode] = useState('');

  const result = useQueries({
    queries: [
      {
        queryKey: ['butlerResidenceList'],

        queryFn: () => {
          const res = getButlerResidence();
          return res;
        },
      },
      {
        queryKey: ['butlerBooking'],

        queryFn: () => {
          const res = getButlerBooking();
          return res;
        },
      },
    ],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });
  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleAddResidence = async () => {
    try {
      const payload = {
        housekeeperRegistrationCode: refCode,
      };

      await butler_add_residence(payload);
      setHousekeeperRegistrationCode('');
      toast.success('Đăng ký thành công! Xin chờ chủ nhà xét duyệt')
    } catch (error) {
      toast.error('Đã xảy ra lỗi');
    }
  };

  if (result.pending) {
    return <SplashScreen />;
  }
  return (
    <Box>
      <CustomBreadcrumbs
        heading="Quản lý"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px: 5,
        }}
      />
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
          px: 5,
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'all' && (
        <>
          {' '}
          <Box sx={{ px: 5, display: 'flex', gap: 2 }}>
            <ButlerFilter />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 40, // Tùy chỉnh chiều cao tổng thể của TextField
                    fontSize: '14px', // Tùy chỉnh kích thước font cho phù hợp
                  },
                }}
                variant="outlined"
                placeholder="Nhập mã  quản gia "
                value={refCode}
                onChange={(e) => setHousekeeperRegistrationCode(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AddIcon onClick={handleAddResidence} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
          <Box sx={{ py: 5, px: 5 }}>
            <ButlerTable data={result?.data[0]} />
          </Box>
        </>
      )}
      {currentTab === 'booking' && <ButlerBookingTable data={result?.data[1]} />}
    </Box>
  );
}
