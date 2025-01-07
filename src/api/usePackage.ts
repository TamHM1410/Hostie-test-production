import { useCallback } from 'react';
import { endPoint } from '../utils/endPoints';
import useAxiosAuth from 'src/utils/hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export const usePackage = () => {
  const axiosAuth = useAxiosAuth();

  const findAllPackage = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.admin.package.root);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  const createNewPackage = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(endPoint.admin.package.root, payload);
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
  const updatePackage = useCallback(
    async (id: any, payload: any) => {
      try {
        const response = await axiosAuth.put<any>(endPoint.admin.package.adminById(id), payload);
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

  const deletePackage = useCallback(
    async (id: any) => {
      try {
        const response = await axiosAuth.delete<any>(endPoint.admin.package.adminById(id));
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



  const extendPackageApi = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.put<any>(
          `${endPoint.register_package.extendPackage}?packageId=${payload}`
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

  const registerPackageApi = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.post<any>(
          `${endPoint.register_package.post}?packageId=${payload}`
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

  const upgrade_package = useCallback(
    async (payload: any) => {
      try {
        const response = await axiosAuth.put<any>(
          endPoint.register_package.upgrade_package(payload)
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

  const getUserDiscount = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.register_package.getDiscount);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  

  const user_getPackage_history = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.register_package.userGetPackageHistory);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);
  const getSuggestPackage = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.register_package.suggestPackage);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  }, [axiosAuth]);

  const findPackageById = useCallback(
    async (id: any, type: any): Promise<any> => {
      try {
        const response = await axiosAuth.get<any>(endPoint.admin.package.byId(id, type));
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

  const getCurrentPackage = useCallback(async () => {
    try {
      const response = await axiosAuth.get<any>(endPoint.register_package.currentPackage);
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
    findAllPackage,
    createNewPackage,
    updatePackage,
    deletePackage,
    getUserDiscount,
    getCurrentPackage,
    getSuggestPackage,
    user_getPackage_history,
    findPackageById,
    extendPackageApi,
    registerPackageApi,
    upgrade_package
  };
};
