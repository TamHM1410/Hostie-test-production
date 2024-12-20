'use client';
import axios, { AxiosResponse } from 'axios';
import { getSession, signOut, signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { javaUrl } from './endPoints';

interface Response {
  result: any;
}

// const defaultHeader = {
//   'Access-Control-Allow-Origin': '*',
//   'Content-Type': 'application/json',
//   Accept: 'application/json',
// };

// for multiple requests
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosClient2 = axios.create({
  baseURL: javaUrl,
  timeout: 8000,
});

// Add a request interceptor
axiosClient2.interceptors.request.use(async (request) => {
  const session: any = await getSession();
  if (session) {
    request.headers.Authorization = `Bearer ${session?.user?.token}`;
  }
  return request;
});

//  Add a response interceptor
const handleResponse = (res: AxiosResponse<Response>) => {
  if (res && res.data.result) {
    return res.data.result;
  }

  return res;
};

const handleError = (error: { response: { data: any } }) => {
  const { data } = error.response;
  return data;
};

const refreshToken = async (token: string) => {
  try {
    const response = await axios.post('http://34.81.244.146:8080/v1/api/auth/refresh-token', {
      token,
    });
    return response?.data.result?.token;
  } catch (error) {
    console.error('Error refreshing token', error);
    throw error;
  }
};

const errorMessages: Record<string, string> = {
  OVERLAP_BLOCK_RESIDENCE: 'Khoảng thời gian đặt đã bị chặn bởi chỗ ở này.',
  OVERLAP_HOLD_RESIDENCE: 'Khoảng thời gian đặt đã bị giữ bởi một khách hàng khác.',
  OVERLAP_BOOKING_RESIDENCE: 'Khoảng thời gian đặt đã được đặt bởi một khách hàng khác.',
  RESIDENCE_NOT_ACTIVE: 'Chỗ ở này hiện không hoạt động.',
  ALREADY_BOOKING: 'Bạn đã đặt chỗ này trước đó.',
  CANNOT_BOOKING_IN_PAST: 'Không thể đặt chỗ ở quá khứ.',
  UPDATE_BOOKING: 'Không thể cập nhật thông tin đặt chỗ.',
  UPDATE_HOLD: 'Không thể cập nhật trạng thái giữ chỗ.',
  DETAIL_BOOKING: 'Không thể lấy thông tin chi tiết đặt chỗ.',
  NOT_HOST_OF_RESIDENCE: 'Bạn không phải chủ sở hữu của chỗ ở này.',
  ALREADY_ACCEPT_HOLD: 'Yêu cầu giữ chỗ này đã được chấp nhận trước đó.',
  CANNOT_ACCEPT_HOLD_AFTER_REJECT: 'Không thể chấp nhận yêu cầu giữ chỗ sau khi đã từ chối.',
  NOT_FOUND_HOLD: 'Không tìm thấy thông tin giữ chỗ.',
  NOT_FOUND_CUSTOMER: 'Không tìm thấy thông tin khách hàng.',
  INTERNAL_SERVER: 'Lỗi hệ thống, vui lòng thử lại sau.',
};

axiosClient2.interceptors.response.use(
  (response) => {
    const res = handleResponse(response);
    return res;
  },
  async (error) => {
    const session: any = await getSession();

    if (error.response?.status === 401 && session) {
      const token = session?.user.token;
      const refreshedSession = await refreshToken(token);

      try {
        if (refreshedSession) {
          await signIn('credentials', { token: refreshedSession });
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('Failed to refresh token', refreshError);

        await signOut();
        redirect('/auth/jwt/login');
      }
    }

    const errorCode = error.response?.data?.error_code;

    const errorMessage = errorMessages[errorCode] || 'Đã xảy ra lỗi, vui lòng thử lại.';

    return Promise.reject(errorMessage);
  }
);

export default axiosClient2;
