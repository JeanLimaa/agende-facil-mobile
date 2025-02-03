import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //SplashScreen.preventAutoHideAsync();
    
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
      setLoading(false);
      await SplashScreen.hideAsync();
    };

    checkAuth();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem("auth_token", token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
