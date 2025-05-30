# Expo (React Native) Project Structure - VozActiva Ciudadana

This document outlines a suggested scalable folder structure for the VozActiva Ciudadana Expo (React Native) project. The goal is to promote organization, maintainability, and ease of navigation as the application grows.

```
vozactiva-ciudadana/
├── assets/                 # Static assets like images, fonts (managed by Expo)
│   ├── fonts/
│   └── images/
│   └── icons/
├── src/                    # Main source code for the application
│   ├── api/                # (or services/) For Appwrite, Cloudinary, and other external API interactions
│   │   ├── appwrite.ts     # Appwrite client setup and core functions
│   │   ├── cloudinary.ts   # Cloudinary SDK setup and upload functions
│   │   ├── authService.ts  # Authentication related API calls
│   │   ├── reportService.ts # Report related API calls
│   │   └── userService.ts  # User profile related API calls
│   │   └── socialCauseService.ts # Social Cause related API calls
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Generic, app-wide components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── InputField.tsx
│   │   │   ├── LoadingIndicator.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── auth/           # Components specific to authentication screens
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── reports/        # Components specific to report features
│   │   │   ├── ReportCard.tsx
│   │   │   ├── ReportList.tsx
│   │   │   ├── MediaUploader.tsx
│   │   │   ├── LocationPicker.tsx
│   │   │   └── ReportForm.tsx
│   │   ├── comments/       # Components for displaying and creating comments
│   │   │   ├── CommentCard.tsx
│   │   │   └── CommentInput.tsx
│   │   ├── profile/        # Components for user profile sections
│   │   │   └── ProfileHeader.tsx
│   │   └── layout/         # Layout components like headers, footers (if not part of navigation)
│   │       └── MainHeader.tsx
│   ├── config/             # Application configuration
│   │   ├── index.ts        # Entry point for config
│   │   ├── environment.ts  # Environment-specific settings (dev, prod)
│   │   └── appwriteConfig.ts # Appwrite specific project IDs, endpoint
│   ├── constants/          # App-wide constants
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── dimensions.ts
│   │   ├── apiEndpoints.ts # (Alternative to placing in config if mostly static)
│   │   └── strings.ts      # For internationalization (i18n) keys or static text
│   ├── contexts/           # React Context API for global state management
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   ├── data/               # Mock data for development and testing (if needed)
│   │   ├── mockReports.ts
│   │   └── mockUsers.ts
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useReports.ts
│   │   ├── useLocation.ts
│   │   └── useNotifications.ts
│   ├── navigation/         # Navigation setup using React Navigation
│   │   ├── AppNavigator.tsx  # Main navigator after user is authenticated
│   │   ├── AuthNavigator.tsx # Navigator for login/signup flow
│   │   ├── MainTabNavigator.tsx # If using tabs within AppNavigator
│   │   ├── ReportStackNavigator.tsx # Stack for report creation/details flow
│   │   └── types.ts        # Navigation-specific type definitions (screen params)
│   ├── screens/            # Top-level screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── reports/
│   │   │   ├── HomeScreen.tsx          # (or FeedScreen.tsx)
│   │   │   ├── ReportDetailScreen.tsx
│   │   │   ├── CreateReportScreen.tsx
│   │   │   └── MyReportsScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── EditProfileScreen.tsx
│   │   ├── socialCauses/
│   │   │   ├── SocialCausesListScreen.tsx
│   │   │   ├── CreateSocialCauseScreen.tsx
│   │   │   └── SocialCauseDetailScreen.tsx
│   │   ├── contractsDiscussions/
│   │   │   ├── ContractsListScreen.tsx
│   │   │   └── ContractDetailScreen.tsx
│   │   ├── common/
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── NotificationsScreen.tsx
│   │   │   └── NotFoundScreen.tsx
│   ├── store/              # (Optional) For state management libraries like Zustand, Redux Toolkit
│   │   ├── index.ts        # Main store setup
│   │   ├── userSlice.ts    # Example slice for Redux Toolkit
│   │   └── reportSlice.ts  # Example slice for Redux Toolkit
│   ├── types/              # Global TypeScript type definitions and interfaces
│   │   ├── index.ts        # Main export for all types
│   │   ├── reportTypes.ts
│   │   ├── userTypes.ts
│   │   ├── commentTypes.ts
│   │   └── commonTypes.ts
│   ├── utils/              # Utility/helper functions
│   │   ├── validators.ts
│   │   ├── formatDate.ts
│   │   ├── helpers.ts      # Generic helper functions
│   │   └── permissions.ts  # Device permission handling (camera, location)
│   └── App.tsx             # Root component of the application
├── .env.example            # Example environment variables
├── .gitignore
├── app.json                # Expo configuration file
├── babel.config.js
├── package.json
└── tsconfig.json
```

## Explanation of Key Directories:

*   **`assets/`**: Managed by Expo, this directory holds static assets such as custom fonts (`fonts/`), images (`images/`), and icons (`icons/`) used throughout the application.
*   **`src/`**: This is the heart of the application, containing all the JavaScript/TypeScript code.
    *   **`api/` (or `services/`)**: Responsible for all communication with backend services (Appwrite) and third-party APIs (Cloudinary). It abstracts the data fetching and manipulation logic from the UI components.
        *   `appwrite.ts`: Initializes and exports the Appwrite client instance.
        *   `cloudinary.ts`: Contains functions for interacting with Cloudinary (e.g., uploading media).
        *   `[feature]Service.ts`: Modules for specific data entities (e.g., `authService.ts`, `reportService.ts`).
    *   **`components/`**: Contains reusable UI components.
        *   `common/`: Generic components that can be used across multiple features (e.g., `Button`, `Card`, `Input`).
        *   `[feature]/`: Components specific to a particular feature or screen (e.g., `reports/ReportCard.tsx`, `auth/LoginForm.tsx`). This helps in organizing feature-specific UI elements.
        *   `layout/`: Components defining parts of the screen layout, like headers or footers, if not directly handled by navigation components.
    *   **`config/`**: Holds application configuration files.
        *   `environment.ts`: Could manage different settings for `development`, `staging`, and `production` environments (e.g., API keys, Appwrite project IDs). Often used with `.env` files.
        *   `appwriteConfig.ts`: Centralizes Appwrite connection details.
    *   **`constants/`**: Stores fixed values used throughout the application.
        *   `colors.ts`: Defines the app's color palette.
        *   `typography.ts`: Defines font families, sizes, and weights.
        *   `dimensions.ts`: Standardized spacing, border radii, etc.
        *   `strings.ts`: Useful for centralizing static text, especially if planning for internationalization (i18n).
    *   **`contexts/`**: For React Context API implementations, used for managing global state that doesn't warrant a more complex state management library or for passing data deep down the component tree without prop drilling (e.g., authentication status, theme).
    *   **`data/`**: Contains mock data files (e.g., JSON or TS files) useful during development before backend integration is complete or for testing purposes.
    *   **`hooks/`**: Houses custom React Hooks to encapsulate and reuse stateful logic across multiple components (e.g., `useAuth` for authentication logic, `useReports` for fetching/managing report data).
    *   **`navigation/`**: Contains all React Navigation configurations, including navigators (stack, tab, drawer), screen definitions within navigators, and navigation-related types.
    *   **`screens/`**: Top-level components that represent distinct screens in the application. Each screen typically corresponds to a route in the navigation setup. Screens are responsible for composing various smaller components and fetching/displaying data. Grouping by feature (e.g., `auth/`, `reports/`) is recommended for scalability.
    *   **`store/`**: (Optional) If using a dedicated state management library like Zustand or Redux Toolkit, this directory would contain the store setup, reducers/slices, actions, and selectors.
    *   **`types/`**: Contains global TypeScript type definitions, interfaces, and enums used across the application. Organizing by feature or entity (e.g., `reportTypes.ts`, `userTypes.ts`) can be beneficial.
    *   **`utils/`**: Includes miscellaneous helper functions and utility modules that don't fit into other categories (e.g., date formatting, input validation, permission handlers).
    *   **`App.tsx`**: The root React component that initializes the application, sets up global providers (like Contexts or navigation), and renders the main navigator.
*   **`.env.example`**: An example file showing the structure of environment variables. Actual secrets should be in a `.env` file which is gitignored.
*   **`app.json`**: Expo's main configuration file for project settings, plugins, assets, etc.
*   **`babel.config.js`**: Babel configuration for JavaScript transpilation.
*   **`package.json`**: Node.js project manifest file, listing dependencies and scripts.
*   **`tsconfig.json`**: TypeScript configuration file.

This structure provides a good separation of concerns and should scale well as the VozActiva Ciudadana application grows in complexity. It's important to adapt it based on team preferences and the specific needs of the project.
