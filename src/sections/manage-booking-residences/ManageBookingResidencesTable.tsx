/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import * as React from 'react';
import {
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    Autocomplete,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useManageBookingResidencesContext } from 'src/auth/context/manage-book-residences-context/ManageBookingResidencesContext';
import { useBookingListContext } from 'src/auth/context/booking-list-context/BookingListContext';
import { MRT_Localization_VI } from 'material-react-table/locales/vi'; // Nhập localization tiếng Việt
import BookingDetailSidebar from '../booking-list/BookingDetailSideBar';

const validationSchema = Yup.object({
    bank: Yup.string().required('Vui lòng chọn ngân hàng'),
    commission: Yup.number()
        .required('Vui lòng nhập hoa hồng')
        .min(10, 'Lớn hơn 10')
        .max(100, 'Không vượt quá 100'),
});

interface HoldData {
    id: number;
    residence_id: number;
    seller_id: number;
    total_amount: number;
    paid_amount: number;
    checkin: string;
    checkout: string;
    guest_name: string | null;
    guest_phone: string | null;
    is_host_accept: boolean;
    is_seller_transfer: boolean;
    is_host_receive: boolean;
    status: number;
}

const ManageBookingResidencesTable: React.FC<{ rows: HoldData[] }> = ({ rows }) => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [actionType, setActionType] = React.useState<'accept' | 'cancel' | 'confirmPayment'>(
        'accept'
    );
    const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
    const { confirmBooking, cancelBooking, confirmReceiveMoney, bankList } =
        useManageBookingResidencesContext();
    const { detail, fetchDataDetail } = useBookingListContext();
    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const handleViewBooking = () => {
        setOpenSidebar(true);
        setIsEdit(false);
    };
    const handleActionClick = (type: 'accept' | 'cancel' | 'confirmPayment', rowId: number) => {
        setActionType(type);
        setSelectedRowId(rowId);
        setOpenDialog(true);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleConfirmAction = async (values?: { bank: any; commission: any }) => {
        if (selectedRowId === null) return;
        const row = rows.find((r) => r.id === selectedRowId);
        if (!row) return;
        const formattedCheckin = row.checkin;
        const formattedCheckout = row.checkout;
        if (actionType === 'accept') {
            await confirmBooking(
                row.id,
                formattedCheckin,
                formattedCheckout,
                values?.bank,
                values?.commission
            );
        } else if (actionType === 'cancel') {
            await cancelBooking(row.id, formattedCheckin, formattedCheckout);
        } else if (actionType === 'confirmPayment') {
            await confirmReceiveMoney(row.id, formattedCheckin, formattedCheckout);
        }
        setOpenDialog(false);
    };
    const columns: MRT_ColumnDef<HoldData>[] = [
        {
            accessorKey: 'id',
            header: 'ID Giữ Chỗ',
            size: 100,
            Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: 'residence_name',
            header: 'Tên Nơi Lưu Trú',
            size: 200,
            Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: 'seller_name',
            header: 'Tên Người Bán',
            size: 200,
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
            accessorKey: 'total_amount',
            header: 'Tổng Số Tiền',
            size: 150,
            Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: 'paid_amount',
            header: 'Số Tiền Đã Thanh Toán',
            size: 150,
            Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: 'guest_name',
            header: 'Tên Khách',
            size: 200,
            Cell: ({ cell }: any) => <Typography>{cell.getValue() || 'Không có'}</Typography>,
        },
        {
            accessorKey: 'guest_phone',
            header: 'Điện Thoại Khách',
            size: 150,
            Cell: ({ cell }: any) => <Typography>{cell.getValue() || 'Không có'}</Typography>,
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
            size: 150,
            Cell: ({ row }: any) => {
                const { status } = row.original;
                return (
                    <Box display="flex">
                        {status === 0 ? (
                            <Tooltip title="Xem chi tiết nơi lưu trú">
                                <IconButton
                                    color="info"
                                    onClick={() => {
                                        fetchDataDetail(row.original.id);
                                        handleViewBooking();
                                    }}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                        ) : status === 1 ? (
                            <>
                                <Tooltip title="Xác nhận đã giữ chỗ">
                                    <IconButton
                                        color="success"
                                        onClick={() => handleActionClick('accept', row.original.id)}
                                    >
                                        <CheckCircleIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Hủy giữ chỗ">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleActionClick('cancel', row.original.id)}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        ) : status === 2 ? (
                            row.original.is_host_receive ? (
                                <Tooltip title="Xem chi tiết nơi lưu trú">
                                    <IconButton
                                        color="info"
                                        onClick={() => {
                                            fetchDataDetail(row.original.id);
                                            handleViewBooking();
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <>
                                    <Tooltip title="Xác nhận đã nhận tiền">
                                        <IconButton
                                            color="success"
                                            onClick={() => handleActionClick('confirmPayment', row.original.id)}
                                        >
                                            <CheckCircleIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xem chi tiết nơi lưu trú">
                                        <IconButton
                                            color="info"
                                            onClick={() => {
                                                fetchDataDetail(row.original.id);
                                                handleViewBooking();
                                            }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                        ) : null}
                    </Box>
                );
            },
        },
    ];

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

    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={rows || []}
                enablePagination
                enableSorting
                localization={MRT_Localization_VI}
                enableTopToolbar
            />
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Xác Nhận Thao Tác</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn{' '}
                        {actionType === 'accept'
                            ? 'chấp nhận'
                            : actionType === 'cancel'
                                ? 'hủy'
                                : 'xác nhận đã nhận tiền'}{' '}
                        cho đơn đặt nơi lưu trú này? Thao tác này không thể hoàn tác.
                    </DialogContentText>

                    {actionType === 'accept' && (
                        <Formik
                            initialValues={{ bank: '', commission: 10 }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => handleConfirmAction(values)}
                        >
                            {({ errors, touched, handleSubmit, setFieldValue, handleChange, initialValues }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Autocomplete
                                        id="bank-autocomplete"
                                        options={bankList || []}
                                        getOptionLabel={(option: any) => option.bank.vnName || ''} // Display the bank name
                                        onChange={(event, value) => {
                                            // Set Formik field value when an option is selected
                                            setFieldValue('bank', value?.id || '');
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Ngân hàng"
                                                fullWidth
                                                margin="normal"
                                                error={touched.bank && Boolean(errors.bank)}
                                                helperText={touched.bank && errors.bank}
                                            />
                                        )}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                    />
                                    <TextField
                                        name="commission"
                                        label="Hoa hồng"
                                        type="number"
                                        fullWidth
                                        onChange={handleChange}
                                        margin="normal"
                                        error={touched.commission && Boolean(errors.commission)}
                                        helperText={touched.commission && errors.commission}
                                    />
                                    <DialogActions>
                                        <Button onClick={handleDialogClose}>Hủy</Button>
                                        <Button type="submit" color="primary" autoFocus>
                                            Xác Nhận
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    )}
                    {actionType !== 'accept' && (
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Hủy</Button>
                            <Button onClick={() => handleConfirmAction()} color="primary" autoFocus>
                                Xác Nhận
                            </Button>
                        </DialogActions>
                    )}
                </DialogContent>
            </Dialog>
            <BookingDetailSidebar
                open={openSidebar}
                onClose={() => setOpenSidebar(false)}
                bookingDetails={detail?.booking}
                onSave={(updatedDetails) => {
                    console.log(updatedDetails);
                }}
                isEditing={isEdit}
            />
        </>
    );
};

export default ManageBookingResidencesTable;
