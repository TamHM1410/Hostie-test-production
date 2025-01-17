import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';
export const useUserManagement = () => {
  const axiosAuth = useAxiosAuth();

  const getAllUsers = useCallback(
    async ({ limit = 1000, search = '' }) => {
      try {
        const response = await axiosAuth.get<any>(
          `${endPoint.admin.getAllUser}?size=${limit}&search=${search}&sortOrder=dsc&sortField=createdAt`
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

  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.user.info);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  const updateUserInfo = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.put<any>(endPoint.user.update, payload);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error('Đã có lỗi xảy ra');
          throw new Error(error.message);
        }
        throw new Error('Đăng nhập thất bại');
      }
    },
    [axiosAuth]
  );

  const getPendingUser = useCallback(
    async ({ limit = 1000, search = '' }) => {
      try {
        const response = await axiosAuth.get<any>(
          `/v1/api/users/pending-users-review?size=${limit}&search=${search}&sortOrder=dsc&sortField=createdAt`
        );
        return response;
      } catch (error) {
        if (error instanceof Error) {
          toast.error('Đã có lỗi xảy ra vui lòng thử lại sau');

          throw new Error(error.message);
        }
        throw new Error('Đăng nhập thất bại');
      }
    },
    [axiosAuth]
  );
  const getUserReferralLink = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(`/v1/api/users/referral-link`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);
  const rejectUserReview = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>('/v1/api/users/reject-user-review', {
          userId: payload,
        });
        toast.error('Tài khoản đã bị từ chối');
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
  const approveUserReview = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>('/v1/api/users/approve-user-review', {
          userId: payload,
        });
        toast.success('Tài khoản đã được chấp thuận');

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

  return {
    getAllUsers,
    getUserInfo,
    updateUserInfo,
    getPendingUser,
    getUserReferralLink,
    rejectUserReview,
    approveUserReview,
  };
};
