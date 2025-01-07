'use client';

import axiosClient from '../axiosClient';
import { useSession, signIn } from 'next-auth/react';
import { useGetUserCurrentRole } from 'src/zustand/user';

export const useRefreshedToken = () => {
  const { data: session } = useSession();

  const { set } = useGetUserCurrentRole();

  const refreshToken = async (): Promise<any> => {
    const res = await axiosClient.post('/v1/api/auth/refresh-token', {
      token: session?.user.token,
    });

    if (session) {
      session.user.token = res?.data?.result.token;
      session.user.roles = res?.data?.result?.roles[0];
      await fetch('/api/auth/update-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: res?.data?.result.token,
          roles: res?.data?.result?.roles[0],
          name: res?.data.result?.username,
          urlAvatar: res?.data.result?.urlAvatar,
          status: res?.data.result?.status,
        }),
      });

      await signIn('credentials', { redirect: false });
    } else signIn();
  };
  return {
    refreshToken,
  };
};
