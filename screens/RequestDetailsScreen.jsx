import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { bookingOperations } from "../Components/DatabaseService";

const RequestDetailsScreen = ({ route, navigation }) => {
  const { request } = route.params;

  const handleAccept = () => {
    Alert.alert(
      "Accept Booking",
      "Are you sure you want to accept this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: async () => {
            try {
              const success = await bookingOperations.updateBookingStatus(
                request.id,
                "Accepted",
                "#4CAF50"
              );

              if (success) {
                Alert.alert(
                  "Booking Accepted",
                  "You have accepted this booking. The client will be notified.",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "Error",
                  "Failed to accept booking. Please try again."
                );
              }
            } catch (error) {
              console.error("Error accepting booking:", error);
              Alert.alert(
                "Error",
                "Failed to accept booking. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      "Decline Booking",
      "Are you sure you want to decline this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Decline",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await bookingOperations.updateBookingStatus(
                request.id,
                "Declined",
                "#F44336"
              );

              if (success) {
                Alert.alert(
                  "Booking Declined",
                  "You have declined this booking. The client will be notified.",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "Error",
                  "Failed to decline booking. Please try again."
                );
              }
            } catch (error) {
              console.error("Error declining booking:", error);
              Alert.alert(
                "Error",
                "Failed to decline booking. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert("Complete Booking", "Mark this booking as completed?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Complete",
        onPress: async () => {
          try {
            const success = await bookingOperations.updateBookingStatus(
              request.id,
              "Completed",
              "#2196F3"
            );

            if (success) {
              Alert.alert(
                "Booking Completed",
                "This booking has been marked as completed. The client can now proceed to payment.",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } else {
              Alert.alert(
                "Error",
                "Failed to complete booking. Please try again."
              );
            }
          } catch (error) {
            console.error("Error completing booking:", error);
            Alert.alert(
              "Error",
              "Failed to complete booking. Please try again."
            );
          }
        },
      },
    ]);
  };

  const handleMarkPendingPayment = () => {
    Alert.alert("Pending Payment", "Mark this booking as pending payment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            const success = await bookingOperations.updateBookingStatus(
              request.id,
              "Pending Payment",
              "#FF9800"
            );

            if (success) {
              Alert.alert(
                "Status Updated",
                "Booking is now pending payment from the client.",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } else {
              Alert.alert(
                "Error",
                "Failed to update booking status. Please try again."
              );
            }
          } catch (error) {
            console.error("Error updating booking status:", error);
            Alert.alert(
              "Error",
              "Failed to update booking status. Please try again."
            );
          }
        },
      },
    ]);
  };

  const handleConfirmPayment = () => {
    Alert.alert(
      "Confirm Payment",
      "Confirm that you have received the payment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const success = await bookingOperations.updateBookingStatus(
                request.id,
                "Paid",
                "#4CAF50",
                null
              );

              if (success) {
                Alert.alert(
                  "Payment Confirmed",
                  "Payment has been confirmed. The booking is now complete.",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "Error",
                  "Failed to confirm payment. Please try again."
                );
              }
            } catch (error) {
              console.error("Error confirming payment:", error);
              Alert.alert(
                "Error",
                "Failed to confirm payment. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleCall = async (phoneNumber) => {
    try {
      const phoneUrl = `tel:${phoneNumber}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);

      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert("Error", "Unable to make phone calls on this device");
      }
    } catch (error) {
      console.error("Error making phone call:", error);
      Alert.alert("Error", "Failed to initiate phone call");
    }
  };

  const handleEmail = async (email) => {
    try {
      const emailUrl = `mailto:${email}`;
      const canOpen = await Linking.canOpenURL(emailUrl);

      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert("Error", "No email app found on this device");
      }
    } catch (error) {
      console.error("Error opening email:", error);
      Alert.alert("Error", "Failed to open email app");
    }
  };

  const handleSMS = async (phoneNumber) => {
    try {
      const smsUrl = `sms:${phoneNumber}`;
      const canOpen = await Linking.canOpenURL(smsUrl);

      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert("Error", "Unable to send SMS on this device");
      }
    } catch (error) {
      console.error("Error opening SMS:", error);
      Alert.alert("Error", "Failed to open messaging app");
    }
  };

  const handleContact = () => {
    const contactOptions = [];

    if (request.clientPhone) {
      contactOptions.push({
        text: "📞 Call",
        onPress: () => handleCall(request.clientPhone),
      });

      contactOptions.push({
        text: "💬 Message",
        onPress: () => handleSMS(request.clientPhone),
      });
    }

    if (request.clientEmail) {
      contactOptions.push({
        text: "📧 Email",
        onPress: () => handleEmail(request.clientEmail),
      });
    }

    if (contactOptions.length === 0) {
      Alert.alert(
        "No Contact Info",
        "No contact information available for this client"
      );
      return;
    }

    contactOptions.push({
      text: "Cancel",
      style: "cancel",
    });

    Alert.alert(
      "Contact Customer",
      "How would you like to contact this customer?",
      contactOptions
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFC107";
      case "confirmed":
      case "accepted":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      case "pending payment":
        return "#FF9800";
      case "pending confirmation":
        return "#FF9800";
      case "paid":
        return "#4CAF50";
      case "cancelled":
      case "declined":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const StatusBadge = ({ status }) => (
    <View
      style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}
    >
      <Text style={styles.statusText}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Service Booking</Text>
            <StatusBadge status={request.status} />
          </View>

          <View style={styles.customerInfo}>
            <Image
              source={require("../assets/images/Profile.jpg")}
              style={styles.customerImage}
            />
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{request.customer}</Text>
              <Text style={styles.customerRating}>
                <FontAwesome name="star" size={14} color="#FFD700" /> Client
              </Text>
              {request.clientEmail && (
                <Text style={styles.clientContact}>{request.clientEmail}</Text>
              )}
              {request.clientPhone && (
                <Text style={styles.clientContact}>{request.clientPhone}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContact}
            >
              <Ionicons name="chatbox-ellipses" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Ionicons name="construct-outline" size={20} color="#555" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Service</Text>
              <Text style={styles.detailValue}>{request.service}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#555" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {request.date} at {request.time}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#555" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{request.address}</Text>
            </View>
          </View>

          {/* Payment Information */}
          {(request.status === "pending confirmation" ||
            request.status === "paid") &&
            request.paymentMethod && (
              <View style={styles.detailRow}>
                <Ionicons name="card-outline" size={20} color="#555" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Payment Method</Text>
                  <View style={styles.paymentMethodInfo}>
                    <Text style={styles.paymentMethodValue}>
                      {request.paymentMethod === "Cash"
                        ? "💵 Cash Payment"
                        : "💳 GCash Payment"}
                    </Text>
                    <Text style={styles.paymentStatusValue}>
                      {request.status === "paid"
                        ? "✅ Payment Confirmed"
                        : "⏳ Awaiting Confirmation"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
        </View>
      </ScrollView>

      {request.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={handleDecline}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {request.status === "confirmed" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={handleDecline}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {request.status === "accepted" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.singleActionButton}
            onPress={handleComplete}
          >
            <Text style={styles.singleActionText}>Mark as Completed</Text>
          </TouchableOpacity>
        </View>
      )}

      {request.status === "completed" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.singleActionButton, { backgroundColor: "#FF9800" }]}
            onPress={handleMarkPendingPayment}
          >
            <Text style={styles.singleActionText}>Pending Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {request.status === "pending payment" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.singleActionButton, { backgroundColor: "#4CAF50" }]}
            disabled={true}
          >
            <Text style={styles.singleActionText}>Waiting for Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {request.status === "pending confirmation" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.singleActionButton, { backgroundColor: "#4CAF50" }]}
            onPress={handleConfirmPayment}
          >
            <Text style={styles.singleActionText}>Confirm Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {request.status === "paid" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.singleActionButton, { backgroundColor: "#4CAF50" }]}
            disabled={true}
          >
            <Text style={styles.singleActionText}>Payment Confirmed</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#6A5ACD",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  customerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  customerDetails: {
    flex: 1,
    marginLeft: 15,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  customerRating: {
    fontSize: 14,
    color: "#757575",
    marginTop: 5,
  },
  clientContact: {
    fontSize: 12,
    color: "#6A5ACD",
    marginTop: 2,
  },
  contactButton: {
    backgroundColor: "#6A5ACD",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  detailContent: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#757575",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#F44336",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  singleActionButton: {
    flex: 1,
    backgroundColor: "#6A5ACD",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  declineButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  singleActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentMethodInfo: {
    marginTop: 5,
  },
  paymentMethodValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 4,
  },
  paymentStatusValue: {
    fontSize: 14,
    color: "#666",
  },
});

export default RequestDetailsScreen;
