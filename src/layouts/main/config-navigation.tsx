// routes
import { paths } from 'src/routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
import { PositionedMenu } from './header';
import { title } from 'process';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Trang chủ',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
  },
  {
    title: 'Liên hệ chúng tôi',
    icon: <Iconify icon="solar:atom-bold-duotone" />,
    path: '/contact-us',
  },
  
  {
    title: 'Về chúng tôi',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: paths.about,
  },  {
    title: 'Gói dịch vụ',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: paths.pricing,
  },
];


export const navMobileConfig= [
  {
    title: 'Trang chủ',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
  },
  {
    title: 'Liên hệ chúng tôi',
    icon: <Iconify icon="solar:atom-bold-duotone" />,
    path: '/contact-us',
  },
  
  {
    title: 'Về chúng tôi',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: paths.about,
  },
  {
    title: 'Gói dịch vụ',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: paths.pricing,
  },
  {
    title: 'Đăng nhập',
    icon: <Iconify icon="solar:user-linear" />,
    path: paths.auth.jwt.login,
  }
];