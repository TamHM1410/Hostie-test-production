/* eslint-disable react/prop-types */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Chip,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { useManageHoldResidencesContext } from 'src/auth/context/manage-hold-residences-context/ManageHoldResidencesContext';
import { MRT_Localization_VI } from 'material-react-table/locales/vi'; // Nhập localization tiếng Việt

interface HoldData {
    id: number;
    residence_name: string;
    seller_name: string;
    checkin: string;
    checkout: string;
    is_host_accept: boolean;
    status: number;
}

interface ManageHoldResidencesProps {
    rows: HoldData[];
}

const ManageHoldResidencesTable: React.FC<ManageHoldResidencesProps> = ({ rows }) => {
    const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [actionType, setActionType] = React.useState<'accept' | 'cancel'>('accept');
    const { confirmHold, cancelHold } = useManageHoldResidencesContext();

    const renderStatusChip = (status: number) => {
        switch (status) {
            case 2:
                return (
                    <Chip label="Đã xác nhận" color="success" variant="outlined" sx={{ borderRadius: 30 }} />
                );
            case 1:
                return (
                    <Chip label="Chờ xác nhận" color="warning" variant="outlined" sx={{ borderRadius: 30 }} />
                );
            default:
                return <Chip label="Đã hủy" color="error" variant="outlined" sx={{ borderRadius: 30 }} />;
        }
    };

    const handleActionClick = (rowId: number, type: 'accept' | 'cancel') => {
        setSelectedRowId(rowId);
        setActionType(type);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleConfirmAction = async () => {
        if (selectedRowId === null) return;

        const row = rows.find((r) => r.id === selectedRowId);
        if (!row) return;



        if (actionType === 'accept') {
            await confirmHold(row.id, row.checkin, row.checkout);
        } else {
            await cancelHold(row.id, row.checkin, row.checkout);
        }

        setOpenDialog(false);
        setSelectedRowId(null);
    };

    const columns: MRT_ColumnDef<HoldData>[] = React.useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID Hold',
                size: 100,
                Cell: ({ cell }: any) => <Typography >{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'residence_name',
                header: 'Tên Nơi Lưu Trú',
                size: 200,
                Cell: ({ cell }: any) => <Typography >{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'seller_name',
                header: 'Tên Người Bán',
                size: 200,
                Cell: ({ cell }: any) => <Typography >{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'checkin',
                header: 'Ngày Nhận Phòng',
                size: 150,
                Cell: ({ cell }: any) => (
                    <Typography >{cell.getValue()}</Typography>
                ),
            },
            {
                accessorKey: 'checkout',
                header: 'Ngày Trả Phòng',
                size: 150,
                Cell: ({ cell }: any) => (
                    <Typography >{cell.getValue()}</Typography>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Trạng Thái',
                size: 150,
                Cell: ({ cell }: any) => renderStatusChip(cell.getValue()),
            },
            {
                accessorKey: 'action',
                header: 'Hành Động',
                size: 150,
                Cell: ({ row }) => (
                    <Box display="flex" justifyContent="center">
                        {row.original.status === 1 && (
                            <>
                                <Tooltip title="Xác nhận giữ nơi lưu trú">
                                    <IconButton
                                        color="success"
                                        onClick={() => handleActionClick(row.original.id, 'accept')}
                                        aria-label="confirm"
                                    >
                                        <CheckCircleIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Hủy xác nhận giữ nơi lưu trú">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleActionClick(row.original.id, 'cancel')}
                                        aria-label="cancel"
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                ),
            },
        ],
        []
    );

    const memoizedRows = React.useMemo(() => rows, [rows]);

    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={memoizedRows || []}
                enablePagination
                enableSorting
                enableTopToolbar
                localization={MRT_Localization_VI}

            />

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Xác Nhận Hành Động</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'accept'
                            ? 'Bạn có chắc chắn muốn xác nhận giữ chỗ này?'
                            : 'Bạn có chắc chắn muốn hủy giữ chỗ này?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmAction} color="primary">
                        Xác Nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageHoldResidencesTable;
