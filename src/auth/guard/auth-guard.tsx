// import { useEffect, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
//
// import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------


const loginPaths: Record<string, string> = {
  jwt: paths.auth.jwt.login,
  auth0: paths.auth.auth0.login,
  amplify: paths.auth.amplify.login,
  firebase: paths.auth.firebase.login,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const {data:session}=useSession()
  

  if (!session) {
    router.push('/auth/jwt/login')
  }

  return <>{children}</>;
}
