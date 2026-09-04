import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import type { Task } from "@/features/tasks/domain/entities/Task";
import { getTasksCreatedBy } from "@/config/dependencies/TaskDependencies";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";

import TaskCard from "@/features/tasks/presentation/components/TaskCard";
import AppInput from "@/shared/components/ui/AppInput";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

export default function CreatedTasksScreen() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);

      if (!user) {
        throw new Error(
          "You must be logged in to view tasks."
        );
      }

      const result = await getTasksCreatedBy.execute(user.id);

      setTasks(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load tasks."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTasks();
    setIsRefreshing(false);
  };

  const filteredTasks = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();

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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading tasks...
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
              router.push(`/admin/tasks/${item.id}`)
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredTasks.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {tasks.length === 0
                ? "No Tasks Created"
                : "No Matching Tasks"}
            </Text>

            <Text style={styles.emptyMessage}>
              {tasks.length === 0
                ? "You have not created any tasks yet."
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
