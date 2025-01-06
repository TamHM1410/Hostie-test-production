'use client';

import axiosClient from '../axiosClient';
import { useSession, signIn } from 'next-auth/react';

export const useRefreshedToken = () => {
  const { data: session } = useSession();

  const refreshToken = async (): Promise<any> => {
    const res = await axiosClient('/refresh-token', {
      token: session?.user.token,
    });

    if (session) session.user.token = res?.token;
    else signIn();
  };
  return useRefreshedToken;
};
