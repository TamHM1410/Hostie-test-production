'use client';

//  @hook
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'src/hooks/use-debounce';
import { useTransaction } from 'src/api/useTransaction';

//  @mui
import { Box, Grid } from '@mui/material';

//  @component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

import TransactionTable from './transaction-table';
import Filter from './filter';

//  @api

export default function TransactionView() {
  const {findAllTransaction}=useTransaction()
  const [filter, setFilter] = useState('all');

  const [value, setValue] = useState('');

  const debouncedSearchTerm = useDebounce(value, 600);

  const { data, isLoading } = useQuery({
    queryKey: ['listTransaction',debouncedSearchTerm],
    queryFn: async () => {
      const rs = await findAllTransaction(1000,debouncedSearchTerm);
      return rs;
    },
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }


  return (
    <Box>
      <CustomBreadcrumbs
        heading="Lịch sử giao dịch"
        links={[{ name: '' }]}
        sx={{
          pt: 5,
          px: 5,
        }}
      />
      <Box>
        <Filter
          filter={filter}
          setFilter={setFilter}
          value={value}
          setValue={setValue}
          handleSearch={handleSearch}
        />
      </Box>
      <Box sx={{ py: 5, px: 5 }}>
        <TransactionTable data={data} />
      </Box>
    </Box>
  );
}
