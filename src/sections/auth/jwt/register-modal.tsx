'use client ';
import { m, AnimatePresence } from 'framer-motion';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

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
import registerImage from 'public/assets/images/register.jpg';
// components
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';
import Image from 'next/image';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  onReset: VoidFunction;
  onDownloadPDF: VoidFunction;
}

export default function RegisterModal({ open, setOpen }: Props | any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('vnp_TransactionNo');
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
      <Typography variant="h4">Đăng ký thành công!</Typography>

      <Box>
        <Image alt="cct" width={300} height={300} src={registerImage} />
      </Box>

      {/* <OrderCompleteIllustration sx={{ height: 260 }} /> */}

      <Typography>
        Cảm ơn đã đăng ký trở thành thành viên của chúng tôi
        <br />
        <br />
        Vui lòng kiểm tra hộp thư để kích hoạt tài khoản
        <br /> Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, vui lòng liên hệ với chúng tôi. <br />
        <br />
        <a href={'https://mail.google.com/'}>Kiểm tra hộp thư</a>
        <br />
        <br />
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
          onClick={() => setOpen(!open)}
        >
          Đóng
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
