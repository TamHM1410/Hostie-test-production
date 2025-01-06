import { useCallback } from 'react';
import { endPoint, goEndPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export const useButler = () => {
  const axiosAuth = useAxiosAuth();

  const getButlerRequest = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.host.housekeeperRequest);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  const host_accept = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.host.acceptButler, payload);
        toast.success('Cập nhật thành công');
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

  const host_reject = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.host.rejectButler, payload);
        toast.success('Cập nhật thành công');
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

  const butler_add_residence = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(goEndPoint.butler_add_residence, payload);
        toast.success('Đăng ký thành công,xin chờ chủ nhà xét duyệt');
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

  return { getButlerRequest, host_accept, host_reject, butler_add_residence };
};
