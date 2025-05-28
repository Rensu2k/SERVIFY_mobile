import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../Components/ThemeContext";
import { useBookings } from "../Components/BookingsContext";

const BookingDetailsScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const { theme } = useTheme();
  const { bookings, updateBookingStatus, deleteBooking } = useBookings();

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

  const openGCashApp = async () => {
    try {
      const gcashSchemes = [
        "gcash://home",
        "gcash://send",
        "gcash://pay",
        "gcash://",
        "com.mynt.gcash://home",
        "com.mynt.gcash://",
      ];

      let appOpened = false;

      for (const scheme of gcashSchemes) {
        try {
          console.log(`Trying to open: ${scheme}`);
          const canOpen = await Linking.canOpenURL(scheme);
          console.log(`Can open ${scheme}: ${canOpen}`);

          if (canOpen) {
            await Linking.openURL(scheme);
            appOpened = true;
            console.log(`Successfully opened: ${scheme}`);
            break;
          }
        } catch (error) {
          console.log(`Failed to open ${scheme}:`, error);
        }
      }

      if (!appOpened) {
        Alert.alert(
          "Open GCash Manually",
          "Please open your GCash app manually to complete the payment, then return here to confirm.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "I'll Open GCash",
              onPress: () => {
                setTimeout(() => {
                  Alert.alert(
                    "Payment Confirmation",
                    "Have you completed the payment in GCash?",
                    [
                      {
                        text: "Not Yet",
                        style: "cancel",
                      },
                      {
                        text: "Yes, Completed",
                        onPress: () => handlePayment("GCash"),
                      },
                    ]
                  );
                }, 3000);
              },
            },
            {
              text: "Download GCash",
              onPress: () => {
                const storeUrl =
                  Platform.OS === "ios"
                    ? "https://apps.apple.com/ph/app/gcash/id520948088"
                    : "https://play.google.com/store/apps/details?id=com.globe.gcash.android";
                Linking.openURL(storeUrl);
              },
            },
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error opening GCash app:", error);
      Alert.alert(
        "Manual GCash Payment",
        "Please open GCash manually to complete your payment, then return here to confirm.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open GCash Manually",
            onPress: () => {
              setTimeout(() => {
                Alert.alert(
                  "Payment Confirmation",
                  "Have you completed the payment in GCash?",
                  [
                    {
                      text: "Not Yet",
                      style: "cancel",
                    },
                    {
                      text: "Yes, Completed",
                      onPress: () => handlePayment("GCash"),
                    },
                  ]
                );
              }, 3000);
            },
          },
        ]
      );
      return false;
    }
  };

  const handleProceedToPayment = () => {
    Alert.alert("Payment Method", "Choose your preferred payment method:", [
      {
        text: "💵 Cash",
        onPress: () => handlePayment("Cash"),
      },
      {
        text: "💳 GCash",
        onPress: async () => {
          const gcashOpened = await openGCashApp();
          if (gcashOpened) {
            setTimeout(() => {
              Alert.alert(
                "Payment Confirmation",
                "Have you completed the payment in GCash?",
                [
                  {
                    text: "Not Yet",
                    style: "cancel",
                  },
                  {
                    text: "Yes, Completed",
                    onPress: () => handlePayment("GCash"),
                  },
                ]
              );
            }, 2000);
          }
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handlePayment = async (paymentMethod) => {
    try {
      const success = await updateBookingStatus(
        bookingId,
        "Pending Confirmation",
        paymentMethod
      );

      if (success) {
        Alert.alert(
          "Payment Submitted",
          `Payment via ${paymentMethod} has been submitted. The service provider will confirm your payment shortly.`,
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to process payment. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("Error", "Failed to process payment. Please try again.");
    }
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
                : booking.status === "Pending Payment"
                ? "card"
                : booking.status === "Pending Confirmation"
                ? "hourglass"
                : booking.status === "Paid"
                ? "checkmark-done-circle"
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
                booking.details?.provider?.profileImage
                  ? { uri: booking.details.provider.profileImage }
                  : booking.image || require("../assets/images/airconTech.png")
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
            <Text
              style={[
                styles.detailValue,
                { color: theme.accent, fontWeight: "600" },
              ]}
            >
              {booking.service || "Service"}
            </Text>
          </View>

          {booking.details && booking.details.service && (
            <>
              {booking.details.service.price && (
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
                    ₱
                    {typeof booking.details.service.price === "number"
                      ? booking.details.service.price.toFixed(2)
                      : booking.details.service.price}
                  </Text>
                </View>
              )}

              {booking.details.service.description && (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>
                    Description:
                  </Text>
                  <Text
                    style={[styles.detailDescription, { color: theme.text }]}
                  >
                    {booking.details.service.description}
                  </Text>
                </View>
              )}
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

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Service Location
          </Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text }]}>
              Address:
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {booking.details?.address || "Address not provided"}
            </Text>
          </View>
        </View>

        {/* Payment Information */}
        {(booking.status === "Pending Confirmation" ||
          booking.status === "Paid") &&
          booking.details?.paymentMethod && (
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Payment Information
              </Text>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.text }]}>
                  Payment Method:
                </Text>
                <View style={styles.paymentMethodContainer}>
                  <Text
                    style={[styles.paymentMethodText, { color: theme.accent }]}
                  >
                    {booking.details.paymentMethod === "Cash"
                      ? "💵 Cash"
                      : "💳 GCash"}
                  </Text>
                  <Text
                    style={[styles.paymentStatusText, { color: theme.text }]}
                  >
                    {booking.status === "Paid"
                      ? "✅ Confirmed"
                      : "⏳ Pending Confirmation"}
                  </Text>
                </View>
              </View>
            </View>
          )}

        {booking.status !== "Cancelled" &&
          booking.status !== "Declined" &&
          booking.status !== "Completed" &&
          booking.status !== "Pending Payment" &&
          booking.status !== "Pending Confirmation" &&
          booking.status !== "Paid" && (
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: "#FF3B30" }]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}

        {booking.status === "Completed" && (
          <TouchableOpacity
            style={[styles.paymentButton, { backgroundColor: "#4CAF50" }]}
            onPress={handleProceedToPayment}
          >
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        )}

        {booking.status === "Pending Payment" && (
          <TouchableOpacity
            style={[styles.paymentButton, { backgroundColor: "#4CAF50" }]}
            onPress={handleProceedToPayment}
          >
            <Text style={styles.buttonText}>Complete Payment</Text>
          </TouchableOpacity>
        )}

        {booking.status === "Pending Confirmation" && (
          <View
            style={[
              styles.pendingConfirmationIndicator,
              { backgroundColor: "#FFF3E0" },
            ]}
          >
            <Ionicons name="hourglass" size={24} color="#FF9800" />
            <Text
              style={[styles.pendingConfirmationText, { color: "#FF9800" }]}
            >
              Payment Pending Confirmation
            </Text>
          </View>
        )}

        {booking.status === "Paid" && (
          <View style={[styles.paidIndicator, { backgroundColor: "#E8F5E8" }]}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={[styles.paidText, { color: "#4CAF50" }]}>
              Payment Completed
            </Text>
          </View>
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
  paymentButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  paidIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  paidText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  pendingConfirmationIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  pendingConfirmationText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentMethodContainer: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  paymentStatusText: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default BookingDetailsScreen;
