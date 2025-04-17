import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import BookingsScreen from "./screens/BookingsScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
          tabBarActiveTintColor: "#6A5ACD",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: "gray",
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Bookings" component={BookingsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
