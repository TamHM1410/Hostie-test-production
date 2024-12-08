import { goEndPoint, endPoint, javaUrl } from 'src/utils/endPoints';
import goAxiosClient from 'src/utils/goAxiosClient';
import axiosClient from 'src/utils/axiosClient';

const registerButler = async (payload: any) => {
  const res = await axiosClient.post(endPoint.butler.signUp, payload);
  return res;
};
const getButlerResidence = async () => {
  
  const res = await goAxiosClient.get(goEndPoint.butler_residence);

  return res?.data?.residences;
};

const getButlerBooking = async () => {
  const res = await goAxiosClient.get(goEndPoint.butler_booking);
  return res?.data?.result;
};

const confirm_checkin = async (id: any) => {
  const res = await goAxiosClient.post(goEndPoint.update_checkin, {
    id,
  });
  return res;
};
const confirm_checkout = async (booking_id: any) => {
  const res = await goAxiosClient.post(goEndPoint.update_checkout, {
    booking_id,
  });
  return res;
};
const butler_add_residence = async (payload: any) => {
  const res = await axiosClient.post(goEndPoint.butler_add_residence, payload);
  return res;
};
const addCharge = async (payload: any) => {
  const res = await goAxiosClient.post(goEndPoint.uploadFileCheckIn, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

const checkInUploadFile = async (payload: any) => {
  const res = await goAxiosClient.post(goEndPoint.uploadFileCheckIn, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

export {
  getButlerResidence,
  registerButler,
  getButlerBooking,
  confirm_checkin,
  confirm_checkout,
  butler_add_residence,
  addCharge,
  checkInUploadFile,
};
