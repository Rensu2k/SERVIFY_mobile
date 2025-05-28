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

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setBookings({
        pending: [],
        cancelled: [],
        completed: [],
      });
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const userBookingsData = await bookingOperations.getAllBookings(
        user.username
      );

      if (userBookingsData) {
        let userBookings;
        if (Array.isArray(userBookingsData)) {
          userBookings = userBookingsData;
        } else {
          userBookings = [
            ...userBookingsData.pending,
            ...userBookingsData.completed,
            ...userBookingsData.cancelled,
          ];
        }

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

  const addBooking = async (newBooking) => {
    if (!user) return false;

    try {
      const formattedBooking = {
        status: newBooking.status,
        color: newBooking.status === "Pending" ? "#FFC107" : "#F5A623",
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
        details: newBooking,
        createdAt: new Date().toISOString(),
        userId: user.username,
        userType: user.userType,
        providerId: newBooking.providerId,
      };

      const success = await bookingOperations.addBooking(formattedBooking);

      if (success) {
        await loadBookings();
      }

      return success;
    } catch (error) {
      console.error("Error adding booking:", error);
      return false;
    }
  };

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

      for (const category of Object.keys(updatedBookings)) {
        const index = updatedBookings[category].findIndex(
          (booking) => booking.id === bookingId
        );

        if (index !== -1) {
          bookingToUpdate = { ...updatedBookings[category][index] };

          updatedBookings[category] = updatedBookings[category].filter(
            (b) => b.id !== bookingId
          );

          bookingToUpdate.status = newStatus;

          if (paymentMethod) {
            if (!bookingToUpdate.details) {
              bookingToUpdate.details = {};
            }
            bookingToUpdate.details.paymentMethod = paymentMethod;
          }

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
              newColor = "#FFC107";
            }
            updatedBookings.pending = [
              bookingToUpdate,
              ...updatedBookings.pending,
            ];
          }

          bookingToUpdate.color = newColor;

          bookingFound = true;

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

  const deleteBooking = async (bookingId) => {
    if (!user) return false;

    try {
      const success = await bookingOperations.deleteBooking(bookingId);

      if (success) {
        let updatedBookings = { ...bookings };

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
