'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useManageBookingResidencesContext } from 'src/auth/context/manage-book-residences-context/ManageBookingResidencesContext';
import ManageBookingResidencesTable from './ManageBookingResidencesTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

const ManageBookingResidencesView: React.FC = () => {
    const settings = useSettingsContext();
    const { rows, isLoading } = useManageBookingResidencesContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Quản lí đặt nơi lưu trú của bạn"
                links={[{ name: '' }]}
                sx={{
                    mb: { xs: 3, md: 5 },
                    px: 1,
                }}
            />
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <ManageBookingResidencesTable rows={rows} />
        </Container>
    );
};

export default ManageBookingResidencesView;
