import { Stack } from "expo-router";

export default function AdminTasksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Tasks",
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: "Create Task",
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: "Task Details",
        }}
      />

      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Edit Task",
        }}
      />
    </Stack>
  );
}