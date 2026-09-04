import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import type { Task } from "@/features/tasks/domain/entities/Task";
import { getTaskById } from "@/config/dependencies/TaskDependencies";
import AppButton from "@/shared/components/ui/AppButton";

export default function UserTaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Task ID is required.");
        }

        const result = await getTaskById.execute(id);

        setTask(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load task details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading task details...
        </Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "Task not found."}
        </Text>

        <AppButton
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <ScrollView
     style={styles.container}
     contentContainerStyle={styles.content}
    >
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.label}>
          Title
        </Text>

        <Text style={styles.value}>
          {task.title}
        </Text>

        <Text style={styles.label}>
          Description
        </Text>

        <Text style={styles.description}>
          {task.description}
        </Text>

        <Text style={styles.label}>
          Priority
        </Text>

        <Text style={styles.value}>
          {task.priority}
        </Text>

        <Text style={styles.label}>
          Current Status
        </Text>

        <Text style={styles.value}>
          {task.status.replace("_", " ")}
        </Text>

        <Text style={styles.label}>
          Due Date
        </Text>

        <Text style={styles.value}>
          {task.dueDate ?? "No due date"}
        </Text>
      </View>

      {task.status !== "completed" && (
        <AppButton
          title="Update Status"
          onPress={() =>
            router.push(
              `/user/tasks/status/${task.id}`
            )
          }
        />
      )}

      {task.status !== "completed" && new Date(task.dueDate) < new Date()
        ? (
          <Text style={styles.overdueText}>
            The due date for this task has passed.
          </Text>
        ) : null
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
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
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 30,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    marginBottom: 30,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  overdueText: {
    fontSize: 14,
    color: "#DC2626",
    marginTop: 12,
  },
});
