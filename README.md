# SERVIFY

A service marketplace app built with React Native.

## Admin Utilities

### User Management

The admin can manage user accounts through the User Management interface:

1. **Accessing User Management:**

   - Log in as admin (username: admin, password: admin123)
   - Navigate to the Admin Dashboard
   - Click on "User Management" in the Quick Actions section

2. **Features:**

   - View all users (clients and service providers)
   - Filter users by type (All, Clients, Providers)
   - Search for users by username
   - Suspend/unsuspend user accounts
   - Delete user accounts

3. **User Suspension:**
   - Suspended users cannot log in to the application
   - Suspension is reversible - the admin can unsuspend users
   - Suspended users are visually highlighted in the management interface

### Removing All Users Except Admin

You have multiple options to remove all user accounts except the admin account:

1. **Through the Admin UI:**

   - Log in as admin (username: admin, password: admin123)
   - Navigate to the Admin Dashboard
   - Click on "Advanced Utilities" in the Quick Actions section
   - Click on "Remove All Users Except Admin" button
   - Confirm the action in the dialog

2. **Using the Script:**

   - Run the following command from the project root:

   ```
   npx react-native run-headless ./scripts/removeUsers.js
   ```

   This will directly execute the function to remove all users except the admin account.

The admin account is hardcoded with the following credentials:

- Username: admin
- Password: admin123
- User Type: admin
