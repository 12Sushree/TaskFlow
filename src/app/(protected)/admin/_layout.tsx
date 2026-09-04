import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Admin Dashboard",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="tasks"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="users"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}