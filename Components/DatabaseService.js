import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const USERS_STORAGE_KEY = "servify_users";
const BOOKINGS_STORAGE_KEY = "servify_bookings";

// Collection references
const usersCollection = collection(db, "users");
const bookingsCollection = collection(db, "bookings");
const servicesCollection = collection(db, "services");

export const initDatabase = async () => {
  try {
    // Check if admin user exists
    const adminQuery = query(usersCollection, where("username", "==", "admin"));
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
      // Create admin user if it doesn't exist
      await addDoc(usersCollection, {
        username: "admin",
        password: "admin123",
        userType: "admin",
        createdAt: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

const updateBookingsForUsernameChange = async (
  oldUsername,
  newUsername,
  userType
) => {
  try {
    const bookingsJson = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
    const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];

    let updated = false;
    const updatedBookings = bookings.map((booking) => {
      let updatedBooking = { ...booking };

      const details =
        typeof booking.details === "string"
          ? JSON.parse(booking.details)
          : booking.details;

      if (userType === "client" && booking.userId === oldUsername) {
        updatedBooking.userId = newUsername;
        updated = true;
      }

      if (userType === "provider" && details?.provider) {
        if (
          details.provider.username === oldUsername ||
          details.provider.name === oldUsername ||
          details.provider.id === oldUsername
        ) {
          details.provider.username = newUsername;
          if (details.provider.name === oldUsername) {
            details.provider.name = newUsername;
          }
          if (details.provider.id === oldUsername) {
            details.provider.id = newUsername;
          }
          updatedBooking.details = details;
          updated = true;
        }
      }

      return updatedBooking;
    });

    if (updated) {
      await AsyncStorage.setItem(
        BOOKINGS_STORAGE_KEY,
        JSON.stringify(updatedBookings)
      );
      console.log(
        "Updated bookings for username change:",
        oldUsername,
        "->",
        newUsername
      );
    }

    return true;
  } catch (error) {
    console.error("Error updating bookings for username change:", error);
    return false;
  }
};

export const userOperations = {
  registerUser: async (user) => {
    try {
      const newUser = {
        ...user,
        suspended: false,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(usersCollection, newUser);
      return docRef.id;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const snapshot = await getDocs(usersCollection);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const userRef = doc(usersCollection, userId);
      await deleteDoc(userRef);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  toggleUserSuspension: async (userId) => {
    try {
      const userRef = doc(usersCollection, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentSuspended = userDoc.data().suspended;
        await updateDoc(userRef, { suspended: !currentSuspended });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error toggling user suspension:", error);
      throw error;
    }
  },

  removeAllUsersExceptAdmin: async () => {
    try {
      const snapshot = await getDocs(usersCollection);
      const deletePromises = snapshot.docs
        .filter((doc) => doc.data().userType !== "admin")
        .map((doc) => deleteDoc(doc.ref));

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error removing users:", error);
      throw error;
    }
  },

  loginUser: async (username, password) => {
    try {
      const q = query(
        usersCollection,
        where("username", "==", username),
        where("password", "==", password)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        return {
          id: userDoc.id,
          ...userDoc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  checkUsernameExists: async (username) => {
    try {
      const q = query(usersCollection, where("username", "==", username));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking username:", error);
      throw error;
    }
  },

  getUserByUsername: async (username) => {
    try {
      const q = query(usersCollection, where("username", "==", username));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        return {
          id: userDoc.id,
          ...userDoc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },

  updateUser: async (user, originalUsername = null) => {
    try {
      const q = query(
        usersCollection,
        where("username", "==", originalUsername || user.username)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await updateDoc(userDoc.ref, user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};

export const bookingOperations = {
  addBooking: async (booking) => {
    try {
      const newBooking = {
        ...booking,
        createdAt: serverTimestamp(),
      };

      await addDoc(bookingsCollection, newBooking);
      return true;
    } catch (error) {
      console.error("Error adding booking:", error);
      throw error;
    }
  },

  getBookingsByStatus: async (userId, status) => {
    try {
      const q = query(
        bookingsCollection,
        where("userId", "==", userId),
        where("status", "==", status)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting bookings by status:", error);
      throw error;
    }
  },

  getAllBookings: async (userId) => {
    try {
      const q = query(bookingsCollection, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        pending: bookings.filter(
          (booking) =>
            booking.status !== "Completed" &&
            booking.status !== "Cancelled" &&
            booking.status !== "Paid" &&
            booking.status !== "Pending Confirmation" &&
            booking.status !== "Declined"
        ),
        completed: bookings.filter(
          (booking) =>
            booking.status === "Completed" ||
            booking.status === "Pending Payment" ||
            booking.status === "Pending Confirmation" ||
            booking.status === "Paid"
        ),
        cancelled: bookings.filter(
          (booking) =>
            booking.status === "Cancelled" || booking.status === "Declined"
        ),
      };
    } catch (error) {
      console.error("Error getting all bookings:", error);
      throw error;
    }
  },

  updateBookingStatus: async (
    bookingId,
    newStatus,
    newColor,
    paymentMethod = null
  ) => {
    try {
      const bookingRef = doc(bookingsCollection, bookingId);
      const updateData = {
        status: newStatus,
        color: newColor,
      };

      if (paymentMethod) {
        updateData.paymentMethod = paymentMethod;
      }

      await updateDoc(bookingRef, updateData);
      return true;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const bookingRef = doc(bookingsCollection, bookingId);
      await deleteDoc(bookingRef);
      return true;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },

  getProviderBookings: async (providerId) => {
    try {
      const q = query(
        bookingsCollection,
        where("providerId", "==", providerId)
      );

      const snapshot = await getDocs(q);
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        pending: bookings.filter(
          (booking) =>
            booking.status !== "Completed" &&
            booking.status !== "Cancelled" &&
            booking.status !== "Paid" &&
            booking.status !== "Pending Confirmation" &&
            booking.status !== "Declined"
        ),
        completed: bookings.filter(
          (booking) =>
            booking.status === "Completed" ||
            booking.status === "Pending Payment" ||
            booking.status === "Pending Confirmation" ||
            booking.status === "Paid"
        ),
        cancelled: bookings.filter(
          (booking) =>
            booking.status === "Cancelled" || booking.status === "Declined"
        ),
      };
    } catch (error) {
      console.error("Error getting provider bookings:", error);
      throw error;
    }
  },

  clearAllBookings: async () => {
    try {
      const snapshot = await getDocs(bookingsCollection);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error clearing all bookings:", error);
      throw error;
    }
  },
};

export const serviceOperations = {
  addService: async (service) => {
    try {
      const newService = {
        ...service,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(servicesCollection, newService);
      return docRef.id;
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  },

  getServicesByProvider: async (providerId) => {
    try {
      const q = query(
        servicesCollection,
        where("providerId", "==", providerId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting provider services:", error);
      throw error;
    }
  },

  getServicesByCategory: async (categoryId) => {
    try {
      const q = query(servicesCollection, where("category", "==", categoryId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting services by category:", error);
      throw error;
    }
  },

  getAllServices: async () => {
    try {
      const snapshot = await getDocs(servicesCollection);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting all services:", error);
      throw error;
    }
  },

  updateService: async (serviceId, updates) => {
    try {
      const serviceRef = doc(servicesCollection, serviceId);
      await updateDoc(serviceRef, updates);
      return true;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  deleteService: async (serviceId) => {
    try {
      const serviceRef = doc(servicesCollection, serviceId);
      await deleteDoc(serviceRef);
      return true;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },

  deleteAllProviderServices: async (providerId) => {
    try {
      const q = query(
        servicesCollection,
        where("providerId", "==", providerId)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error deleting provider services:", error);
      throw error;
    }
  },
};

export default {
  initDatabase,
  userOperations,
  bookingOperations,
  serviceOperations,
};
