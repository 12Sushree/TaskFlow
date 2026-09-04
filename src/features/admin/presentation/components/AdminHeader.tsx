import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AdminHeaderProps = {
  name: string;
  unreadNotificationCount: number;
  onNotificationsPress: () => void;
  onLogout: () => void;
};

export default function AdminHeader({
  name,
  unreadNotificationCount,
  onNotificationsPress,
  onLogout,
}: AdminHeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>
          Welcome back,
        </Text>

        <Text style={styles.name}>
          {name}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <Pressable
          style={styles.notificationButton}
          onPress={onNotificationsPress}
        >
          <Ionicons
            name="notifications-outline"
            size={30}
            color="#374151"
          />

          {unreadNotificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadNotificationCount > 99
                  ? "99+"
                  : unreadNotificationCount}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={30}
            color="#DC2626"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
    color: "#6B7280",
  },

  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  notificationButton: {
    position: "relative",
    padding: 8,
  },

  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  notificationBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});