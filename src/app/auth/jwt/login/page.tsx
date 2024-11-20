// sections
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Đăng nhập',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
