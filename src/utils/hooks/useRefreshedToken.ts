'use client';
import axiosClient from '../axiosClient';
import { useSession, signIn ,signOut} from 'next-auth/react';
import { useGetUserCurrentRole } from 'src/zustand/user';

export const useRefreshedToken = () => {

  const { data: session } = useSession();


  const refreshToken = async (): Promise<any> => {
    const res = await axiosClient.post('/v1/api/auth/refresh-token', {
      token: session?.user.token,
    });

    if (session) {
      session.user.token = res?.data?.result.token;
      session.user.roles = res?.data?.result?.roles[0];

      await signIn('credentials', {
        username: res?.data.result?.username,
        id: res?.data?.result.userId,
        email: res?.data?.result.email,
        isActive: res?.data?.result?.isActice,
        roles: res?.data?.result?.roles,
        token:  res?.data?.result.token,
        status: res?.data?.result?.status,
        urlAvatar: res?.data?.result?.urlAvatar,
        redirect: false,
      });
    } else signIn();
  };
  return {
    refreshToken,
  };
};
