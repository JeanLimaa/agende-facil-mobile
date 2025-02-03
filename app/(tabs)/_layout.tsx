import { ProtectRoute } from "@/components/ProtectRoute";
import { Stack } from "expo-router";

export default function TabsLayout(){
    return (
        <ProtectRoute>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
        </ProtectRoute>
    )
}