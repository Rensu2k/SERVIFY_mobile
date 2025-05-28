import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "../Components/ThemeContext";
import { useAuth } from "../Components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!currentPassword) {
      Alert.alert("Error", "Current password is required");
      return false;
    }

    if (!newPassword) {
      Alert.alert("Error", "New password is required");
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem("registeredUsers");
      let registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

      const defaultUsers = {
        provider: { username: "provider", password: "provider123" },
        client: { username: "client", password: "client123" },
        admin: { username: "admin", password: "admin123" },
      };

      let passwordMatched = false;

      const isDefaultUser =
        defaultUsers[user.userType] &&
        defaultUsers[user.userType].username === user.username;

      if (isDefaultUser) {
        passwordMatched =
          currentPassword === defaultUsers[user.userType].password;
      } else {
        const registeredUser = registeredUsers.find(
          (regUser) =>
            regUser.username === user.username &&
            regUser.userType === user.userType
        );

        if (registeredUser) {
          passwordMatched = currentPassword === registeredUser.password;
        }
      }

      if (!passwordMatched) {
        Alert.alert("Error", "Current password is incorrect");
        setLoading(false);
        return;
      }

      const updatedUserData = {
        ...user,
        password: newPassword,
      };

      const result = await updateUser(updatedUserData);

      if (result.success) {
        Alert.alert("Success", "Password updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", result.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Change Password
        </Text>
        <View style={{ width: 24 }} />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
        extraHeight={150}
        extraScrollHeight={150}
      >
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Current Password
          </Text>
          <View
            style={[styles.passwordContainer, { backgroundColor: theme.card }]}
          >
            <TextInput
              style={[styles.passwordInput, { color: theme.text }]}
              placeholderTextColor={theme.placeholder}
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showCurrentPassword ? "eye-off" : "eye"}
                size={22}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            New Password
          </Text>
          <View
            style={[styles.passwordContainer, { backgroundColor: theme.card }]}
          >
            <TextInput
              style={[styles.passwordInput, { color: theme.text }]}
              placeholderTextColor={theme.placeholder}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showNewPassword ? "eye-off" : "eye"}
                size={22}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Confirm New Password
          </Text>
          <View
            style={[styles.passwordContainer, { backgroundColor: theme.card }]}
          >
            <TextInput
              style={[styles.passwordInput, { color: theme.text }]}
              placeholderTextColor={theme.placeholder}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={22}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: theme.accent }]}
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.updateButtonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  updateButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditPasswordScreen;
