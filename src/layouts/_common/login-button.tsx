// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Button from '@mui/material/Button';
// routes
import { RouterLink } from 'src/routes/components';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';

import { useRouter } from 'next/navigation';
// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  const router=useRouter()
  return (
    <Button onClick={()=>router.push('/auth/jwt/login')} variant="outlined" sx={{ mr: 1, ...sx }}>
      Đăng nhập
    </Button>
  );
}
