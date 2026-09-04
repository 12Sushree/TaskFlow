import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";

import type { User } from "@/features/auth/domain/entities/User";

type UserSelectorProps = {
  users: User[];
  selectedUserId: string | null;
  onSelect: (userId: string | null) => void;
  isLoading?: boolean;
};

export default function UserSelector({
  users,
  selectedUserId,
  onSelect,
  isLoading = false,
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedUser =
    users.find(
      (user) => user.id === selectedUserId
    ) ?? null;

  const handleSelect = (
    userId: string | null
  ) => {
    onSelect(userId);
    setIsOpen(false);
  };

  return (
    <View>
      {/* Dropdown Trigger */}
      <Pressable
        style={[
          styles.dropdown,
          isOpen && styles.dropdownOpen,
        ]}
        onPress={() => {
          if (!isLoading && users.length > 0) {
            setIsOpen(true);
          }
        }}
        disabled={
          isLoading || users.length === 0
        }
      >
        <View style={styles.selectedContent}>
          {isLoading ? (
            <Text style={styles.placeholder}>
              Loading users...
            </Text>
          ) : selectedUser ? (
            <>
              <Text style={styles.selectedName}>
                {selectedUser.name}
              </Text>

              <Text style={styles.selectedEmail}>
                {selectedUser.email}
              </Text>
            </>
          ) : (
            <Text style={styles.placeholder}>
              Select a user
            </Text>
          )}
        </View>

        <Text style={styles.arrow}>
          {isOpen ? "▲" : "▼"}
        </Text>
      </Pressable>

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <Text style={styles.helperText}>
          No users available for assignment.
        </Text>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setIsOpen(false)
        }
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={styles.dropdownModal}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select User
              </Text>

              <Pressable
                onPress={() =>
                  setIsOpen(false)
                }
              >
                <Text style={styles.closeButton}>
                  ✕
                </Text>
              </Pressable>
            </View>

            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Pressable
                  style={[
                    styles.option,
                    selectedUserId === null &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    handleSelect(null)
                  }
                >
                  <View>
                    <Text style={styles.optionName}>
                      Unassigned
                    </Text>

                    <Text
                      style={styles.optionEmail}
                    >
                      No user assigned
                    </Text>
                  </View>

                  {selectedUserId === null && (
                    <Text style={styles.checkmark}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              }
              renderItem={({ item }) => {
                const isSelected =
                  item.id === selectedUserId;

                return (
                  <Pressable
                    style={[
                      styles.option,
                      isSelected &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      handleSelect(item.id)
                    }
                  >
                    <View style={styles.optionInfo}>
                      <Text
                        style={styles.optionName}
                      >
                        {item.name}
                      </Text>

                      <Text
                        style={styles.optionEmail}
                      >
                        {item.email}
                      </Text>
                    </View>

                    {isSelected && (
                      <Text
                        style={styles.checkmark}
                      >
                        ✓
                      </Text>
                    )}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    minHeight: 58,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownOpen: {
    borderColor: "#111827",
  },

  selectedContent: {
    flex: 1,
  },

  selectedName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  selectedEmail: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  placeholder: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  arrow: {
    marginLeft: 10,
    fontSize: 12,
    color: "#6B7280",
  },

  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  dropdownModal: {
    maxHeight: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  closeButton: {
    fontSize: 18,
    color: "#6B7280",
  },

  option: {
    minHeight: 64,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  selectedOption: {
    backgroundColor: "#F3F4F6",
  },

  optionInfo: {
    flex: 1,
    marginRight: 12,
  },

  optionName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  optionEmail: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },

  checkmark: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
});