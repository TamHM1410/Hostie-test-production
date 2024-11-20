'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useManageBookingResidencesContext } from 'src/auth/context/manage-book-residences-context/ManageBookingResidencesContext';
import ManageBookingResidencesTable from './ManageBookingResidencesTable';

const ManageBookingResidencesView: React.FC = () => {
    const settings = useSettingsContext();
    const { rows, isLoading } = useManageBookingResidencesContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <ManageBookingResidencesTable rows={rows} />
        </Container>
    );
};

export default ManageBookingResidencesView;
