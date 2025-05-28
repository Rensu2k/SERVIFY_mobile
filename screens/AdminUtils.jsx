import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { userOperations } from "../Components/DatabaseService";
import { useAuth } from "../Components/AuthContext";

const AdminUtils = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user || user.userType !== "admin") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Access Denied: Admin privileges required
        </Text>
      </View>
    );
  }

  const handleRemoveAllUsersExceptAdmin = async () => {

    Alert.alert(
      "Remove Users",
      "Are you sure you want to remove all user accounts except admin? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

          
              await userOperations.removeAllUsersExceptAdmin();

              Alert.alert(
                "Success",
                "All users except admin have been removed."
              );
            } catch (error) {
              console.error("Error removing users:", error);
              Alert.alert("Error", "Failed to remove users. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Utilities</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRemoveAllUsersExceptAdmin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Remove All Users Except Admin"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});

export default AdminUtils;
