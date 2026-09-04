import { StyleSheet, Text, View } from "react-native";

type UserStatsCardProps = {
  title: string;
  value: number;
  description?: string;
}

export default function UserStatsCard({
  title,
  value,
  description,
}: UserStatsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      {description ? (
        <Text style={styles.description}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 110,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  title: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  value: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },

  description: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});