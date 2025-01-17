/* eslint-disable no-unsafe-optional-chaining */
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
  InputAdornment,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useBooking } from 'src/auth/context/service-context/BookingContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useManageBookingResidencesContext } from 'src/auth/context/manage-book-residences-context/ManageBookingResidencesContext';
import { useBookingListContext } from 'src/auth/context/booking-list-context/BookingListContext';
import { MRT_Localization_VI } from 'material-react-table/locales/vi'; // Nhập localization tiếng Việt
import BookingDetailSidebar from '../booking-list/BookingDetailSideBar';
import { formatCurrency } from '../booking-service/Booking';
import BookingLogsModal from '../booking-list/BookingLogs';
import { CalendarMonthRounded } from '@mui/icons-material';
import { formattedAmount } from 'src/utils/format-time';
import toast from 'react-hot-toast';

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
  const [actionType, setActionType] = React.useState<
    'accept' | 'cancel' | 'confirmPayment' | 'notPayment'
  >('accept');
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  const {
    confirmBooking,
    cancelBooking,
    confirmReceiveMoney,
    bankList,
    fetchBookingLogs,
    logs,
    confirmNotReceiveMoney,
    fetchPriceQuotation,
    priceQuotation,
  } = useManageBookingResidencesContext();


  const { detail, fetchDataDetail } = useBookingListContext();
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const [openLogs, setOpenLogs] = React.useState(false);

  const handleOpenLogs = () => setOpenLogs(true);

  const handleCloseLogs = () => setOpenLogs(false);

  const handleViewBooking = () => {
    setOpenSidebar(true);
    setIsEdit(false);
  };
  const handleActionClick = async (
    type: 'accept' | 'cancel' | 'confirmPayment' | 'notPayment',
    rowId: number
  ) => {
    if (type === 'accept' && !bankList.length) {
      toast.error(
        'Bạn chưa có tài khoản ngân hàng hãy tạo tài khoản ngân hàng trước khi chấp nhận.'
      );
      return;
    }
    setActionType(type);
    setSelectedRowId(rowId);

    const row = rows.find((r) => r.id === rowId);
    if (!row) return;

    if (type === 'accept') {
      await fetchPriceQuotation(row.checkin, row.checkout, row.residence_id, row.id); // Fetch giá trị commission trước
    }

    setOpenDialog(true); // Mở form sau khi fetch xong
  };

  const validationSchema = Yup.object({
    bank: Yup.string().required('Vui lòng chọn ngân hàng'),
    commission: Yup.number()
      .required('Vui lòng nhập hoa hồng')
      .min(priceQuotation - 1, `Lớn hơn hoặc bằng ${priceQuotation}`)
      .max(100, 'Không vượt quá 100'),
  });
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = async (values?: {
    bank: any;
    commission: any;
    rejectionReason: any;
  }) => {
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
      await cancelBooking(row.id, formattedCheckin, formattedCheckout, values?.rejectionReason);
    } else if (actionType === 'confirmPayment') {
      await confirmReceiveMoney(row.id, formattedCheckin, formattedCheckout);
    } else if (actionType === 'notPayment') {
      await confirmNotReceiveMoney(row.id, formattedCheckin, formattedCheckout);
    }
    setOpenDialog(false);
  };
  const columns: MRT_ColumnDef<HoldData>[] = [
    {
      accessorKey: 'id',
      header: 'Mã đặt chỗ',
      size: 10,
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
      header: 'Tên Người Đặt',
      size: 200,
      Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
    },

    {
      accessorKey: 'total_amount',
      header: 'Tổng Số Tiền',
      size: 150,
      Cell: ({ cell }: any) => (
        <Typography>{`${formattedAmount(cell.getValue() || 0)} `}</Typography>
      ),
    },

    {
      accessorKey: 'paid_amount',
      header: 'Số Tiền Cần Thanh Toán',
      size: 150,
      Cell: ({ cell }: any) => <Typography>{`${formattedAmount(cell.getValue())} `}</Typography>,
    },
    {
      accessorKey: 'charge_amount',
      header: 'Phụ Phí ',
      size: 150,
      Cell: ({ cell }: any) => (
        <Typography>{`${formattedAmount(cell.getValue() || 0)} `}</Typography>
      ),
    },
    {
      accessorKey: 'is_customer_checkin',
      header: 'Nhận nơi lưu trú ',
      size: 100,
      Cell: ({ row, cell }: any) =>
        renderBooleanChip(cell.getValue(), 'Đã nhận', 'Chưa nhận', row.original.status === 0),
    },
    {
      accessorKey: 'is_customer_checkout',
      header: 'Trả nơi lưu trú ',
      size: 100,
      Cell: ({ row, cell }: any) =>
        renderBooleanChip(cell.getValue(), 'Đã trả', 'Chưa trả', row.original.status === 0),
    },
    {
      accessorKey: 'is_seller_transfer',
      header: 'Chuyển Giao',
      size: 100,
      Cell: ({ row, cell }: any) =>
        renderBooleanChip(cell.getValue(), 'Đã Chuyển', 'Chưa Chuyển', row.original.status === 0),
    },
    {
      accessorKey: 'action',
      header: 'Hành Động',
      size: 100,
      Cell: ({ row }: any) => {
        const { status } = row.original;
        return (
          <Box display="flex">
            {status === 0 ? (
              <Tooltip title="Xem chi tiết ">
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
                <Tooltip title="Xác nhận đặt nơi lưu trú">
                  <IconButton
                    color="success"
                    onClick={() => {
                      handleActionClick('accept', row.original.id);
                    }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Hủy đặt nơi lưu trú">
                  <IconButton
                    color="error"
                    onClick={() => handleActionClick('cancel', row.original.id)}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xem chi tiết ">
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
            ) : status === 2 ? (
              row.original.is_host_receive ? (
                
                  <Tooltip title="Xem chi tiết ">
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
                  <Tooltip title="Xác nhận chưa  nhận tiền">
                    <IconButton
                      color="error"
                      onClick={() => handleActionClick('notPayment', row.original.id)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xem chi tiết ">
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
            <Tooltip title="Xem nhật kí đặt nơi lưu trú">
                    <IconButton
                      color="info"
                      onClick={async () => {
                        await fetchBookingLogs(row.original.id);
                        handleOpenLogs();
                      }}
                    >
                      <CalendarMonthRounded />
                    </IconButton>
                  </Tooltip>
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
      label={isCanceled ? 'Hủy đặt' : value ? trueLabel : falseLabel}
      color={isCanceled ? 'error' : value ? 'success' : 'warning'}
      variant="soft"
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

          {actionType === 'cancel' && (
            <Formik
              initialValues={{ rejectionReason: '' }}
              validationSchema={Yup.object({
                rejectionReason: Yup.string().required('Vui lòng nhập lý do từ chối.'),
              })}
              onSubmit={(values) => handleConfirmAction(values)}
            >
              {({ errors, touched, handleSubmit, handleChange, values }) => (
                <Form onSubmit={handleSubmit}>
                  <TextField
                    name="rejectionReason"
                    label="Lý Do Từ Chối"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    multiline
                    rows={3}
                    error={touched.rejectionReason && Boolean(errors.rejectionReason)}
                    helperText={touched.rejectionReason && errors.rejectionReason}
                  />
                  <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                      Hủy
                    </Button>
                    <Button type="submit" color="error" autoFocus>
                      Xác Nhận
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}

          {actionType !== 'cancel' && actionType === 'accept' && (
            <Formik
              initialValues={{ bank: '', commission: priceQuotation }}
              validationSchema={validationSchema}
              onSubmit={(values: any) => handleConfirmAction(values)}
            >
              {({ errors, touched, handleSubmit, setFieldValue, handleChange, values }) => (
                <Form onSubmit={handleSubmit}>
                  <Autocomplete
                    id="bank-autocomplete"
                    options={bankList || []}
                    getOptionLabel={(option: any) => option.bank.vnName || ''}
                    onChange={(event, value) => {
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
                    margin="normal"
                    onChange={handleChange}
                    value={values.commission}
                    error={touched.commission && Boolean(errors.commission)}
                    helperText={touched.commission && errors.commission}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>, // Thêm dấu %
                    }}
                  />
                  <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                      Hủy
                    </Button>
                    <Button type="submit" color="success" autoFocus>
                      Xác Nhận
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
          {actionType === 'confirmPayment' && (
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Hủy
              </Button>
              <Button onClick={() => handleConfirmAction()} color="success" autoFocus>
                Xác Nhận
              </Button>
            </DialogActions>
          )}
          {actionType === 'notPayment' && (
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Hủy
              </Button>
              <Button onClick={() => handleConfirmAction()} color="success" autoFocus>
                Xác Nhận
              </Button>
            </DialogActions>
          )}
        </DialogContent>
      </Dialog>

      <BookingDetailSidebar
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        bookingDetails={detail}
        onSave={(updatedDetails) => {
        }}
        isEditing={isEdit}
        bookingId={detail?.booking?.id}
      />

      <BookingLogsModal logs={logs} open={openLogs} onClose={handleCloseLogs} />
    </>
  );
};

export default ManageBookingResidencesTable;
