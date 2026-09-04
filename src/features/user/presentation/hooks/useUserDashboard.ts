import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import type { Task } from "@/features/tasks/domain/entities/Task";
import { getAssignedTasks } from "@/config/dependencies/TaskDependencies";
import { useAuth } from "@/features/auth/presentation/hooks/useAuth";

export function useUserDashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error("User is not authenticated.");
      }

      const result = await getAssignedTasks.execute(user.id);

      setTasks(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your tasks."
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

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return {
    tasks,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    isLoading,
    error,
    refresh: loadTasks,
  };
}