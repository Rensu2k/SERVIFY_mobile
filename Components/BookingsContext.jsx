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
      const userBookingsData = await bookingOperations.getAllBookings(
        user.username
      );

      if (userBookingsData) {
        // Check if it's already grouped or if it's an array
        let userBookings;
        if (Array.isArray(userBookingsData)) {
          // If it's an array, we need to group it
          userBookings = userBookingsData;
        } else {
          // If it's already grouped, flatten it first
          userBookings = [
            ...userBookingsData.pending,
            ...userBookingsData.completed,
            ...userBookingsData.cancelled,
          ];
        }

        // Group bookings by status
        const groupedBookings = {
          pending: userBookings.filter(
            (booking) =>
              booking.status !== "Completed" &&
              booking.status !== "Cancelled" &&
              booking.status !== "Paid" &&
              booking.status !== "Pending Confirmation" &&
              booking.status !== "Declined"
          ),
          completed: userBookings.filter(
            (booking) =>
              booking.status === "Completed" ||
              booking.status === "Pending Payment" ||
              booking.status === "Pending Confirmation" ||
              booking.status === "Paid"
          ),
          cancelled: userBookings.filter(
            (booking) =>
              booking.status === "Cancelled" || booking.status === "Declined"
          ),
        };

        setBookings(groupedBookings);
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
        color: newBooking.status === "Pending" ? "#FFC107" : "#F5A623", // Yellow for pending, orange for confirmed
        service:
          newBooking.service?.name ||
          newBooking.provider?.category ||
          "Service",
        name: newBooking.provider?.name || "Unknown Provider",
        date: `${newBooking.date.toDateString()} at ${newBooking.time}`,
        image:
          newBooking.provider?.profileImage ||
          newBooking.provider?.image ||
          null,
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
  const updateBookingStatus = async (
    bookingId,
    newStatus,
    paymentMethod = null
  ) => {
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

          // Store payment method if provided
          if (paymentMethod) {
            if (!bookingToUpdate.details) {
              bookingToUpdate.details = {};
            }
            bookingToUpdate.details.paymentMethod = paymentMethod;
          }

          // Set color based on status
          let newColor;
          if (newStatus === "Completed") {
            newColor = "#2196F3";
            updatedBookings.completed = [
              bookingToUpdate,
              ...updatedBookings.completed,
            ];
          } else if (newStatus === "Pending Payment") {
            newColor = "#FF9800";
            updatedBookings.completed = [
              bookingToUpdate,
              ...updatedBookings.completed,
            ];
          } else if (newStatus === "Pending Confirmation") {
            newColor = "#FF9800";
            updatedBookings.completed = [
              bookingToUpdate,
              ...updatedBookings.completed,
            ];
          } else if (newStatus === "Paid") {
            newColor = "#4CAF50";
            updatedBookings.completed = [
              bookingToUpdate,
              ...updatedBookings.completed,
            ];
          } else if (newStatus === "Cancelled" || newStatus === "Declined") {
            newColor = "#F44336";
            updatedBookings.cancelled = [
              bookingToUpdate,
              ...updatedBookings.cancelled,
            ];
          } else {
            if (newStatus === "Accepted") {
              newColor = "#4CAF50";
            } else if (newStatus === "Confirmed") {
              newColor = "#F5A623";
            } else {
              newColor = "#FFC107"; // Default for pending
            }
            updatedBookings.pending = [
              bookingToUpdate,
              ...updatedBookings.pending,
            ];
          }

          bookingToUpdate.color = newColor;

          bookingFound = true;

          // Update in database
          await bookingOperations.updateBookingStatus(
            bookingId,
            newStatus,
            newColor,
            paymentMethod
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
