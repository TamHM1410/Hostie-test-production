import axiosClient from 'src/utils/axiosClient';
import { endPoint } from 'src/utils/endPoints';
import { PackageType } from 'src/types/pagekages';

const findAllPackage = async () => {
    const res =await axiosClient.get(endPoint.admin.package.root);
  return res
};
const create_new_package = async (payload: Pick<PackageType, 'name' | 'description' | 'price'>) => {
  const res = await axiosClient.post(endPoint.admin.package.root, payload);

  return res;
};
const update_package = async ({ id, payload }: { id: any; payload: any }) => {
  const res = await axiosClient.put(endPoint.admin.package.byId(id), payload);
  return res;
};
const delete_package_api = async (id: any) => {
    const rs=await axiosClient.delete(endPoint.admin.package.byId(id));
  return rs 
};

const findPackageById = async (id: any): Promise<any> => {
  const rs = await axiosClient.get(endPoint.admin.package.byId(id));
  return rs;
};

const registerPackageApi = async (payload: any) => {
  const rs = axiosClient.post(endPoint.register_package.post, payload);
  return rs;
};


const getUserDiscount =async (): Promise<any>=>{
  const rs =await axiosClient.get(endPoint.register_package.getDiscount)
  return rs
}

const getCurrenPackage=async (): Promise<any>=>{
  const rs =await axiosClient.get(endPoint.register_package.currentPackage)
  return rs
}
const getSuggestPackage=async (): Promise<any>=>{
  const rs =await axiosClient.get(endPoint.register_package.suggestPackage)
  return rs
}

export {
  findAllPackage,
  create_new_package,
  update_package,
  delete_package_api,
  findPackageById,
  registerPackageApi,
  getUserDiscount,
  getCurrenPackage,
  getSuggestPackage
};
