import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DebugProviders = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersJson = await AsyncStorage.getItem("servify_users");
      const allUsers = usersJson ? JSON.parse(usersJson) : [];
      setUsers(allUsers);

      // Log to console as well
      console.log("=== ALL USERS IN DATABASE ===");
      allUsers.forEach((user) => {
        console.log(
          `ID: ${user.id}, Username: ${user.username}, Type: ${
            user.userType
          }, Full Name: ${user.fullName || "N/A"}`
        );
      });

      // Find Clarence specifically
      const clarence = allUsers.find(
        (user) =>
          user.username.toLowerCase() === "clarence" ||
          user.fullName?.toLowerCase().includes("clarence")
      );

      if (clarence) {
        console.log("🎯 FOUND CLARENCE!");
        console.log("Clarence Provider ID:", clarence.id);
        console.log("Clarence Full Data:", clarence);
      } else {
        console.log("❌ Clarence not found");
        console.log(
          "Available usernames:",
          allUsers.map((u) => u.username)
        );
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug: All Users</Text>
      {users.map((user) => (
        <View key={user.id} style={styles.userItem}>
          <Text style={styles.userText}>ID: {user.id}</Text>
          <Text style={styles.userText}>Username: {user.username}</Text>
          <Text style={styles.userText}>Type: {user.userType}</Text>
          <Text style={styles.userText}>
            Full Name: {user.fullName || "N/A"}
          </Text>
          {user.username.toLowerCase() === "clarence" && (
            <Text style={styles.clarenceText}>🎯 THIS IS CLARENCE!</Text>
          )}
        </View>
      ))}
    </ScrollView>
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
  },
  userItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userText: {
    fontSize: 14,
    marginBottom: 5,
  },
  clarenceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
  },
});

export default DebugProviders;
