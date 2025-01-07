'use client';

import { Container, CircularProgress, Backdrop ,Box} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useBookingListContext } from 'src/auth/context/booking-list-context/BookingListContext';
import BookingListTable from './BookingListTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import goAxiosClient from 'src/utils/goAxiosClient';
import { useResidence } from 'src/api/useResidence';
import { useQuery } from '@tanstack/react-query';

export default function BookingListView() {
  const settings = useSettingsContext();
  const { rows, setRows } = useBookingListContext();

  const { data, isLoading } = useQuery({
    queryKey: ["booking"],
    queryFn: async () => {
      const res = await goAxiosClient.get('/booking?sort=id:desc&page_size=9999&size=1');
      // Move setRows after the return to ensure we're not causing a state update during render
      const bookingData = res?.data?.result;
      if (bookingData) {
        setRows(bookingData);
      }
      return bookingData;
    },
    // Add these options to help manage the state updates
    staleTime: 5000, // Data considered fresh for 5 seconds
  
  });

  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Danh sách đặt nơi lưu trú của bạn"
        links={[{ name: '' }]}
        sx={{
          mb: { xs: 3, md: 5 },
          px: 1,
        }}
      />
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

    <BookingListTable rows={data || rows} />



    </Container>
  );
}