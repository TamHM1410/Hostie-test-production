
import { HoldListProvider } from "src/auth/context/hold-list-context/HoldListContext";
import { BookingProvider } from "src/auth/context/service-context/BookingContext";
import HoldListView from "src/sections/hold-residences-list/HoldListView";


export const metadata = {
    title: 'Dashboard: Hold Residence List',
};

export default function HoldResidence() {
    return <BookingProvider><HoldListProvider><HoldListView /></HoldListProvider></BookingProvider>
}