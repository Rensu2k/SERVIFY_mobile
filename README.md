# SERVIFY

A service marketplace app built with React Native.

## Getting Started

### Prerequisites

Before cloning and running this project, ensure you have the following installed:

1. **Node.js** (LTS version recommended)

   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

### Setup Instructions

After cloning this project from GitHub, follow these steps:

1. **Navigate to the project directory**

   ```bash
   cd SERVIFY
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This installs all required packages including:

   - React Native and Expo framework (SDK 53)
   - Navigation libraries (@react-navigation)
   - UI components and utilities
   - All other project dependencies

3. **Verify Expo installation**
   ```bash
   expo --version
   ```

### Platform-Specific Setup

Choose based on your target development platform:

#### For Android Development:

- Install [Android Studio](https://developer.android.com/studio)
- Set up Android SDK
- Configure Android emulator or connect a physical device

#### For iOS Development (macOS only):

- Install Xcode from the App Store
- Set up iOS Simulator or connect a physical iOS device

#### For Web Development:

- No additional setup needed (runs in browser)

### Running the Project

Start the development server:

```bash
npm start
# or
npx expo start
```

This opens Expo Developer Tools in your browser where you can:

- Run on Android emulator/device
- Run on iOS simulator/device
- Run in web browser
- Generate QR code for Expo Go app

### Project Structure

- `App.jsx` - Main application entry point
- `screens/` - Application screens
- `Components/` - Reusable UI components
- `assets/` - Images, icons, and other static assets
- `scripts/` - Utility scripts for admin functions

### Default Admin Credentials

- **Username:** admin
- **Password:** admin123
- **User Type:** admin

## Admin Utilities
