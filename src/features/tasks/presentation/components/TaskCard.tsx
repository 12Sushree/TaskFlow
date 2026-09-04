import { StyleSheet, Text, View } from "react-native";
import type { Task } from "@/features/tasks/domain/entities/Task";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>

        <Text style={styles.priority}>
          {task.priority.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.description}>
        {task.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.status}>
          {task.status}
        </Text>

        {task.dueDate && (
          <Text style={styles.dueDate}>
            Due: {task.dueDate}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    marginRight: 10,
  },

  priority: {
    fontSize: 11,
    fontWeight: "700",
  },

  description: {
    marginTop: 8,
    fontSize: 14,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  status: {
    fontSize: 13,
    fontWeight: "600",
  },

  dueDate: {
    fontSize: 12,
  },
});