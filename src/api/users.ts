import { Role, SignIn, SignUp, UserInfor,UserManagement  } from 'src/types/users';
import axiosClient from 'src/utils/axiosClient';
import { endPoint } from 'src/utils/endPoints';

interface UserInfoResponse {
  result: any;
}

/// authentication
const registerApi = async (payload: SignUp) => {
  return await axiosClient.post(endPoint.user.signUp, payload);
};

const loginApi = async (payload: SignIn | any): Promise<UserInfoResponse | any> => {
  return await axiosClient.post(endPoint.user.signIn, payload);
};

const refreshToken=async(token:any)=>{
  return  await axiosClient.post(endPoint.user.refresh,token)
}

/// user api
const getUserInfor = async (): Promise<UserInfoResponse|any> => {
  return await axiosClient.get(endPoint.user.info);
};

const updateUserById = async (payload: UserInfor): Promise<UserInfoResponse> => {
  return await axiosClient.put(endPoint.user.update, payload);
};
const sendForgotPassword=async(payload:any)=>{
  return await axiosClient.post(endPoint.user.forgot,payload)
}

const resetPassword=async(payload:any)=>{
  return await axiosClient.post(endPoint.user.reset,payload)
}

const updateAvatar=async(file:any)=>{
  const res =await axiosClient.post(endPoint.user.avatar,file)
  return res

}

///// admin user management
const getAllUserApi = async () => {
  return await axiosClient.get(endPoint.admin.getAllUser);
};

const updateUserActive=async (id:any,isActive:any)=>{
  console.log(endPoint.admin.updateActiveById(id,isActive),'url')
  const res =await axiosClient.put(endPoint.admin.updateActiveById(id,isActive))
  return res

}

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

const updatedRoleApi = async ({id,payload}:{ id: any; payload: any }): Promise<UserInfoResponse> => {
  return await axiosClient.put(endPoint.admin.deleteRole(id), payload);
};




export {

  registerApi,
  loginApi,
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
  updateUserActive
};
