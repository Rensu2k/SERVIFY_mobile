import React, { createContext, useState, useContext, useEffect } from "react";
import { bookingOperations } from "./DatabaseService";
import { useAuth } from "./AuthContext";

const BookingsContext = createContext();

export const useBookings = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState({
    pending: [],
    cancelled: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);

  // Load bookings from database when user changes
  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      // Clear bookings when user logs out
      setBookings({
        pending: [],
        cancelled: [],
        completed: [],
      });
    }
  }, [user]);

  // Load user-specific bookings from database
  const loadBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get all bookings for current user
      const userBookings = await bookingOperations.getAllBookings(
        user.username
      );

      if (userBookings) {
        setBookings(userBookings);
      } else {
        // Initialize with empty categories if no bookings found
        setBookings({
          pending: [],
          cancelled: [],
          completed: [],
        });
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new booking
  const addBooking = async (newBooking) => {
    if (!user) return false;

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
        createdAt: new Date().toISOString(),
        userId: user.username, // Associate with current user
        userType: user.userType,
      };

      // Add to database
      const success = await bookingOperations.addBooking(formattedBooking);

      if (success) {
        // Update local state for immediate UI update
        const updatedBookings = {
          ...bookings,
          pending: [formattedBooking, ...bookings.pending],
        };
        setBookings(updatedBookings);
      }

      return success;
    } catch (error) {
      console.error("Error adding booking:", error);
      return false;
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    if (!user) return false;

    try {
      let updatedBookings = { ...bookings };
      let bookingFound = false;
      let bookingToUpdate = null;

      // Find the booking in any category
      for (const category of Object.keys(updatedBookings)) {
        const index = updatedBookings[category].findIndex(
          (booking) => booking.id === bookingId
        );

        if (index !== -1) {
          bookingToUpdate = { ...updatedBookings[category][index] };

          // Remove from current category
          updatedBookings[category] = updatedBookings[category].filter(
            (b) => b.id !== bookingId
          );

          // Update status and color
          bookingToUpdate.status = newStatus;

          // Set color based on status
          let newColor;
          if (newStatus === "Completed") {
            newColor = "green";
            updatedBookings.completed = [
              bookingToUpdate,
              ...updatedBookings.completed,
            ];
          } else if (newStatus === "Cancelled") {
            newColor = "red";
            updatedBookings.cancelled = [
              bookingToUpdate,
              ...updatedBookings.cancelled,
            ];
          } else {
            newColor = newStatus === "Accepted" ? "green" : "#F5A623";
            updatedBookings.pending = [
              bookingToUpdate,
              ...updatedBookings.pending,
            ];
          }

          bookingFound = true;

          // Update in database
          await bookingOperations.updateBookingStatus(
            bookingId,
            newStatus,
            newColor
          );
          break;
        }
      }

      if (bookingFound) {
        setBookings(updatedBookings);
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
    if (!user) return false;

    try {
      // Delete from database
      const success = await bookingOperations.deleteBooking(bookingId);

      if (success) {
        // Update local state for immediate UI update
        let updatedBookings = { ...bookings };

        // Remove from any category
        for (const category of Object.keys(updatedBookings)) {
          if (
            updatedBookings[category].some(
              (booking) => booking.id === bookingId
            )
          ) {
            updatedBookings[category] = updatedBookings[category].filter(
              (b) => b.id !== bookingId
            );
            break;
          }
        }

        setBookings(updatedBookings);
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
