import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native";

const bookingsData = {
  pending: [
    {
      status: "Pending",
      color: "#F5A623",
      service: "Aircon Cleaning",
      name: "Jester G. Pastor",
      date: "Thursday, March 27",
    },
    {
      status: "Accepted",
      color: "green",
      service: "Aircon Cleaning",
      name: "Mark Angelo Reyes",
      date: "Friday, March 28",
    },
    {
      status: "Declined",
      color: "red",
      service: "Aircon Cleaning",
      name: "Mark Angelo Reyes",
      date: "Friday, March 28",
    },
    {
      status: "Completed",
      color: "green",
      service: "Aircon Cleaning",
      name: "Mark Angelo Reyes",
      date: "Friday, March 28",
    },
  ],
  cancelled: [
    {
      status: "Cancelled",
      color: "red",
      service: "Laundry Service",
      name: "Althea Rose Bautista",
      date: "Wednesday, March 26",
    },
  ],
};

const renderBookings = (list) =>
  list.map((booking, i) => (
    <View key={i} style={styles.card}>
      <TouchableOpacity>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceLabel}>{booking.service}</Text>
          <TouchableOpacity>
            <Text style={styles.detailsLink}>View Details</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <Image
            source={require("../assets/images/airconTech.png")}
            style={styles.image}
          />
          <View style={styles.textContent}>
            <Text style={styles.name}>{booking.name}</Text>
            <Text style={{ color: booking.color }}>{booking.status}</Text>
            <Text style={styles.date}>{booking.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ));

const PendingTab = () => (
  <ScrollView contentContainerStyle={styles.scrollContent}>
    {renderBookings(bookingsData.pending)}
  </ScrollView>
);
const CancelledTab = () => (
  <ScrollView contentContainerStyle={styles.scrollContent}>
    {renderBookings(bookingsData.cancelled)}
  </ScrollView>
);

const TopTab = createMaterialTopTabNavigator();

export default function BookingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopTab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarIndicatorStyle: { backgroundColor: "#8C52FF", height: 3 },
          tabBarLabelStyle: { fontWeight: "600" },
        }}
      >
        <TopTab.Screen name="Pending/Active" component={PendingTab} />
        <TopTab.Screen name="Cancelled" component={CancelledTab} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#EFE9FF",
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
    backgroundColor: "#D9D9D9",
    color: "#000",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
  },
  detailsLink: {
    color: "#8C52FF",
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
    color: "#444",
    fontSize: 12,
  },
});
