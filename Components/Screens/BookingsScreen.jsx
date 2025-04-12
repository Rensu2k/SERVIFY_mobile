import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

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

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState("pending"); // State to track active tab

  const renderBookings = (bookings) => {
    return bookings.map((booking, index) => (
      <View key={index} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceLabel}>{booking.service}</Text>
          <TouchableOpacity>
            <Text style={styles.detailsLink}>View Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <Image
            source={require("../../assets/images/airconTech.png")} // Replace with your image path
            style={styles.image}
          />
          <View style={styles.textContent}>
            <Text style={styles.name}>{booking.name}</Text>
            <Text style={{ color: booking.color }}>{booking.status}</Text>
            <Text style={styles.date}>{booking.date}</Text>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("pending")}>
          <Text
            style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          >
            Pending/Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("cancelled")}>
          <Text
            style={[styles.tab, activeTab === "cancelled" && styles.activeTab]}
          >
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Based on Active Tab */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === "pending"
          ? renderBookings(bookingsData.pending)
          : renderBookings(bookingsData.cancelled)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    paddingBottom: 10,
    fontSize: 16,
    color: "#999",
  },
  activeTab: {
    color: "black",
    borderBottomWidth: 2,
    borderBottomColor: "#8C52FF",
    fontWeight: "bold",
  },
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
    borderBottomColor: "Red",
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

export default BookingsScreen;
