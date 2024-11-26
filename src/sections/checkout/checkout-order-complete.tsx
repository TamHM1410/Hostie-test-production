import { m, AnimatePresence } from 'framer-motion';
import { useRouter,useParams,useSearchParams } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// assets
import { OrderCompleteIllustration } from 'src/assets/illustrations';
// components
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  onReset: VoidFunction;
  onDownloadPDF: VoidFunction;
}

export default function CheckoutOrderComplete({ open}: Props|any) {
  const router=useRouter()
  const searchParams=useSearchParams()
  const code =searchParams.get('vnp_TransactionNo')
  console.log(code,'code')
  const renderContent = (
    <Stack
      spacing={5}
      sx={{
        m: 'auto',
        maxWidth: 480,
        textAlign: 'center',
        px: { xs: 2, sm: 0 },
      }}
    >
      <Typography variant="h4">Cảm ơn!</Typography>

      <OrderCompleteIllustration sx={{ height: 260 }} />

      <Typography>
        Cảm ơn đã đăng ký gói sử dụng dịch vụ của chúng tôi
        <br />
        <br />
        <Link>Mã giao dịch: {code}</Link>
        <br />
        <br />
        Chúng tôi sẽ gửi cho bạn thông báo trong vòng 5 ngày .
        <br /> Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, vui lòng liên hệ với chúng tôi.. <br /> <br />
        Chúc bạn một ngày tốt lành,
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        justifyContent="space-between"
        direction={{ xs: 'column-reverse', sm: 'row' }}
      >
       
        <Button
          fullWidth
          size="large"
          variant="contained"
          startIcon={<Iconify icon="hugeicons:dashboard-circle" />}
          onClick={()=>router.push('/dashboard')}

        >
          Về trang quản lí
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          fullScreen
          open={open}
          PaperComponent={(props: PaperProps) => (
            <Box
              component={m.div}
              {...varFade({
                distance: 120,
                durationIn: 0.32,
                durationOut: 0.24,
                easeIn: 'easeInOut',
              }).inUp}
              sx={{
                width: 1,
                height: 1,
                p: { md: 3 },
              }}
            >
              <Paper {...props}>{props.children}</Paper>
            </Box>
          )}
        >
          {renderContent}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
