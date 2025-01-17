import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export const useCommissionPolicy = () => {
  const axiosAuth = useAxiosAuth();

  const findAllCommissionPolicy = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>('/v1/api/commission-policies?page=0&size=9999999999');
      console.log('res',response)
      return response;
    } catch (error) {
      if (error instanceof Error) {
      
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  const  createCommissionPolicy = useCallback(async (payload:any) => {
    try {
      const response = await axiosAuth.post<any>('/v1/api/commission-policies',payload);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Tạo chính sách thất bại');
        throw new Error('');
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  const updateCommissionPolicy= useCallback(async (payload:any) => {
    try {
      const response = await axiosAuth.put<any>('/v1/api/commission-policies',payload);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Cập nhật chính sách thất bại');
        throw new Error('');
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);


  return {
    findAllCommissionPolicy,
    createCommissionPolicy,
    updateCommissionPolicy
  
  };
};
