/* eslint-disable no-lonely-if */
import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Typography } from '@mui/material';
import { useSocket } from 'src/auth/context/socket-message-context/SocketMessageContext';
import QRDialog from 'src/sections/booking-list/QrCode';
import HoldActionDialog from './HoldDialogConfirm';
import ActionDialog from './DialogBookingConFirm';
import BookingDialog from './DialogBookingForm';




function getVietnameseText(eventCode: any): any {
  switch (eventCode) {
    case 'BOOKING_CREATED':
      return 'Bạn có đơn đặt nơi lưu trú mới';
    case 'BOOKING_UPDATED':
      return 'Có 1 đơn đặt nơi lưu trú đã được update thông tin';
    case 'BOOKING_CANCELLED':
      return 'Có 1 đơn đặt nơi lưu trú đã bị hủy';
    case 'HOST_ACCEPTED_BOOKING':
      return 'Chủ nơi lưu trú đã chấp nhận đơn đặt nơi lưu trú của bạn';
    case 'HOST_REJECTED_BOOKING':
      return 'Chủ nơi lưu trú đã từ chối đơn đặt nơi lưu trú của bạn';
    case 'SELLER_TRANSFERRED':
      return 'Người môi giới đã chuyển tiền cho bạn';
    case 'HOST_RECEIVED':
      return 'Chủ nơi lưu trú chưa nhận được tiền của bạn';
    case 'HOST_DONT_RECEIVED':
      return 'Chủ nơi lưu trú đã nhận được tiền đơn của bạn đã hoàn tất';
    case 'HOLD_CREATED':
      return 'Bạn có đơn giữ nơi lưu trú mới';
    case 'HOST_ACCEPTED_HOLD':
      return 'Chủ nơi lưu trú đã chấp nhận giữ chỗ của bạn';
    case 'HOST_REJECTED_HOLD':
      return 'Chủ nơi lưu trú đã từ chối đơn giữ chỗ của bạn';
    case 'BOOKING_SYSTEM_CANCELLED':
      return 'Đơn đặt nơi lưu trú đã bị hủy.';
    default:
      return 'Thông báo mới';
  }
}


type NotificationItemProps = {
  notification: {
    id: string;
    title: string;
    category: string;
    createdAt: Date;
    isUnRead: boolean;
    type: string;
    avatarUrl: string | null;
    event_code: string | null;
    entity_details: any;
  };
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { confirmBooking, cancelBooking, cancelConfirmBooking, confirmReceiveMoney, bankList, confirmHold, cancelHold, handleBookingSubmit, customerList, confirmTransfer, fetchDataDetailBookingQR, qr } = useSocket();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isHoldAction, setIsHoldAction] = React.useState(false);  // New state for determining the action type
  const [activeModal, setActiveModal] = React.useState<'hold' | 'booking' | 'action' | 'transfer' | null>(null);
  const [actionType, setActionType] = React.useState<'accept' | 'cancel' | 'confirmPayment'>('accept');
  const handleOpenModal = (type: 'accept' | 'cancel' | 'confirmPayment', modal: 'hold' | 'booking' | 'action' | 'transfer') => {
    setActiveModal(modal);
    setActionType(type);
    setOpenDialog(true)
  }


  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = async (values: { bank?: string; commission?: number; rejectionReason: string }) => {
    if (activeModal === 'hold') {
      if (actionType === 'accept') {
        await confirmHold(notification.entity_details.id, notification.entity_details.checkin, notification.entity_details.checkout);
      } else if (actionType === 'cancel') {
        await cancelHold(notification.entity_details.id, notification.entity_details.checkin, notification.entity_details.checkout, values.rejectionReason);
      }
    } if (activeModal === 'action') {
      if (actionType === 'accept') {
        await confirmBooking(notification.entity_details.id, notification.entity_details.checkin, notification.entity_details.checkout, values.bank, values.commission);
      } else if (actionType === 'cancel') {
        await cancelConfirmBooking(notification.entity_details.id, notification.entity_details.checkin, notification.entity_details.checkout, values.rejectionReason);
      } else if (actionType === 'confirmPayment') {
        await confirmReceiveMoney(notification.entity_details.id, notification.entity_details.checkin, notification.entity_details.checkout);
      }
    }
    setOpenDialog(false);
  };


  const handleTransfer = (id: any, checkin: any, checkout: any, commission_rate: any) => {
    confirmTransfer(id, checkin, checkout, commission_rate);
    handleDialogClose();
  };
  const handleRedirect = () => {
    // Redirect to the specific booking or hold page based on the event
    if (notification.event_code === 'BOOKING_CREATED' || notification.event_code === 'BOOKING_UPDATED') {
      router.push(`/booking/${notification.entity_details.id}`);
    } else if (notification.event_code === 'HOLD_CREATED' || notification.event_code === 'HOST_ACCEPTED_HOLD') {
      router.push(`/hold/${notification.entity_details.id}`);
    }
  };
  const renderText = (
    <ListItemText
      disableTypography
      primary={getVietnameseText(notification.event_code)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={<Box sx={{ width: 2, height: 2, bgcolor: 'currentColor', mx: 0.5, borderRadius: '50%' }} />}
        >
          {`Đơn đặt (giữ) nơi lưu trú có mã là : ${notification.entity_details.id}`}
        </Stack>
      }
    />
  );

  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='success' onClick={() => { handleOpenModal('accept', 'action') }}>
        Chấp nhận
      </Button>
      <Button size="small" variant="outlined" color='error' onClick={() => { handleOpenModal('cancel', 'action') }}>
        Hủy
      </Button>
    </Stack>
  );
  const acceptOrCancelHold = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='success' onClick={() => { handleOpenModal('accept', 'hold') }}>
        Chấp nhận
      </Button>
      <Button size="small" variant="outlined" color='error' onClick={() => { handleOpenModal('cancel', 'hold') }}>
        Hủy
      </Button>
    </Stack>
  );
  const bookNow = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='success' onClick={() => { handleOpenModal('accept', 'booking'); }}>
        Đặt Ngay
      </Button>
    </Stack>
  );

  const complain = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='warning'>
        Báo cáo sử lí
      </Button>
    </Stack>
  );


  const confirm = (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='success' onClick={() => { handleOpenModal('confirmPayment', 'action') }}>
        Đã nhận
      </Button>
      <Button size="small" variant="outlined" color='error'>
        Chưa nhận
      </Button>
    </Stack>
  );

  const paymentAction = (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='success' onClick={() => { fetchDataDetailBookingQR(notification.entity_details.id); handleOpenModal('accept', 'transfer') }}>
        Thanh toán ngay
      </Button>
    </Stack>
  );

  //  case 'BOOKING_UPDATED':
  //   return notification.entity_details.is_host_accept === true ? <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography> : friendAction;
  //       case 'HOLD_CREATED':
  //   return notification.entity_details.is_host_accept === true ? <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography> : acceptOrCancelHold;
  //       case 'HOST_ACCEPTED_BOOKING':
  //   return notification.entity_details.is_seller_transfer === true ? <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography> : paymentAction;
  //       case 'SELLER_TRANSFERRED':
  //   return notification.entity_details.is_host_receive === true ? <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography> : confirm;
  //       case 'HOST_ACCEPTED_HOLD':
  //   return bookNow;

  const renderAction = () => {
    switch (notification.event_code) {
      case 'HOST_REJECTED_BOOKING':
        return <Typography sx={{ marginTop: 1, }}>Đơn của bạn đã bị từ chối với lí do : {notification?.entity_details?.reason_reject}</Typography>;
      case 'HOST_REJECTED_HOLD':
        return <Typography sx={{ marginTop: 1, }}>Đơn của bạn đã bị từ chối với lí do : {notification?.entity_details?.reason_reject}</Typography>;
      case 'HOLD_CANCELLED':
        return `Đơn của bạn đã bị từ chối với lí do : ${notification?.entity_details?.reason_reject}`;
      case 'BOOKING_CREATED':
      case 'BOOKING_UPDATED':
        return <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography>
      case 'HOLD_CREATED':
        return <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography>
      case 'HOST_ACCEPTED_BOOKING':
        return <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography>
      case 'SELLER_TRANSFERRED':
        return <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography>
      case 'HOST_ACCEPTED_HOLD':
        return <Typography sx={{ marginTop: 1, color: "#30e0ff" }}></Typography>;
      default:
        return null;
    }
  };



  return (
    <>
      <ListItemButton
        disableRipple
        sx={{ p: 2.5, alignItems: 'flex-start', borderBottom: (theme) => `dashed 1px ${theme.palette.divider}` }}

      >

        <Stack sx={{ flexGrow: 1 }}>
          {renderText}
          {renderAction()}
        </Stack>
      </ListItemButton>



      {activeModal === 'booking' && (<BookingDialog
        isOpen={openDialog}
        handleClose={handleDialogClose}
        notification={notification}
        customerList={customerList}
        handleBookingSubmit={handleBookingSubmit}
      />)}


      {activeModal === 'transfer' && (<QRDialog
        open={openDialog}
        onClose={handleDialogClose}
        qrDetails={qr}
        onTransfer={() =>
          handleTransfer(
            notification?.entity_details?.id,
            notification?.entity_details?.checkin,
            notification?.entity_details?.checkout,
            notification.entity_details?.commission_rate
          )
        }
      />)}


      {activeModal === 'hold' && (
        <HoldActionDialog
          open={openDialog}
          onClose={handleDialogClose}
          actionType={actionType}
          onConfirm={handleConfirmAction}
        />
      )}


      {activeModal === 'action' && <ActionDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleConfirmAction}
        actionType={actionType}
        bankList={bankList}
        notification={notification}
      />
      }

    </>
  );
}
