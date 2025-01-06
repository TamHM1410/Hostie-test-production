import axiosClient from 'src/utils/axiosClient';
import { endPoint } from 'src/utils/endPoints';

export const getAllReport = async (limit = 1000, skip = 0) => {
  const res = await axiosClient.get(`${endPoint.admin.report.get}?page=${skip}&size=${limit}`);

  return res;
};

export const updateReport = async (payload: any, id: any) => {
  const res = await axiosClient.put(endPoint.admin.report.put(id), payload);

  return res;
};
