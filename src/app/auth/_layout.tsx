import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";

function AuthStack(){
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot-password" />
        </Stack>
    )
}

export default function AuthLayout(){
    const { isAuthenticated } = useAuth();
    
    if(isAuthenticated){
        return <Redirect href={"/(tabs)/schedule"} />
    }

    return <AuthStack />
}