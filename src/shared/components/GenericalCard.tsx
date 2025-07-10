import { Card } from "react-native-paper";
import { StyleSheet } from "react-native";

export function GenericalCard({
  children,
  onPress,
  isBlocked = false,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  isBlocked?: boolean;
}) {
  return (
    <Card style={[styles.card, isBlocked && styles.blockedCard]} onPress={onPress}>
      <Card.Content style={styles.content}>{children}</Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },
  blockedCard: {
    borderColor: "#D32F2F",
    borderWidth: 1.5,
  },
  content: {
    flexDirection: "column",
  },
});