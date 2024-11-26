'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { useHoldListContext } from 'src/auth/context/hold-list-context/HoldListContext';

import HoldListTable from './HoldListTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function HoldListView() {
    const settings = useSettingsContext();
    const { rows, isLoading } = useHoldListContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Danh sách giữ nơi lưu trú của bạn"
                links={[{ name: '' }]}
                sx={{
                    mb: { xs: 3, md: 5 },
                    px: 1,
                }}
            />
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <HoldListTable rows={rows} />
        </Container>
    );
}
