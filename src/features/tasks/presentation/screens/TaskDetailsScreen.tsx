import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import type { Task } from "@/features/tasks/domain/entities/Task";
import { getTaskById } from "@/config/dependencies/TaskDependencies";

import InfoRow from "@/features/tasks/presentation/components/InfoRow";
import InfoSection from "@/features/tasks/presentation/components/InfoSection";
import StatusBadge from "@/features/tasks/presentation/components/StatusBadge";
import AppButton from "@/shared/components/ui/AppButton";

function formatStatus(
  status: Task["status"]
) {
  switch (status) {
    case "pending":
      return "Pending";

    case "in_progress":
      return "In Progress";

    case "completed":
      return "Completed";
  }
}

function formatPriority(
  priority: Task["priority"]
) {
  return (
    priority.charAt(0).toUpperCase() +
    priority.slice(1)
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString();
}

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [task, setTask] = useState<Task | null>(
    null
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Task ID is required.");
        }

        const result =
          await getTaskById.execute(id);

        setTask(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load task."
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
          Loading task...
        </Text>
      </View>
    );
  }

  if (error || !task) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load task
        </Text>

        <Text style={styles.errorText}>
          {error ?? "Task not found."}
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {task.title}
          </Text>

          <Text style={styles.createdAt}>
            Created{" "}
            {formatDate(task.createdAt)}
          </Text>
        </View>

        <StatusBadge status={formatStatus(task.status)} />
      </View>

      <InfoSection title="Description">
        <Text style={styles.description}>
          {task.description}
        </Text>
      </InfoSection>

      <InfoSection title="Task Information">
        <InfoRow
          label="Priority"
          value={formatPriority(task.priority)}
        />

        <InfoRow
          label="Status"
          value={formatStatus(task.status)}
        />

        <InfoRow
          label="Assigned To"
          value={
            task.assignedTo ?? "Unassigned"
          }
        />

        <InfoRow
          label="Due Date"
          value={
            task.dueDate
              ? formatDate(task.dueDate)
              : "No due date"
          }
        />

        <InfoRow
          label="Created At"
          value={formatDate(task.createdAt)}
        />

        <InfoRow
          label="Updated At"
          value={formatDate(task.updatedAt)}
        />
      </InfoSection>

      {task.status !== "completed" && (
        <AppButton
          title="Edit Task"
          onPress={() =>
            router.push(
              `/admin/tasks/edit/${task.id}`
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
    padding: 24,
    backgroundColor: "#F9FAFB",
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#111827",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  headerContent: {
    flex: 1,
    paddingRight: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  createdAt: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },

  editButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  overdueText: {
    fontSize: 14,
    color: "#DC2626",
    marginTop: 12,
  }
});