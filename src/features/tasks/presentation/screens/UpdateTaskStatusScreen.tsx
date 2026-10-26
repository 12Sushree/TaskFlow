import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import type { Task } from "@/features/tasks/domain/entities/Task";
import type { UpdateTaskInput } from "@/features/tasks/domain/repositories/TaskRepository";
import { getTaskById, updateTask } from "@/config/dependencies/TaskDependencies";
import { createNotification } from "@/config/dependencies/NotificationDependencies";
import { showLocalNotification } from "@/shared/services/LocalNotificationService.ts";

import AppButton from "@/shared/components/ui/AppButton";

type StatusOption = {
  value: Task["status"];
  title: string;
  description: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "pending",
    title: "Pending",
    description: "Task has not been started yet.",
  },
  {
    value: "in_progress",
    title: "In Progress",
    description: "Task is currently active.",
  },
  {
    value: "completed",
    title: "Completed",
    description: "Task has been successfully finished.",
  },
];

export default function UpdateTaskStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [status, setStatus] =
    useState<Task["status"]>("pending");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

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
        setStatus(result.status);
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

  const handleUpdateStatus = async () => {
    try {
      setError(null);

      if (!id) {
        throw new Error("Task ID is required.");
      }

      if (!task) {
        throw new Error("Task not found.");
      }

      setIsSaving(true);

      const input: UpdateTaskInput = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        status,
      };

      await updateTask.execute(id, input);

      try {
        await showLocalNotification(
          "Task Status Updated",
          `"${task.title}" status updated successfully.`
        );
      } catch (error) {
        console.error("Failed to show local notification:", error);
      }

      if (status !== task.status) {
        try {
          await createNotification.execute({
            userId: task.createdBy,
            title:
              status === "completed"
                ? "Task Completed"
                : "Task Status Updated",

            message:
              status === "completed"
                ? `The task "${task.title}" has been completed.`
                : `The task "${task.title}" status was changed to ${
                    status === "in_progress"
                      ? "In Progress"
                      : "Pending"
                  }.`,

            type:
              status === "completed"
                ? "TASK_COMPLETED"
                : "TASK_STATUS_CHANGED",

            taskId: task.id,
          });
        } catch (error) {
          console.error(
            "Failed to create notification:",
            error
          );
        }
      }

      router.replace(`/user/tasks/${id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update task status."
      );
    } finally {
      setIsSaving(false);
    }
  };

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

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "Task not found."}
        </Text>

        <View style={styles.backButton}>
          <AppButton
            title="Go Back"
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  const hasChanges = status !== task.status;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={styles.taskCard}>
          <Text style={styles.taskLabel}>
            TASK
          </Text>

          <Text
            style={styles.taskTitle}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          <View style={styles.currentStatusRow}>
            <Text style={styles.currentStatusLabel}>
              Current status
            </Text>

            <Text style={styles.currentStatusValue}>
              {task.status === "pending"
                ? "Pending"
                : task.status === "in_progress"
                ? "In Progress"
                : "Completed"}
            </Text>
          </View>
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>
            Select New Status
          </Text>

          <Text style={styles.sectionSubtitle}>
            Choose the current progress of this task.
          </Text>

          <View style={styles.statusOptions}>
            {STATUS_OPTIONS.map((option) => {
              const isSelected =
                status === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.statusOption,
                    isSelected &&
                      styles.selectedStatusOption,
                  ]}
                  onPress={() =>
                    setStatus(option.value)
                  }
                  disabled={isSaving}
                >
                  <View style={styles.statusContent}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected &&
                          styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected ? (
                        <View style={styles.radioInner} />
                      ) : null}
                    </View>

                    <View style={styles.statusTextContainer}>
                      <Text
                        style={[
                          styles.statusTitle,
                          isSelected &&
                            styles.selectedStatusTitle,
                        ]}
                      >
                        {option.title}
                      </Text>

                      <Text
                        style={styles.statusDescription}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton
            title={
              isSaving
                ? "Updating..."
                : "Update Status"
            }
            onPress={handleUpdateStatus}
            disabled={isSaving || !hasChanges}
          />

          {!hasChanges ? (
            <Text style={styles.noChangesText}>
              Select a different status to update.
            </Text>
          ) : null}

          <View style={styles.cancelContainer}>
            <AppButton
              title="Cancel"
              variant="outline"
              onPress={() => router.back()}
              disabled={isSaving}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  content: {
    padding: 20,
    paddingTop: 28,
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

  backButton: {
    width: "100%",
    marginTop: 20,
  },

  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 14,
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },

  taskLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1,
  },

  taskTitle: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  currentStatusRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  currentStatusLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  currentStatusValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  statusSection: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  sectionSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },

  statusOptions: {
    marginTop: 16,
    gap: 10,
  },

  statusOption: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  selectedStatusOption: {
    borderColor: "#6B7280",
    backgroundColor: "#F9FAFB",
  },

  statusContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  radioOuterSelected: {
    borderColor: "#374151",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#374151",
  },

  statusTextContainer: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  selectedStatusTitle: {
    color: "#111827",
    fontWeight: "700",
  },

  statusDescription: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },

  actions: {
    marginTop: 4,
  },

  noChangesText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },

  cancelContainer: {
    marginTop: 12,
  },
});