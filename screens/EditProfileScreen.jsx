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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../Components/ThemeContext";
import { useAuth } from "../Components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const isServiceProvider = user?.userType === "provider";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    // Service provider specific fields
    serviceDescription: user?.serviceDescription || "",
    serviceType: user?.serviceType || "",
    hourlyRate: user?.hourlyRate || "",
    yearsOfExperience: user?.yearsOfExperience || "",
    isAvailable: user?.isAvailable !== false, // Default to true if not set
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert("Validation Error", "Username is required");
      return false;
    }

    // Simple email validation
    if (formData.email.trim() && !formData.email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    // Validate service provider specific fields
    if (isServiceProvider) {
      if (!formData.serviceType.trim()) {
        Alert.alert("Validation Error", "Service type is required");
        return false;
      }

      if (formData.hourlyRate && isNaN(parseFloat(formData.hourlyRate))) {
        Alert.alert("Validation Error", "Hourly rate must be a number");
        return false;
      }

      if (
        formData.yearsOfExperience &&
        isNaN(parseInt(formData.yearsOfExperience))
      ) {
        Alert.alert("Validation Error", "Years of experience must be a number");
        return false;
      }
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Check if username already exists and is not the current user
      const storedUsers = await AsyncStorage.getItem("registeredUsers");
      let registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

      const usernameAlreadyExists = registeredUsers.some(
        (registeredUser) =>
          registeredUser.username === formData.username &&
          registeredUser.userType === user.userType &&
          registeredUser.username !== user.username
      );

      if (usernameAlreadyExists) {
        Alert.alert(
          "Error",
          "This username is already taken. Please choose a different one."
        );
        setLoading(false);
        return;
      }

      // Create updated user data
      const updatedUserData = {
        ...user,
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      };

      // Add service provider specific fields if user is a service provider
      if (isServiceProvider) {
        updatedUserData.serviceDescription = formData.serviceDescription;
        updatedUserData.serviceType = formData.serviceType;
        updatedUserData.hourlyRate = formData.hourlyRate;
        updatedUserData.yearsOfExperience = formData.yearsOfExperience;
        updatedUserData.isAvailable = formData.isAvailable;
      }

      // Use the updateUser function from AuthContext
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

      <ScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
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
              { backgroundColor: theme.card, color: theme.text, height: 80 },
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
                Service Type
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.card, color: theme.text },
                ]}
                placeholderTextColor={theme.placeholder}
                placeholder="e.g. Plumbing, Electrical, Carpentry"
                value={formData.serviceType}
                onChangeText={(text) => handleInputChange("serviceType", text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Service Description
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.card,
                    color: theme.text,
                    height: 100,
                  },
                ]}
                placeholderTextColor={theme.placeholder}
                placeholder="Describe your services in detail"
                value={formData.serviceDescription}
                onChangeText={(text) =>
                  handleInputChange("serviceDescription", text)
                }
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Hourly Rate (₱)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.card, color: theme.text },
                ]}
                placeholderTextColor={theme.placeholder}
                placeholder="e.g. 500"
                value={formData.hourlyRate}
                onChangeText={(text) => handleInputChange("hourlyRate", text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Years of Experience
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.card, color: theme.text },
                ]}
                placeholderTextColor={theme.placeholder}
                placeholder="e.g. 5"
                value={formData.yearsOfExperience}
                onChangeText={(text) =>
                  handleInputChange("yearsOfExperience", text)
                }
                keyboardType="numeric"
              />
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
              <Text style={styles.helperText}>
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
      </ScrollView>
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
});

export default EditProfileScreen;
