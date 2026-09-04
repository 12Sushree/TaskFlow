import { Redirect } from "expo-router";

import { useAuth } from "@/features/auth/presentation/hooks/useAuth";

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.role === "admin") {
    return <Redirect href="/admin" />;
  }

  return <Redirect href="/user" />;
}