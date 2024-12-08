// sections
import { JwtLoginView } from 'src/sections/auth/jwt';
import LoginPageView from 'src/sections/auth/jwt/login-view';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/authOptions';

export async function generateMetadata() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }
}

// ----------------------------------------------------------------------


export default function LoginPage() {
  return <LoginPageView />;
}
