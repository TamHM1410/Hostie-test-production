// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
// utils
// components
// ----------------------------------------------------------------------
function getVietnameseText(eventCode: any): any {
  switch (eventCode) {
    case 'BOOKING_CREATED':
      return 'Đặt chỗ mới đã được tạo';
    case 'BOOKING_UPDATED':
      return 'Đặt chỗ đã được cập nhật';
    case 'BOOKING_CANCELLED':
      return 'Đặt chỗ đã bị hủy';
    case 'HOST_ACCEPTED_BOOKING':
      return 'Chủ nhà đã chấp nhận đặt chỗ';
    case 'HOST_REJECTED_BOOKING':
      return 'Chủ nhà đã từ chối đặt chỗ';
    case 'SELLER_TRANSFERRED':
      return 'Người môi giới đã chuyển tiền';
    case 'HOST_RECEIVED':
      return 'Chủ nhà đã nhận tiền';
    case 'HOST_DONT_RECEIVED':
      return 'Chủ nhà chưa nhận tiền';
    case 'HOLD_CREATED':
      return 'Yêu cầu giữ chỗ mới đã được tạo';
    case 'HOST_ACCEPTED_HOLD':
      return 'Chủ nhà đã chấp nhận giữ chỗ';
    case 'HOST_REJECTED_HOLD':
      return 'Chủ nhà đã từ chối giữ chỗ';
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
    entity_details: any
  };
};

export default function NotificationItem({ notification }: NotificationItemProps) {

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(getVietnameseText(notification.event_code))}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >

          {`Đơn hàng có id là : ${notification.entity_details.id}`}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = notification.isUnRead && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );



  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='success'>
        Chấp nhận
      </Button>
      <Button size="small" variant="outlined" color='error'>
        Hủy
      </Button>
    </Stack>
  );

  const bookNow = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='success'>
        Đặt Ngay
      </Button>
      <Button size="small" variant="outlined" color='error'>
        Hủy
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
      <Button size="small" variant="contained" color='success'>
        Đã nhận
      </Button>
      <Button size="small" variant="outlined" color='error'>
        Chưa nhận
      </Button>
    </Stack>
  );

  const paymentAction = (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" color='success'>
        Thanh toán
      </Button>
      <Button size="small" variant="outlined" color='error'>
        Hủy
      </Button>
    </Stack>
  );
  const renderAction = () => {
    switch (notification.event_code) {
      case 'BOOKING_CREATED':
      case 'BOOKING_UPDATED':
      case 'HOLD_CREATED':
        return friendAction;
      case 'HOST_ACCEPTED_BOOKING':
        return paymentAction;
      case 'SELLER_TRANSFERRED':
        return confirm;
      case 'HOST_DONT_RECEIVED':
        return complain;
      case 'HOST_ACCEPTED_HOLD':
        return bookNow;
      default:
        return null;
    }
  };
  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderUnReadBadge}



      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {renderAction()}
      </Stack>
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function reader(data: any) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
