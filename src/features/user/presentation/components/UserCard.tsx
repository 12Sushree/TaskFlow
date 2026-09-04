import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { User } from "@/features/auth/domain/entities/User";

type UserCardProps = {
  user: User;
};

export default function UserCard({
  user,
}: UserCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {user.name}
          </Text>

          <Text style={styles.email}>
            {user.email}
          </Text>
        </View>

        <View style={styles.roleContainer}>
          <Text style={styles.role}>
            {user.role.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.createdAt}>
          Joined: {user.createdAt}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  userInfo: {
    flex: 1,
    marginRight: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
  },

  email: {
    marginTop: 5,
    fontSize: 14,
    color: "#666666",
  },

  roleContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },

  role: {
    fontSize: 11,
    fontWeight: "700",
  },

  footer: {
    marginTop: 14,
  },

  createdAt: {
    fontSize: 12,
    color: "#777777",
  },
});