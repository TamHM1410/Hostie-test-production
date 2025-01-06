import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';
export const useAuth = () => {
  const axiosAuth = useAxiosAuth();

  const login = useCallback(
    async (credentials: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.user.signIn, credentials);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        }
        throw new Error('Đăng nhập thất bại');
      }
    },
    [axiosAuth]
  );

  const register = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.user.signUp, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        }
        throw new Error('Đăng ký thất bại');
      }
    },
    [axiosAuth]
  );
  const butler_register = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.butler.signUp, payload);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        }
        throw new Error('Đăng ký thất bại');
      }
    },
    [axiosAuth]
  );

  return { login, register, butler_register };
};
