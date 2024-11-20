
import { ServiceProvider } from "src/auth/context/residences-context/ResidencesContext";
import ServiceView from "src/sections/service/ServiceView";

export const metadata = {
    title: 'Dashboard: Services',
};

export default function Services() {
    return (

        <ServiceProvider> <ServiceView /></ServiceProvider>

    )
}