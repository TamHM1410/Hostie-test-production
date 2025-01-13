'use client';
import { Role, SignIn, SignUp, UserInfor, UserManagement } from 'src/types/users';
import axiosClient from 'src/utils/axiosClient';
import { endPoint } from 'src/utils/endPoints';
import createAxiosAuth from 'src/utils/hooks/useAxiosAuth';

interface UserInfoResponse {
  result: any;
}

/// authentication

const useLogin = async (payload: SignIn | any): Promise<UserInfoResponse | any> => {
  const axiosAuth = createAxiosAuth();
  try {
    const res = await axiosAuth.post(endPoint.user.signIn, payload);
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred');
  }
};

const registerApi = async (payload: any) => {
  return await axiosClient.post(endPoint.user.signUp, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const refreshToken = async (token: any) => {
  return await axiosClient.post(endPoint.user.refresh, token);
};

/// user api
const getUserInfor = async (): Promise<UserInfoResponse | any> => {
  return await axiosClient.get(endPoint.user.info);
};

const updateUserById = async (payload: UserInfor): Promise<UserInfoResponse> => {
  return await axiosClient.put(endPoint.user.update, payload);
};
const sendForgotPassword = async (payload: any) => {
  return await axiosClient.post(endPoint.user.forgot, payload);
};

const resetPassword = async (payload: any) => {
  return await axiosClient.post(endPoint.user.reset, payload);
};

const updateAvatar = async (file: any) => {
  const res = await axiosClient.post(endPoint.user.avatar, file);
  return res;
};

const getUserRole = async (): Promise<UserInfoResponse> => {
  return await axiosClient.get(endPoint.user.role);
};
const confirmVerifyEmail = async (token: any) => {
  const res = await axiosClient.post(endPoint.user.confirmVerification, {
    token: token,
  });
  return res;
};

///// admin user management
const getAllUserApi = async ({ limit = 1000, search = '' }) => {
  return await axiosClient.get(
    `${endPoint.admin.getAllUser}?size=${limit}&search=${search}&sortOrder=dsc`
  );
};

const updateUserActive = async (id: any, isActive: any) => {
  const res = await axiosClient.put(endPoint.admin.updateActiveById(id, isActive));
  return res;
};

const adminUpdateUserById = async (payload: UserManagement): Promise<UserInfoResponse> => {
  return await axiosClient.put(endPoint.user.getUserById(payload.id), payload);
};

////roles management

const createdRoleApi = async (
  payload: Pick<Role, 'name' | 'description' | 'status'>
): Promise<UserInfoResponse> => {
  return await axiosClient.post(endPoint.admin.createNewRole, payload);
};

const getAllRolesApi = async (): Promise<UserInfoResponse> => {
  return await axiosClient.get(endPoint.admin.createNewRole);
};

const deleteRoleApi = async (id: any): Promise<UserInfoResponse> => {
  return await axiosClient.delete(endPoint.admin.deleteRole(id));
};

const updatedRoleApi = async ({
  id,
  payload,
}: {
  id: any;
  payload: any;
}): Promise<UserInfoResponse> => {
  return await axiosClient.put(endPoint.admin.deleteRole(id), payload);
};

export {
  confirmVerifyEmail,
  getUserRole,
  registerApi,
  useLogin,
  refreshToken,
  getUserInfor,
  updateUserById,
  getAllUserApi,
  adminUpdateUserById,
  createdRoleApi,
  getAllRolesApi,
  deleteRoleApi,
  updatedRoleApi,
  sendForgotPassword,
  resetPassword,
  updateAvatar,
  updateUserActive,
};
