import { StyleSheet, Text, View } from "react-native";

type StatusBadgeProps = {
  status: Task["status"];
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <View style={styles.statusBadge}>
      <Text style={styles.statusText}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
})