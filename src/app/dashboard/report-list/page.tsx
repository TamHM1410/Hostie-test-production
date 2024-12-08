
import { ReportListProvider } from "src/auth/context/report-list-context/ReportListContext";
import { BookingProvider } from "src/auth/context/service-context/BookingContext";
import ReportView from "src/sections/report-list/ReportView";


export const metadata = {
    title: 'Dashboard: Report List',
};

export default function ReportListPage() {
    return <BookingProvider><ReportListProvider><ReportView /></ReportListProvider></BookingProvider>
}