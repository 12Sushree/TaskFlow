import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  type?: InputType;
}

export default function AppInput({
  label,
  error,
  type = "text",
  style,
  ...props
}: AppInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);

  const isPassword = type === "password";

  const keyboardType =
    type === "email"
      ? "email-address"
      : type === "number"
        ? "numeric"
        : type === "search"
          ? "default"
          : props.keyboardType;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          error && styles.inputContainerError,
        ]}
      >
        <TextInput
          {...props}
          style={[styles.input, style]}
          keyboardType={keyboardType}
          secureTextEntry={
            isPassword && !isPasswordVisible
          }
          placeholderTextColor="#9CA3AF"
          autoCapitalize={
            type === "email"
              ? "none"
              : props.autoCapitalize
          }
          autoCorrect={
            type === "email" || isPassword
              ? false
              : props.autoCorrect
          }
        />

        {isPassword ? (
          <Pressable
            onPress={() =>
              setIsPasswordVisible(
                (previous) => !previous
              )
            }
            hitSlop={10}
          >
            <Text style={styles.toggle}>
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  inputContainerError: {
    borderColor: "#DC2626",
  },

  input: {
    flex: 1,
    minHeight: 48,
    fontSize: 15,
    color: "#111827",
  },

  toggle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  error: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 5,
  },
});