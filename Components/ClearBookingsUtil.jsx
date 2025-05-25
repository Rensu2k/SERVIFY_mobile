import React from "react";
import { View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { bookingOperations } from "./DatabaseService";

const ClearBookingsUtil = () => {
  const handleClearBookings = () => {
    Alert.alert(
      "Clear All Bookings",
      "Are you sure you want to delete ALL bookings? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await bookingOperations.clearAllBookings();
              if (success) {
                Alert.alert(
                  "Success",
                  "All bookings have been cleared successfully! You can now start fresh."
                );
              } else {
                Alert.alert("Error", "Failed to clear bookings.");
              }
            } catch (error) {
              console.error("Error clearing bookings:", error);
              Alert.alert("Error", "Failed to clear bookings.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearBookings}
      >
        <Text style={styles.buttonText}>🗑️ Clear All Bookings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClearBookingsUtil;
