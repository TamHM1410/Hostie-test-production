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
    Popover,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
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
import { CalendarMonthRounded, ReportOffRounded, ReportRounded } from '@mui/icons-material';
import { useReportListContext } from 'src/auth/context/report-list-context/ReportListContext';
import ReportForm from './ReportForm';
import BookingLogsModal from './BookingLogs';
import { MoreVerticalIcon } from 'lucide-react';
import { formattedAmount } from '../../utils/format-time';




const logsData = [
    {
        date: "2024-11-23T16:07:26.76524Z",
        event_type: "BOOKING_CREATED",
        user_id: 1,
        username: "seller",
        user_avatar: "https://hostie-image.s3.amazonaws.com/6dc68e7f-3345-42ed-b42f-da600c194082.jpg",
        data_change: [
            { field: "id", old_value: null, new_value: 408 },
            { field: "residence_id", old_value: null, new_value: 192 },
            { field: "guest_name", old_value: null, new_value: "Hoàng Thiên" },
            { field: "total_amount", old_value: null, new_value: 1100 },
        ],
    },
    {
        date: "2024-11-23T16:09:27.928592Z",
        event_type: "HOST_ACCEPTED_BOOKING",
        user_id: 3,
        username: "host",
        user_avatar: "https://hostie-image.s3.amazonaws.com/c0e9b6dd-ed1e-4042-b16c-d5770094f5c8.jpg",
        data_change: [
            { field: "paid_amount", old_value: 0, new_value: 440 },
            { field: "is_host_accept", old_value: false, new_value: true },
        ],
    },
    {
        date: "2024-11-23T16:11:38.892049Z",
        event_type: "SELLER_TRANSFERRED",
        user_id: 1,
        username: "seller",
        user_avatar: "https://hostie-image.s3.amazonaws.com/6dc68e7f-3345-42ed-b42f-da600c194082.jpg",
        data_change: [{ field: "updated_at", old_value: "2024-11-23T16:09:27.928592Z", new_value: "2024-11-23T16:11:38.892049Z" }],
    },
    {
        date: "2024-11-23T16:24:28.036904Z",
        event_type: "BOOKING_SYSTEM_CANCELLED",
        user_id: 2,
        username: "admin",
        user_avatar: "https://hostie-image.s3.amazonaws.com/b5e98741-ee7d-4eec-b88b-e66e2a14effe.png",
        data_change: null,
    },
];

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

    const { detail, fetchDataDetail, confirmTransfer, cancelBooking, handleUpdateBookingSubmit, qr, fetchDataDetailBookingQR, logs, fetchBookingLogs } = useBookingListContext();

    const { createReport } = useReportListContext()

    const [openSidebar, setOpenSidebar] = useState(false);

    const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

    const [isEdit, setIsEdit] = useState(false);

    const [residenceId, setResidenceId] = useState()

    const [bookingId2, setBookingId] = useState()

    const [openReportDialog, setOpenReportDialog] = useState(false);

    const handleOpenReportDialog = () => setOpenReportDialog(true);

    const handleCloseReportDialog = () => setOpenReportDialog(false);


    const [openLogs, setOpenLogs] = useState(false);

    const handleOpenLogs = () => setOpenLogs(true);

    const handleCloseLogs = () => setOpenLogs(false);

    const handleReportSubmit = async (data: any, images: any) => {

        await createReport(residenceId, bookingId2, data.reportType, data.severity, data.title, data.description, images)
        handleCloseReportDialog()
    };


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
    }

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
                header: 'Mã Đặt Chỗ',
                size: 100,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'paid_amount',
                header: 'Số Tiền Cần Thanh Toán',
                size: 150,
                Cell: ({ cell }: any) => <Typography>{`${formattedAmount(cell.getValue())} `}</Typography>,
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
                accessorKey: 'is_customer_checkin',
                header: 'Nhận nơi lưu trú ',
                size: 100,
                Cell: ({ row, cell }: any) =>
                    renderBooleanChip(
                        cell.getValue(),
                        'Đã nhận',
                        'Chưa nhận',
                        row.original.status === 0
                    ),
            },
            {
                accessorKey: 'is_customer_out',
                header: 'Trả nơi lưu trú ',
                size: 100,
                Cell: ({ row, cell }: any) =>
                    renderBooleanChip(
                        cell.getValue(),
                        'Đã trả',
                        'Chưa trả',
                        row.original.status === 0
                    ),
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
                Cell: ({ row }: any) => {
                    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

                    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
                        setAnchorEl(event.currentTarget);
                    };

                    const handleClose = () => {
                        setAnchorEl(null);
                    };

                    const open = Boolean(anchorEl);
                    const id = open ? 'action-popover' : undefined;

                    return (
                        <>
                            <IconButton onClick={handleOpen}>
                                <MoreVerticalIcon />
                            </IconButton>
                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <List>
                                    {row.original.status === 0 ? (
                                        <>
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={() => {
                                                        fetchDataDetail(row.original.id);
                                                        handleViewBooking(row.original.id);
                                                        handleClose();
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <VisibilityIcon color="info" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Xem Chi Tiết" />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={() => {
                                                        handleOpenReportDialog();
                                                        handleClose();
                                                        setBookingId(row.original.id);
                                                        setResidenceId(row.original.residence_id);
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <ReportRounded color="warning" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Báo cáo vấn đề" />
                                                </ListItemButton>
                                            </ListItem>
                                        </>
                                    ) : (
                                        <>
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={async () => {
                                                        await fetchBookingLogs(row.original.id);
                                                        handleOpenLogs();
                                                        handleClose();
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <CalendarMonthRounded />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Xem nhật kí đặt nơi lưu trú" />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={() => {
                                                        fetchDataDetail(row.original.id);
                                                        handleViewBooking(row.original.id);
                                                        handleClose();
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <VisibilityIcon color="info" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Xem Chi Tiết" />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton
                                                    onClick={() => {
                                                        handleOpenConfirmationDialog(row.original.id);
                                                        handleClose();
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <CancelIcon color="error" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Hủy Đặt" />
                                                </ListItemButton>
                                            </ListItem>
                                            {row.original.is_seller_transfer && (
                                                <ListItem disablePadding>
                                                    <ListItemButton
                                                        onClick={() => {
                                                            handleOpenReportDialog();
                                                            setBookingId(row.original.id);
                                                            setResidenceId(row.original.residence_id);
                                                            handleClose();
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <ReportRounded color="warning" />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Báo cáo vấn đề" />
                                                    </ListItemButton>
                                                </ListItem>
                                            )}
                                            {!row.original.is_host_accept && (
                                                <ListItem disablePadding>
                                                    <ListItemButton
                                                        onClick={() => {
                                                            fetchDataDetail(row.original.id);
                                                            handleEditBooking(row.original.id);
                                                            handleClose();
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <EditIcon color="success" />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Sửa Đặt Nơi Lưu Trú" />
                                                    </ListItemButton>
                                                </ListItem>
                                            )}
                                            {row.original.is_host_accept && !row.original.is_seller_transfer && (
                                                <ListItem disablePadding>
                                                    <ListItemButton
                                                        onClick={() => {
                                                            fetchDataDetail(row.original.id);
                                                            fetchDataDetailBookingQR(row.original.id);
                                                            handleOpenDialog();
                                                            handleClose();
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <AttachMoneyIcon color="success" />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Chuyển Tiền" />
                                                    </ListItemButton>
                                                </ListItem>
                                            )}
                                        </>
                                    )}
                                </List>
                            </Popover>
                        </>
                    );
                },
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

            <ReportForm
                open={openReportDialog}
                onClose={handleCloseReportDialog}
                onSubmit={handleReportSubmit}
            />

            <BookingLogsModal logs={logs} open={openLogs} onClose={handleCloseLogs} />


            <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog}>
                <DialogTitle>Xác Nhận Hủy Đặt</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn hủy đặt này? Hành động này sẽ không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmationDialog} color="primary">
                        Đóng
                    </Button>
                    <Button onClick={handleConfirmCancellation} color="error">
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
