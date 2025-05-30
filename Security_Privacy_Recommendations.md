# Security & Privacy Recommendations - VozActiva Ciudadana

This document outlines key security and privacy recommendations for the VozActiva Ciudadana application to protect user data and ensure trust.

---

## 1. True Anonymity for Reports

Ensuring true anonymity for users who choose to submit reports anonymously is paramount.

*   **`creatorUserID` Handling:**
    *   **Never Store or Link:** When a user submits a report with the `isAnonymous` flag set to `true`, the `creatorUserID` field in the `reports` collection **must be explicitly set to `null` or be absent**. No Appwrite Function or client-side logic should ever populate this field for anonymous reports.
    *   **Appwrite Function Logic:** If a serverless function (`createReport` or an event-triggered function like `onReportCreate`) processes report data, it must check the `isAnonymous` flag. If true, it must ensure `creatorUserID` is not persisted. Any user session information available to the function should be disregarded for populating creator-specific fields in this context.

*   **Mitigating Deanonymization Risks:**
    *   **Location Data:** While precise location is often necessary for the report, be mindful that a pattern of reports from very specific, non-public locations could inadvertently deanonymize a user over time.
        *   **Recommendation (Future Consideration):** For highly sensitive reports, consider options like location fuzzing (slightly reducing precision) if the use case allows, though this might conflict with the need for accurate issue locating. For MVP, focus on not linking the user ID.
    *   **Writing Style:** Technically difficult to mitigate in MVP. Educating users that truly unique writing styles could theoretically be a factor is a transparency measure, not a technical one for this stage.
    *   **Media Metadata:** EXIF data in photos/videos can contain GPS coordinates, device information, and timestamps. This **must** be stripped (see Section 5: Data Privacy).

*   **`creatorDisplayName` Handling:**
    *   When `isAnonymous` is `true`, the `creatorDisplayName` field in the `reports` collection must be set to a generic, consistent string (e.g., "Anónimo", "Citizen Reporter"). This should be handled by the client-side logic preparing the report data or by the `createReport` Appwrite Function. Avoid any user-specific data here.

---

## 2. Appwrite Security

Securing the Appwrite backend is crucial as it manages core data and logic.

*   **Permissions (Collection & Document Level):**
    *   **Principle of Least Privilege:** Grant only the minimum necessary permissions.
    *   **`users` Collection (Public Profiles):**
        *   **Create:** Only by an Appwrite Function (`onUserCreate`) triggered by new auth user creation.
        *   **Read:** `any` (if profiles are public). If profiles are private, then `user:[userID]`.
        *   **Update:** `user:[userID]` (users can only update their own profile), `team:admins`.
        *   **Delete:** `team:admins`.
    *   **`reports` Collection:**
        *   **Create:** `users` (any authenticated user).
        *   **Read:** `any` (reports are generally public).
        *   **Update:** `user:[creatorUserID]` (only if not anonymous and report status allows, e.g., not yet 'verified' or 'resolved'), `team:moderators`, `team:admins`.
        *   **Delete:** `user:[creatorUserID]` (only if not anonymous and status is 'nuevo'), `team:admins`.
    *   **`comments` Collection:**
        *   **Create:** `users`.
        *   **Read:** `any`.
        *   **Update:** `user:[commenterUserID]`, `team:moderators`, `team:admins`.
        *   **Delete:** `user:[commenterUserID]`, `team:moderators`, `team:admins`.
    *   **`userSupports` Collection:**
        *   **Create:** `users`.
        *   **Read:** `user:[userID]` (users can see their own support actions), or `team:admins` if detailed listing isn't a user feature.
        *   **Delete:** `user:[userID]`, `team:admins`.
    *   **Other Collections (`contractsDiscussions`, `socialCauses`):** Apply similar tailored permissions. Read is often `any`, create/update/delete restricted to specific roles (`team:content_creators`, `team:admins`) or the document owner.

*   **Function Security:**
    *   **Input Validation:** Rigorously validate all input data passed to Appwrite Functions (e.g., type checks, length limits, format validation) to prevent injection attacks (NoSQL injection, etc.) and ensure data integrity.
    *   **Authorization Checks:** If a function is triggered via an API call by a user, verify that the authenticated user has the necessary rights to perform the function's operations (e.g., checking ownership or roles before modifying a document). Event-triggered functions operate with admin-like privileges by default, so ensure their logic is secure and respects user intent (like anonymity).
    *   **Environment Variables:** Store sensitive information (API keys for third-party services like Cloudinary) in Appwrite Function environment variables, not hardcoded in the function script.
    *   **Error Handling:** Implement robust error handling to prevent leaking sensitive error details to the client.

*   **API Keys (Appwrite):**
    *   **Client-Side Keys:** The Appwrite API key used in the Expo app should have the **minimum scope** required for client operations (e.g., read public collections, create documents in specific collections, execute specific functions). Avoid using powerful server-side or admin API keys in the client.
    *   **Server-Side Keys:** Keys used by Appwrite Functions for internal operations or privileged third-party integrations should be stored securely as environment variables and have appropriate scopes.
    *   **Regular Review:** Periodically review API key permissions.

*   **Authentication:**
    *   **Password Policies:** Enforce strong password policies if Appwrite allows configuration (length, complexity). If not directly configurable, advise users during signup.
    *   **Email Verification:** Enable email verification for new user sign-ups to confirm identity and reduce fake accounts.
    *   **Rate Limiting:** Appwrite typically has built-in rate limiting for authentication attempts. Verify and rely on this to prevent brute-force attacks.
    *   **Secure Session Management:** Utilize Appwrite's built-in session management. Ensure session tokens are handled securely by the client.

---

## 3. Cloudinary Security

Protecting media assets and the upload process is vital.

*   **API Keys (Cloudinary):**
    *   **Never Embed Master API Key/Secret in Client:** The Cloudinary API Secret must **never** be included in the frontend application.
    *   **Signature-Based Uploads:** Strongly recommend using signed uploads for client-side uploads. The signature is generated server-side (by an Appwrite Function).

*   **Secure Upload Process:**
    1.  **Client Request:** Expo app requests an upload signature from a dedicated Appwrite Function (`secureCloudinaryUploadSignature`).
    2.  **Appwrite Function Generates Signature:** This function, using the Cloudinary SDK and the secure Cloudinary API Key & Secret (from environment variables), generates a short-lived, unique signature. The signature can be scoped to specific upload parameters (e.g., folder, tags, upload preset).
    3.  **Client Uploads to Cloudinary:** The Expo app uses the received signature (and the non-secret Cloudinary API Key) to upload the file directly to Cloudinary.
    *   This flow ensures the client never handles the Cloudinary API Secret.

*   **Access Control for Media:**
    *   **Default Public Access:** Media associated with public reports will likely have public Cloudinary URLs. This is generally acceptable.
    *   **Transformations:** Use Cloudinary transformations for:
        *   Optimizing images/videos (reducing file size).
        *   **Stripping EXIF data (see Section 5).**
        *   Generating thumbnails.
    *   **Private/Restricted Media (Future):** If a feature requires restricted media access tied to specific users, Cloudinary offers options like private images or token-based authentication for delivery, which would require more complex integration. For MVP, public media for public reports is standard.

---

## 4. Frontend (Expo App) Security

Client-side security measures.

*   **Data Storage:**
    *   **SecureStore:** Use Expo's `SecureStore` for storing any sensitive data on the device, such as session tokens or user-specific encrypted data. Avoid `AsyncStorage` (or basic `localStorage` in web contexts) for sensitive items.
    *   **Minimize On-Device Storage:** Do not store data unnecessarily on the device. Fetch from the server when needed if it's sensitive.

*   **Network Security:**
    *   **HTTPS Everywhere:** Ensure all API calls from the Expo app to Appwrite and Cloudinary (including media delivery) are made over HTTPS. Expo and modern hosting providers enforce this by default, but verify configurations.

*   **Input Validation:**
    *   **Client-Side First Pass:** Implement input validation in the app (e.g., for forms) to provide immediate feedback to users and catch basic errors.
    *   **Server-Side Authoritative:** **Always** re-validate data on the server-side (Appwrite Functions) as client-side validation can be bypassed.

*   **Code Obfuscation (Production Builds):**
    *   Consider using code obfuscation tools as part of the production build process for your React Native code. This can make it more difficult for attackers to reverse-engineer the application bundle, though it's not a foolproof security measure.

---

## 5. Data Privacy

Respecting user privacy is critical for user trust.

*   **Privacy Policy:**
    *   **Provide a Clear Policy:** Include a comprehensive, easy-to-understand Privacy Policy accessible from within the app and on any associated website.
    *   **Contents:** Explain what data is collected, how it's used, stored, and shared (if at all). Detail user rights regarding their data (access, deletion). Explain anonymous reporting.

*   **Data Minimization:**
    *   **Collect Only Essentials:** Only collect personal data that is strictly necessary for the functionality of VozActiva Ciudadana. Avoid collecting superfluous information.
    *   **Limited Retention (Future):** Define data retention policies and delete data that is no longer needed, if applicable (may be more relevant post-MVP).

*   **EXIF Data Stripping:**
    *   **Critical for Anonymity and Privacy:** Photos and videos can contain embedded EXIF metadata, which may include GPS location where the media was captured, device make/model, and capture timestamp.
    *   **Server-Side Removal:** Configure Cloudinary to automatically strip EXIF data during the upload process using an incoming transformation or a specific upload preset. Alternatively, if media is proxied through an Appwrite Function, the function can use a library to strip EXIF before re-uploading to Cloudinary. This is crucial for protecting the privacy of users, especially those posting anonymously.

---

## 6. General Best Practices

Ongoing security hygiene.

*   **Regular Security Audits (Informal for MVP):**
    *   Periodically review Appwrite permissions, function code for vulnerabilities, and dependencies. Even a quick self-audit or peer review can be beneficial.
*   **Dependency Management:**
    *   **Keep Updated:** Regularly update dependencies (Expo SDK, React Native, Appwrite SDK, Cloudinary SDK, and other npm packages) to their latest stable versions to patch known vulnerabilities. Use tools like `npm audit` or `yarn audit`.
*   **Logging and Monitoring (Backend):**
    *   **Appwrite Function Logs:** Utilize Appwrite Function logging to record key events, errors, and potentially suspicious activities (e.g., repeated failed access attempts if not handled by Appwrite itself). These logs are essential for debugging and incident response.
    *   **Audit Trails (Future):** For sensitive admin actions, consider implementing an audit trail.
*   **Secure Development Practices:**
    *   Train developers (even if it's a solo developer) on common web and mobile security vulnerabilities (e.g., OWASP Top 10 Mobile Risks).

By implementing these recommendations, VozActiva Ciudadana can establish a strong foundation for security and user privacy.
