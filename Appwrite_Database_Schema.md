# Appwrite Database Schema - VozActiva Ciudadana

This document outlines the database schema for the VozActiva Ciudadana application using Appwrite as the backend.

## General Notes:

*   Appwrite automatically provides `$id` (unique ID), `$createdAt`, and `$updatedAt` for each document in a collection. These are not explicitly listed under attributes unless specific behavior or naming is intended.
*   Appwrite uses `Relationship` attributes for linking documents between collections.
*   Permissions are defined using Appwrite's role-based access control. Common roles include `any` (public), `users` (any authenticated user), `user:[USER_ID]` (specific user), and `team:[TEAM_ID]` (specific team, e.g., admins).

---

## 1. Collection: `users`

*   **Purpose:** Stores public profile information for users, extending Appwrite's built-in Authentication users. This collection is for data that users might want to share publicly or that defines their application-specific profile.
*   **Attributes:**
    *   `userID` (String, unique, primary key - this will be the same as Appwrite's Auth user ID, `$id` from the `users` auth object)
        *   *Description:* Unique identifier for the user, linking to the authentication entry.
    *   `displayName` (String, 100 chars max)
        *   *Description:* The user's public display name in the app.
    *   `profileImageCloudinaryUrl` (String, URL, optional)
        *   *Description:* URL to the user's profile picture, hosted on Cloudinary.
    *   `bio` (String, 500 chars max, optional)
        *   *Description:* A short biography or description provided by the user.
    *   `reputationPoints` (Integer, default: 0)
        *   *Description:* Points accumulated by the user for positive contributions (e.g., verified reports, helpful comments).
    *   `isActive` (Boolean, default: true)
        *   *Description:* Whether the user account is active.
    *   `notificationsEnabled` (Boolean, default: true)
        *   *Description:* User preference for receiving notifications.
    *   `preferredCategories` (Array of Strings, optional)
        *   *Description:* List of issue categories the user is most interested in.
*   **Indexes:**
    *   `userID` (Primary & Unique)
    *   `displayName` (for searching users)
    *   `reputationPoints` (for leaderboards or sorting)
*   **Permissions:**
    *   **Create:** `users` (An Appwrite function triggered on new auth user creation (`users.create` event) will create this document. The `userID` in this document should match the `$id` of the newly created auth user.)
    *   **Read:** `any` (Public profiles can be viewed by anyone)
    *   **Update:** `user:[userID]` (Users can only update their own profile), `team:admins`
    *   **Delete:** `team:admins` (Admins can delete user profiles, typically in conjunction with deleting the auth user)

---

## 2. Collection: `reports`

*   **Purpose:** Stores information about issues reported by citizens.
*   **Attributes:**
    *   `title` (String, 255 chars max)
        *   *Description:* A concise title for the reported issue.
    *   `description` (String, 5000 chars max, Text)
        *   *Description:* Detailed description of the issue.
    *   `category` (String, 50 chars max, e.g., 'pothole', 'streetlight_out', 'uncollected_garbage', 'public_safety')
        *   *Description:* Category of the reported issue. Consider using an Enum-like list for consistency. (For MVP, a string is fine; a `categories` collection could be a future enhancement).
    *   `location` (Object - GeoPoint, e.g., `{ "type": "Point", "coordinates": [longitude, latitude] }` or two separate Number fields if GeoPoint is not directly supported as a native Appwrite type for querying in all desired ways)
        *   `latitude` (Number, Double)
        *   `longitude` (Number, Double)
        *   *Description:* Geographical coordinates of the issue.
    *   `addressText` (String, 500 chars max, optional)
        *   *Description:* Human-readable address or location description (can be auto-geocoded or manually entered).
    *   `cloudinaryMedia` (Array of Objects, optional)
        *   *Description:* List of media files (images/videos) associated with the report.
        *   `object`: `{ "public_id": "string", "url": "string", "type": "image | video", "thumbnailUrl": "string?" (optional for videos) }`
    *   `isAnonymous` (Boolean, default: false)
        *   *Description:* Whether the report was submitted anonymously.
    *   `creatorUserID` (String, Relationship to `users` collection's `userID` field, nullable if `isAnonymous` is true)
        *   *Description:* The ID of the user who created the report. Null if anonymous.
    *   `creatorDisplayName` (String, 100 chars max)
        *   *Description:* Stores "Anónimo" if `isAnonymous` is true, otherwise the `displayName` of the `creatorUserID`. This is denormalized for quick display.
    *   `status` (String, 50 chars max, e.g., 'nuevo', 'verificado', 'en_progreso', 'resuelto', 'rechazado', default: 'nuevo')
        *   *Description:* Current status of the issue report.
    *   `urgency` (String, 20 chars max, optional, e.g., 'low', 'medium', 'high')
        *   *Description:* User-defined urgency of the report.
    *   `supportCount` (Integer, default: 0)
        *   *Description:* Number of users who have supported or "upvoted" this report.
    *   `resolverNotes` (String, 2000 chars max, Text, optional)
        *   *Description:* Notes from the entity responsible for resolving the issue (e.g., municipality).
    *   `timestampResolved` (DateTime, nullable)
        *   *Description:* Timestamp when the issue was marked as 'resuelto'.
*   **Indexes:**
    *   `creatorUserID` (for fetching reports by a specific user)
    *   `status` (for filtering reports by status)
    *   `category` (for filtering reports by category)
    *   `timestampCreated` (Appwrite's `$createdAt`, for sorting by creation date)
    *   `location` (Geo-index if supported and needed for proximity queries, otherwise separate `latitude`, `longitude` may need careful querying)
    *   `supportCount` (for trending or popular reports)
*   **Permissions:**
    *   **Create:** `users` (Any authenticated user can create a report)
    *   **Read:** `any` (All reports are publicly viewable)
    *   **Update:** `user:[creatorUserID]` (Only the creator can update their report, if not anonymous and status allows, e.g., before it's 'verificado'), `team:admins`, `team:moderators` (e.g., council members who manage reports)
    *   **Delete:** `user:[creatorUserID]` (Only if status is 'nuevo'), `team:admins`

---

## 3. Collection: `comments`

*   **Purpose:** Stores comments made by users on reports, social causes, or contract discussions.
*   **Attributes:**
    *   `parentDocumentID` (String)
        *   *Description:* The ID of the document this comment belongs to (e.g., `reportID`, `socialCauseID`, `contractsDiscussionID`).
    *   `parentCollection` (String, e.g., 'reports', 'socialCauses', 'contractsDiscussions')
        *   *Description:* Name of the collection the parent document belongs to. Helps in generic comment handling.
    *   `commenterUserID` (String, Relationship to `users` collection's `userID`)
        *   *Description:* The ID of the user who posted the comment.
    *   `commenterDisplayName` (String, 100 chars max)
        *   *Description:* Denormalized display name of the commenter for quick display.
    *   `text` (String, 2000 chars max, Text)
        *   *Description:* The content of the comment.
    *   `timestampCreated` (DateTime, Appwrite's `$createdAt`)
    *   `timestampUpdated` (DateTime, Appwrite's `$updatedAt`)
    *   `isEdited` (Boolean, default: false)
        *   *Description:* True if the comment has been edited.
    *   `mentionUserIDs` (Array of Strings, optional, Relationship to `users` collection's `userID`)
        *   *Description:* List of user IDs mentioned in the comment.
*   **Indexes:**
    *   `parentDocumentID` (to fetch all comments for a specific report/cause/discussion)
    *   `parentCollection` (to be used in conjunction with `parentDocumentID`)
    *   `commenterUserID` (to fetch all comments by a specific user)
    *   `timestampCreated` (Appwrite's `$createdAt`, for sorting)
*   **Permissions:**
    *   **Create:** `users` (Any authenticated user can comment)
    *   **Read:** `any` (Comments are publicly viewable)
    *   **Update:** `user:[commenterUserID]` (User can edit their own comment, within a time limit perhaps), `team:admins`, `team:moderators`
    *   **Delete:** `user:[commenterUserID]`, `team:admins`, `team:moderators`

---

## 4. Collection: `contractsDiscussions`

*   **Purpose:** Stores discussions related to public contracts or municipal proposals.
*   **Attributes:**
    *   `title` (String, 300 chars max)
        *   *Description:* Title of the contract or proposal being discussed.
    *   `summary` (String, 5000 chars max, Text)
        *   *Description:* A summary or abstract of the contract/proposal.
    *   `fullTextLink` (String, URL, optional)
        *   *Description:* Link to the full document of the contract/proposal if available externally.
    *   `category` (String, 100 chars max, e.g., 'infrastructure', 'public_services', 'urban_planning')
        *   *Description:* Category of the contract/proposal.
    *   `status` (String, 50 chars max, e.g., 'propuesto', 'en_discusion', 'aprobado', 'rechazado', default: 'propuesto')
        *   *Description:* Current status of the contract/proposal.
    *   `initiatorUserID` (String, Relationship to `users` collection's `userID`, or null if initiated by admin/system)
        *   *Description:* User who initiated this discussion topic (if applicable).
    *   `initiatorDisplayName` (String, 100 chars max)
        *   *Description:* Display name of the initiator.
    *   `tags` (Array of Strings, optional)
        *   *Description:* Keywords or tags for easier searching.
    *   `voteCountUp` (Integer, default: 0)
    *   `voteCountDown` (Integer, default: 0)
    *   `commentCount` (Integer, default: 0) - Denormalized, can be updated via Appwrite Functions.
    *   `lastActivityAt` (DateTime, default: $createdAt) - Updated when new comments are added.
*   **Indexes:**
    *   `title` (Text index for searching)
    *   `category`
    *   `status`
    *   `tags`
    *   `initiatorUserID`
    *   `lastActivityAt` (for sorting by recent activity)
*   **Permissions:**
    *   **Create:** `team:admins`, `team:content_creators` (or designated users)
    *   **Read:** `any` (Publicly viewable)
    *   **Update:** `team:admins`, `team:content_creators`
    *   **Delete:** `team:admins`

---

## 5. Collection: `socialCauses`

*   **Purpose:** Allows users to propose and rally support for social causes or community improvement projects.
*   **Attributes:**
    *   `title` (String, 255 chars max)
        *   *Description:* Title of the social cause.
    *   `description` (String, 5000 chars max, Text)
        *   *Description:* Detailed description of the cause, its objectives, and proposed actions.
    *   `proposerUserID` (String, Relationship to `users` collection's `userID`)
        *   *Description:* The user who proposed the social cause.
    *   `proposerDisplayName` (String, 100 chars max)
        *   *Description:* Denormalized display name of the proposer.
    *   `category` (String, 100 chars max, e.g., 'environment', 'education', 'community_health', 'animal_welfare')
        *   *Description:* Category of the social cause.
    *   `goal` (String, 1000 chars max, optional)
        *   *Description:* Specific, measurable goal of the cause (e.g., "Collect 500 signatures", "Raise $1000 for park benches").
    *   `currentProgress` (String, 1000 chars max, optional)
        *   *Description:* Current status or progress towards the goal.
    *   `targetDate` (DateTime, nullable)
        *   *Description:* Proposed deadline or target date for achieving the goal.
    *   `status` (String, 50 chars max, e.g., 'propuesto', 'activo', 'completado', 'archivado', default: 'propuesto')
        *   *Description:* Current status of the social cause.
    *   `supportCount` (Integer, default: 0) - Denormalized count of users supporting this cause (from `userSupports` collection).
    *   `cloudinaryHeaderImage` (Object, optional: `{ "public_id": "string", "url": "string" }`)
        *   *Description:* Optional header image for the cause page.
    *   `tags` (Array of Strings, optional)
        *   *Description:* Keywords for discoverability.
    *   `commentCount` (Integer, default: 0) - Denormalized, can be updated via Appwrite Functions.
    *   `lastActivityAt` (DateTime, default: $createdAt) - Updated when new comments or supports are added.
*   **Indexes:**
    *   `title` (Text index for searching)
    *   `proposerUserID`
    *   `category`
    *   `status`
    *   `tags`
    *   `supportCount`
    *   `lastActivityAt`
*   **Permissions:**
    *   **Create:** `users` (Authenticated users can propose social causes, possibly after meeting some criteria like reputation points, or it goes into a 'pending_approval' status first).
    *   **Read:** `any` (Publicly viewable).
    *   **Update:** `user:[proposerUserID]` (Proposer can update their cause, especially if status is 'propuesto' or 'activo'), `team:admins`, `team:moderators`.
    *   **Delete:** `user:[proposerUserID]` (only if 'propuesto' and no/few supports), `team:admins`.

---

## 6. Collection: `userSupports`

*   **Purpose:** Tracks which users support which reports or social causes (many-to-many relationship). This helps prevent a user from supporting the same item multiple times and allows for easy counting and listing of supporters.
*   **Attributes:**
    *   `userID` (String, Relationship to `users` collection's `userID`)
        *   *Description:* The ID of the user who is supporting an item.
    *   `targetDocumentID` (String)
        *   *Description:* The ID of the document being supported (e.g., `reportID`, `socialCauseID`).
    *   `targetCollection` (String, e.g., 'reports', 'socialCauses')
        *   *Description:* The collection of the document being supported.
    *   `timestampCreated` (DateTime, Appwrite's `$createdAt`)
*   **Indexes:**
    *   Composite Index on (`userID`, `targetDocumentID`, `targetCollection`) (Unique - to ensure a user supports an item only once).
    *   `userID` (to list all items supported by a user).
    *   `targetDocumentID` (to list all users supporting an item - though count is often denormalized on parent).
*   **Permissions:**
    *   **Create:** `users` (Authenticated users can support an item). Logic within an Appwrite Function or client-side will prevent duplicate entries and increment/decrement the `supportCount` on the parent document (`reports` or `socialCauses`).
    *   **Read:** `users` (Users can see who supported what, if necessary, otherwise restrict to admins or just use for counting). Could be `user:[userID]` if users should only see their own support records.
    *   **Update:** `team:admins` (Generally no updates needed).
    *   **Delete:** `user:[userID]` (User can withdraw their support), `team:admins`. (Deletion should trigger decrementing `supportCount` on parent document via Appwrite Function).

---

This schema provides a comprehensive structure for the VozActiva Ciudadana application. Attribute types and constraints should be reviewed and adjusted based on Appwrite's specific capabilities and limitations during implementation. Permissions are also foundational and can be refined with more granular team-based roles as needed.
