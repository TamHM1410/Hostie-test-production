import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';
export const useResidence = () => {
  const axiosAuth = useAxiosAuth();

  const getAllResidenceType = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.admin.residence_types.root);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);
  const createNewResidenceType = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.admin.residence_types.root, payload);
        toast.success('Tạo thành công');
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
  const updateResidenceType = useCallback(
    async (payload: any, id: any) => {
      try {
        const response = await axiosAuth.put<any>(endPoint.admin.residence_types.byId(id), payload);
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

  const deleteResidenceType = useCallback(
    async (id: any) => {
      try {
        const response = await axiosAuth.delete<any>(endPoint.admin.residence_types.byId(id));
        toast.success('Xóa thành công');

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

  const getAllResidence = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(`${endPoint.admin.residence.root}?size=100000&sortField=createdAt&sortOrder=asc`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  const updateResidenceStatus= useCallback(async (id:any) => {
    try {
      const response = await axiosAuth.get<any>(endPoint.admin.residence.byId(id));
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  return {
    getAllResidenceType,
    createNewResidenceType,
    updateResidenceType,
    deleteResidenceType,
    getAllResidence,
    updateResidenceStatus
  };
};
