'use client';

// @hook
import { useState, useCallback ,useEffect} from 'react';
import { useQuery ,useQueries} from '@tanstack/react-query';
import { useUserManagement } from 'src/api/useUserManagement';

import { getUserInfor } from 'src/api/users';

// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userAbout } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
//
import { useCurrentUser } from 'src/zustand/store';

import { getBankList } from 'src/api/bank';

import AccountGeneral from '../account-general';
import AccountSocialLinks from '../account-social-links';
// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'Chung',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },

  {
    value: 'social',
    label: 'Mạng xã hội',
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountView() {

  const {getUserInfo,getReferredAccount,getTotalCommissionPackage}=useUserManagement()
  const settings = useSettingsContext();

  const { updateUserSelected } = useCurrentUser();

 

  const result=useQueries({
    queries:[{
      queryKey:['userTest'],
      queryFn: ()=>getUserInfo()
    },{
      queryKey:['bankList'],
      queryFn:()=>getBankList()
    },{
      queryKey:['referenceAccountList'],
      queryFn:()=>getReferredAccount()
    },{
      queryKey:['totalCommission'],
      queryFn:()=>getTotalCommissionPackage()
    }],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      }
    },
  })

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  if (result?.pending) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Tài khoản"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Người dùng', href: paths.dashboard.user.root },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'general' && <AccountGeneral userData={result?.data[0]} bankName={result?.data[1]} referListData={result?.data[2]} totalCommission={result?.data[3]} />}

      {currentTab === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks}  socials={result?.data[0]?.socials}  />}

    </Container>
  );
}
