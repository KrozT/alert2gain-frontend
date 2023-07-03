import axios from 'axios';
import { useUserStore } from '@/stores/userStore.ts';

export function useAxios() {
  const { token } = useUserStore();
  const api = axios.create({
    /**
     * The base URL is defined in the .env file.
     */
    baseURL: import.meta.env.A2G_API_URL || 'https://api.example.com',

    /**
     * The headers are defined here.
     * The Authorization header is added if the user is logged in.
     */
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return {
    api,
  };
}
