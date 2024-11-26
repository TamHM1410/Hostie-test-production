'use client';

/// @hook
import { useState ,useCallback  } from 'react';
import { useQuery ,useQueries} from '@tanstack/react-query';

import { Box } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';


import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Iconify from 'src/components/iconify';
import { getHousekeepersRequest } from 'src/api/host';

import BulterWorkTable from './work-residence-table';
import ButlerFilter from './filter';



//  @component

//  @hook
// import { findAllHousekeeperResidence } from 'src/api/house-keeper';


// ----------------------------------------------------------------------

const TABS = [
  

  {
    value: 'work',
    label: 'Danh sách quản gia cần duyệt',
    icon: <Iconify icon="fluent-mdl2:calendar-work-week" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function MyResidenceView() {

  const [filter,setFilter]=useState('all')
  const [currentTab, setCurrentTab] = useState('work');

  
  const result=useQueries({
    queries:[{
      queryKey:['housekeeperRequest',filter],
      queryFn:async ()=>{
        const res = await getHousekeepersRequest()
        console.log(res,'res')
      switch(filter){
        case 'all':return res;
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


        default :return res;
      }
      }
    }]
  })


  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


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
      <ButlerFilter filter={filter} setFilter={setFilter}/>

      </Box>
      <Box sx={{ py: 5, px: 5 }}>
     {currentTab ==='work' && <BulterWorkTable data={result[0]?.data ?? [] }/>}   


      </Box>
    </Box>
  );
}
