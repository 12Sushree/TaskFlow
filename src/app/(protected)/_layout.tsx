import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="admin"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="user"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}