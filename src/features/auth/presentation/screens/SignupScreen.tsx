import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import type { User } from "@/features/auth/domain/entities/User";

import { useAuth } from "@/features/auth/presentation/hooks/useAuth";
import AuthHeader from "@/features/auth/presentation/components/AuthHeader";
import AuthFooter from "@/features/auth/presentation/components/AuthFooter";

import AppInput from "@/shared/components/ui/AppInput";
import AppButton from "@/shared/components/ui/AppButton";

import { signup } from "@/config/dependencies/AuthDependencies";

export default function SignupScreen() {
  const { isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState<User["role"]>("user");

  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      setError(null);

      await signup.execute(
        name,
        email,
        password,
        confirmPassword,
        role
      );

      router.replace("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account."
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Logo */}
          <Text style={styles.logo}>
            TaskFlow
          </Text>

          {/* Header */}
          <AuthHeader
            title="Create Account"
            subtitle="Create your TaskFlow account"
          />

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Name */}
          <AppInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
            autoCorrect={false}
          />

          {/* Email */}
          <AppInput
            label="Email"
            type="email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          {/* Password */}
          <AppInput
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />

          {/* Confirm Password */}
          <AppInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
          />

          {/* Role */}
          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>
              Select Role
            </Text>

            <View style={styles.roleContainer}>
              {/* User */}
              <Pressable
                style={[
                  styles.roleButton,
                  role === "user" &&
                    styles.roleButtonActive,
                ]}
                onPress={() =>
                  setRole("user")
                }
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "user" &&
                      styles.roleTextActive,
                  ]}
                >
                  User
                </Text>
              </Pressable>

              {/* Admin */}
              <Pressable
                style={[
                  styles.roleButton,
                  role === "admin" &&
                    styles.roleButtonActive,
                ]}
                onPress={() =>
                  setRole("admin")
                }
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "admin" &&
                      styles.roleTextActive,
                  ]}
                >
                  Admin
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Signup Button */}
          <AppButton
            title="Signup"
            onPress={handleSignup}
            loading={isLoading}
            disabled={
              !name.trim() ||
              !email.trim() ||
              !password ||
              !confirmPassword ||
              isLoading
            }
          />

          {/* Login */}
          <AuthFooter
            message="Already have an account?"
            actionText="Login"
            onPress={() =>
              router.push("/login")
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

  roleSection: {
    marginTop: 8,
    marginBottom: 16,
  },

  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
  },

  roleButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  roleButtonActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  roleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  roleTextActive: {
    color: "#FFFFFF",
  },
});