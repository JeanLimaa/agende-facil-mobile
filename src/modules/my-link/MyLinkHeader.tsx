import { View, Text } from "react-native";
import { myLinkHeaderStyles } from "./styles";
import { MePayload } from "@/shared/types/MePayload.interface";

export function MyLinkHeader({ user }: { user: MePayload }) {
    return (
        <View style={myLinkHeaderStyles.container}>
            <Text style={myLinkHeaderStyles.title}>Meu Link</Text>
            <Text style={myLinkHeaderStyles.subtitle}>{user.companyName}</Text>
            <Text style={myLinkHeaderStyles.subtitle}>{user.companyLink}</Text>
        </View>
    )
}