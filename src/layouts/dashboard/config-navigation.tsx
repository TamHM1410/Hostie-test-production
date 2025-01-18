'use client';
import { useMemo, useEffect } from 'react'; // Thêm useEffect
import { useSession } from 'next-auth/react';

/// nextauth
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';

import { useRouter } from 'next/navigation';

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
  const { data: session } = useSession();

  useEffect(() => {
    // Kiểm tra nếu người dùng chưa có role và điều hướng tới trang đăng nhập
    if (!session?.user.roles) {
      router.push('/auth/jwt/login');
    }
  }, [session]);

  const data = useMemo(
    () => [
      // OVERVIEW
      {
        subheader: 'Tổng quan',
        items: [
          {
            title: 'Ứng dụng',
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },

      // MANAGEMENT
      {
        subheader: 'Quản lý',
        items: [
          {
            title: 'Người dùng',
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: 'Quản lý người dùng', path: paths.dashboard.user.root },
              { title: 'Quản lý quyền ', path: paths.dashboard.user.roles },
              { title: 'Danh sách người dùng cần duyệt ', path: '/dashboard/user-pending' },
            ],
          },
          {
            title: 'Cư trú',
            path: paths.dashboard.residence.root,
            icon: ICONS.tour,
            children: [
              { title: 'Loại cư trú', path: paths.dashboard.residence.type },
              { title: 'Danh sách căn hộ', path: '/dashboard/residence' },
            ],
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
            title: 'Chính sách hoa hồng',
            path: '/dashboard/commission-policy',
            icon: <Icon icon="iconoir:hand-cash" style={{ width: 40, height: 40 }} />,
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
          {
            title: 'Tin nhắn',
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
          { title: 'Tài khoản', path: paths.dashboard.user.account, icon: ICONS.user },
        ],
      },
    ],
    [t, session]
  );

  const bulterNav = useMemo(
    () => [
      {
        subheader: 'Tổng quan',
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
          {
            title: 'Tin nhắn',
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
        ],
      },
    ],
    [t, session]
  );

  const userNav = useMemo(
    () => [
      {
        subheader: 'Tổng quan',
        items: [
          {
            title: 'Tài khoản',
            path: '/dashboard/user/account',
            icon: ICONS.user,
          },
        ],
      },
    ],
    [t, session]
  );

  const hostNav = useMemo(
    () => [
      {
        subheader: 'Tổng quan',
        items: [
          {
            title: 'Phân tích',
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
          {
            title: 'Đặt dịch vụ',
            path: paths.dashboard.general.booking,
            icon: ICONS.booking,
          },
          {
            title: 'Căn hộ của bạn',
            path: paths.dashboard.service,
            icon: <Icon icon="carbon:stay-inside" style={{ width: 35, height: 35 }} />,
          },
          {
            title: 'Danh sách ',
            path: paths.dashboard.bookingList,
            icon: <Icon icon="fluent-mdl2:reservation-orders" style={{ width: 35, height: 35 }} />,
            children: [
              {
                title: 'Danh sách đặt nơi lưu trú',
                path: paths.dashboard.bookingList,
              },
              {
                title: 'Danh sách giữ nơi lưu trú',
                path: paths.dashboard.hold_residence,
              },
            ],
          },
          {
            title: 'Quản lý ',
            path: paths.dashboard.manage_booking_residence,
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
                title: t('Quản lý báo cáo'),
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

      {
        subheader: 'Khác',
        items: [
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
    [t, session]
  );

  const seller = useMemo(
    () => [
      {
        subheader: 'Tổng quan',
        items: [
          {
            title: 'Phân tích',
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
            path: paths.dashboard.bookingList,
            icon: <Icon icon="fluent-mdl2:reservation-orders" style={{ width: 35, height: 35 }} />,
            children: [
              {
                title: 'Danh sách đặt',
                path: paths.dashboard.bookingList,
              },
              {
                title: 'Danh sách giữ ',
                path: paths.dashboard.hold_residence,
              },
            ],
          },
          {
            title: 'Quản lý ',
            path: paths.dashboard.manage_customer,
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

      {
        subheader: 'Khác',
        items: [
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
    [t, session]
  );

  switch (session?.user?.roles) {
    case 'HOUSEKEEPER':
      return bulterNav;
    case 'ADMIN':
      return data;
    case 'SELLER':
      return seller;
    case 'HOST':
      return hostNav;
    case 'USER':
      return userNav;
    default:
      return null; // Nếu không có vai trò hợp lệ, không render gì
  }
}
