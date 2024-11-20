import React, { useMemo } from 'react';
import { Chip, IconButton, Typography } from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { MRT_Localization_VI } from 'material-react-table/locales/vi'; // Localization in Vietnamese
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { formatDateToDDMMYYYY } from 'src/utils/format-time';

interface BookingData {
    id: string;
    customerName: string;
    sellerName: string;
    checkinDate: string;
    checkoutDate: string;
    depositAmount: number;
    paymentMethod: string;
    status: string;
}

interface BookingHistoryTableProps {
    rows: BookingData[];
    order: 'asc' | 'desc';
    orderBy: keyof BookingData;
    handleSort: (property: keyof BookingData) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const BookingHistoryTable: React.FC<BookingHistoryTableProps> = ({
    rows,
    order,
    orderBy,
    handleSort,
    onEdit,
    onDelete,
}) => {
    const renderStatusChip = (status: string) => {
        const statusStyles: { [key: string]: { color: string; background: string } } = {
            Confirmed: { color: 'green', background: '#EBF9F1' },
            Cancelled: { color: '#CD6200', background: '#FEF2E5' },
            Pending: { color: '#FFC107', background: '#FFF9E5' },
            Booked: { color: '#1976D2', background: '#E0F7FA' },
        };
        const { color, background } = statusStyles[status] || { color: 'black', background: 'white' };

        return (
            <Chip
                label={status}
                sx={{ color, background, borderRadius: 30 }}
            />
        );
    };

    const columns: MRT_ColumnDef<BookingData>[] = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID giao dịch',
            size: 100,
            enableSorting: true,
        },
        {
            accessorKey: 'customerName',
            header: 'Tên khách hàng',
            size: 150,
            enableSorting: true,
        },
        {
            accessorKey: 'sellerName',
            header: 'Loại dịch vụ',
            size: 150,
            enableSorting: false,
        },
        {
            accessorKey: 'checkinDate',
            header: 'Ngày đặt phòng',
            size: 150,
            enableSorting: true,
            Cell: ({ cell }) => formatDateToDDMMYYYY(cell.getValue() as string),
        },
        {
            accessorKey: 'checkoutDate',
            header: 'Ngày trả phòng',
            size: 150,
            enableSorting: true,
            Cell: ({ cell }) => formatDateToDDMMYYYY(cell.getValue() as string),
        },
        {
            accessorKey: 'depositAmount',
            header: 'Số tiền cọc',
            size: 150,
            enableSorting: true,
        },
        {
            accessorKey: 'paymentMethod',
            header: 'Phương thức thanh toán',
            size: 150,
            enableSorting: false,
        },
        {
            accessorKey: 'status',
            header: 'Trạng thái',
            size: 150,
            Cell: ({ cell }) => renderStatusChip(cell.getValue() as string),
        },
        {
            accessorKey: 'action',
            header: 'Action',
            size: 100,
            Cell: ({ row }: any) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton color="primary" onClick={() => onEdit(row.original.id)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => onDelete(row.original.id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ], [onEdit, onDelete]);

    return (
        <MaterialReactTable
            columns={columns}
            data={rows}
            enablePagination
            enableSorting
            localization={MRT_Localization_VI}
            renderEmptyRowsFallback={() => (
                <Typography variant="h6" align="center" sx={{ margin: 2 }}>
                    Dữ liệu không tồn tại
                </Typography>
            )}
        />
    );
};

export default BookingHistoryTable;
