import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export const useTransaction = () => {
  const axiosAuth = useAxiosAuth();

  const findAllTransaction = useCallback(
    async (limit = 1000, id = '') => {
      try {
        const response = await axiosAuth.get<any>(
          `/v1/api/registers/history/all?size=${limit}&id=${id}`
        );
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

  return { findAllTransaction };
};
