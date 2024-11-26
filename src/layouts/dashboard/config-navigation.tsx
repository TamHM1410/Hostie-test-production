import { useMemo } from 'react';

/// nextauth
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';

import { useRouter } from 'next/navigation';

import { useGetUserCurrentRole } from 'src/zustand/user';
// components

import SvgColor from 'src/components/svg-color';

import { Icon } from '@iconify/react';
// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();



  const router = useRouter();

  const { userCurrentRole } = useGetUserCurrentRole();


  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: "Tổng quan",
        items: [
          {
            title: "Ứng dụng",
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'Quản lý',
        items: [
          // USER
          {
            title: 'Người dùng',
            path: '/dashboasrsdsdsa',
            icon: ICONS.user,
            children: [
              { title: 'Quản lý người dùng', path: paths.dashboard.user.root },
              { title: 'Quản lý quyền ', path: paths.dashboard.user.roles },
            ],
          },
          {
            title: "Cư trú",
            path: paths.dashboard.residence.root,
            icon: ICONS.tour,
            children: [{ title: 'Loại cư trú', path: paths.dashboard.residence.type }],
          },
          {
            title: 'Gói',
            path: paths.dashboard.package,
            icon: ICONS.ecommerce,
          },
          {
            title: 'Tiện ích',
            path: paths.dashboard.amenity,
            icon: ICONS.label,
          },
          {
            title: 'Giao dịch',
            path: '/dashboard/transactions',
            icon: <Icon icon="hugeicons:bitcoin-transaction" style={{ width: 40, height: 40 }} />,
          },
          {
            title: 'Báo cáo vi phạm',
            path: '/dashboard/report',
            icon: <Icon icon="tabler:report-off" style={{ width: 40, height: 40 }} />,
          },
        ],
      },
      {
        subheader: 'Khác',
        items: [
          // USER
          {
            title: 'Tin nhắn',
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
          { title: 'Tài khoản', path: paths.dashboard.user.account, icon: ICONS.user },
        ],
      },
    ],

    [t]
  );

  const bulterNav = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: "Tổng quan",
        items: [

          {
            title: 'Căn hộ đang làm việc',
            path: '/dashboard/housekeepers',
            icon: ICONS.ecommerce,
          },

          {
            title: 'Tài khoản',
            path: '/dashboard/user/account',
            icon: ICONS.user,
          },
        ],
      },
    ],
    [t]
  );
  const userNav = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: "Tổng quan",
        items: [

          

          {
            title: 'Tài khoản',
            path: '/dashboard/user/account',
            icon: ICONS.user,
          },
        ],
      },
    ],
    [t]
  );
  const hostNav = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Tổng quan',
        items: [

          {
            title: 'Phân tích',
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
          {
            title: "Đặt dịch vụ",
            path: paths.dashboard.general.booking,
            icon: ICONS.booking,
          },
          {
            title: "Dịch vụ",
            path: paths.dashboard.service,
            icon: <Icon icon="carbon:stay-inside" style={{ width: 35, height: 35 }} />,
          },

          {
            title: 'Danh sách ',
            path: 'hidsshisd',
            icon: <Icon icon="fluent-mdl2:reservation-orders" style={{ width: 35, height: 35 }} />,
            children: [
              {
                title: t('booking residence list'),
                path: paths.dashboard.bookingList,
              },
              {
                title: t('hold  residence list'),
                path: paths.dashboard.hold_residence,
              },

            ],
          },
          {
            title: 'Quản lý ',
            path: 'dsihsdhis',
            icon: ICONS.job,
            children: [
              {
                title: 'Quản lý đặt phòng',
                path: paths.dashboard.manage_booking_residence,
              },
              {
                title: 'Quản lý giữ ',
                path: paths.dashboard.manage_hold_residence,
              },
              {
                title: 'Quản lý khách hàng',
                path: paths.dashboard.manage_customer,
              },
              {
                title: t('Quản lí báo cáo'),
                path: paths.dashboard.report_list,
              },
            ],
          },
          {
            title: 'Quản gia',
            path: '/dashboard/butler',
            icon: <Icon icon="fa:users" />,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------

      {
        subheader: 'Khác',
        items: [
          // USER
          {
            title: 'Tin nhắn',
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
          { title: 'Tài khoản', path: paths.dashboard.user.account, icon: ICONS.user },
          {
            title: 'Gói của bạn',
            path: '/dashboard/yourpackage',
            icon: <Icon icon="hugeicons:work-history" style={{ width: 35, height: 35 }} />,
          },
        ],
      },
    ],

    [t]
  );
  const seller = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Tổng quan',
        items: [

          {
            title: "Phân tích",
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
          {
            title: 'Đặt dịch vụ',
            path: paths.dashboard.general.booking,
            icon: ICONS.booking,
          },
          {
            title: 'Danh sách ',
            path: '/dashboard/booking/xxxdsd',
            icon: <Icon icon="fluent-mdl2:reservation-orders" style={{ width: 35, height: 35 }} />,

            children: [
              {
                title: "Danh sách đặt",
                path: paths.dashboard.bookingList,
              },
              {
                title: "Danh sách giữ ",
                path: paths.dashboard.hold_residence,
              },

            ],
          }, {
            title: 'Quản lý ',
            path: 'dsihsdhis',
            icon: ICONS.job,
            children: [
              {
                title: 'Quản lý khách hàng',
                path: paths.dashboard.manage_customer,
              },
              {
                title: 'Quản lý báo cáo',
                path: paths.dashboard.report_list,
              },

            ],
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------

      {
        subheader: "Khác",
        items: [
          // USER
          {
            title: "Tin nhắn",
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
          { title: "Tài khoản", path: paths.dashboard.user.account, icon: ICONS.user },
          {
            title: 'Gói của bạn',
            path: '/dashboard/yourpackage',
            icon: <Icon icon="hugeicons:work-history" style={{ width: 35, height: 35 }} />,
          },
        ],
      },
    ],

    [t]
  );
  switch (userCurrentRole) {
    case 'HOUSEKEEPER':
      return bulterNav;
    case 'ADMIN':
      return data;
    case 'SELLER':
      return seller;
    case 'HOST':
      return hostNav;
    case 'USER': return userNav
      break;

    default:
      router.push('/auth/jwt/login');
  }
}
