import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";

import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import { useUserDashboard } from "@/features/user/presentation/hooks/useUserDashboard";
import { getUnreadNotificationCount } from "@/config/dependencies/NotificationDependencies";

import UserHeader from "@/features/user/presentation/components/UserHeader";
import UserStatsCard from "@/features/user/presentation/components/UserStatsCard";
import TaskPriorityChart from "@/features/tasks/presentation/components/TaskPriorityChart";
import AppButton from "@/shared/components/ui/AppButton";

export default function UserDashboardScreen() {
  const { user, logout } = useAuth();

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const {
    tasks,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    isLoading,
    error,
    refresh,
  } = useUserDashboard();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const loadUnreadNotificationCount =
    useCallback(async () => {
      if (!user?.id) {
        setUnreadNotificationCount(0);
        return;
      }

      try {
        const count = await getUnreadNotificationCount.execute(user.id);
        setUnreadNotificationCount(count);
      } catch (error) {
        console.error("Failed to load notification count:",error);
      }
    }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadUnreadNotificationCount();
    }, [loadUnreadNotificationCount])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={async () => {
            await Promise.all([
              refresh(),
              loadUnreadNotificationCount(),
            ]);
          }}
        />
      }
    >
      <UserHeader
        name={user?.name ?? "User"}
        unreadNotificationCount={unreadNotificationCount}
        onNotificationsPress={() =>
          router.push("/user/notifications")
        }
        onLogout={handleLogout}
      />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>
        My Overview
      </Text>

      <View style={styles.statsRow}>
        <UserStatsCard
          title="Total Tasks"
          value={totalTasks}
          description="Assigned to me"
        />

        <UserStatsCard
          title="Pending"
          value={pendingTasks}
          description="Awaiting work"
        />
      </View>

      <View style={styles.statsRow}>
        <UserStatsCard
          title="In Progress"
          value={inProgressTasks}
          description="Currently active"
        />

        <UserStatsCard
          title="Completed"
          value={completedTasks}
          description="Finished tasks"
        />
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>
          Tasks by Priority
        </Text>

        <TaskPriorityChart tasks={tasks} />
      </View>

      <Text style={styles.sectionTitle}>
        My Tasks
      </Text>

      <AppButton
        title="View My Tasks"
        onPress={() =>
          router.push("/user/tasks")
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  chartSection: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 13,
  },
});