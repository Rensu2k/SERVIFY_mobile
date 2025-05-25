import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const USERS_STORAGE_KEY = "servify_users";
const BOOKINGS_STORAGE_KEY = "servify_bookings";

// Initialize storage with default data structure
export const initDatabase = async () => {
  try {
    // Check if users data exists, if not initialize it
    const users = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (!users) {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    }

    // Check if bookings data exists, if not initialize it
    const bookings = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!bookings) {
      await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([]));
    }

    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Helper function to update bookings when username changes
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

      // Parse details if it's a string
      const details =
        typeof booking.details === "string"
          ? JSON.parse(booking.details)
          : booking.details;

      // Update client bookings (userId matches)
      if (userType === "client" && booking.userId === oldUsername) {
        updatedBooking.userId = newUsername;
        updated = true;
      }

      // Update provider references in booking details
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

    // Save updated bookings if any changes were made
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

// User-related storage operations
export const userOperations = {
  // Register a new user
  registerUser: async (user) => {
    try {
      // Get existing users
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Add new user with generated ID
      const newUser = {
        ...user,
        id: Date.now().toString(), // Simple ID generation
        suspended: false, // Default suspended status
      };
      users.push(newUser);

      // Save updated users list
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return newUser.id;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  },

  // Delete a specific user by ID
  deleteUser: async (userId) => {
    try {
      // Get existing users
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Filter out the user to delete
      const updatedUsers = users.filter((user) => user.id !== userId);

      // Check if user was found and deleted
      const wasDeleted = users.length > updatedUsers.length;

      // Save updated users list
      await AsyncStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(updatedUsers)
      );
      return wasDeleted;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Toggle user suspension status
  toggleUserSuspension: async (userId) => {
    try {
      // Get existing users
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find and update user suspension status
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, suspended: !user.suspended } : user
      );

      // Check if user was found
      const userFound = users.some((user) => user.id === userId);

      // Save updated users list
      await AsyncStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(updatedUsers)
      );
      return userFound;
    } catch (error) {
      console.error("Error toggling user suspension:", error);
      throw error;
    }
  },

  // Remove all users except admin (admin is handled separately in AuthContext)
  removeAllUsersExceptAdmin: async () => {
    try {
      // Set empty array to remove all users from storage
      // Admin user is hardcoded in AuthContext, not stored in AsyncStorage
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error("Error removing users:", error);
      throw error;
    }
  },

  // Login - check credentials
  loginUser: async (username, password) => {
    try {
      // Get users
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user with matching credentials
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      return user || null;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  // Check if username exists
  checkUsernameExists: async (username) => {
    try {
      // Get users
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Check if username exists
      return users.some((u) => u.username === username);
    } catch (error) {
      console.error("Error checking username:", error);
      throw error;
    }
  },

  // Get user by username
  getUserByUsername: async (username) => {
    try {
      // Get users
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user by username
      return users.find((u) => u.username === username) || null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },

  // Update user information
  updateUser: async (user, originalUsername = null) => {
    try {
      // Get users
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Use original username if provided (for username changes), otherwise use current username
      const searchUsername = originalUsername || user.username;

      // Find user index
      const userIndex = users.findIndex(
        (u) => u.username === searchUsername && u.userType === user.userType
      );

      if (userIndex === -1) {
        console.error("User not found for update:", searchUsername);
        return false;
      }

      // Update user at the found index
      users[userIndex] = { ...users[userIndex], ...user };

      // Save updated users
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // If username changed, update related bookings
      if (originalUsername && originalUsername !== user.username) {
        await updateBookingsForUsernameChange(
          originalUsername,
          user.username,
          user.userType
        );
      }

      console.log("User updated successfully:", user.username);
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};

// Booking-related storage operations
export const bookingOperations = {
  // Add a new booking
  addBooking: async (booking) => {
    try {
      // Get existing bookings
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];

      // Add new booking
      bookings.push(booking);

      // Save updated bookings
      await AsyncStorage.setItem(
        BOOKINGS_STORAGE_KEY,
        JSON.stringify(bookings)
      );
      return true;
    } catch (error) {
      console.error("Error adding booking:", error);
      throw error;
    }
  },

  // Get all bookings for a user by status
  getBookingsByStatus: async (userId, status) => {
    try {
      // Get all bookings
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];

      // Filter by user and status
      return bookings
        .filter((b) => b.userId === userId && b.status === status)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((booking) => ({
          ...booking,
          details:
            typeof booking.details === "string"
              ? JSON.parse(booking.details)
              : booking.details,
        }));
    } catch (error) {
      console.error("Error getting bookings by status:", error);
      throw error;
    }
  },

  // Get all bookings for a user grouped by status
  getAllBookings: async (userId) => {
    try {
      // Get all bookings
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];

      // Filter by user and parse details
      const userBookings = bookings
        .filter((b) => b.userId === userId)
        .map((booking) => ({
          ...booking,
          details:
            typeof booking.details === "string"
              ? JSON.parse(booking.details)
              : booking.details,
        }));

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

      return groupedBookings;
    } catch (error) {
      console.error("Error getting all bookings:", error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (
    bookingId,
    newStatus,
    newColor,
    paymentMethod = null
  ) => {
    try {
      // Get all bookings
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];

      // Find and update booking
      const updatedBookings = bookings.map((booking) => {
        if (booking.id === bookingId) {
          const updatedBooking = {
            ...booking,
            status: newStatus,
            color: newColor,
          };

          // Store payment method if provided
          if (paymentMethod) {
            const details =
              typeof booking.details === "string"
                ? JSON.parse(booking.details)
                : booking.details || {};
            details.paymentMethod = paymentMethod;
            updatedBooking.details = details;
          }

          return updatedBooking;
        }
        return booking;
      });

      // Check if booking was found and updated
      const wasUpdated =
        bookings.length > 0 &&
        bookings.some((booking) => booking.id === bookingId);

      // Save updated bookings
      await AsyncStorage.setItem(
        BOOKINGS_STORAGE_KEY,
        JSON.stringify(updatedBookings)
      );
      return wasUpdated;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  },

  // Delete a booking
  deleteBooking: async (bookingId) => {
    try {
      // Get all bookings
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];

      // Filter out the booking to delete
      const updatedBookings = bookings.filter((b) => b.id !== bookingId);

      // Check if booking was found and deleted
      const wasDeleted = bookings.length > updatedBookings.length;

      // Save updated bookings
      await AsyncStorage.setItem(
        BOOKINGS_STORAGE_KEY,
        JSON.stringify(updatedBookings)
      );
      return wasDeleted;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },

  // Get all bookings for a service provider (where they are the provider)
  getProviderBookings: async (providerId) => {
    try {
      // Get all bookings
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];

      // Filter bookings where the current user is the provider
      const providerBookings = bookings
        .filter((booking) => {
          // Parse details if it's a string
          const details =
            typeof booking.details === "string"
              ? JSON.parse(booking.details)
              : booking.details;

          // Check if the provider matches
          return (
            details?.provider?.id === providerId ||
            details?.provider?.name === providerId ||
            details?.provider?.username === providerId
          );
        })
        .map((booking) => ({
          ...booking,
          details:
            typeof booking.details === "string"
              ? JSON.parse(booking.details)
              : booking.details,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Group bookings by status
      const groupedBookings = {
        pending: providerBookings.filter(
          (booking) =>
            booking.status !== "Completed" &&
            booking.status !== "Cancelled" &&
            booking.status !== "Paid" &&
            booking.status !== "Pending Confirmation" &&
            booking.status !== "Declined"
        ),
        completed: providerBookings.filter(
          (booking) =>
            booking.status === "Completed" ||
            booking.status === "Pending Payment" ||
            booking.status === "Pending Confirmation" ||
            booking.status === "Paid"
        ),
        cancelled: providerBookings.filter(
          (booking) =>
            booking.status === "Cancelled" || booking.status === "Declined"
        ),
      };

      return groupedBookings;
    } catch (error) {
      console.error("Error getting provider bookings:", error);
      throw error;
    }
  },

  // Clear all bookings (for testing/reset purposes)
  clearAllBookings: async () => {
    try {
      await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([]));
      console.log("All bookings cleared successfully");
      return true;
    } catch (error) {
      console.error("Error clearing all bookings:", error);
      throw error;
    }
  },
};

export default {
  initDatabase,
  userOperations,
  bookingOperations,
};
