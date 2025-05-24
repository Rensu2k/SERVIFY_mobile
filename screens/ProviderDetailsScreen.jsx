import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../Components/ThemeContext";
import { useBookings } from "../Components/BookingsContext";
import { useAuth } from "../Components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AVAILABILITY_STORAGE_KEY = "servify_provider_availability";

const ProviderDetailsScreen = ({ route, navigation }) => {
  const { provider } = route.params || {};

  // Safety check for provider data
  if (!provider) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Error: Provider information not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#6A5ACD", marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { theme } = useTheme();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [providerAvailability, setProviderAvailability] = useState({});

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Time slot mappings
  const timeSlotMappings = {
    "Morning (8AM - 12PM)": [
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
    ],
    "Afternoon (12PM - 5PM)": [
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
    ],
    "Evening (5PM - 9PM)": [
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
    ],
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    loadProviderAvailability();
  }, [provider]);

  useEffect(() => {
    if (Object.keys(providerAvailability).length > 0) {
      generateAvailableDates();
    }
  }, [providerAvailability]);

  useEffect(() => {
    if (selectedDate) {
      generateAvailableTimesForDate(selectedDate);
    }
  }, [selectedDate, providerAvailability]);

  const loadProviderAvailability = async () => {
    try {
      setLoadingAvailability(true);
      const storedAvailability = await AsyncStorage.getItem(
        AVAILABILITY_STORAGE_KEY
      );

      if (storedAvailability) {
        const parsedAvailability = JSON.parse(storedAvailability);
        const providerSchedule = parsedAvailability[provider.id] || {};
        setProviderAvailability(providerSchedule);
      } else {
        // No availability set - use default availability
        setProviderAvailability({});
      }
    } catch (error) {
      console.error("Error loading provider availability:", error);
      setProviderAvailability({});
    } finally {
      setLoadingAvailability(false);
    }
  };

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    // Generate next 14 days and filter by provider's available days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Convert to Monday-Sunday format

      // Check if provider is available on this day
      if (providerAvailability[dayName]?.enabled) {
        dates.push(date);
      }
    }

    setAvailableDates(dates);
  };

  const generateAvailableTimesForDate = (date) => {
    const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
    const dayAvailability = providerAvailability[dayName];

    if (!dayAvailability || !dayAvailability.enabled) {
      setAvailableTimes([]);
      return;
    }

    const times = [];

    // Check each time slot and add individual times if the slot is enabled
    Object.entries(timeSlotMappings).forEach(([slotName, timeList]) => {
      if (dayAvailability.timeSlots && dayAvailability.timeSlots[slotName]) {
        times.push(...timeList);
      }
    });

    // Remove duplicates (like 12:00 PM which appears in both Morning and Afternoon)
    const uniqueTimes = [...new Set(times)];

    // Sort times chronologically
    uniqueTimes.sort((a, b) => {
      const timeA = convertTo24Hour(a);
      const timeB = convertTo24Hour(b);
      return timeA - timeB;
    });

    setAvailableTimes(uniqueTimes);
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return parseInt(hours + minutes, 10);
  };

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

  const handleBooking = () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to make a booking");
      return;
    }

    // Check if provider is available for booking
    if (provider?.userInfo?.isAvailable === false) {
      Alert.alert(
        "Provider Unavailable",
        "This service provider is currently not accepting new bookings. Please try again later or contact them directly."
      );
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select a date and time for your booking");
      return;
    }

    Alert.alert(
      "Booking Confirmation",
      `You are about to book ${
        provider?.name || "this provider"
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
          <Image
            source={
              provider?.image || {
                uri: "https://via.placeholder.com/100x100/cccccc/000000?text=Profile",
              }
            }
            style={styles.providerImage}
          />
          <View style={styles.providerInfo}>
            <Text style={[styles.providerName, { color: theme.text }]}>
              {provider?.name || "Unknown Provider"}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {provider?.rating || "4.5"} ({provider?.reviews || "0"} reviews)
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {provider?.category || "Service"}
              </Text>
            </View>

            {/* Availability Status */}
            <View
              style={[
                styles.availabilityBadge,
                {
                  backgroundColor:
                    provider?.userInfo?.isAvailable !== false
                      ? "#4CAF50"
                      : "#F44336",
                },
              ]}
            >
              <Ionicons
                name={
                  provider?.userInfo?.isAvailable !== false
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={14}
                color="white"
              />
              <Text style={styles.availabilityText}>
                {provider?.userInfo?.isAvailable !== false
                  ? "Available"
                  : "Unavailable"}
              </Text>
            </View>
          </View>
        </View>
        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          <Text style={[styles.aboutText, { color: theme.text }]}>
            {(provider?.userInfo?.serviceDescription &&
              typeof provider.userInfo.serviceDescription === "string" &&
              provider.userInfo.serviceDescription.trim()) ||
              "No job description provided yet."}
          </Text>
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

          {/* Loading availability */}
          {loadingAvailability && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.accent} />
              <Text style={[styles.loadingText, { color: theme.text }]}>
                Loading availability...
              </Text>
            </View>
          )}

          {/* Availability Notice */}
          {provider?.userInfo?.isAvailable === false && (
            <View style={styles.unavailableNotice}>
              <Ionicons name="information-circle" size={20} color="#F44336" />
              <Text style={[styles.unavailableText, { color: theme.text }]}>
                This provider is currently not accepting new bookings.
              </Text>
            </View>
          )}

          {/* No availability set notice */}
          {!loadingAvailability &&
            Object.keys(providerAvailability).length === 0 && (
              <View style={styles.unavailableNotice}>
                <Ionicons name="information-circle" size={20} color="#FF9800" />
                <Text style={[styles.unavailableText, { color: theme.text }]}>
                  This provider hasn't set their availability schedule yet.
                </Text>
              </View>
            )}

          {/* No available dates notice */}
          {!loadingAvailability &&
            Object.keys(providerAvailability).length > 0 &&
            availableDates.length === 0 && (
              <View style={styles.unavailableNotice}>
                <Ionicons name="information-circle" size={20} color="#FF9800" />
                <Text style={[styles.unavailableText, { color: theme.text }]}>
                  No available dates in the next 2 weeks based on provider's
                  schedule.
                </Text>
              </View>
            )}

          {/* Date Selection */}
          {!loadingAvailability && availableDates.length > 0 && (
            <>
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
            </>
          )}

          {/* Time Selection */}
          {!loadingAvailability &&
            selectedDate &&
            availableTimes.length > 0 && (
              <>
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
                          {
                            color: selectedTime === time ? "white" : theme.text,
                          },
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

          {/* No times available for selected date */}
          {!loadingAvailability &&
            selectedDate &&
            availableTimes.length === 0 && (
              <View style={styles.noTimesContainer}>
                <Text style={[styles.noTimesText, { color: theme.text }]}>
                  No available time slots for {formatDate(selectedDate)}
                </Text>
              </View>
            )}

          {/* Book Button */}
          {!loadingAvailability && availableDates.length > 0 && (
            <TouchableOpacity
              style={[
                styles.bookButton,
                {
                  backgroundColor:
                    provider?.userInfo?.isAvailable !== false &&
                    selectedDate &&
                    selectedTime
                      ? theme.accent
                      : "#CCCCCC",
                  opacity:
                    provider?.userInfo?.isAvailable !== false &&
                    selectedDate &&
                    selectedTime
                      ? 1
                      : 0.6,
                },
              ]}
              onPress={handleBooking}
              disabled={
                provider?.userInfo?.isAvailable === false ||
                !selectedDate ||
                !selectedTime
              }
            >
              <Text
                style={[
                  styles.bookButtonText,
                  {
                    color:
                      provider?.userInfo?.isAvailable !== false &&
                      selectedDate &&
                      selectedTime
                        ? "white"
                        : "#777777",
                  },
                ]}
              >
                {provider?.userInfo?.isAvailable === false
                  ? "Provider Unavailable"
                  : !selectedDate || !selectedTime
                  ? "Select Date & Time"
                  : "Book Now"}
              </Text>
            </TouchableOpacity>
          )}
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
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  availabilityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  unavailableNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  unavailableText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontStyle: "italic",
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
  },
  noTimesContainer: {
    padding: 16,
    alignItems: "center",
  },
  noTimesText: {
    fontSize: 14,
    fontStyle: "italic",
    opacity: 0.7,
  },
});

export default ProviderDetailsScreen;
