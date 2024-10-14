import axios from 'axios';
import { useNotice } from '@yamada-ui/react';

const API_URL = import.meta.env.VITE_API_URL;

export const useApi = () => {
  const notice = useNotice();

  const request = async (endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
    try {
      const response = await axios({
        method,
        url: `${API_URL}${endpoint}`,
        data: body,
      });
      return response.data;
    } catch (error) {
      notice({
        title: 'Error',
        description: 'Failed to fetch data. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  };

  return { request };
};
