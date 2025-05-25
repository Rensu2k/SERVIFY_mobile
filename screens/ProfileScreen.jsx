import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../Components/AuthContext";
import { CommonActions } from "@react-navigation/native";
import { useTheme } from "../Components/ThemeContext";

const UserProfile = ({ navigation, route }) => {
  const { user, logout, updateUser } = useAuth();
  const { theme } = useTheme();
  const { userType } = route.params || { userType: "client" };
  const isServiceProvider = userType === "provider";
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  // Sync profileImage state with user changes
  useEffect(() => {
    setProfileImage(user?.profileImage || null);
  }, [user?.profileImage]);

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

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const navigateToSettings = () => {
    navigation.navigate("Settings");
  };
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to change your profile picture."
      );
      return false;
    }
    return true;
  };
  const handleImagePicker = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    Alert.alert(
      "Select Image",
      "Choose how you want to select your profile picture",
      [
        { text: "Camera", onPress: () => pickImageFromCamera() },
        { text: "Gallery", onPress: () => pickImageFromGallery() },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };
  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0]) {
      await updateProfileImage(result.assets[0].uri);
    }
  };
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0]) {
      await updateProfileImage(result.assets[0].uri);
    }
  };
  const updateProfileImage = async (imageUri) => {
    try {
      const updatedUserData = { ...user, profileImage: imageUri };
      const result = await updateUser(updatedUserData);
      if (result.success) {
        setProfileImage(imageUri);
        Alert.alert("Success", "Profile picture updated successfully!");
      } else {
        Alert.alert(
          "Error",
          "Failed to update profile picture. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again."
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.profileHeader}>
        <TouchableOpacity
          onPress={handleImagePicker}
          style={styles.avatarContainer}
        >
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../assets/images/Profile.jpg")
            }
            style={styles.avatar}
          />
          <View style={[styles.cameraIcon, { backgroundColor: theme.accent }]}>
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.name, { color: theme.text }]}>
          {user?.username || "User"}
        </Text>
        <Text style={[styles.email, { color: theme.text }]}>
          {user?.email ||
            `Account Type: ${
              userType.charAt(0).toUpperCase() + userType.slice(1)
            }`}
        </Text>
      </View>

      {isServiceProvider && (
        <View style={styles.serviceProviderSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Service Provider Details
          </Text>

          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <View style={styles.infoRow}>
              <Feather name="tag" size={20} color={theme.accent} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.text }]}>
                  Service Type
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.serviceType || "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Feather name="dollar-sign" size={20} color={theme.accent} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.text }]}>
                  Hourly Rate
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.hourlyRate ? `₱${user.hourlyRate}` : "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Feather name="clock" size={20} color={theme.accent} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.text }]}>
                  Experience
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.yearsOfExperience
                    ? `${user.yearsOfExperience} years`
                    : "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Feather
                name="check-circle"
                size={20}
                color={user?.isAvailable ? "#4CAF50" : "#F44336"}
              />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.text }]}>
                  Availability
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    {
                      color: user?.isAvailable ? "#4CAF50" : "#F44336",
                    },
                  ]}
                >
                  {user?.isAvailable
                    ? "Available for booking"
                    : "Not available"}
                </Text>
              </View>
            </View>

            {user?.serviceDescription && (
              <View style={styles.descriptionContainer}>
                <Text style={[styles.infoLabel, { color: theme.text }]}>
                  Service Description
                </Text>
                <Text style={[styles.descriptionText, { color: theme.text }]}>
                  {user.serviceDescription}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

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
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 50,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
    marginTop: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
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
    marginBottom: 20,
  },
  editButtonText: {
    fontWeight: "600",
  },
  serviceProviderSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  infoCard: {
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  descriptionContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 30,
    alignSelf: "center",
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
    marginTop: 10,
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "60%",
    alignSelf: "center",
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    marginLeft: 10,
  },
});
