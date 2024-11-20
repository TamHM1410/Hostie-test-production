import { BookingListProvider } from 'src/auth/context/booking-list-context/BookingListContext';
import { ManageBookingResidencesProvider } from 'src/auth/context/manage-book-residences-context/ManageBookingResidencesContext';
import { BookingProvider } from 'src/auth/context/service-context/BookingContext';
import ManageBookingResidencesView from 'src/sections/manage-booking-residences/ManageBookingResidencesView';

export const metadata = {
    title: 'Dashboard: Manage Booking Residences',
};

export default function ManageBookingResidences() {
    return (
        <BookingProvider>
            <BookingListProvider>
                <ManageBookingResidencesProvider>
                    <ManageBookingResidencesView />
                </ManageBookingResidencesProvider>
            </BookingListProvider>
        </BookingProvider>
    );
}
