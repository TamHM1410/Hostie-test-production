'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useBookingListContext } from 'src/auth/context/booking-list-context/BookingListContext';
import BookingListTable from './BookingListTable';

export default function BookingListView() {
    const settings = useSettingsContext();
    const { rows, isLoading } = useBookingListContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <BookingListTable rows={rows} />
        </Container>
    );
}
