import { router } from "expo-router";
import { Appbar } from "react-native-paper";
import { Colors } from "../constants/Colors";

interface AppBarHeaderProps {
    message?: string;
    children?: React.ReactNode;
}

export function AppBarHeader({message, children}: AppBarHeaderProps) {
    return (
        <Appbar.Header style={{
            backgroundColor: Colors.light.mainColor,
        }}>
            <Appbar.BackAction onPress={() => router.back()} />
            {message && <Appbar.Content title={message} />}
            {children}
        </Appbar.Header>
    )
}