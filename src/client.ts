import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import Qs from 'qs'; 

export type RequestConfig<TData = any> = AxiosRequestConfig<TData>;
export type ResponseErrorConfig<TError = any> = AxiosError<TError>;

export type Client<TData = any, TError = any, TVariables = any> = {
  (config: RequestConfig<TVariables>): Promise<AxiosResponse<TData>>;
  <TRes = TData, TErr = TError, TVar = TVariables>(config: RequestConfig<TVar>): Promise<AxiosResponse<TRes>>;
};

export const axiosInstance = axios.create({
  withCredentials: true,
  // CONFIGURAÇÃO PARA ARRAY NA URL:
  paramsSerializer: {
    serialize: (params) => {
      // O 'indices: false' remove os colchetes []
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Aqui você pode tratar erros globais se necessário
    // Por exemplo, tratar 401 para redirecionar para login
    return Promise.reject(error);
  }
);

export const client: Client = async <TData = any, TError = any, TVariables = any>(
  config: RequestConfig<TVariables>
): Promise<AxiosResponse<TData>> => {
  const response = await axiosInstance.request<TData>(config);
  return response; 
};

export default client;
