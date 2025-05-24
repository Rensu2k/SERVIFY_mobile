import React, { createContext, useState, useContext, useEffect } from "react";
import { userOperations, initDatabase } from "./DatabaseService";

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

  // Initialize database and load user data on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize database tables
        await initDatabase();

        // Insert default mock users if they don't exist
        await ensureDefaultUsers();

        setLoading(false);
      } catch (error) {
        console.error("Error initializing app:", error);
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // Ensure default users exist in database
  const ensureDefaultUsers = async () => {
    try {
      // Check if provider mock user exists
      const providerExists = await userOperations.checkUsernameExists(
        "provider"
      );
      if (!providerExists) {
        await userOperations.registerUser({
          username: "provider",
          password: "provider123",
          userType: "provider",
          serviceType: "Plumbing",
          serviceDescription:
            "Professional plumbing services for homes and businesses.",
          hourlyRate: "500",
          yearsOfExperience: "5",
          isAvailable: true,
        });
      }

      // Check if client mock user exists
      const clientExists = await userOperations.checkUsernameExists("client");
      if (!clientExists) {
        await userOperations.registerUser({
          username: "client",
          password: "client123",
          userType: "client",
        });
      }
    } catch (error) {
      console.error("Error ensuring default users:", error);
    }
  };

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

      // Query database for user credentials
      const userFromDb = await userOperations.loginUser(
        userData.username,
        userData.password
      );

      if (userFromDb && userFromDb.userType === userData.userType) {
        // Check if user is suspended
        if (userFromDb.suspended) {
          return {
            success: false,
            error:
              "Your account has been suspended. Please contact admin for assistance.",
          };
        }

        // Login successful
        setUser(userFromDb);
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

      // Check if username already exists
      const usernameExists = await userOperations.checkUsernameExists(
        userData.username
      );

      if (usernameExists) {
        return {
          success: false,
          error: "Username already exists",
        };
      }

      // Register the new user in database
      await userOperations.registerUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateUser = async (updatedUserData) => {
    try {
      // Update the user in database
      const success = await userOperations.updateUser(updatedUserData);

      if (success) {
        // Update the user in state
        setUser(updatedUserData);
        return { success: true };
      }

      return { success: false, error: "Failed to update user" };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Simply clear the user from state
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  // Expose the context value
  const authContextValue = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
