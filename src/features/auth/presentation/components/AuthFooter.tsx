import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AuthFooterProps = {
  message: string;
  actionText: string;
  onPress: () => void;
}

export default function AuthFooter({
  message,
  actionText,
  onPress,
}: AuthFooterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {message}
      </Text>

      <Pressable onPress={onPress}>
        <Text style={styles.action}>
          {actionText}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  message: {
    fontSize: 14,
    opacity: 0.65,
  },

  action: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },
});