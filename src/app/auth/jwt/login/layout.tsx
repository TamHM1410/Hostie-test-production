import AuthClassicLayout from 'src/layouts/auth/classic';


import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/authOptions';

export async function generateMetadata() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.roles) {
    const role :any= session.user.roles;

    console.log('roles',role)
    
    const roleRedirects :any= {
      'USER': '/pricing',
      'HOUSEKEEPER': '/dashboard/housekeepers/',
      'SELLER': '/dashboard/analytics/',
      'HOST': '/dashboard/analytics/',
      'ADMIN': '/dashboard'

    };

    if (roleRedirects[role]) {
      redirect(roleRedirects[role]);
    }
  }

  return {
    title: 'Login Page'
  };
}

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <AuthClassicLayout title='Quản lý dịch vụ Villa & homestay hiệu quả hơn với Hosite'>{children}</AuthClassicLayout>;
}