# VozActiva Ciudadana - Solution Architecture

## 1. Overview

This document describes the solution architecture for the VozActiva Ciudadana application. The architecture is designed to be scalable, maintainable, and cost-effective, leveraging modern technologies for mobile application development and backend services.

The core components of the architecture are:

1.  **Expo Client Application (React Native):** The mobile frontend used by citizens to report issues, track status, and interact with the platform.
2.  **Appwrite (Backend-as-a-Service):** Provides essential backend services including:
    *   **Authentication:** Manages user registration, login, and session management.
    *   **Database:** Stores application data such as user profiles, issue reports, and categories.
    *   **Functions:** Enables serverless backend logic for tasks like data validation, notifications, and integration with third-party services (e.g., Cloudinary).
3.  **Cloudinary (Media Management):** Handles the upload, storage, optimization, and delivery (via CDN) of all media files (images, videos) associated with issue reports.

## 2. Component Interaction and Data Flow

The following diagram illustrates the high-level interaction between the components:

```
+-------------------------+      +-----------------------+      +-----------------------+
|   Expo Client App       |----->|    Appwrite           |<---->|     Cloudinary        |
|   (React Native)        |      | (Auth, DB, Functions) |      |  (Media Management)   |
+-------------------------+      +-----------------------+      +-----------------------+
        |                                  ^
        | (User Interactions)              | (Admin/Council Interface - Future)
        V                                  |
+-------------------------+
|   Citizen User          |
+-------------------------+
```

### 2.1. User Authentication

**Objective:** Securely register and authenticate users.

**Data Flow:**

1.  **Registration:**
    *   **Expo Client:** User enters registration details (email, password, name, etc.) on the registration screen.
    *   **Expo Client -> Appwrite (Auth):** The client sends the registration request directly to the Appwrite Authentication service.
    *   **Appwrite (Auth):** Appwrite creates a new user account, hashes the password, and stores user credentials securely. It may also handle email verification if configured.
    *   **Appwrite (Auth) -> Expo Client:** Appwrite returns a success response with a session token (or user ID for session creation).
    *   **Expo Client:** Stores the session token securely on the device and navigates the user to the appropriate screen (e.g., login or dashboard).
    *   **(Optional) Appwrite (Functions) -> Appwrite (Database):** An Appwrite Function, triggered on user creation (`users.create` event), can create a corresponding user profile document in the Appwrite Database (e.g., `Users` collection) to store additional profile information not handled by the core Auth service.

2.  **Login:**
    *   **Expo Client:** User enters login credentials (email, password).
    *   **Expo Client -> Appwrite (Auth):** The client sends the login request to Appwrite Authentication.
    *   **Appwrite (Auth):** Appwrite verifies the credentials.
    *   **Appwrite (Auth) -> Expo Client:** If successful, Appwrite returns a session token.
    *   **Expo Client:** Stores the session token and grants access to protected parts of the application.

3.  **Session Management:**
    *   **Expo Client:** For subsequent requests to protected Appwrite resources (Database, Functions), the client includes the session token in the request headers.
    *   **Appwrite:** Validates the session token before granting access.

### 2.2. Report Creation (including Media Upload)

**Objective:** Allow users to create new issue reports with textual information and media attachments.

**Data Flow:**

1.  **Initiate Report:**
    *   **Expo Client:** User fills out the issue report form (title, description, category, location data). User selects media (images/videos) from their device.

2.  **Media Upload to Cloudinary (Client-Side or via Appwrite Function):**

    *   **Option A: Direct Client-Side Upload to Cloudinary (Recommended for efficiency):**
        *   **Expo Client -> Appwrite (Function - Get Signature):** The client requests a secure upload signature from an Appwrite Function. This function would use the Cloudinary SDK with backend credentials to generate a unique, short-lived signature for the upload. This avoids embedding Cloudinary API keys in the client.
        *   **Appwrite (Function) -> Expo Client:** The Appwrite Function returns the upload signature and API key (safe for unsigned uploads if using signatures).
        *   **Expo Client -> Cloudinary:** The client uses the signature and Cloudinary's upload SDK/API to directly upload the media file(s) to Cloudinary. Cloudinary can be configured with upload presets for automatic optimization, format conversion, and tagging.
        *   **Cloudinary -> Expo Client:** Cloudinary returns the secure URL(s) and other metadata (public ID, format, etc.) of the uploaded media.

    *   **Option B: Media Upload via Appwrite Function (Proxy):**
        *   **Expo Client -> Appwrite (Function - Upload Proxy):** The client sends the media file to a dedicated Appwrite Function.
        *   **Appwrite (Function) -> Cloudinary:** The Appwrite Function uses the Cloudinary SDK (with backend credentials) to stream/upload the file to Cloudinary.
        *   **Cloudinary -> Appwrite (Function):** Cloudinary returns the media URL(s) and metadata to the function.
        *   **Appwrite (Function) -> Expo Client:** The function returns the Cloudinary media URL(s) to the client. (This option is less efficient for large files as it streams data through Appwrite).

3.  **Submit Report Data to Appwrite:**
    *   **Expo Client:** Once media is successfully uploaded to Cloudinary and their URLs are obtained, the client compiles the full report data:
        *   Textual information (title, description, category, location coordinates).
        *   Cloudinary media URLs (and/or public IDs).
        *   User ID (from the current session).
        *   Timestamp.
    *   **Expo Client -> Appwrite (Database):** The client sends a request to the Appwrite Database service to create a new document in the `Issues` collection with all the compiled report data.
    *   **Appwrite (Database):** Stores the new issue report. Permissions are set to allow the creating user to read/update (if needed) their report, and potentially for admins/council members to read/update.
    *   **Appwrite (Database) -> Expo Client:** Returns a success confirmation.

4.  **(Optional) Post-Processing/Notifications via Appwrite Functions:**
    *   **Appwrite (Database Trigger -> Function):** An Appwrite Function can be triggered when a new document is created in the `Issues` collection (`databases.*.collections.issues.documents.create` event).
    *   **Appwrite (Function):** This function can perform actions like:
        *   Sending notifications (e.g., to an admin dashboard, or potentially to the user confirming submission).
        *   Performing data validation or enrichment.
        *   Categorizing or flagging issues based on keywords.

### 2.3. Data Retrieval (Viewing Issues)

**Objective:** Allow users to view a list of reported issues and details of specific issues, including media.

**Data Flow:**

1.  **Fetching List of Issues:**
    *   **Expo Client:** User navigates to the screen displaying a list of issues (e.g., dashboard, map view).
    *   **Expo Client -> Appwrite (Database):** The client sends a query to the Appwrite Database service to retrieve documents from the `Issues` collection. Queries can include:
        *   Filters (e.g., by category, status, location proximity).
        *   Sorting (e.g., by date, urgency).
        *   Pagination (to load data in chunks).
    *   **Appwrite (Database):** Executes the query based on defined permissions (users can typically see all public issues or issues within their locality). Returns a list of issue documents. Each document contains the textual data and the Cloudinary URLs for the associated media.
    *   **Appwrite (Database) -> Expo Client:** Sends the list of issue documents.
    *   **Expo Client:** Renders the list. For each issue, the client uses the Cloudinary media URLs.

2.  **Fetching Specific Issue Details & Displaying Media:**
    *   **Expo Client:** User selects a specific issue from the list.
    *   **Expo Client -> Appwrite (Database):** (If not already loaded) The client requests the specific issue document by its ID from the `Issues` collection.
    *   **Appwrite (Database) -> Expo Client:** Returns the issue document.
    *   **Expo Client:** Displays the textual details. To display media:
        *   The client uses the Cloudinary URLs stored in the issue document.
        *   These URLs point directly to Cloudinary's CDN.
        *   **Expo Client (Image/Video Component) -> Cloudinary (CDN):** The React Native Image/Video components fetch the media directly from Cloudinary's CDN. Cloudinary handles optimization (e.g., responsive image sizing based on device, format conversion like WebP) and fast delivery.

### 2.4. Data Update (e.g., Issue Status Change by Admin - Future Scope)

**Objective:** Allow authorized personnel (e.g., city council members, admins) to update the status of an issue.

**Data Flow (Conceptual for MVP, as admin interface might be separate):**

1.  **Admin Interface -> Appwrite (Database):** An admin user (through a separate web interface or a privileged section of the app) updates the status field of an issue document in the Appwrite `Issues` collection.
2.  **Appwrite (Database):** Updates the document.
3.  **(Optional) Appwrite (Database Trigger -> Function):** An Appwrite Function, triggered on document update (`databases.*.collections.issues.documents.update` event), can:
    *   **Appwrite (Function) -> (Notification Service):** Send a push notification to the original reporter about the status change.
    *   Log the change for auditing purposes.

## 3. Key Considerations

*   **Security:**
    *   Appwrite handles user authentication and session management securely.
    *   Appwrite's database rules and permissions will be configured to ensure users can only access/modify data they are authorized for.
    *   Cloudinary signed uploads (Option A for media) prevent unauthorized uploads to your Cloudinary account. If using Option B, Appwrite functions act as a secure intermediary.
    *   API keys and sensitive credentials for Appwrite and Cloudinary will be managed securely (e.g., environment variables in Appwrite Functions, not hardcoded in the client).
*   **Scalability:**
    *   Appwrite is designed to scale, and its managed cloud offering simplifies this.
    *   Cloudinary is inherently scalable for media storage, processing, and delivery via its CDN.
    *   Expo Client applications can be distributed to many users.
*   **Offline Support (Future Consideration for Expo Client):**
    *   For MVP, a stable internet connection is assumed.
    *   Future enhancements could involve caching data locally on the device using Expo's filesystem or a local database like SQLite for basic offline viewing and queueing submissions.
*   **Error Handling:**
    *   Robust error handling will be implemented in the Expo Client for API request failures, media upload issues, etc.
    *   Appwrite Functions will also include error handling and logging.
*   **Cost:**
    *   Appwrite offers a generous free tier, with paid plans for larger usage.
    *   Cloudinary also has a free tier, with costs based on storage, transformations, and bandwidth.
    *   Expo services are mostly free, with optional paid services for advanced build and update needs.

This architecture provides a solid foundation for the VozActiva Ciudadana application, balancing ease of development with robust functionality and scalability.
