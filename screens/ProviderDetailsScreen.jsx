import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../Components/ThemeContext";
import { useBookings } from "../Components/BookingsContext";
import { useAuth } from "../Components/AuthContext";

const ProviderDetailsScreen = ({ route, navigation }) => {
  const { provider } = route.params;
  const { theme } = useTheme();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Mock data for reviews
  const reviews = [
    {
      id: "r1",
      name: "John Smith",
      rating: 5,
      comment: "Excellent service! Very professional and on time.",
      date: "2 weeks ago",
    },
    {
      id: "r2",
      name: "Maria Rodriguez",
      rating: 4,
      comment: "Great work, but arrived a bit late.",
      date: "1 month ago",
    },
    {
      id: "r3",
      name: "David Chen",
      rating: 5,
      comment: "Superb quality work. Will definitely hire again!",
      date: "1 month ago",
    },
  ];

  // Mock data for services offered
  const services = [
    {
      id: "s1",
      name: `Regular Service`,
      price: "₱350",
      description: "Standard service package",
    },
    {
      id: "s2",
      name: `Premium Service`,
      price: "₱650",
      description: "Premium service with additional features",
    },
    {
      id: "s3",
      name: "Express Service",
      price: "₱850",
      description: "Fast turnaround within 3 hours",
    },
  ];

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Generate available time slots
  const availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const handleBooking = () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to make a booking");
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select a date and time for your booking");
      return;
    }

    if (!selectedService) {
      Alert.alert("Error", "Please select a service type");
      return;
    }

    Alert.alert(
      "Booking Confirmation",
      `You are about to book ${provider.name} for ${
        selectedService.name
      } on ${selectedDate.toDateString()} at ${selectedTime}. Proceed?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            // Create booking object with all details
            const bookingDetails = {
              id: `booking-${Date.now()}`,
              provider: provider,
              service: selectedService,
              date: selectedDate,
              time: selectedTime,
              status: "Confirmed",
              createdAt: new Date().toISOString(),
              // Add client information
              clientId: user.username,
              clientType: user.userType,
              clientName: user.fullName || user.username,
              clientEmail: user.email,
              clientPhone: user.phone,
            };

            // Add booking using context which now uses AsyncStorage
            const success = await addBooking(bookingDetails);

            if (success) {
              Alert.alert(
                "Booking Successful",
                "Your booking has been confirmed. The service provider will contact you soon."
              );
              // Navigate to Bookings tab within the ClientTabs
              navigation.navigate("ClientTabs", { screen: "Bookings" });
            } else {
              Alert.alert(
                "Booking Failed",
                "There was an error saving your booking. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${
      months[date.getMonth()]
    }`;
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, i) => (
          <Ionicons
            key={i}
            name={i < rating ? "star" : "star-outline"}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.serviceItem,
        {
          backgroundColor: theme.card,
          borderColor:
            selectedService && selectedService.id === item.id
              ? theme.accent
              : "transparent",
          borderWidth:
            selectedService && selectedService.id === item.id ? 2 : 0,
        },
      ]}
      onPress={() => setSelectedService(item)}
    >
      <View style={styles.serviceHeader}>
        <Text style={[styles.serviceName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.servicePrice, { color: theme.accent }]}>
          {item.price}
        </Text>
      </View>
      <Text style={[styles.serviceDescription, { color: theme.text }]}>
        {item.description}
      </Text>
      {selectedService && selectedService.id === item.id && (
        <View style={styles.selectedServiceIndicator}>
          <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
          <Text style={[styles.selectedText, { color: theme.accent }]}>
            Selected
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }) => (
    <View style={[styles.reviewItem, { backgroundColor: theme.card }]}>
      <View style={styles.reviewHeader}>
        <Text style={[styles.reviewerName, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.reviewDate, { color: theme.text }]}>
          {item.date}
        </Text>
      </View>
      {renderStars(item.rating)}
      <Text style={[styles.reviewComment, { color: theme.text }]}>
        {item.comment}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Provider Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Provider Info Section */}
        <View style={styles.providerSection}>
          <Image source={provider.image} style={styles.providerImage} />
          <View style={styles.providerInfo}>
            <Text style={[styles.providerName, { color: theme.text }]}>
              {provider.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {provider.rating} ({provider.reviews} reviews)
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{provider.category}</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          <Text style={[styles.aboutText, { color: theme.text }]}>
            Professional {provider.category} service provider with{" "}
            {Math.floor(Math.random() * 5) + 3} years of experience. Specialized
            in providing high-quality services with attention to detail and
            customer satisfaction.
          </Text>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Services Offered
          </Text>
          <Text style={[styles.serviceSelectionText, { color: theme.text }]}>
            Please select a service type:
          </Text>
          <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Reviews
          </Text>
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Booking Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Book an Appointment
          </Text>

          {/* Date Selection */}
          <Text style={[styles.bookingLabel, { color: theme.text }]}>
            Select Date:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateSelector}
          >
            {availableDates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateItem,
                  selectedDate && selectedDate.getDate() === date.getDate()
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.card },
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    {
                      color:
                        selectedDate &&
                        selectedDate.getDate() === date.getDate()
                          ? "white"
                          : theme.text,
                    },
                  ]}
                >
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Selection */}
          <Text style={[styles.bookingLabel, { color: theme.text }]}>
            Select Time:
          </Text>
          <View style={styles.timeSelector}>
            {availableTimes.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeItem,
                  selectedTime === time
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.card },
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    { color: selectedTime === time ? "white" : theme.text },
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={[
              styles.bookButton,
              {
                backgroundColor: selectedService ? theme.accent : "#ccc",
                opacity: selectedService ? 1 : 0.7,
              },
            ]}
            onPress={handleBooking}
            disabled={!selectedService}
          >
            <Text style={styles.bookButtonText}>
              {selectedService ? "Book Now" : "Select a Service First"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  providerSection: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  providerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "white",
    fontWeight: "500",
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  aboutText: {
    lineHeight: 22,
  },
  serviceItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 0,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  serviceName: {
    fontWeight: "600",
    fontSize: 15,
  },
  servicePrice: {
    fontWeight: "bold",
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectedServiceIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  selectedText: {
    fontWeight: "500",
    marginLeft: 5,
  },
  serviceSelectionText: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: "italic",
  },
  reviewItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewerName: {
    fontWeight: "600",
  },
  reviewDate: {
    fontSize: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  bookingLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 16,
  },
  dateSelector: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dateItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
  },
  timeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  timeItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
  },
  bookButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProviderDetailsScreen;
