import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import type { Task } from "@/features/tasks/domain/entities/Task";
import type { UpdateTaskInput } from "@/features/tasks/domain/repositories/TaskRepository";
import type { User } from "@/features/auth/domain/entities/User";
import { getTaskById, updateTask } from "@/config/dependencies/TaskDependencies";
import { getUsers } from "@/config/dependencies/UserDependencies";
import { createNotification } from "@/config/dependencies/NotificationDependencies";
import { showLocalNotification } from "@/shared/services/LocalNotificationService.ts";

import UserSelector from "@/features/tasks/presentation/components/UserSelector";
import AppInput from "@/shared/components/ui/AppInput";
import AppButton from "@/shared/components/ui/AppButton";
import PriorityButton from "@/features/tasks/presentation/components/PriorityButton";
import DatePicker from "@/features/tasks/presentation/components/DatePicker";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setUsersLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Task ID is required.");
        }

        const [taskResult, registeredUsers] = await Promise.all([
          getTaskById.execute(id),
          getUsers.execute(),
        ]);

        setTask(taskResult);
        setTitle(taskResult.title);
        setDescription(taskResult.description);
        setPriority(taskResult.priority);
        setAssignedTo(taskResult.assignedTo);
        setDueDate(
          taskResult.dueDate
            ? new Date(`${taskResult.dueDate}T00:00:00`)
            : null
        );

        const assignableUsers = registeredUsers.filter(
          (registeredUser) => registeredUser.role === "user"
        );
        setUsers(assignableUsers);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load task information."
        );
      } finally {
        setIsLoading(false);
        setUsersLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setError(null);

      if (!id) {
        throw new Error("Task ID is required.");
      }

      const input: UpdateTaskInput = {
        title,
        description,
        priority,
        assignedTo,
        dueDate: dueDate
          ? dueDate.toLocaleDateString("en-CA")
          : undefined,
      };

      setIsSaving(true);

      await updateTask.execute(id, input);

      router.replace(`/admin/tasks/${id}`);

      try {
        if(task.assignedTo !== assignedTo) {
          await showLocalNotification(
            "Task Reassigned",
            `"${title}" reassigned successfully.`
          );
        } else {
          await showLocalNotification(
            "Task Updated",
            `"${title}" updated successfully.`
          );
        }
      } catch (error) {
        console.error("Failed to show local notification:", error);
      }

      if (assignedTo) {
        try {
          const isReassigned =
            task.assignedTo !== assignedTo;

          await createNotification.execute({
            userId: assignedTo,
            title: isReassigned
              ? "Task Assigned"
              : "Task Updated",
            message: isReassigned
              ? `You have been assigned to the task "${title.trim()}".`
              : `The task "${title.trim()}" has been updated.`,
            type: isReassigned
              ? "TASK_ASSIGNED"
              : "TASK_UPDATED",
            taskId: task.id,
          });
        } catch (error) {
          console.error(
            "Failed to create notification:",
            error
          );
        }
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update task."
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

        <AppButton
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios" ? "padding" : "height"
      }
    >
      <ScrollView
       contentContainerStyle={styles.content}
       keyboardShouldPersistTaps="handled"
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}

        <AppInput
          label="Task Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          autoCapitalize="sentences"
        />

        <AppInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={styles.descriptionInput}
        />

        <Text style={styles.label}>
          Priority
        </Text>

        <View style={styles.priorityContainer}>
          <PriorityButton
            label="Low"
            value="low"
            selected={priority === "low"}
            onPress={() =>
              setPriority("low")
            }
          />

          <PriorityButton
            label="Medium"
            value="medium"
            selected={priority === "medium"}
            onPress={() =>
              setPriority("medium")
            }
          />

          <PriorityButton
            label="High"
            value="high"
            selected={priority === "high"}
            onPress={() =>
              setPriority("high")
            }
          />
        </View>

        <Text style={styles.label}>
          Assign To
        </Text>

        <UserSelector
          users={users}
          selectedUserId={assignedTo}
          onSelect={setAssignedTo}
          isLoading={usersLoading}
        />

        <Text style={styles.helperText}>
          Select another user to reassign the task, or leave it unassigned.
        </Text>

        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={setDueDate}
          minimumDate={new Date()}
          placeholder="Select due date"
        />

        <Text style={styles.helperText}>
          Leave this empty if the task has no due date.
        </Text>

        <AppButton
          title={ isSaving ? "Updating..." : "Update Task" }
          onPress={handleUpdate}
          disabled={
            isSaving ||
            usersLoading ||
            !title.trim() ||
            !description.trim()
          }
        />

        <View style={styles.cancelContainer}>
          <AppButton
            title="Cancel"
            variant="outline"
            onPress={() => router.back()}
            disabled={isSaving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: 24,
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
    fontSize: 13,
  },

  descriptionInput: {
    minHeight: 120,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  priorityContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },

  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 16,
  },

  cancelContainer: {
    marginTop: 12,
  },
});
