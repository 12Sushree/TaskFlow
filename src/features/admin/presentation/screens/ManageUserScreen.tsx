import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import type { User } from "@/features/auth/domain/entities/User";

import { getUsers } from "@/config/dependencies/UserDependencies";

import UserCard from "@/features/user/presentation/components/UserCard";

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setError(null);

      const users = await getUsers.execute();

      setUsers(users);
    } catch (error) {
      console.error(
        "Failed to load users:",
        error
      );

      setError("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await loadUsers();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading users...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorMessage}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          {users.length}{" "}
          {users.length === 1
            ? "user"
            : "users"}{" "}
          registered
        </Text>
      </View>

      {/* Users */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard user={item} />
        )}
        contentContainerStyle={
          users.length === 0
            ? styles.emptyList
            : styles.list
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No Users Found
            </Text>

            <Text style={styles.emptyMessage}>
              There are no registered users yet.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#666666",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666666",
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  emptyMessage: {
    marginTop: 8,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
});