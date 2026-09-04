import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import { useAdminDashboard } from "@/features/admin/presentation/hooks/useAdminDashboard";
import { getUnreadNotificationCount } from "@/config/dependencies/NotificationDependencies";

import AdminHeader from "@/features/admin/presentation/components/AdminHeader";
import AdminStatsCard from "@/features/admin/presentation/components/AdminStatsCard";
import TaskPriorityChart from "@/features/tasks/presentation/components/TaskPriorityChart";
import AppButton from "@/shared/components/ui/AppButton";

export default function AdminDashboardScreen() {
  const { user, logout } = useAuth();

  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const {
    tasks,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    unassignedTasks,
    isLoading,
    error,
    refresh,
  } = useAdminDashboard();

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
      <AdminHeader
        name={user?.name ?? "Admin"}
        unreadNotificationCount={unreadNotificationCount}
        onNotificationsPress={() =>
          router.push("/admin/notifications")
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
        Overview
      </Text>

      <View style={styles.statsRow}>
        <AdminStatsCard
          title="Total Tasks"
          value={totalTasks}
          description="All tasks"
        />

        <AdminStatsCard
          title="Pending"
          value={pendingTasks}
          description="Awaiting work"
        />
      </View>

      <View style={styles.statsRow}>
        <AdminStatsCard
          title="In Progress"
          value={inProgressTasks}
          description="Currently active"
        />

        <AdminStatsCard
          title="Completed"
          value={completedTasks}
          description="Finished tasks"
        />
      </View>

      <View style={styles.statsRow}>
        <AdminStatsCard
          title="Unassigned"
          value={unassignedTasks}
          description="Need assignment"
        />
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>
          Tasks by Priority
        </Text>

        <TaskPriorityChart tasks={tasks} />
      </View>

      <Text style={styles.sectionTitle}>
        Task Management
      </Text>

      <AppButton
        title="View All Tasks"
        onPress={() =>
          router.push("/admin/tasks")
        }
      />

      <View style={styles.buttonSpacing} />

      <AppButton
        title="Create Task"
        onPress={() =>
          router.push("/admin/tasks/create")
        }
      />

      <View style={styles.buttonSpacing} />

      <AppButton
        title="Manage Users"
        variant="outline"
        onPress={() =>
          router.push("/admin/users")
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

  buttonSpacing: {
    height: 10,
  },
});