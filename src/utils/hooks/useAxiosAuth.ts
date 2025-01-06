'use client';
import { useEffect } from 'react';
import { useSession,getSession } from 'next-auth/react';
import { useRefreshedToken } from './useRefreshedToken';
import { signIn, signOut } from 'next-auth/react';
import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

interface Response {
  result: any;
}

const useAxiosAuth =  () => {
  const { data: session } = useSession();

  const refreshedToken = useRefreshedToken();

  useEffect(() => {
    let isRefreshing = false;
    const failedQueue: any[] = [];

    const processQueue = (error: Error | null, token: string | null = null) => {
      failedQueue.forEach((promise) => {
        if (error) {
          promise.reject(error);
        } else {
          promise.resolve(token);
        }
      });
      failedQueue.length = 0;
    };

    const refreshToken = async () => {
      try {
        const response = await axiosClient.post<{ token: string }>('/auth/refresh-token', {
          token: session?.user?.token,
        });
        return response.data.token;
      } catch (error) {
        throw new Error('Failed to refresh token');
      }
    };

    const requestInterceptor = axiosClient.interceptors.request.use(
     async (config) => {
    

        if (session?.user?.token) {
          // Set Authorization header
          config.headers['Authorization'] = `Bearer ${session?.user.token}`;
          console.log('Token set:', session.user.token);
        } else {
          console.log('No token available in session');
        }

        console.log('Request config:', {
          url: config.url,
          method: config.method,
          headers: config.headers
        });

        return config;
      },
      (error) => Promise.reject(error)
    );

    const handleResponse = (res: AxiosResponse<any>) => {
      return res.data?.result || res.data || res;
    };

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => handleResponse(response),
      async (error: any) => {
        const originalRequest = error.config;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        // Handle 401 error
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            try {
              const retryOriginal = await new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              });

              // Ensure headers exist
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }

              return axiosClient({
                ...originalRequest,
                headers: {
                  ...originalRequest.headers,
                  'Authorization': `Bearer ${retryOriginal}`,
                },
              });
            } catch (error) {
              return Promise.reject(error);
            }
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Check if token refresh is possible
            if (!refreshedToken || !session) {
              await signOut({ redirect: true });
              throw new Error('No refresh token available');
            }

            const newToken = await refreshToken();
            isRefreshing = false;
            processQueue(null, newToken);

            // Ensure headers exist
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }

            return axiosClient({
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                'Authorization': `Bearer ${newToken}`,
              },
            });
          } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError as Error);
            await signOut({ redirect: true });
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        const errorMessage =
          typeof error.response?.data?.message === 'string'
            ? error.response.data.message
            : error.message || 'An error occurred';
        return Promise.reject(new Error(errorMessage));
      }
    );

    // Log session state when effect runs
    console.log('Session state:', {
      hasSession: !!session,
      hasToken: !!session?.user?.token,
      token: session?.user?.token ? 'Token exists' : 'No token'
    });

    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [session, refreshedToken]);

  return axiosClient;
};

export default useAxiosAuth;