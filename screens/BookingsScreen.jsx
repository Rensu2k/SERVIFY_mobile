import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native";
import { useTheme } from "../Components/ThemeContext";
import { useBookings } from "../Components/BookingsContext";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Bookings = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { bookings, loading, refreshBookings } = useBookings();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh bookings when screen is focused
  useEffect(() => {
    if (isFocused) {
      refreshBookings();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    setRefreshing(false);
  };

  const renderBookings = (list) => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading bookings...
          </Text>
        </View>
      );
    }

    if (list.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-outline"
            size={50}
            color={theme.isDarkMode ? "#666" : "#CCC"}
          />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No bookings found
          </Text>
        </View>
      );
    }

    return list.map((booking, i) => (
      <View
        key={booking.id || i}
        style={[
          styles.card,
          { backgroundColor: theme.isDarkMode ? "#2C2C2C" : "#EFE9FF" },
        ]}
      >
        <TouchableOpacity>
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.serviceLabel,
                {
                  backgroundColor: theme.isDarkMode ? "#444" : "#D9D9D9",
                  color: theme.text,
                },
              ]}
            >
              {booking.service}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BookingDetails", { bookingId: booking.id })
              }
            >
              <Text style={[styles.detailsLink, { color: theme.accent }]}>
                View Details
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardBody}>
            <Image
              source={
                booking.image || require("../assets/images/airconTech.png")
              }
              style={styles.image}
            />
            <View style={styles.textContent}>
              <Text style={[styles.name, { color: theme.text }]}>
                {booking.name}
              </Text>
              <Text style={{ color: booking.color }}>{booking.status}</Text>
              <Text
                style={[
                  styles.date,
                  { color: theme.isDarkMode ? "#AAA" : "#444" },
                ]}
              >
                {booking.date}
              </Text>
              {booking.details && booking.details.service && (
                <View style={styles.serviceDetails}>
                  <Text style={[styles.serviceType, { color: theme.text }]}>
                    {booking.details.service.name}
                  </Text>
                  <Text style={[styles.servicePrice, { color: theme.accent }]}>
                    {booking.details.service.price}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  const PendingTab = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={{ backgroundColor: theme.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.accent]}
          tintColor={theme.accent}
          progressBackgroundColor={theme.card}
        />
      }
    >
      {renderBookings(bookings.pending)}
    </ScrollView>
  );

  const CancelledTab = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={{ backgroundColor: theme.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.accent]}
          tintColor={theme.accent}
          progressBackgroundColor={theme.card}
        />
      }
    >
      {renderBookings(bookings.cancelled)}
    </ScrollView>
  );

  const CompletedTab = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={{ backgroundColor: theme.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.accent]}
          tintColor={theme.accent}
          progressBackgroundColor={theme.card}
        />
      }
    >
      {renderBookings(bookings.completed)}
    </ScrollView>
  );

  const TopTab = createMaterialTopTabNavigator();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <TopTab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarIndicatorStyle: { backgroundColor: theme.accent, height: 3 },
          tabBarLabelStyle: { fontWeight: "600", color: theme.text },
          tabBarStyle: { backgroundColor: theme.background },
        }}
      >
        <TopTab.Screen name="Pending/Active" component={PendingTab} />
        <TopTab.Screen name="Completed" component={CompletedTab} />
        <TopTab.Screen name="Cancelled" component={CancelledTab} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
};

export default function BookingsScreen({ navigation, route }) {
  const { theme } = useTheme();
  return <Bookings route={route} navigation={navigation} />;
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  serviceLabel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
  },
  detailsLink: {
    fontWeight: "600",
    fontSize: 15,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  serviceType: {
    fontSize: 12,
    fontWeight: "500",
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
