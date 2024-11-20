import { BookingProvider } from "src/auth/context/service-context/BookingContext";
import { SocketProvider } from "src/auth/context/socket-message-context/SocketMessageContext";
import BookingServiceView from "src/sections/booking-service/BookingServiceView";

export const metadata = {
    title: 'Dashboard: Booking Service',
};
export default function BookingService() {
    return <SocketProvider><BookingProvider><BookingServiceView /></BookingProvider></SocketProvider>
}