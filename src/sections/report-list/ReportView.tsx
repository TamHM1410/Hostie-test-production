'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useReportListContext } from 'src/auth/context/report-list-context/ReportListContext';

import ReportListTable from './ReportTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';




export default function ReportView() {
    const settings = useSettingsContext();
    const { rows, isLoading } = useReportListContext();


    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Quản lí báo cáo của bạn"
                links={[{ name: '' }]}
                sx={{
                    mb: { xs: 3, md: 5 },
                    px: 1,
                }}
            />
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ReportListTable rows={rows} />
        </Container>
    );
}
