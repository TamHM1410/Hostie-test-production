import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export const useAmenity = () => {
  const axiosAuth = useAxiosAuth();

  const findAllAmenity = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.admin.amenity.root);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  const createNewAmenity = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.admin.amenity.root, payload);
        toast.success('Tạo thành công')
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
  const updateAmenity = useCallback(
    async (id: any, payload: any) => {
      try {
        const response = await axiosAuth.put<any>(endPoint.admin.amenity.byId(id), payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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

  const deleteAmenity = useCallback(
    async (id: any) => {
      try {
        const response = await axiosAuth.delete<any>(endPoint.admin.amenity.byId(id));
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



  return { findAllAmenity, createNewAmenity, updateAmenity, deleteAmenity };
};
