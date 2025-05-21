import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookingsContext = createContext();

export const useBookings = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState({
    pending: [],
    cancelled: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);

  // Load bookings from AsyncStorage on component mount
  useEffect(() => {
    loadBookings();
  }, []);

  // Load all bookings from storage
  const loadBookings = async () => {
    try {
      setLoading(true);
      const storedBookings = await AsyncStorage.getItem("bookings");

      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save bookings to AsyncStorage
  const saveBookings = async (updatedBookings) => {
    try {
      await AsyncStorage.setItem("bookings", JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Error saving bookings:", error);
    }
  };

  // Add a new booking
  const addBooking = async (newBooking) => {
    try {
      const formattedBooking = {
        id: newBooking.id,
        status: newBooking.status,
        color: "#F5A623", // Yellow for confirmed status
        service: newBooking.service.name,
        name: newBooking.provider.name,
        date: `${newBooking.date.toDateString()} at ${newBooking.time}`,
        image: newBooking.provider.image,
        details: newBooking, // Store the full booking details
        createdAt: newBooking.createdAt,
      };

      const updatedBookings = {
        ...bookings,
        pending: [formattedBooking, ...bookings.pending],
      };

      await saveBookings(updatedBookings);
      return true;
    } catch (error) {
      console.error("Error adding booking:", error);
      return false;
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      let updatedBookings = { ...bookings };
      let bookingFound = false;

      // Find the booking in any category
      for (const category of Object.keys(updatedBookings)) {
        const index = updatedBookings[category].findIndex(
          (booking) => booking.id === bookingId
        );

        if (index !== -1) {
          const booking = { ...updatedBookings[category][index] };

          // Remove from current category
          updatedBookings[category] = updatedBookings[category].filter(
            (b) => b.id !== bookingId
          );

          // Update status and color
          booking.status = newStatus;

          // Set color based on status
          if (newStatus === "Completed") {
            booking.color = "green";
            updatedBookings.completed = [booking, ...updatedBookings.completed];
          } else if (newStatus === "Cancelled") {
            booking.color = "red";
            updatedBookings.cancelled = [booking, ...updatedBookings.cancelled];
          } else {
            booking.color = newStatus === "Accepted" ? "green" : "#F5A623";
            updatedBookings.pending = [booking, ...updatedBookings.pending];
          }

          bookingFound = true;
          break;
        }
      }

      if (bookingFound) {
        await saveBookings(updatedBookings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating booking status:", error);
      return false;
    }
  };

  // Delete a booking
  const deleteBooking = async (bookingId) => {
    try {
      let updatedBookings = { ...bookings };
      let bookingFound = false;

      // Find and remove the booking from any category
      for (const category of Object.keys(updatedBookings)) {
        if (
          updatedBookings[category].some((booking) => booking.id === bookingId)
        ) {
          updatedBookings[category] = updatedBookings[category].filter(
            (b) => b.id !== bookingId
          );
          bookingFound = true;
          break;
        }
      }

      if (bookingFound) {
        await saveBookings(updatedBookings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting booking:", error);
      return false;
    }
  };

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        loading,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        refreshBookings: loadBookings,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};
