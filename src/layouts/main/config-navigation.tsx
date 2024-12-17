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
    title: 'Câu hỏi thường gặp',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: paths.faqs,
  },
  {
    title: 'Dashboard',
    icon: <Iconify icon="ic:round-dashboard" />,
    path: paths.dashboard.root,
  }
];