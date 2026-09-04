import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import type { Task } from "@/features/tasks/domain/entities/Task";
import type { User } from "@/features/auth/domain/entities/User";

import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import { getUsers } from "@/config/dependencies/UserDependencies";
import { createTask } from "@/config/dependencies/TaskDependencies";
import { createNotification } from "@/config/dependencies/NotificationDependencies";
import { showLocalNotification } from "@/shared/services/LocalNotificationService";

import UserSelector from "@/features/tasks/presentation/components/UserSelector";
import AppInput from "@/shared/components/ui/AppInput";
import AppButton from "@/shared/components/ui/AppButton";
import PriorityButton from "@/features/tasks/presentation/components/PriorityButton";
import DatePicker from "@/features/tasks/presentation/components/DatePicker";

export default function CreateTaskScreen() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);

      const registeredUsers = await getUsers.execute();

      const assignableUsers =
        registeredUsers.filter(
          (registeredUser) => registeredUser.role === "user"
        );

      setUsers(assignableUsers);
    } catch (error) {
      console.error("Failed to load users:",error);
      setError("Unable to load users for assignment.");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  const handleCreate = async () => {
    try {
      setError(null);

      if (!user) {
        throw new Error("You must be logged in to create a task.");
      }

      setSaving(true);

      const createdTask = await createTask.execute({
        title,
        description,
        priority,
        assignedTo,
        dueDate: dueDate
          ? dueDate.toLocaleDateString("en-CA")
          : undefined,
        createdBy: user.id,
      });

      await showLocalNotification({
        title: "Task Created",
        body: `"${input.title}" was created successfully.`,
      });

      if (createdTask.assignedTo) {
        try {
          await createNotification.execute({
            userId: createdTask.assignedTo,
            title: "New Task Assigned",
            message: `You have been assigned the task "${createdTask.title}".`,
            type: "TASK_ASSIGNED",
            taskId: createdTask.id,
          });
        } catch (error) {
          console.error("Failed to create notification:",error);
        }
      }

      router.back();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create task."
      );
    } finally {
      setSaving(false);
    }
  };

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
          Select a user to assign this task.
          You can also leave it unassigned.
        </Text>

        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={setDueDate}
          minimumDate={new Date()}
          placeholder="Select due date"
        />

        <Text style={styles.helperText}>
          Leave this empty if the task has no
          due date.
        </Text>

        <AppButton
          title={
            saving
              ? "Creating..."
              : "Create Task"
          }
          onPress={handleCreate}
          disabled={
            saving || usersLoading
          }
        />

        <View style={styles.cancelContainer}>
          <Pressable
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </Pressable>
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

  descriptionInput: {
    minHeight: 120,
  },

  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 16,
  },

  cancelContainer: {
    alignItems: "center",
    marginTop: 16,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
});