'use client';

// components
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthClassicLayout title="Quản lý công việc hiệu quả hơn với Hosite">
      {children}
    </AuthClassicLayout>
  );
}
