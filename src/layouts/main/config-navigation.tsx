// routes
import { paths } from 'src/routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';

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
    title: 'Câu hỏi thường gặp',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: paths.faqs,
  },
];
