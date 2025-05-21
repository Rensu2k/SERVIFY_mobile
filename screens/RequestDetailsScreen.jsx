import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

const RequestDetailsScreen = ({ route, navigation }) => {
  const { request } = route.params;

  const handleAccept = () => {
    Alert.alert(
      "Accept Request",
      "Are you sure you want to accept this service request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () => {
            // In a real app, update this request in the database
            Alert.alert(
              "Request Accepted",
              "You have accepted this service request."
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      "Decline Request",
      "Are you sure you want to decline this service request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Decline",
          style: "destructive",
          onPress: () => {
            // In a real app, decline this request in the database
            Alert.alert(
              "Request Declined",
              "You have declined this service request."
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleContact = () => {
    Alert.alert(
      "Contact Customer",
      "Would you like to call or message this customer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Call",
          onPress: () => {
            // In a real app, make a phone call
            Alert.alert("Call", "Calling the customer...");
          },
        },
        {
          text: "Message",
          onPress: () => {
            // In a real app, open messaging app
            Alert.alert("Message", "Opening messaging app...");
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFC107";
      case "confirmed":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      case "cancelled":
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
        <Text style={styles.headerTitle}>Request Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Service Request</Text>
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
                <FontAwesome name="star" size={14} color="#FFD700" /> 4.8 (15
                reviews)
              </Text>
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

          <View style={styles.detailRow}>
            <MaterialIcons name="attach-money" size={20} color="#555" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Estimated Price</Text>
              <Text style={styles.detailValue}>₱1,200 - ₱1,500</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={20} color="#555" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Service Description</Text>
              <Text style={styles.detailValue}>
                This is a detailed description of the requested service. The
                customer has requested assistance with plumbing issues in their
                bathroom. They have mentioned a leaking faucet and slow draining
                sink.
              </Text>
            </View>
          </View>
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
          <TouchableOpacity style={styles.singleActionButton}>
            <Text style={styles.singleActionText}>Mark as Completed</Text>
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
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  declineButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F44336",
    borderRadius: 10,
    padding: 15,
    marginRight: 8,
    alignItems: "center",
  },
  declineButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "bold",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    marginLeft: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  singleActionButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  singleActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RequestDetailsScreen;
