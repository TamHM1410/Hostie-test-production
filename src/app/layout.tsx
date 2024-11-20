// i18n
import 'src/locales/i18n';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';


// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// locales
import { LocalizationProvider } from 'src/locales';
// theme
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
// components
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
import QueryProvider from 'src/app/components/react-query/Query-provider';
// sections
import { CheckoutProvider } from 'src/sections/checkout/context';
// auth
import { AuthProvider, AuthConsumer } from 'src/auth/context/jwt';
import NextAuthProvider from 'src/auth/context/next-auth/Next-auth-provider';


// /toast
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from 'src/auth/context/socket-message-context/SocketMessageContext';

import './App.css';


// ----------------------------------------------------------------------

export const metadata = {
  title: 'Hostie',
  description:
    'Nền tảng quản lý dành cho host và seller',
  keywords: 'hostie,management,host,seller,easy,free',
  themeColor: '#000000',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: [
    {
      rel: 'icon',
      url: '/logo/hostie.png',
      sizes: '80x80',

    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '80x80',
      url: '/logo/hostie.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '129x129',
      url: '/logo/hostie.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/logo/hostie.png',
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <NextAuthProvider>
          <QueryProvider>
            <AuthProvider>
              <LocalizationProvider>
                <SettingsProvider
                  defaultSettings={{
                    themeMode: 'light', // 'light' | 'dark'
                    themeDirection: 'ltr', //  'rtl' | 'ltr'
                    themeContrast: 'default', // 'default' | 'bold'
                    themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                    themeColorPresets: 'blue', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                    themeStretch: false,
                  }}
                >
                  <SocketProvider>
                    <ThemeProvider>
                      <MotionLazy>
                        <SnackbarProvider>
                          <CheckoutProvider>
                            <SettingsDrawer />
                            <ProgressBar />
                            <AuthConsumer>{children}</AuthConsumer>
                          </CheckoutProvider>
                        </SnackbarProvider>
                      </MotionLazy>
                    </ThemeProvider>
                  </SocketProvider>
                </SettingsProvider>
              </LocalizationProvider>
            </AuthProvider>
          </QueryProvider>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
