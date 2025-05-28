import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const lightTheme = {
  background: "#FFFFFF",
  text: "#333333",
  accent: "#6A5ACD",
  card: "#F5F5F5",
  tabBar: "#FFFFFF",
  border: "#E0E0E0",
  headerBackground: "#FFFFFF",
  inputBackground: "#F5F5F5",
  shadow: "#000000",
};

export const darkTheme = {
  background: "#121212",
  text: "#FFFFFF",
  accent: "#9F7AEA",
  card: "#1E1E1E",
  tabBar: "#1E1E1E",
  border: "#333333",
  headerBackground: "#1E1E1E",
  inputBackground: "#2C2C2C",
  shadow: "#000000",
};

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemePreference = await AsyncStorage.getItem("isDarkMode");
        if (savedThemePreference !== null) {
          const darkModeEnabled = JSON.parse(savedThemePreference);
          setIsDarkMode(darkModeEnabled);
          setTheme(darkModeEnabled ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      setTheme(newMode ? darkTheme : lightTheme);
      await AsyncStorage.setItem("isDarkMode", JSON.stringify(newMode));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const value = {
    isDarkMode,
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
