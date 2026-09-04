import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import AuthHeader from "@/features/auth/presentation/components/AuthHeader";
import AuthFooter from "@/features/auth/presentation/components/AuthFooter";

import AppInput from "@/shared/components/ui/AppInput";
import AppButton from "@/shared/components/ui/AppButton";

import { login } from "@/config/dependencies/AuthDependencies";

export default function LoginScreen() {
  const { isLoading, setAuthenticatedUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);

      const user = await login.execute(
        email,
        password
      );
      setAuthenticatedUser(user);

      router.replace("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
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
        <View style={styles.form}>
          <Text style={styles.logo}>
            TaskFlow
          </Text>

          <AuthHeader
            title="Welcome Back"
            subtitle="Sign in to your account"
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          <AppInput
            label="Email"
            type="email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <AppInput
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />

          <AppButton
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!email || !password || isLoading}
          />

          <AuthFooter
            message="Don't have an account?"
            actionText="Sign Up"
            onPress={() =>
              router.push("/signup")
            }
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
    justifyContent: "center",
    padding: 24,
  },

  form: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },

  logo: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 40,
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
});