import { StyleSheet, Text } from "react-native";

export function EmptyText({ children }: { children: string }) {
    return (
        <Text style={styles.emptyText}>
            {children}
        </Text>
    );
}
const styles = StyleSheet.create({
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "gray",
    },
})