import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Iconify from 'src/components/iconify';

const TABS = [
  {
    value: 'user',
    label: 'Chủ nhà hoặc người bán',
    icon: <Iconify icon="fa-solid:user-tie" width={24} />,
  },

  {
    value: 'butler',
    label: 'Quản gia',
    icon: <Iconify icon="carbon:clean" width={24} />,
  },
];

export default function RegisterTab(props: any) {
  const { currentTab, setCurrentTab } = props;

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    [setCurrentTab]
  );

  return (
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
  );
}
