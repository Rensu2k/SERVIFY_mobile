// This script removes all user accounts except the admin account
import { userOperations, initDatabase } from "../Components/DatabaseService";

const removeAllUsersExceptAdmin = async () => {
  try {
    console.log("Initializing database...");
    await initDatabase();

    console.log("Removing all users except admin...");
    await userOperations.removeAllUsersExceptAdmin();

    console.log("SUCCESS: All users except admin have been removed!");
    process.exit(0);
  } catch (error) {
    console.error("ERROR: Failed to remove users:", error);
    process.exit(1);
  }
};

// Execute the function
removeAllUsersExceptAdmin();
