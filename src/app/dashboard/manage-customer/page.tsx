import { ManageCustomerProvider } from "src/auth/context/manage-customer-context/ManageCustomerContext";
import ManageCustomerView from "src/sections/manage-customer/ManageCustomerView";



export const metadata = {
    title: 'Dashboard: Manage Customer',
};

export default function ManageCustomer() {
    return <ManageCustomerProvider> <ManageCustomerView /></ManageCustomerProvider>
}