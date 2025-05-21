import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "../Components/AuthContext";
import { CommonActions } from "@react-navigation/native";
import { useTheme } from "../Components/ThemeContext";

const UserProfile = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { userType } = route.params || { userType: "client" };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          const result = await logout();
          if (result.success) {
            // Navigate back to the auth screen and reset navigation
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Auth" }],
              })
            );
          } else {
            Alert.alert("Error", "Failed to log out. Please try again.");
          }
        },
      },
    ]);
  };

  const navigateToSettings = () => {
    navigation.navigate("Settings");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={require("../assets/images/Profile.jpg")}
        style={styles.avatar}
      />
      <Text style={[styles.name, { color: theme.text }]}>
        {user?.username || "User"}
      </Text>
      <Text style={[styles.email, { color: theme.text }]}>
        {user?.email ||
          `Account Type: ${
            userType.charAt(0).toUpperCase() + userType.slice(1)
          }`}
      </Text>

      <TouchableOpacity style={styles.settingRow} onPress={navigateToSettings}>
        <View style={styles.settingLeft}>
          <Feather name="settings" size={24} color={theme.accent} />
          <Text style={[styles.settingText, { color: theme.text }]}>
            Settings
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={theme.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: theme.border }]}
        onPress={handleLogout}
      >
        <Feather name="power" size={20} color="red" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 15,
    marginTop: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 30,
  },
  editButtonText: {
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 30,
    marginBottom: 30,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "60%",
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    marginLeft: 10,
  },
});
