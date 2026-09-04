import { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import AppInput from "@/shared/components/ui/AppInput";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import { getAssignedTasks } from "@/config/dependencies/TaskDependencies";

import type { Task } from "@/features/tasks/domain/entities/Task";

import TaskCard from "@/features/tasks/presentation/components/TaskCard";

export default function AssignedTasksScreen() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery =
    useDebouncedValue(searchQuery, 400);

  const loadAssignedTasks = useCallback(async () => {
    if (!user?.id) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      const assignedTasks =
        await getAssignedTasks.execute(user.id);

      setTasks(assignedTasks);
    } catch (error) {
      console.error(
        "Failed to load assigned tasks:",
        error
      );

      setError("Failed to load your tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAssignedTasks();
    }, [loadAssignedTasks])
  );

  const filteredTasks = useMemo(() => {
    const query =
      debouncedSearchQuery.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query)
      );
    });
  }, [tasks, debouncedSearchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await loadAssignedTasks();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading your tasks...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push(`/user/tasks/${item.id}`)
            }
          >
            <TaskCard task={item} />
          </Pressable>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <AppInput
                label="Search Tasks"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search your tasks"
                autoCapitalize="none"
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}
          </>
        }
        contentContainerStyle={
          filteredTasks.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {tasks.length === 0
                ? "No Tasks Assigned"
                : "No Matching Tasks"}
            </Text>

            <Text style={styles.emptyMessage}>
              {tasks.length === 0
                ? "You don't have any tasks assigned to you yet."
                : "Try searching with a different keyword."}
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
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
    marginTop: 8,
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
    paddingBottom: 40,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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