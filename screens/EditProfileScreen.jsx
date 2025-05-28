import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "../Components/ThemeContext";
import { useAuth } from "../Components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const isServiceProvider = user?.userType === "provider";

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",

    serviceDescription: user?.serviceDescription || "",
    isAvailable: user?.isAvailable !== false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
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
        {
          text: "Camera",
          onPress: () => pickImageFromCamera(),
        },
        {
          text: "Gallery",
          onPress: () => pickImageFromGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
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
      setProfileImage(result.assets[0].uri);
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
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert("Validation Error", "Username is required");
      return false;
    }

    if (formData.username.length < 3) {
      Alert.alert(
        "Validation Error",
        "Username must be at least 3 characters long"
      );
      return false;
    }

    if (formData.username.length > 20) {
      Alert.alert(
        "Validation Error",
        "Username must be less than 20 characters long"
      );
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(formData.username)) {
      Alert.alert(
        "Validation Error",
        "Username can only contain letters, numbers, underscores, and hyphens"
      );
      return false;
    }

    if (formData.email.trim() && !formData.email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem("servify_users");
      let registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

      if (formData.username !== user.username) {
        const usernameAlreadyExists = registeredUsers.some(
          (registeredUser) =>
            registeredUser.username === formData.username &&
            registeredUser.userType === user.userType
        );

        if (usernameAlreadyExists) {
          Alert.alert(
            "Error",
            "This username is already taken. Please choose a different one."
          );
          setLoading(false);
          return;
        }
      }

      const updatedUserData = {
        ...user,
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        profileImage: profileImage,
      };

      if (isServiceProvider) {
        updatedUserData.serviceDescription = formData.serviceDescription;
        updatedUserData.isAvailable = formData.isAvailable;
      }

      const result = await updateUser(updatedUserData);

      if (result.success) {
        Alert.alert("Success", "Profile updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
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
          Edit Profile
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
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <Text style={[styles.label, { color: theme.text }]}>
            Profile Picture
          </Text>
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
            <View
              style={[styles.cameraIcon, { backgroundColor: theme.accent }]}
            >
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text
            style={[styles.helperText, { color: theme.text, opacity: 0.6 }]}
          >
            Tap to change your profile picture
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Username</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.card, color: theme.text },
            ]}
            placeholderTextColor={theme.placeholder}
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => handleInputChange("username", text)}
          />
          <Text
            style={[styles.helperText, { color: theme.text, opacity: 0.6 }]}
          >
            Username must be 3-20 characters long and can only contain letters,
            numbers, underscores, and hyphens
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.card, color: theme.text },
            ]}
            placeholderTextColor={theme.placeholder}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.card, color: theme.text },
            ]}
            placeholderTextColor={theme.placeholder}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Phone Number
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.card, color: theme.text },
            ]}
            placeholderTextColor={theme.placeholder}
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Address</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                height: 80,
              },
            ]}
            placeholderTextColor={theme.placeholder}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
            multiline
          />
        </View>

        {isServiceProvider && (
          <>
            <View style={styles.sectionDivider}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Service Provider Details
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Job Description
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    height: 120,
                  },
                ]}
                placeholderTextColor={theme.placeholder}
                placeholder="Describe your professional background, experience, specialties, and what makes your services unique..."
                value={formData.serviceDescription}
                onChangeText={(text) =>
                  handleInputChange("serviceDescription", text)
                }
                multiline
                textAlignVertical="top"
              />
              <Text
                style={[styles.helperText, { color: theme.text, opacity: 0.6 }]}
              >
                This will be displayed in your profile's "About" section for
                clients to see
              </Text>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Available for Booking
                </Text>
                <Switch
                  value={formData.isAvailable}
                  onValueChange={(value) =>
                    handleInputChange("isAvailable", value)
                  }
                  trackColor={{ false: "#767577", true: "#6A5ACD" }}
                  thumbColor={formData.isAvailable ? "#f4f3f4" : "#f4f3f4"}
                />
              </View>
              <Text
                style={[styles.helperText, { color: theme.text, opacity: 0.6 }]}
              >
                Turn off if you're not currently accepting new service requests
              </Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.accent }]}
          onPress={handleSaveProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionDivider: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6A5ACD",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helperText: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
  },
  avatarContainer: {
    position: "relative",
    marginTop: 10,
    marginBottom: 10,
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
});

export default EditProfileScreen;
