// Debug script to find user information
// Run this in your React Native app console or add it to a component temporarily

import AsyncStorage from "@react-native-async-storage/async-storage";

const findClarenceId = async () => {
  try {
    // Get all users from storage
    const usersJson = await AsyncStorage.getItem("servify_users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    console.log("All users in database:");
    users.forEach((user) => {
      console.log(
        `Username: ${user.username}, ID: ${user.id}, Type: ${user.userType}`
      );
    });

    // Find Clarence specifically
    const clarence = users.find(
      (user) =>
        user.username.toLowerCase() === "clarence" ||
        user.fullName?.toLowerCase().includes("clarence")
    );

    if (clarence) {
      console.log("Found Clarence!");
      console.log("Clarence ID:", clarence.id);
      console.log("Clarence data:", clarence);
    } else {
      console.log("Clarence not found in database");
      console.log(
        "Available users:",
        users.map((u) => u.username)
      );
    }
  } catch (error) {
    console.error("Error finding Clarence:", error);
  }
};

// Uncomment the next line to run the function
// findClarenceId();

export default findClarenceId;
