'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useManageCustomerContext } from 'src/auth/context/manage-customer-context/ManageCustomerContext';
import ManageCustomerTable from './ManageCustomerTable';

export default function ManageCustomerView() {
    const settings = useSettingsContext();
    const { customers, isLoading } = useManageCustomerContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ManageCustomerTable rows={customers} />
        </Container>
    );
}
