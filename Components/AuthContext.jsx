import React, { createContext, useState, useContext, useEffect } from "react";
import { userOperations, initDatabase } from "./DatabaseService";

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  userType: "admin",
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initDatabase();

        await ensureDefaultUsers();

        setLoading(false);
      } catch (error) {
        console.error("Error initializing app:", error);
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const ensureDefaultUsers = async () => {
    try {
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

  const login = async (userData, rememberMe = false) => {
    try {
      if (!userData.username || !userData.password) {
        return {
          success: false,
          error: "Username and password are required",
        };
      }

      if (userData.userType === "admin") {
        if (
          userData.username === ADMIN_CREDENTIALS.username &&
          userData.password === ADMIN_CREDENTIALS.password
        ) {
          const adminUser = { ...userData, isAdmin: true };
          setUser(adminUser);
          return { success: true };
        } else {
          return {
            success: false,
            error:
              "Invalid admin credentials. Please contact the system administrator.",
          };
        }
      }

      const userFromDb = await userOperations.loginUser(
        userData.username,
        userData.password
      );

      if (userFromDb && userFromDb.userType === userData.userType) {
        if (userFromDb.suspended) {
          return {
            success: false,
            error:
              "Your account has been suspended. Please contact admin for assistance.",
          };
        }

        setUser(userFromDb);
        return { success: true };
      }

      return {
        success: false,
        error: "Invalid username or password",
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      if (userData.userType === "admin") {
        return {
          success: false,
          error:
            "Admin accounts cannot be created. Please contact system administrator.",
        };
      }

      const usernameExists = await userOperations.checkUsernameExists(
        userData.username
      );

      if (usernameExists) {
        return {
          success: false,
          error: "Username already exists",
        };
      }

      await userOperations.registerUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const originalUsername = user.username;

      const success = await userOperations.updateUser(
        updatedUserData,
        originalUsername
      );

      if (success) {
        setUser(updatedUserData);
        return { success: true };
      }

      return { success: false, error: "Failed to update user" };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

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
