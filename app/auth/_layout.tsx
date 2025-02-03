import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { Redirect, Stack, useSegments } from "expo-router";

function AuthStack(){
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        </Stack>
    )
}

export default function AuthLayout(){
    const { isAuthenticated } = useAuth();
    
    if(isAuthenticated){
        return <Redirect href={"/(tabs)"} />
    }

    return <AuthStack />
}