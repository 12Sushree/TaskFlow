import { StyleSheet, Text, View } from "react-native";

type InfoRowProps = {
  label: string;
  value: string;
}

export default function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
  },

  infoValue: {
    flex: 1,
    marginLeft: 20,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
})