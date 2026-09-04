import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { AppNotification } from "@/features/notifications/domain/entities/Notification";

type NotificationItemProps = {
  notification: AppNotification;
  onPress: () => void;
};

export default function NotificationItem({
  notification,
  onPress,
}: NotificationItemProps) {
  return (
    <Pressable
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            !notification.isRead && styles.unreadTitle,
          ]}
        >
          {notification.title}
        </Text>

        {!notification.isRead && (
          <View style={styles.unreadDot} />
        )}
      </View>

      <Text style={styles.message}>
        {notification.message}
      </Text>

      <Text style={styles.createdAt}>
        {new Date(notification.createdAt).toLocaleString()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  unreadContainer: {
    backgroundColor: "#F3F4F6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },

  unreadTitle: {
    fontWeight: "700",
    color: "#111827",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6D28D9",
    marginLeft: 12,
  },

  message: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },

  createdAt: {
    marginTop: 8,
    fontSize: 12,
    color: "#9CA3AF",
  },
});