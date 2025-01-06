import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';
export const useRoleManagement = () => {
  const axiosAuth = useAxiosAuth();

  const getAllRoles = useCallback(
    async ({ limit = 1000 }) => {
      try {
        const response = await axiosAuth.get<any>(`${endPoint.admin.createNewRole}?size=${limit}`);

        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        }
      }
    },
    [axiosAuth]
  );

  const createNewRole = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.admin.createNewRole, payload);
        toast.success('Thành công');

        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        }
      }
    },
    [axiosAuth]
  );

  const deleteRoles = useCallback(
    async (id: any) => {
      try {
        const response = await axiosAuth.delete<any>(endPoint.admin.deleteRole(id));
        toast.success('Thành công');
        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        }
        throw new Error('err');
      }
    },
    [axiosAuth]
  );
  const editRoles = useCallback(
    async (id: any, payload: any) => {
      try {
        const response = await axiosAuth.put<any>(endPoint.admin.deleteRole(id), payload);
        toast.success('Thành công');
        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        }
        throw new Error('err');
      }
    },
    [axiosAuth]
  );

  // const getUserRole = async (): Promise<UserInfoResponse> => {
  //   return await axiosClient.get(endPoint.user.role);
  // };


  const getUserRole = useCallback(
    async ({ limit = 1000 }) => {
      try {
        const response = await axiosAuth.get<any>(endPoint.user.role);

        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          throw new Error(error.message);
        }
      }
    },
    [axiosAuth]
  );

  return { getAllRoles, createNewRole, deleteRoles, editRoles ,getUserRole};
};
