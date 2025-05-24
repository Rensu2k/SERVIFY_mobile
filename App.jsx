import React, { useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import BookingsScreen from "./screens/BookingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AuthScreen from "./screens/AuthScreen";
import ServiceProviderDashboard from "./screens/ServiceProviderDashboard";
import RequestDetailsScreen from "./screens/RequestDetailsScreen";
import AdminDashboard from "./screens/AdminDashboard";
import SettingsScreen from "./screens/SettingsScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import EditPasswordScreen from "./screens/EditPasswordScreen";
import AllProvidersScreen from "./screens/AllProvidersScreen";
import ProviderDetailsScreen from "./screens/ProviderDetailsScreen";
import BookingDetailsScreen from "./screens/BookingDetailsScreen";
import AdminUtils from "./screens/AdminUtils";
import UserManagement from "./screens/UserManagement";
import ManageServicesScreen from "./screens/ManageServicesScreen";
import AvailabilityScreen from "./screens/AvailabilityScreen";
import { AuthProvider } from "./Components/AuthContext";
import { ThemeProvider, useTheme } from "./Components/ThemeContext";
import { BookingsProvider } from "./Components/BookingsContext";
import { initDatabase } from "./Components/DatabaseService";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab navigation for regular clients
function ClientTabs({ route }) {
  const { userType } = route.params;
  const { theme, isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? "home" : "home-outline",
            Bookings: focused ? "document-text" : "document-text-outline",
            Profile: focused ? "person" : "person-outline",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: isDarkMode ? "#888888" : "gray",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.tabBar,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ userType }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        initialParams={{ userType }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userType }}
      />
    </Tab.Navigator>
  );
}

// Stack navigator for Service Provider
function ServiceProviderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProviderDashboard"
        component={ServiceProviderDashboard}
      />
      <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userType: "provider" }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
      <Stack.Screen name="ManageServices" component={ManageServicesScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
    </Stack.Navigator>
  );
}

// Stack navigator for Admin
function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userType: "admin" }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
      <Stack.Screen name="AdminUtils" component={AdminUtils} />
      <Stack.Screen name="UserManagement" component={UserManagement} />
    </Stack.Navigator>
  );
}

// Client stack with tabs and non-tab screens
function ClientStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ClientTabs"
        component={ClientTabs}
        initialParams={{ userType: "client" }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
      <Stack.Screen name="AllProviders" component={AllProvidersScreen} />
      <Stack.Screen name="ProviderDetails" component={ProviderDetailsScreen} />
      <Stack.Screen name="Bookings" component={BookingsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    </Stack.Navigator>
  );
}

// Main component for handling authentication and routing
function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen
        name="Main"
        component={RouteSelector}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}

// Component to choose the correct route based on user type
function RouteSelector({ route }) {
  const { userType } = route.params;

  if (userType === "provider") {
    return <ServiceProviderStack />;
  } else if (userType === "admin") {
    return <AdminStack />;
  } else {
    // Default to client stack
    return <ClientStack />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BookingsProvider>
          <AppContent />
        </BookingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { theme, isDarkMode } = useTheme();

  // Initialize database on app startup
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    setupDatabase();
  }, []);

  // Create custom theme for react-navigation
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.accent,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
