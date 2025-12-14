/**
 * SAHNE - API Service
 * Axios instance with interceptors
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '@/src/constants';
import { ApiError } from '@/src/types';

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: Config.API_BASE_URL,
      timeout: Config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(Config.STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status,
        };

        if (error.response) {
          const data = error.response.data as any;
          apiError.message = data?.message || error.message;
          apiError.errors = data?.errors;

          // Handle 401 - Unauthorized (token expired or invalid)
          if (error.response.status === 401) {
            await AsyncStorage.removeItem(Config.STORAGE_KEYS.AUTH_TOKEN);
            await AsyncStorage.removeItem(Config.STORAGE_KEYS.USER_DATA);
            // Note: Navigation to login will be handled by AuthContext
          }
        } else if (error.request) {
          apiError.message = 'No response from server. Please check your connection.';
        }

        return Promise.reject(apiError);
      }
    );
  }

  public getAxios(): AxiosInstance {
    return this.instance;
  }
}

export const apiService = new ApiService();
export const api = apiService.getAxios();
