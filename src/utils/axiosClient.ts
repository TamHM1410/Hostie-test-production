'use client';
import axios, { AxiosResponse } from 'axios';
import { getSession, signOut, signIn } from 'next-auth/react';
import { javaUrl } from './endPoints';



const axiosClient = axios.create({
  baseURL: javaUrl,
  timeout: 8000,
});



// Add a request interceptor
axiosClient.interceptors.request.use(async (request) => {
  const session: any = await getSession();
  if (session) {
    request.headers.Authorization = `Bearer ${session?.user?.token}`;
  }
  return request;
});










export default axiosClient;
