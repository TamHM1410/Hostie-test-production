'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useManageHoldResidencesContext } from 'src/auth/context/manage-hold-residences-context/ManageHoldResidencesContext';

import ManageHoldResidencesTable from './ManageHoldResidencesTable';

export default function ManageHoldResidencesView() {
    const settings = useSettingsContext();
    const { rows, isLoading } = useManageHoldResidencesContext(); // Use context

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <ManageHoldResidencesTable rows={rows} />
        </Container>
    );
}
