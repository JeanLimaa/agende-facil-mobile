import axios from "axios";
import { BASE_URL } from "@/shared/constants/apiUrl";
import { AuthToken, useAuth } from "@/modules/auth/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AuthToken);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;