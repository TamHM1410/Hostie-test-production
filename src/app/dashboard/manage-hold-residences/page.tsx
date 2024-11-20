
import { ManageHoldResidencesProvider } from "src/auth/context/manage-hold-residences-context/ManageHoldResidencesContext";
import ManageHoldResidencesView from "src/sections/manage-hold-residences/ManageHoldResidencesView";


export const metadata = {
    title: 'Dashboard: Manage Hold Residences',
};

export default function ManageHoldResidences() {
    return <ManageHoldResidencesProvider> <ManageHoldResidencesView /></ManageHoldResidencesProvider>
}