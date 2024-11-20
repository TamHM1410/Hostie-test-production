import { useMemo } from 'react';

/// nextauth
import { useSession } from 'next-auth/react';
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

  const { data: session } = useSession();

  const roles: any = session?.user.roles ?? 'seller';

  const router = useRouter()

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('app'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('analytics'),
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
         
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: t('users'), path: paths.dashboard.user.root },
              { title: t('roles'), path: paths.dashboard.user.roles },
            ],
          },
          {
            title: t('residence'),
            path: paths.dashboard.residence.root,
            icon: ICONS.tour,
            children: [{ title: t('residence_type'), path: paths.dashboard.residence.type }],
          },
          {
            title: t('package'),
            path: paths.dashboard.package,
            icon: ICONS.ecommerce,
          },
          {
            title: t('amenity'),
            path: paths.dashboard.amenity,
            icon: ICONS.label,
          },
          {
            title: 'Giao dịch',
            path: '/dashboard/transactions',
            icon:<Icon icon="hugeicons:bitcoin-transaction" style={{width:40,height:40}}/>,
          },
        ],
      },
      {
        subheader: t('Other'),
        items: [
          // USER
          {
            title: t('chat'),
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
          { title: t('account'), path: paths.dashboard.user.account, icon: ICONS.user },
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
        subheader: t('overview'),
        items: [
          {
            title: t('app'),
            path: '/DASH',
            icon: ICONS.dashboard,
          },
          {
            title: t('analytics'),
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
          {
            title: t('my-residence'),
            path: '/dashboard/housekeepers',
            icon: ICONS.ecommerce,
          },
          
          {
            title: t('account'),
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
        subheader: t('overview'),
        items: [
          {
            title: t('app'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('analytics'),
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
          {
            title: t('booking service'),
            path: paths.dashboard.general.booking,
            icon: ICONS.booking,
          },
          {
            title: t('service'),
            path: paths.dashboard.service,
            icon: ICONS.job,
          },
          
          {
            title: 'Lưu trú',
            path: paths.dashboard.user.root,
            icon: <Icon icon="carbon:stay-inside"  style={{width:35,height:35}}/>,
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
            title: 'Quản lí booking',
            path: paths.dashboard.user.root,
            icon: <Icon icon="fluent-mdl2:reservation-orders" style={{width:35,height:35}} />,
            children: [
              {
                title: t('manage booking residence'),
                path: paths.dashboard.manage_booking_residence,
              },
              {
                title: t('manage hold residence'),
                path: paths.dashboard.manage_hold_residence,
              },
              {
                title: t('manage customer'),
                path: paths.dashboard.manage_customer,
              },
            ],
          },
          {
            title: 'Quản gia',
            path: '/dashboard/butler',
            icon: <Icon icon="fa:users" />
          }
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------

      {
        subheader: t('Other'),
        items: [
          // USER
          {
            title: t('chat'),
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
          { title: t('account'), path: paths.dashboard.user.account, icon: ICONS.user },
          { title: 'Gói của bạn', path: '/dashboard/yourpackage', icon: <Icon icon="hugeicons:work-history"  style={{width:35,height:35}}/>}

        ],
      },
    ],

    [t]
  );
  const seller =useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('app'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('analytics'),
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
          {
            title: t('booking service'),
            path: paths.dashboard.general.booking,
            icon: ICONS.booking,
          },
          {
            title: t('service'),
            path: paths.dashboard.service,
            icon: ICONS.job,
          },
          
          {
            title: 'Lưu trú',
            path: paths.dashboard.user.root,
            icon: <Icon icon="carbon:stay-inside"  style={{width:35,height:35}}/>,
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
            title: 'Quản lí booking',
            path: paths.dashboard.user.root,
            icon: <Icon icon="fluent-mdl2:reservation-orders" style={{width:35,height:35}} />,
            children: [
              {
                title: t('manage booking residence'),
                path: paths.dashboard.manage_booking_residence,
              },
              {
                title: t('manage hold residence'),
                path: paths.dashboard.manage_hold_residence,
              },
              {
                title: t('manage customer'),
                path: paths.dashboard.manage_customer,
              },
            ],
          },
          {
            title: 'Quản gia',
            path: '/dashboard/butler',
            icon: <Icon icon="fa:users" />
          }
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------

      {
        subheader: t('Other'),
        items: [
          // USER
          {
            title: t('chat'),
            path: paths.dashboard.chat,
            icon: ICONS.chat,
          },
          { title: t('account'), path: paths.dashboard.user.account, icon: ICONS.user },
          { title: 'Gói của bạn', path: '/dashboard/yourpackage', icon: <Icon icon="hugeicons:work-history"  style={{width:35,height:35}}/>}

        ],
      },
    ],

    [t]
  );
  switch (roles) {
    case 'HOUSEKEEPER':
      return bulterNav;
    case 'ADMIN':
      return data;
    case 'SELLER':
      return seller;
    case 'HOST':
      return hostNav;
    case 'USER': router.push('/pricing') 
     break;

    default: router.push('/auth/jwt/login')
  }
}
