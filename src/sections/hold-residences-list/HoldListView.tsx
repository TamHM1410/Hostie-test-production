'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { useHoldListContext } from 'src/auth/context/hold-list-context/HoldListContext';

import HoldListTable from './HoldListTable';

export default function HoldListView() {
    const settings = useSettingsContext();
    const { rows, isLoading } = useHoldListContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <HoldListTable rows={rows} />
        </Container>
    );
}
