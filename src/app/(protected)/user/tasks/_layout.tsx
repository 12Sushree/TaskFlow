import { Stack } from "expo-router";

export default function TasksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "My Tasks",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: "Task Details",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="status/[id]"
        options={{
          title: "Update Status",
          headerShown: true,
        }}
      />
    </Stack>
  );
}