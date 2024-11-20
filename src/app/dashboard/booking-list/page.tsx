import { BookingListProvider } from 'src/auth/context/booking-list-context/BookingListContext';
import { BookingProvider } from 'src/auth/context/service-context/BookingContext';
import BookingListView from 'src/sections/booking-list/BookingListView';

export const metadata = {
    title: 'Dashboard: Booking List',
};

export default function BookingList() {
    return (
        <BookingProvider>
            <BookingListProvider>
                <BookingListView />
            </BookingListProvider>
        </BookingProvider>
    );
}
