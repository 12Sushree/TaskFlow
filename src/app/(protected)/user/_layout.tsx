import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "User Dashboard",
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
        name="notifications"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}