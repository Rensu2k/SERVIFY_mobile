import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../Components/AuthContext";
import { useTheme } from "../Components/ThemeContext";

const AuthScreen = ({ navigation }) => {
  const { isAuthenticated, login, signup } = useAuth();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState("client");

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // If user is already authenticated, navigate to Main screen
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace("Main", { userType });
    }
  }, [isAuthenticated, navigation, userType]);

  const handleAuth = async () => {
    // Validate empty fields
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Password cannot be empty");
      return;
    }

    if (isLogin) {
      // Handle login logic
      const userData = {
        username,
        password, // Include password for authentication
        userType,
      };
      const result = await login(userData, rememberMe);

      if (result.success) {
        navigation.replace("Main", { userType });
      } else {
        Alert.alert(
          "Login Failed",
          result.error || "Please check your credentials and try again"
        );
      }
    } else {
      // Handle signup logic
      if (userType === "admin") {
        Alert.alert(
          "Error",
          "Admin accounts cannot be created. Please contact system administrator."
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters long");
        return;
      }

      const userData = { username, userType, password };
      const result = await signup(userData);

      if (result.success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => setIsLogin(true) },
        ]);
      } else {
        Alert.alert(
          "Signup Failed",
          result.error || "An error occurred during signup"
        );
      }
    }
  };

  // User type selector for login screen - includes Admin option
  const LoginUserTypeSelector = () => (
    <View style={styles.userTypeContainer}>
      <Text style={[styles.userTypeLabel, { color: theme.text }]}>
        Login as:
      </Text>
      <View style={styles.userTypeButtons}>
        <TouchableOpacity
          style={[
            styles.userTypeButton,
            { borderColor: theme.accent },
            userType === "client" && [
              styles.userTypeButtonActive,
              { backgroundColor: theme.accent },
            ],
          ]}
          onPress={() => setUserType("client")}
        >
          <Text
            style={
              userType === "client"
                ? styles.userTypeTextActive
                : [styles.userTypeText, { color: theme.accent }]
            }
          >
            Client
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.userTypeButton,
            { borderColor: theme.accent },
            userType === "provider" && [
              styles.userTypeButtonActive,
              { backgroundColor: theme.accent },
            ],
          ]}
          onPress={() => setUserType("provider")}
        >
          <Text
            style={
              userType === "provider"
                ? styles.userTypeTextActive
                : [styles.userTypeText, { color: theme.accent }]
            }
          >
            Service Provider
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.userTypeButton,
            { borderColor: theme.accent },
            userType === "admin" && [
              styles.userTypeButtonActive,
              { backgroundColor: theme.accent },
            ],
          ]}
          onPress={() => setUserType("admin")}
        >
          <Text
            style={
              userType === "admin"
                ? styles.userTypeTextActive
                : [styles.userTypeText, { color: theme.accent }]
            }
          >
            Admin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // User type selector for signup screen - excludes Admin option
  const SignupUserTypeSelector = () => (
    <View style={styles.userTypeContainer}>
      <Text style={[styles.userTypeLabel, { color: theme.text }]}>
        Select User Type:
      </Text>
      <View style={[styles.userTypeButtons, styles.signupUserTypeButtons]}>
        <TouchableOpacity
          style={[
            styles.userTypeButton,
            styles.signupUserTypeButton,
            { borderColor: theme.accent },
            userType === "client" && [
              styles.userTypeButtonActive,
              { backgroundColor: theme.accent },
            ],
          ]}
          onPress={() => setUserType("client")}
        >
          <Text
            style={
              userType === "client"
                ? styles.userTypeTextActive
                : [styles.userTypeText, { color: theme.accent }]
            }
          >
            Client
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.userTypeButton,
            styles.signupUserTypeButton,
            { borderColor: theme.accent },
            userType === "provider" && [
              styles.userTypeButtonActive,
              { backgroundColor: theme.accent },
            ],
          ]}
          onPress={() => setUserType("provider")}
        >
          <Text
            style={
              userType === "provider"
                ? styles.userTypeTextActive
                : [styles.userTypeText, { color: theme.accent }]
            }
          >
            Service Provider
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/servify_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {isLogin ? "Sign In" : "Sign Up"}
          </Text>

          {isLogin ? <LoginUserTypeSelector /> : <SignupUserTypeSelector />}

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBackground, color: theme.text },
              ]}
              placeholder="Username"
              placeholderTextColor={
                theme.text === "#FFFFFF" ? "#AAAAAA" : "#A9A9A9"
              }
              value={username}
              onChangeText={setUsername}
            />

            <View
              style={[
                styles.passwordContainer,
                { backgroundColor: theme.inputBackground },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={
                  theme.text === "#FFFFFF" ? "#AAAAAA" : "#A9A9A9"
                }
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color={theme.accent}
                />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View
                style={[
                  styles.passwordContainer,
                  { backgroundColor: theme.inputBackground },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: theme.text }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={
                    theme.text === "#FFFFFF" ? "#AAAAAA" : "#A9A9A9"
                  }
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color={theme.accent}
                  />
                </TouchableOpacity>
              </View>
            )}

            {isLogin && (
              <TouchableOpacity
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={styles.checkboxContainer}>
                  {rememberMe ? (
                    <Ionicons name="checkbox" size={20} color={theme.accent} />
                  ) : (
                    <Ionicons
                      name="square-outline"
                      size={20}
                      color={theme.accent}
                    />
                  )}
                  <Text style={[styles.rememberText, { color: theme.text }]}>
                    Remember Me
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: theme.accent }]}
              onPress={handleAuth}
            >
              <Text style={styles.authButtonText}>
                {isLogin ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={[styles.switchText, { color: theme.text }]}>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsLogin(!isLogin);
                  // Reset user type to client when switching between login/signup
                  setUserType("client");
                }}
              >
                <Text
                  style={[styles.switchActionText, { color: theme.accent }]}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    borderRadius: 25,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  rememberContainer: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 10,
  },
  authButton: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  authButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  switchText: {},
  switchActionText: {
    fontWeight: "bold",
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  userTypeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signupUserTypeButtons: {
    justifyContent: "center",
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center",
  },
  signupUserTypeButton: {
    maxWidth: "45%",
  },
  userTypeButtonActive: {},
  userTypeText: {},
  userTypeTextActive: {
    color: "white",
  },
});

export default AuthScreen;
