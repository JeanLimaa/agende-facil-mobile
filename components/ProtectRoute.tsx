import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export function ProtectRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect href={"/auth/login"} />;
  }

  return children;
}