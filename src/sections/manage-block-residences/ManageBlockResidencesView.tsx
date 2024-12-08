'use client';

import { Container, CircularProgress, Backdrop } from '@mui/material';

import { useEffect } from 'react';

import { useSettingsContext } from 'src/components/settings';

import { useResidenceBlockContext } from 'src/auth/context/manage-block-residence-context/ManageBlockResidenceContext';

import ManageBlockResidenceTable from './ManageBlockTable';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';








export default function ManageBlockResidencesView({ id }: any) {
    const settings = useSettingsContext();
    const { blocks, isLoading, fetchBlocks, createBlock, deleteBlock } = useResidenceBlockContext();

    useEffect(() => {
        fetchBlocks(id)
    }, [id])


    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Quản lí khóa nơi lưu trú"
                links={[{ name: '' }]}
                sx={{
                    mb: { xs: 3, md: 5 },
                    px: 1,
                }}
            />
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ManageBlockResidenceTable rows={blocks} id={id} onAddBlock={createBlock} onDeleteBlock={deleteBlock} />
        </Container>
    );
}
