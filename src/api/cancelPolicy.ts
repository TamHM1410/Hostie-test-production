import goAxiosClient from 'src/utils/goAxiosClient';
import { goEndPoint } from 'src/utils/endPoints';

export const create_cancel_policy = async (payload: any) => {
  const res = await goAxiosClient.post('/cancel-policy', payload);

  return res;
};

export const update_cancel_policy = async (payload: any) => {
  const res = await goAxiosClient.post('/cancel-policy', payload);

  return res;
};

export const get_all_policy = async (residence_id = '') => {
  const res = await goAxiosClient.get(
    `/cancel-policy?page_size=100&page=1&residence_id=${residence_id}`
  );

  return res?.data?.policies;
};

export const map_residence_policy = async (payload: any) => {
  const res = await goAxiosClient.post('/cancel-policy/map-residence', payload);

  return res;
};

export const get_refund = async (booking_id: any) => {
  const res = await goAxiosClient.get(`/cancel-policy/refund?booking_id=${booking_id}`);

  return res;
};
