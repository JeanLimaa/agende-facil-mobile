import Constants from 'expo-constants';

const isDevelopmentMode = process.env.NODE_ENV === "development";
const urlDevelopment = `http://${Constants.expoConfig?.hostUri?.split(':')[0]}:3000`;

export const BASE_URL = 
    isDevelopmentMode ? urlDevelopment || process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";