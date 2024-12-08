'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useManageCustomerContext } from 'src/auth/context/manage-customer-context/ManageCustomerContext';
import ManageCustomerTable from './ManageCustomerTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function ManageCustomerView() {
    const settings = useSettingsContext();
    const { customers, isLoading } = useManageCustomerContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Quản lí khách hàng của bạn"
                links={[{ name: '' }]}
                sx={{
                    mb: { xs: 3, md: 5 },
                    px: 1,
                }}
            />
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ManageCustomerTable rows={customers} />
        </Container>
    );
}
