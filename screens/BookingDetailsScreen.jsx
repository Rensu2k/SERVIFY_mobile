import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../Components/ThemeContext";
import { useBookings } from "../Components/BookingsContext";

const BookingDetailsScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const { theme } = useTheme();
  const { bookings, updateBookingStatus, deleteBooking } = useBookings();

  // Find the booking in any category
  const findBooking = () => {
    for (const category of Object.keys(bookings)) {
      const booking = bookings[category].find((b) => b.id === bookingId);
      if (booking) return booking;
    }
    return null;
  };

  const booking = findBooking();

  if (!booking) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Booking Details
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={50} color={theme.text} />
          <Text style={[styles.errorText, { color: theme.text }]}>
            Booking not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCancel = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            const success = await updateBookingStatus(bookingId, "Cancelled");
            if (success) {
              Alert.alert(
                "Booking Cancelled",
                "Your booking has been cancelled."
              );
              navigation.goBack();
            } else {
              Alert.alert(
                "Error",
                "Failed to cancel booking. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Booking Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: booking.color + "22" },
          ]}
        >
          <Ionicons
            name={
              booking.status === "Confirmed" || booking.status === "Accepted"
                ? "checkmark-circle"
                : booking.status === "Cancelled" ||
                  booking.status === "Declined"
                ? "close-circle"
                : booking.status === "Completed"
                ? "trophy"
                : "time"
            }
            size={28}
            color={booking.color}
          />
          <Text style={[styles.statusText, { color: booking.color }]}>
            {booking.status}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Provider Information
          </Text>
          <View style={styles.providerInfo}>
            <Image
              source={
                booking.image || require("../assets/images/airconTech.png")
              }
              style={styles.providerImage}
            />
            <View style={styles.providerDetails}>
              <Text style={[styles.providerName, { color: theme.text }]}>
                {booking.name}
              </Text>
              {booking.details &&
                booking.details.provider &&
                booking.details.provider.rating && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={[styles.ratingText, { color: theme.text }]}>
                      {booking.details.provider.rating} (
                      {booking.details.provider.reviews} reviews)
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Service Details
          </Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text }]}>
              Service:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {booking.service}
            </Text>
          </View>

          {booking.details && booking.details.service && (
            <>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.text }]}>
                  Service Type:
                </Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {booking.details.service.name}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.text }]}>
                  Price:
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.accent, fontWeight: "bold" },
                  ]}
                >
                  {booking.details.service.price}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.text }]}>
                  Description:
                </Text>
                <Text style={[styles.detailDescription, { color: theme.text }]}>
                  {booking.details.service.description}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Schedule
          </Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text }]}>
              Date & Time:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {formatDate(booking.date)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text }]}>
              Booking Created:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {booking.details && booking.details.createdAt
                ? new Date(booking.details.createdAt).toLocaleString()
                : "N/A"}
            </Text>
          </View>
        </View>

        {booking.status !== "Cancelled" && booking.status !== "Completed" && (
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: "#FF3B30" }]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
  },
  detailDescription: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default BookingDetailsScreen;
