import { useState } from "react";

import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

type DatePickerProps = {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minimumDate?: Date;
  disabled?: boolean;
  placeholder?: string;
};

export default function DatePicker({
  label,
  value,
  onChange,
  minimumDate,
  disabled = false,
  placeholder = "Select due date",
}: DatePickerProps) {
  const [showPicker, setShowPicker] =
    useState(false);

  const handleChange = (
    event: unknown,
    selectedDate?: Date
  ) => {
    if (Platform.OS !== "ios") {
      setShowPicker(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View>
      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}

      <Pressable
        style={[
          styles.dateField,
          disabled && styles.disabledField,
        ]}
        onPress={() => setShowPicker(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dateText,
            !value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          { value
           ? formatDate(value)
           : placeholder
          }
        </Text>

        <Text style={styles.calendarIcon}>
          📅
        </Text>
      </Pressable>

      {showPicker && Platform.OS === "ios" && (
        <>
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display="spinner"
            minimumDate={minimumDate}
            onChange={handleChange}
          />

          <Pressable onPress={() => setShowPicker(false)}>
            <Text>Done</Text>
          </Pressable>
        </>
      )}

      {showPicker ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={
            Platform.OS === "ios"
              ? "spinner"
              : "default"
          }
          minimumDate={minimumDate}
          onValueChange={handleChange}
        />
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  dateField: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateText: {
    fontSize: 16,
    color: "#111827",
  },

  placeholderText: {
    color: "#9CA3AF",
  },

  calendarIcon: {
    fontSize: 18,
  },

  disabledField: {
    backgroundColor: "#F3F4F6",
  },

  disabledText: {
    color: "#9CA3AF",
  },
});