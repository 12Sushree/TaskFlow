import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline";

type AppButtonProps = {
  title: string;
  onPress: (
    event: GestureResponderEvent
  ) => void;

  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        pressed &&
          !isDisabled &&
          styles.pressed,
      ]}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={
              variant === "outline"
                ? "#111827"
                : "#FFFFFF"
            }
          />

          <Text
            style={[
              styles.text,
              variant === "outline" &&
                styles.outlineText,
            ]}
          >
            Please wait...
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.text,
            variant === "outline" &&
              styles.outlineText,
            variant === "secondary" &&
              styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  primary: {
    backgroundColor: "#111827",
  },

  secondary: {
    backgroundColor: "#E5E7EB",
  },

  danger: {
    backgroundColor: "#DC2626",
  },

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#111827",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  outlineText: {
    color: "#111827",
  },

  secondaryText: {
    color: "#111827",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  disabled: {
    opacity: 0.55,
  },

  pressed: {
    opacity: 0.8,
  },
});