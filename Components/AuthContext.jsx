import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create authentication context
const AuthContext = createContext();

// Default admin credentials for demonstration purposes
// In a real app, this would be stored securely on a backend server
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  userType: "admin",
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Load user data and registered users from storage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load current user if remembered
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }

        // Load registered users
        const storedUsers = await AsyncStorage.getItem("registeredUsers");
        if (storedUsers) {
          setRegisteredUsers(JSON.parse(storedUsers));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Login function
  const login = async (userData, rememberMe = false) => {
    try {
      // Validation for empty fields - extra check on context level
      if (!userData.username || !userData.password) {
        return {
          success: false,
          error: "Username and password are required",
        };
      }

      // Check if trying to log in as admin
      if (userData.userType === "admin") {
        if (
          userData.username === ADMIN_CREDENTIALS.username &&
          userData.password === ADMIN_CREDENTIALS.password
        ) {
          // Admin login successful
          const adminUser = { ...userData, isAdmin: true };
          setUser(adminUser);

          if (rememberMe) {
            await AsyncStorage.setItem("user", JSON.stringify(adminUser));
          }

          return { success: true };
        } else {
          // Admin login failed
          return {
            success: false,
            error:
              "Invalid admin credentials. Please contact the system administrator.",
          };
        }
      }

      // Simulate stored default users (in a real app, this would be in a database)
      const mockedUsers = {
        provider: { username: "provider", password: "provider123" },
        client: { username: "client", password: "client123" },
      };

      // Check default mock users first
      const mockedUser = mockedUsers[userData.userType];
      if (
        mockedUser &&
        mockedUser.username === userData.username &&
        mockedUser.password === userData.password
      ) {
        // Default user login successful
        setUser(userData);

        // If remember me is checked, store user data
        if (rememberMe) {
          await AsyncStorage.setItem("user", JSON.stringify(userData));
        }

        return { success: true };
      }

      // Check against registered users from AsyncStorage
      const matchedUser = registeredUsers.find(
        (user) =>
          user.username === userData.username &&
          user.password === userData.password &&
          user.userType === userData.userType
      );

      if (matchedUser) {
        // Registered user login successful
        setUser(userData);

        // If remember me is checked, store user data
        if (rememberMe) {
          await AsyncStorage.setItem("user", JSON.stringify(userData));
        }

        return { success: true };
      }

      // Login failed if we got here
      return {
        success: false,
        error: "Invalid username or password",
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      // Prevent admin signup
      if (userData.userType === "admin") {
        return {
          success: false,
          error:
            "Admin accounts cannot be created. Please contact system administrator.",
        };
      }

      // Check if username already exists for this user type
      const usernameExists = registeredUsers.some(
        (user) =>
          user.username === userData.username &&
          user.userType === userData.userType
      );

      // Also check against default mock users
      const mockedUsers = {
        provider: { username: "provider", password: "provider123" },
        client: { username: "client", password: "client123" },
      };

      const defaultUserExists =
        mockedUsers[userData.userType] &&
        mockedUsers[userData.userType].username === userData.username;

      if (usernameExists || defaultUserExists) {
        return {
          success: false,
          error: "Username already exists for this user type",
        };
      }

      // Store the new user
      const updatedUsers = [...registeredUsers, userData];
      setRegisteredUsers(updatedUsers);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "registeredUsers",
        JSON.stringify(updatedUsers)
      );

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  // Values to be provided by the context
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
