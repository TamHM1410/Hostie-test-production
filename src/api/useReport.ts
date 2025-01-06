import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export const useReport = () => {
  const axiosAuth = useAxiosAuth();

  const findAllReport = useCallback(
    async (limit = 1000, skip = 0) => {
      try {
        const response = await axiosAuth.get<any>(
          `${endPoint.admin.report.get}?page=${skip}&size=${limit}`
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

  const updateReport = useCallback(
    async (id: any, payload: any) => {
      try {
        const response = await axiosAuth.put<any>(endPoint.admin.report.put(id), payload);
        toast.success('Cập nhật thành công');
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

  const acceptReport = useCallback(
    async (id: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.admin.report.accept(id));
        toast.success('Cập nhật thành công');
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

  const warningReport = useCallback(
    async (id: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.admin.report.warning(id));
        toast.success('Cập nhật thành công');
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

  const rejectReport = useCallback(
    async (id: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.admin.report.reject(id));
        toast.success('Cập nhật thành công');
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

  return { findAllReport, updateReport, acceptReport, warningReport, rejectReport };
};
