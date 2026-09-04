import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import type { AppNotification } from "@/features/notifications/domain/entities/Notification";
import { getNotificationsByUser, markNotificationAsRead, markAllNotificationsAsRead } from "@/config/dependencies/NotificationDependencies";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";

import NotificationItem from "@/features/notifications/presentation/components/NotificationItem";

export default function NotificationsScreen() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(
    async () => {
      if (!user?.id) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        const result = await getNotificationsByUser.execute(user.id);
        setNotifications(result);
      } catch (error) {
        console.error("Failed to load notifications:", error);
        setError("Failed to load notifications.");
      } finally {
        setIsLoading(false);
      }
    }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadNotifications();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNotificationPress = async (notification: AppNotification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead.execute(notification.id);

        setNotifications(
          (currentNotifications) => currentNotifications.map(
            (currentNotification) =>
              currentNotification.id === notification.id
                ? { ...currentNotification, isRead: true }
                : currentNotification
          )
        );
      }

      if (notification.taskId) {
        if (user?.role === "admin") {
          router.push(`/admin/tasks/${notification.taskId}`);
        } else {
          router.push(`/user/tasks/${notification.taskId}`);
        }
      }
    } catch (error) {
      console.error("Failed to open notification:", error);
      setError("Failed to open notification.");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setError(null);
      await markAllNotificationsAsRead.execute(user.id);
      setNotifications(
        (currentNotifications) => currentNotifications.map(
          (notification) => ({ ...notification, isRead: true })
        )
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setError("Failed to update notifications.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading notifications...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {notifications.some(
            (notification) => !notification.isRead
          ) && (
            <Text
              style={styles.markAllText}
              onPress={handleMarkAllAsRead}
            >
              Mark all as read
            </Text>
          )}
        </View>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() =>
              handleNotificationPress(item)
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={
          notifications.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No Notifications
            </Text>

            <Text style={styles.emptyMessage}>
              You do not have any notifications yet.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  markAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6D28D9",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F5F6FA",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  errorBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 13,
  },

  listContent: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  emptyList: {
    flexGrow: 1,
    padding: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  emptyMessage: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});