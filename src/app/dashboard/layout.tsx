'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { SplashScreen } from 'src/components/loading-screen';

// auth

// components
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { data: session, status } = useSession(); // Lấy session và trạng thái

  const [isMounted, setIsMounted] = useState(false); // Tránh lỗi khi rendering trên server

  useEffect(() => {
    setIsMounted(true); // Chỉ set sau khi component đã mount trên client
  }, []);

  if (!isMounted || status === 'loading') {
    return <SplashScreen />;
  }

  if (!session) {
    // Nếu không có session, chuyển hướng đến trang đăng nhập
    return null; // Để tránh render nếu không có session
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
