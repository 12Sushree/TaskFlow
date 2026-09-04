import { Pressable, Text, StyleSheet } from 'react-native';

type PriorityButtonProps = {
  label: string;
  value: Task["priority"];
  selected: boolean;
  onPress: () => void;
}

export default function PriorityButton({
  label,
  selected,
  onPress,
}: PriorityButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.priorityButton,
        selected && styles.priorityButtonSelected,
      ]}
    >
      <Text
        style={[
          styles.priorityText,
          selected && styles.priorityTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  priorityButtonSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  priorityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  priorityTextSelected: {
    color: "#FFFFFF",
  },
})