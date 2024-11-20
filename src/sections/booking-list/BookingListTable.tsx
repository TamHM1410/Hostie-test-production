/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react';
import {
    Chip,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
} from '@mui/material';
import { useBookingListContext } from 'src/auth/context/booking-list-context/BookingListContext';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { MRT_Localization_VI } from 'material-react-table/locales/vi'; // Import Vietnamese localization
import QRDialog from './QrCode';
import BookingDetailSidebar from './BookingDetailSideBar';

interface BookingData {
    id: number;
    residence_name: string;
    host_id: number;
    paid_amount: number;
    checkin: string;
    checkout: string;
    guest_name: string;
    guest_phone: string;
    is_host_accept: boolean;
    is_seller_transfer: boolean;
    is_host_receive: boolean;
    status: number;
    guest_id: number;
}

interface BookingListTableProps {
    rows: BookingData[];
}

const BookingListTable: React.FC<BookingListTableProps> = ({ rows }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
    const { detail, fetchDataDetail, confirmTransfer, cancelBooking, handleUpdateBookingSubmit, qr, fetchDataDetailBookingQR } = useBookingListContext();
    const [openSidebar, setOpenSidebar] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
    const [isEdit, setIsEdit] = useState(false);

    const handleViewBooking = (bookingId: number) => {
        const bookingDetails = rows.find((row) => row.id === bookingId);
        setSelectedBooking(bookingDetails || null);
        setOpenSidebar(true);
        setIsEdit(false);
    };

    const handleEditBooking = (bookingId: number) => {
        const bookingDetails = rows.find((row) => row.id === bookingId);
        setSelectedBooking(bookingDetails || null);
        setOpenSidebar(true);
        setIsEdit(true);
    };

    const handleOpenDialog = () => setOpenDialog(true);

    const handleCloseDialog = () => setOpenDialog(false);

    const handleOpenConfirmationDialog = (id: number) => {
        setBookingToCancel(id);
        setOpenConfirmationDialog(true);
    };

    const handleCloseConfirmationDialog = () => {
        setOpenConfirmationDialog(false);
        setBookingToCancel(null);
    };

    const handleConfirmCancellation = () => {
        if (bookingToCancel) {
            const bookingToCancelData = rows.find((row) => row.id === bookingToCancel);
            cancelBooking(
                bookingToCancelData?.id,
                bookingToCancelData?.checkin,
                bookingToCancelData?.checkout
            );
        }
        handleCloseConfirmationDialog();
    };

    const handleTransfer = (id: any, checkin: any, checkout: any, commission_rate: any) => {
        confirmTransfer(id, checkin, checkout, commission_rate);
        handleCloseDialog();
    };

    const renderBooleanChip = (
        value: boolean,
        trueLabel: string,
        falseLabel: string,
        isCanceled: boolean
    ) => (
        <Chip
            label={isCanceled ? 'Hủy' : value ? trueLabel : falseLabel}
            color={isCanceled ? 'error' : value ? 'success' : 'warning'}
            variant="outlined"
            sx={{ borderRadius: 30 }}
        />
    );

    const columns: MRT_ColumnDef<BookingData>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                size: 100,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'paid_amount',
                header: 'Số Tiền Đã Thanh Toán',
                size: 150,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'checkin',
                header: 'Ngày Nhận Phòng',
                size: 150,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'checkout',
                header: 'Ngày Trả Phòng',
                size: 150,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'guest_name',
                header: 'Tên Khách',
                size: 200,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'guest_phone',
                header: 'Số Điện Thoại Khách',
                size: 150,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'is_host_accept',
                header: 'Chấp Nhận Của Chủ',
                size: 150,
                Cell: ({ row, cell }: any) =>
                    renderBooleanChip(
                        cell.getValue(),
                        'Đã Chấp Nhận',
                        'Chưa Chấp Nhận',
                        row.original.status === 0
                    ),
            },
            {
                accessorKey: 'is_seller_transfer',
                header: 'Chuyển Giao',
                size: 150,
                Cell: ({ row, cell }: any) =>
                    renderBooleanChip(cell.getValue(), 'Đã Chuyển', 'Chưa Chuyển', row.original.status === 0),
            },
            {
                accessorKey: 'is_host_receive',
                header: 'Chủ Nhận',
                size: 150,
                Cell: ({ row, cell }: any) =>
                    renderBooleanChip(cell.getValue(), 'Đã Nhận', 'Chưa Nhận', row.original.status === 0),
            },
            {
                accessorKey: 'action',
                header: 'Hành Động',
                size: 200,
                Cell: ({ row }: any) => (
                    <Box display="flex">
                        {row.original.status === 0 ? (
                            <Tooltip title="Xem Chi Tiết">
                                <IconButton
                                    color="info"
                                    onClick={() => {
                                        fetchDataDetail(row.original.id);
                                        handleViewBooking(row.original.id);
                                    }}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <>
                                <Tooltip title="Hủy Đặt">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleOpenConfirmationDialog(row.original.id)}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Xem Chi Tiết">
                                    <IconButton
                                        color="info"
                                        onClick={() => {
                                            fetchDataDetail(row.original.id);
                                            handleViewBooking(row.original.id);
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                {!row.original.is_host_accept && (
                                    <Tooltip title="Sửa Đặt">
                                        <IconButton
                                            color="success"
                                            onClick={() => {
                                                fetchDataDetail(row.original.id);
                                                handleEditBooking(row.original.id);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {row.original.is_host_accept && !row.original.is_seller_transfer && (
                                    <Tooltip title="Chuyển Tiền">
                                        <IconButton
                                            color="success"
                                            onClick={() => {
                                                fetchDataDetail(row.original.id);
                                                fetchDataDetailBookingQR(row.original.id);
                                                handleOpenDialog();
                                            }}
                                        >
                                            <AttachMoneyIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </>
                        )}
                    </Box>
                ),
            },
        ],
        [rows]
    );

    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={rows || []}
                enablePagination
                enableSorting
                enableTopToolbar
                localization={MRT_Localization_VI}
            />
            <QRDialog
                open={openDialog}
                onClose={handleCloseDialog}
                qrDetails={qr}
                onTransfer={() =>
                    handleTransfer(
                        detail?.booking?.id,
                        detail?.booking?.checkin,
                        detail?.booking?.checkout,
                        qr?.commission_rate
                    )
                }
            />
            <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog}>
                <DialogTitle>Xác Nhận Hủy Đặt</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn hủy đặt này? Hành động này sẽ không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmationDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmCancellation} color="success">
                        Xác Nhận
                    </Button>
                </DialogActions>
            </Dialog>
            <BookingDetailSidebar
                open={openSidebar}
                onClose={() => setOpenSidebar(false)}
                bookingDetails={detail?.booking}
                onSave={(updatedDetails) => {
                    handleUpdateBookingSubmit(updatedDetails);
                }}
                isEditing={isEdit}
            />
        </>
    );
};

export default BookingListTable;
