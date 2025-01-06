'use client';

//  @hook
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReport } from 'src/api/useReport';
//  @mui
import { Box, Grid } from '@mui/material';

//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { getALlTransactionPackage } from 'src/api/pagekages';


import { getAllReport } from 'src/api/report';
import { useDebounce } from 'src/hooks/use-debounce';
import ReportTable from './report-table';


//  @api

export default function  ReportAdmin() {

  const {findAllReport}=useReport()

  const [filter,setFilter]=useState('all')

  const [value, setValue] = useState("");

  const debouncedSearchTerm = useDebounce(value, 600);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['reportList',value],
    queryFn: async () => {
      const rs = await findAllReport();
      return rs;
    },
  });
  if (isLoading) {
    return <LoadingScreen />;
  }



  return (
    <Box>
      <CustomBreadcrumbs
        heading="Báo cáo"
        links={[{ name: '' }]}
        sx={{
          pt: 5,
          px: 5,
        }}
      />
      <Box>
        {/* <Filter filter={filter} setFilter={setFilter}/> */}
      
      </Box>
      <Box sx={{ py: 5, px: 5 }}>
        <ReportTable data={Array.isArray(data) && data.length>0?data :[]}/>
      </Box>
    </Box>
  );
}
