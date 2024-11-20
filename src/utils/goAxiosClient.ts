import axios, { AxiosResponse } from 'axios';
import { getSession, signOut,signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { goApi} from './endPoints';



interface Response {
  result: any;
}


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

const goAxiosClient = axios.create({
  baseURL:goApi,
  timeout: 8000,
});

// Add a request interceptor
goAxiosClient.interceptors.request.use(async (request:any) => {
  const session:any = await getSession();
  if (session) {
    request.headers.Authorization = `Bearer ${session?.user?.token}`;
  }
  return request;
});

//  Add a response interceptor
const handleResponse = (res: AxiosResponse<Response>) => {
  if (res && res.data) {
    return res.data;
  }

  return res;
};

const handleError = (error: { response: { data: any } }) => {
  const { data } = error.response;
  return data;
};

const refreshToken = async (token: string) => {
  try {

    const response = await axios.post('http://34.81.244.146:8080/v1/api/auth/refresh-token', { token });

    return response?.data.result?.token;
  } catch (error) {
    console.error('Error refreshing token', error);
    throw error;
  }
};


goAxiosClient.interceptors.response.use(
  (response: AxiosResponse<any, any>):any => {
    const res =handleResponse(response)
    return res ;
  },
  async (error:any) => {
    const  session :any  = await getSession();
    

    if (!session) {
      redirect('/auth/jwt/login');
   
    }
    
    if (error.response?.status === 401 &&  session) {
      const token = session?.user.token;
      const refreshedSession = await refreshToken(token);
     
       
      try {
        if(refreshedSession){
          await signIn("credentials", {token: refreshedSession })      }
        

              } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('Failed to refresh token', refreshError);

      
        await signOut();    
        redirect('/auth/jwt/login');
        
      } 
    }

    return Promise.reject(handleError(error));
  }
);

export default goAxiosClient;
