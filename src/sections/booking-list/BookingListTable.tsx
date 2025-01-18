/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Card,
  Grid,
  Divider,
  CardContent,
} from '@mui/material';
import { useBookingListContext } from 'src/auth/context/booking-list-context/BookingListContext';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { MRT_Localization_VI } from 'material-react-table/locales/vi'; // Import Vietnamese localization
import QRDialog from './QrCode';
import BookingDetailSidebar from './BookingDetailSideBar';
import { CalendarMonthRounded, ReportRounded } from '@mui/icons-material';
import { useReportListContext } from 'src/auth/context/report-list-context/ReportListContext';
import ReportForm from './ReportForm';
import BookingLogsModal from './BookingLogs';
import { MoreVerticalIcon } from 'lucide-react';
import { formattedAmount } from '../../utils/format-time';
import ServicePolicyList from '../service/service-detail/service-policy-list';
import { useSession } from 'next-auth/react';
import Chat from '@mui/icons-material/Chat';
import { useRouter } from 'next/navigation';
import RefundDialog from './RefundedDialog';
import SellerConfirmRefunded from './SellerConfirmReceiveDialog';
//  @api
import { get_refund } from 'src/api/cancelPolicy';
import { get_all_policy } from 'src/api/cancelPolicy';

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

  const router=useRouter()
  
  const [openDialog, setOpenDialog] = useState(false);

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);

  const {
    detail,
    fetchDataDetail,
    confirmTransfer,
    cancelBooking,
    handleUpdateBookingSubmit,
    qr,
    fetchDataDetailBookingQR,
    logs,
    fetchBookingLogs,
  } = useBookingListContext();

  const { data: session } = useSession();
  const { createReport } = useReportListContext();

  const [openSidebar, setOpenSidebar] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<BookingData | null|any>(null);

  const [isEdit, setIsEdit] = useState(false);

  const [residenceId, setResidenceId] = useState();

  const [bookingId2, setBookingId] = useState();

  const [viewPolicy, setViewPolicy] = useState(false);

  const [policyData, setPolicyData] = useState<any>(null);

  const [openReportDialog, setOpenReportDialog] = useState(false);

  const [openRefundedDialog, setOpenRefundedDialog] = useState(false);

  const [openSellerConfirmRefunded,setOpenSellerConfirmRefunded]= useState(false);

  const [refunded, setRefunded] = useState<any>(null);

  const handleOpenReportDialog = () => setOpenReportDialog(true);

  const handleCloseReportDialog = () => setOpenReportDialog(false);

  const [openLogs, setOpenLogs] = useState(false);

  const handleOpenLogs = () => setOpenLogs(true);

  const handleCloseLogs = () => setOpenLogs(false);

  const handleReportSubmit = async (data: any, images: any) => {
    await createReport(
      residenceId,
      bookingId2,
      data.reportType,
      data.severity,
      data.title,
      data.description,
      images
    );
    handleCloseReportDialog();
  };

  const handleViewBooking = (bookingId: number) => {
    const bookingDetails = rows.find((row) => row.id === bookingId);
    setSelectedBooking(bookingDetails || null);
    setOpenSidebar(true);
    setIsEdit(false);
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

  const formatCurrencyVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const columns: MRT_ColumnDef<BookingData>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Mã Đặt Chỗ',
        size: 60,
        Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
      },
      {
        accessorKey: 'residence_name',
        header: 'Tên căn hộ',
        size: 150,
        Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
      },
      {
        accessorKey: 'paid_amount',
        header: 'Tiền Cần Thanh Toán',
        size: 250,
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

        Cell: ({ cell, row }: any) => {
          console.log(row.original,'row')
          if (row.original.status === 0)
            return (
              <Chip
                label={row.original.is_refund &&!row.original.is_seller_receive_refund     ? 'Đã huỷ (chưa hoàn tiền)' : 'Đã huỷ '}
                variant="soft"
                color="error"
              />
            );

          return cell.getValue() === false ? (
            <Chip label="Chưa nhận" variant="soft" color="warning" />
          ) : (
            <Chip label="Đã nhận " variant="soft" color="success" />
          );
        },
      },
      {
        accessorKey: 'is_customer_checkout',
        header: 'Trả nơi lưu trú ',
        size: 100,
        Cell: ({ cell, row }: any) => {
          if (row.original.status === 0)
            return (
              <Chip
                label={row.original.is_refund &&!row.original.is_seller_receive_refund    ? 'Đã huỷ (chưa hoàn tiền)' : 'Đã huỷ '}
                variant="soft"
                color="error"
              />
            );

          return cell.getValue() === false ? (
            <Chip label="Chưa trả " variant="soft" color="warning" />
          ) : (
            <Chip label="Đã trả " variant="soft" color="success" />
          );
        },
      },
      {
        accessorKey: 'is_host_accept',
        header: 'Chấp Nhận Của Chủ',
        size: 120,
        Cell: ({ cell, row }: any) => {
          if (row.original.status === 0)
            return (
              <Chip
                label={row.original.is_refund &&!row.original.is_seller_receive_refund   ? 'Đã huỷ (chưa hoàn tiền)' : 'Đã huỷ '}
                variant="soft"
                color="error"
              />
            );

          return cell.getValue() === false ? (
            <Chip label="Chưa trả " variant="soft" color="default" />
          ) : (
            <Chip label="Đã xác nhận " variant="soft" color="success" />
          );
        },
      },
      {
        accessorKey: 'is_host_receive',
        header: 'Chủ Nhận',
        size: 120,
        Cell: ({ cell, row }: any) => {
          if (row.original.status === 0)
            return (
              <Chip
                label={row.original.is_refund &&!row.original.is_seller_receive_refund    ? 'Đã huỷ (chưa hoàn tiền)' : 'Đã huỷ '}
                variant="soft"
                color="error"
              />
            );

          return cell.getValue() === false ? (
            <Chip label="Chưa trả " variant="soft" color="default" />
          ) : (
            <Chip label="Đã nhận " variant="soft" color="success" />
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Thao tác',
        size: 60,
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
                    {!row.original.is_seller_receive_refund  && (
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => {
                              setOpenSellerConfirmRefunded(!openSellerConfirmRefunded)
                              setBookingId(row.original.id);
                            }}
                          >
                            <ListItemIcon>
                              <AttachMoneyIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Xác nhận đã nhận tiền" />
                          </ListItemButton>
                        </ListItem>
                      )}

                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            fetchDataDetail(row.original.id);
                            handleViewBooking(row.original.id);
                            handleClose();
                            setBookingId(row.original.id);
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
                            let id =session?.user.roles ==='HOST' ? row.original?.seller_id:row.original?.host_id 

                            router.push(`/dashboard/chat/?id=${id}`)
                          
                          }}
                        >
                          <ListItemIcon>
                          <Chat  />
                          </ListItemIcon>
                          <ListItemText primary={session?.user.roles ==='HOST' ? 'Nhắn tin cho môi giới':'Nhắn tin cho chủ nhà'} />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            handleOpenReportDialog();
                            handleClose();

                            setResidenceId(row.original.residence_id);
                          }}
                        >
                          <ListItemIcon>
                            <ReportRounded color="warning" />
                          </ListItemIcon>
                          <ListItemText primary="Báo cáo vấn đề" />
                        </ListItemButton>
                      </ListItem>
                      {!row.original.is_host_refund && session?.user.roles === 'HOST' &&row.original.is_refund && (
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => {
                              setOpenRefundedDialog(!openRefundedDialog)
                              // handleClose();
                              setSelectedBooking(row.original)
                              setResidenceId(row.original.residence_id);
                              setBookingId(row.original?.id)
                            }}
                          >
                            <ListItemIcon>
                              <AttachMoneyIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Hoàn tiền" />
                          </ListItemButton>
                        </ListItem>
                      )}
                    </>
                  ) : (
                    <>
                      
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {

                            let id =session?.user.roles ==='HOST' ? row.original?.seller_id:row.original?.host_id 
                          router.push(`/dashboard/chat/?id=${id}`)

                          }}
                        >
                          <ListItemIcon>
                          <Chat  />
                          </ListItemIcon>
                          <ListItemText primary={session?.user.roles ==='HOST' ? 'Nhắn tin cho môi giới':'Nhắn tin cho chủ nhà'}/>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            fetchDataDetail(row.original.id);
                            handleViewBooking(row.original.id);
                            handleClose();
                            setBookingId(row.original.id);
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
                            setResidenceId(row.original.residence_id);

                            handleOpenConfirmationDialog(row.original.id);
                            handleClose();
                            setBookingId(row.original.id);
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
                </List>
              </Popover>
            </>
          );
        },
      },
    ],
    [rows]
  );

  const get_refund_api = async (booking_id: any) => {
    const res = await get_refund(booking_id);
    setRefunded(res.data);

    return res;
  };

  const get_policy = async (residenceId: any) => {
    const res = await get_all_policy(residenceId);
    setPolicyData(res);
    return res;
  };

  useEffect(() => {
    get_refund_api(bookingId2);
  }, [bookingId2]);
  useEffect(() => {
    get_policy(residenceId);
  }, [residenceId]);
  

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

      <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog} sx={{width:'auto'}} fullWidth   maxWidth="xl">
        <DialogTitle>Xác Nhận Hủy Đặt</DialogTitle>
        <DialogContent sx={{width:'auto'}}>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đặt này? Hành động này sẽ không thể hoàn tác.
          </DialogContentText>
          <Divider sx={{ my: 2 }} />

          <Box onClick={() => setViewPolicy(!viewPolicy)} sx={{ color: 'blue', cursor: 'pointer' }}>
            Chính sách hủy?
          </Box>
          {viewPolicy && policyData !== null && (
            <Box>
              <ServicePolicyList data={policyData} type="cancelview" />
            </Box>
          )}
          {viewPolicy && policyData === null && <Box sx={{ py: 2 }}>Phí hủy mặc định là 100%</Box>}
          <Divider sx={{ my: 2 }} />

          <Card sx={{ maxWidth: 1200, margin: 'auto', mt: 4 ,width:1000}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chi tiết hoàn tiền
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body1" color="text.secondary">
                    Số tiền đã thanh toán:
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrencyVND(refunded?.paid_amount)}{' '}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" color="text.secondary">
                   Chủ nhà hoàn tiền cho bạn
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrencyVND(refunded?.host_refund)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" color="text.secondary">
                   Số tiền bạn cần hoàn cho khách hàng
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrencyVND(refunded?.seller_refund)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Chi tiết hoàn tiền:
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small" aria-label="refund details">
                  <TableBody>
                    {Array.isArray(refunded?.refund_detail) &&
                      refunded?.refund_detail.length > 0 &&
                      refunded?.refund_detail?.map((detail: any, index: number) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Ngày đặt:
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {new Date(detail.booking_date).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Giá đặt:
                              </Typography>
                            </TableCell>
                            <TableCell>{formatCurrencyVND(detail.booking_price)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Phí hủy:
                              </Typography>
                            </TableCell>
                            <TableCell>{detail.cancel_fee}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Phí hủy (cho Môi giới):
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {formatCurrencyVND(detail.cancel_fee_currency.for_seller)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Phí hủy (cho khách hàng):
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {formatCurrencyVND(detail.cancel_fee_currency.for_customer)}
                            </TableCell>
                          </TableRow>
                       
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                Hoàn tiền:
                              </Typography>
                            </TableCell>
                            <TableCell>
                              Chủ nhà hoàn : {formatCurrencyVND(detail.refund.host_refund)} | Tiền cần hoàn cho khách :{' '}
                              {formatCurrencyVND(detail.refund.seller_refund)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={2}>
                              <Divider />
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
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

      <RefundDialog open={openRefundedDialog} setOpen={setOpenRefundedDialog}  bookingSelected={selectedBooking} refunded={refunded}/>
      <BookingDetailSidebar
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        bookingDetails={detail}
        onSave={(updatedDetails) => {
          handleUpdateBookingSubmit(updatedDetails);
        }}
        isEditing={isEdit}
        bookingId={bookingId2}
      />

      <SellerConfirmRefunded open={openSellerConfirmRefunded} setOpen={setOpenSellerConfirmRefunded} booking_id={bookingId2}/>
    </>
  );
};

export default BookingListTable;
