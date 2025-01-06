import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const axiosAuth = useAxiosAuth();

  const admin_analytic = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.admin.analytic);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  return {admin_analytic};
};
