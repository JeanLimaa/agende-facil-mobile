import React from "react";
import { Card } from "react-native-paper";
import {
  StyleSheet,
  Image,
  View,
  Text,
  ViewStyle,
} from "react-native";

interface GenericalCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  isBlocked?: boolean;
  showAvatar?: boolean;
  imageUrl?: string;
  name?: string;
  containerStyle?: ViewStyle;
}

export function GenericalCard({
  children,
  onPress,
  isBlocked = false,
  showAvatar = false,
  imageUrl,
  name = "",
  containerStyle,
}: GenericalCardProps) {
  const renderAvatar = () => {
    if (!showAvatar) return null;

    return (
      <View style={styles.avatarContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Card
      onPress={onPress}
      style={[styles.card, isBlocked && styles.blockedCard, containerStyle]}
    >
      <Card.Content style={styles.content}>
        {renderAvatar()}
        <View style={styles.contentWrapper}>{children}</View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 6,
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
    flexDirection: "row",
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});