# Appwrite Serverless Functions - VozActiva Ciudadana

This document describes the key serverless functions to be implemented using Appwrite Functions for the VozActiva Ciudadana application. These functions will handle backend logic, integrations, and automated tasks.

---

## 1. Function: `onUserCreate`

*   **Purpose/Description:** To create a corresponding user profile document in the `users` collection in Appwrite Database when a new user successfully registers via Appwrite Authentication. This keeps public user profile data separate from sensitive authentication data.
*   **Trigger:**
    *   Event-based: `users.create` (triggered after a new user is created in Appwrite Authentication).
*   **Key Operations/Logic:**
    1.  Receives user data from the event payload (e.g., `$id` of the new auth user, email, name if provided during signup).
    2.  Prepares a new document for the `users` collection.
    3.  Sets the `userID` attribute in the `users` document to the `$id` of the newly created auth user.
    4.  Populates default values for the new user profile (e.g., `displayName` from auth name or a default, `reputationPoints` = 0, `isActive` = true, `notificationsEnabled` = true).
    5.  Creates the new document in the `users` collection.
*   **Interactions:**
    *   Appwrite Authentication (receives event data)
    *   Appwrite Database (creates document in `users` collection)

---

## 2. Function: `secureCloudinaryUploadSignature`

*   **Purpose/Description:** To generate a secure, short-lived signature for direct client-side uploads to Cloudinary. This avoids exposing Cloudinary API secrets in the frontend application.
*   **Trigger:**
    *   API Call (HTTP POST request from the Expo client application when a user intends to upload media).
*   **Key Operations/Logic:**
    1.  Receives parameters from the client if needed (e.g., desired transformations, folder in Cloudinary). These are optional and depend on upload strategy.
    2.  Uses the Cloudinary SDK (server-side) with the Cloudinary API Key and Secret (stored securely as Appwrite Function environment variables).
    3.  Generates an upload signature (and potentially other parameters like `api_key` if doing signed uploads) using `cloudinary.utils.api_sign_request` or similar method.
    4.  The signature should be specific to the upload parameters to prevent misuse (e.g., tied to a specific folder or upload preset).
    5.  Returns the signature, API key (the one safe for unsigned/signed uploads, not the secret), and timestamp to the client.
*   **Interactions:**
    *   Expo Client (receives request, returns signature)
    *   Cloudinary API (via Cloudinary SDK, using secure credentials)

---

## 3. Function: `createReport`
    (Note: Much of the report creation logic might reside client-side after media is uploaded directly to Cloudinary. This function could act as a final validation/processing step if needed, or if media is proxied.)

*   **Purpose/Description:** To handle the creation of a new issue report, including data validation, processing anonymous submissions, and storing the report in the database. This function might be more relevant if there's complex server-side validation or if media uploads are proxied through Appwrite instead of direct client-to-Cloudinary. If direct client-side DB write for reports is used after Cloudinary upload, this specific *API-triggered* function might be less critical, and an event-based function like `onReportCreate` (see below) might be more useful.
*   **Trigger:**
    *   API Call (HTTP POST request from the Expo client) - *Alternative: Direct DB write from client, then use `onReportCreate`.*
*   **Key Operations/Logic:**
    1.  Receives report data from the client (title, description, category, location, Cloudinary media URLs, `isAnonymous` flag, etc.).
    2.  Validates the input data (e.g., field lengths, valid category, location format).
    3.  If `isAnonymous` is true:
        *   Sets `creatorUserID` to `null`.
        *   Sets `creatorDisplayName` to "Anónimo".
    4.  If `isAnonymous` is false:
        *   Retrieves the `creatorUserID` from the authenticated user session.
        *   Fetches the `displayName` from the `users` collection for the `creatorUserID` and sets `creatorDisplayName`.
    5.  Prepares the document for the `reports` collection.
    6.  Sets initial `status` (e.g., 'nuevo') and `supportCount` (e.g., 0).
    7.  Stores the new report document in the `reports` collection in Appwrite Database.
    8.  Returns a success response or error to the client.
*   **Interactions:**
    *   Expo Client (receives request, returns response)
    *   Appwrite Database (stores data in `reports` collection, potentially reads from `users` collection)
    *   Appwrite Authentication (to get current `userID` if not anonymous)

---

## 4. Function: `onReportCreate` (Event-Based)

*   **Purpose/Description:** To perform actions after a new report is successfully created in the `reports` collection. This is useful for denormalization, notifications, or other side effects.
*   **Trigger:**
    *   Event-based: `databases.[DATABASE_ID].collections.[REPORTS_COLLECTION_ID].documents.create`
*   **Key Operations/Logic:**
    1.  Receives the newly created report document data from the event payload.
    2.  **Notification Logic (Example):**
        *   If the report is not anonymous, potentially send an in-app notification or email to the creator confirming submission (could also be client-side).
        *   Send notifications to an admin/moderator group/dashboard about the new report.
    3.  **Data Aggregation/Denormalization (Example):**
        *   If there's a `userStats` collection, increment the `reportsCreatedCount` for the `creatorUserID`.
        *   Update a `categories` collection with a counter for reports in that category (if such a collection exists).
    4.  **External System Integration (Example):**
        *   If integrated with a city's task management system, forward the report details.
*   **Interactions:**
    *   Appwrite Database (receives event, may read/update other collections)
    *   Appwrite Functions (could call other functions, e.g., a generic `sendNotification` function)
    *   External Notification Services (e.g., FCM, APNS, email provider)
    *   (Potentially) External APIs for city services.

---

## 5. Function: `handleSupportAction`

*   **Purpose/Description:** To manage users supporting/unsupporting a report or social cause. It ensures data integrity by creating/deleting a support record and updating the aggregate support count on the parent document.
*   **Trigger:**
    *   API Call (HTTP POST from Expo client when a user clicks "support" or "unsupport"). The request should include `targetDocumentID` and `targetCollection`.
*   **Key Operations/Logic:**
    1.  Receives `targetDocumentID`, `targetCollection` (e.g., 'reports', 'socialCauses'), and action type (support/unsupport) from the client.
    2.  Retrieves `userID` from the authenticated user session.
    3.  **For "support" action:**
        *   Checks if a document already exists in `userSupports` for this `userID`, `targetDocumentID`, and `targetCollection`.
        *   If not, creates a new document in `userSupports`.
        *   Atomically increments the `supportCount` on the target document (in `reports` or `socialCauses` collection). Appwrite's database update operations should allow for atomic increments.
    4.  **For "unsupport" action:**
        *   Finds and deletes the corresponding document in `userSupports`.
        *   Atomically decrements the `supportCount` on the target document.
    5.  Returns success/failure to the client.
*   **Interactions:**
    *   Expo Client
    *   Appwrite Database (read/write `userSupports`, update `reports` or `socialCauses`)
    *   Appwrite Authentication (to get `userID`)

---

## 6. Function: `onCommentCreate`

*   **Purpose/Description:** To perform actions after a new comment is created, such as updating a comment count on the parent document or sending notifications for mentions.
*   **Trigger:**
    *   Event-based: `databases.[DATABASE_ID].collections.[COMMENTS_COLLECTION_ID].documents.create`
*   **Key Operations/Logic:**
    1.  Receives the newly created comment document data from the event payload (including `parentDocumentID`, `parentCollection`, `text`, `mentionUserIDs`).
    2.  Atomically increments `commentCount` on the `parentDocumentID` in its `parentCollection` (e.g., in `reports`, `socialCauses`, or `contractsDiscussions`).
    3.  Updates `lastActivityAt` on the parent document to the comment's creation time.
    4.  If `mentionUserIDs` is populated:
        *   Iterate through `mentionUserIDs`.
        *   For each mentioned user, trigger a notification (in-app, push, or email) via a generic notification function.
*   **Interactions:**
    *   Appwrite Database (receives event, updates parent document)
    *   Appwrite Functions (potentially calls a `sendNotification` function)

---

## 7. Function: `aggregateReportData` (Scheduled or Triggered)

*   **Purpose/Description:** To periodically calculate and store aggregated data or statistics related to reports. For example, daily/weekly report counts, status distributions, or trending issues. This reduces the need for complex queries on the client-side or in real-time.
*   **Trigger:**
    *   Scheduled Task (e.g., runs daily via Appwrite's cron-like scheduling).
    *   Event-based (e.g., triggered after a report status changes, though this might be too frequent for heavy aggregations).
*   **Key Operations/Logic:**
    1.  Queries the `reports` collection based on specific criteria (e.g., reports created in the last 24 hours, reports by status, reports by category).
    2.  Performs calculations (e.g., counts, averages).
    3.  Stores the aggregated results in a separate `reportStats` collection or updates a specific document meant for holding dashboard data.
    *   Example Aggregations:
        *   Total reports per category.
        *   Number of reports per status ('nuevo', 'verificado', 'resuelto') per day/week.
        *   Most active areas (based on location density of reports).
*   **Interactions:**
    *   Appwrite Database (reads from `reports`, writes to `reportStats` or another summary collection)

---

## 8. Function: `handleUserNotification` (Generic Notification Sender)

*   **Purpose/Description:** A generic function to handle the sending of various types of notifications (push, email, in-app) to users. This centralizes notification logic.
*   **Trigger:**
    *   API Call from other Appwrite Functions (e.g., `onReportCreate`, `onCommentCreate`, `onReportStatusChange`).
*   **Key Operations/Logic:**
    1.  Receives parameters: `userID` (of the recipient), `notificationType` (e.g., 'new_comment', 'report_status_update', 'mention'), `title`, `body`, and `dataPayload` (for deep linking).
    2.  Fetches user's notification preferences and device tokens (for push) from the `users` collection or Appwrite's internal user attributes if FCM tokens are stored there.
    3.  If push notifications are enabled and token exists:
        *   Constructs the push notification payload.
        *   Sends the notification via a push notification service provider (e.g., Firebase Cloud Messaging (FCM), APNS).
    4.  If email notifications are preferred for certain types:
        *   Constructs and sends an email via an email service provider (e.g., SendGrid, Mailgun - requires integration).
    5.  (Optional) Stores a record of the notification in a `notifications` collection for the user's in-app notification center.
*   **Interactions:**
    *   Other Appwrite Functions
    *   Appwrite Database (reads user preferences/tokens from `users`, writes to `notifications` collection)
    *   Push Notification Services (FCM, APNS)
    *   Email Service Providers

---

These functions provide a robust backend logic layer for the VozActiva Ciudadana application. The specific implementation details and choice between API-triggered vs. event-triggered functions will depend on the final desired user experience and system efficiency.
