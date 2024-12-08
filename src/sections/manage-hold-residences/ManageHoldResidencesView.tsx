'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useManageHoldResidencesContext } from 'src/auth/context/manage-hold-residences-context/ManageHoldResidencesContext';

import ManageHoldResidencesTable from './ManageHoldResidencesTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function ManageHoldResidencesView() {
    const settings = useSettingsContext();
    const { rows, isLoading } = useManageHoldResidencesContext(); // Use context

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Quản lí giữ nơi lưu trú của bạn"
                links={[{ name: '' }]}
                sx={{
                    mb: { xs: 3, md: 5 },
                    px: 1,
                }}
            />
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <ManageHoldResidencesTable rows={rows} />
        </Container>
    );
}
