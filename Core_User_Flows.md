# Core User Flows - VozActiva Ciudadana (with Mock Data)

This document describes two core user flows for the VozActiva Ciudadana application, focusing on the initial development phase where the frontend interacts with mock data.

---

## Flow 1: Creating an Anonymous Report with Photo and Location (Initial Display with Mock Data)

*   **Objective**: User successfully submits an anonymous report including a photo and location, with the frontend simulating these interactions using mock data.
*   **Pre-conditions**: User is on a screen with an option to "Create New Report" or similar.

**Steps:**

1.  **Navigate to Create Report:**
    *   **User Action:** Taps the "Create New Report" button/link.
    *   **System Response:** Navigates to the 'Create Report' screen. The screen displays input fields for title, description, category, media attachment, location selection, and an anonymous posting option.

2.  **Fill Report Details:**
    *   **User Action:** Taps on the "Title" input field and types a title (e.g., "Large pothole on Main Street").
    *   **System Response:** The entered text appears in the title field.
    *   **User Action:** Taps on the "Description" input field and types a description (e.g., "A deep pothole causing issues for traffic near the intersection with Oak Ave.").
    *   **System Response:** The entered text appears in the description field.

3.  **Add Media (Photo):**
    *   **User Action:** Taps on the 'Add Media' button (which would internally use the `MediaUploader` component).
    *   **System Response:** The `MediaUploader` interface appears, offering options like "Choose from Library" or "Take Photo."
    *   **User Action:** Selects "Choose from Library" (or "Take Photo").
    *   **System Response (Mock):** The app simulates the native image picker opening. The user is presented with a mock gallery or camera interface.
    *   **User Action:** Selects a photo.
    *   **System Response (Mock):** The `MediaUploader` component receives a mock image URI. A preview of the selected mock photo (e.g., a placeholder image bundled with the app assets) is displayed within the 'Create Report' form.

4.  **Set Location:**
    *   **User Action:** Taps on the 'Set Location' button (which would internally use the `LocationPicker` component).
    *   **System Response:** The `LocationPicker` interface appears, possibly showing a map view.
    *   **User Action (Scenario: Auto-fetch):** If the app requests location permission: User taps "Allow."
    *   **System Response (Mock):** The app simulates fetching current GPS coordinates. A map view within the `LocationPicker` displays a pin at a mock current location (e.g., center of the city, or a predefined mock coordinate).
    *   **User Action (Optional Adjustment):** User can drag the pin to adjust the location slightly.
    *   **User Action:** Taps "Confirm Location."
    *   **System Response (Mock):** The `LocationPicker` returns the mock coordinates (and potentially a mock reverse-geocoded address like "Mock Main Street, Mockville"). The 'Create Report' form updates to show the selected mock location (e.g., "Location: Mock Main Street" or a small static map preview).

5.  **Select Category:**
    *   **User Action:** Taps on the category selection field (which would use the `CategorySelector` component).
    *   **System Response:** A list or dropdown of predefined mock categories appears (e.g., "Pothole," "Broken Streetlight," "Uncollected Garbage").
    *   **User Action:** Selects a category (e.g., "Pothole").
    *   **System Response:** The selected category "Pothole" is displayed in the form.

6.  **Post Anonymously:**
    *   **User Action:** Taps on the toggle switch labeled "Post Anonymously" (representing the `AnonymousSwitch` component).
    *   **System Response:** The switch toggles to an 'on' or active state. A visual indicator confirms that the report will be anonymous.

7.  **Submit Report:**
    *   **User Action:** Taps the 'Submit Report' button.
    *   **System Response (Mock Data Phase):**
        *   The application simulates a successful submission to a backend. No actual network request is made, or if it is, it hits a mock service worker or a simple mock endpoint within the app.
        *   A loading indicator might briefly appear.
        *   A success message is displayed (e.g., "Report submitted successfully!").
        *   The app navigates the user to a relevant screen, such as:
            *   The main feed/map screen, where the newly created (mock) report now appears, clearly marked as "Posted by: Anónimo" and including the mock title, category, and location pin.
            *   A 'Report Detail' screen for the newly created mock report.

---

## Flow 2: User Views Reports on Map, Opens One, and Simulates Adding a Comment (Mock Data)

*   **Objective**: User interacts with a map-based feed of reports, views the details of a specific report, and simulates the comment submission process, all using mock data.
*   **Pre-conditions**: User is authenticated (or app allows anonymous browsing of reports).

**Steps:**

1.  **Navigate to Map View:**
    *   **User Action:** Taps on the "Map View" tab or navigation item.
    *   **System Response:** The app navigates to the 'Map View' screen.

2.  **View Reports on Map:**
    *   **System Response (Mock Data):** The map interface loads. Multiple pins are displayed on the map at various mock locations. Each pin represents a mock issue report (e.g., 5-10 predefined mock reports with varying categories, titles, and locations).

3.  **Select a Report from Map:**
    *   **User Action:** Taps on one of the map pins.
    *   **System Response (Mock Data):** An information callout or a small summary card (a variant of `ReportCard`) appears above or near the selected pin, displaying a mock title (e.g., "Broken Streetlight at Elm St") and category for that report.

4.  **View Full Report Details:**
    *   **User Action:** Taps on the summary card/callout.
    *   **System Response (Mock Data):** The app navigates to the 'Report Detail' screen for the selected mock report.
        *   The screen displays detailed information from the mock data set:
            *   **Title:** e.g., "Broken Streetlight at Elm St"
            *   **Description:** e.g., "The streetlight on the corner of Elm and 2nd has been out for three days."
            *   **Media:** Displays one or more mock images/video placeholders (e.g., generic asset images).
            *   **Location:** Shows the mock location on a small, non-interactive map preview and/or as text (e.g., "Elm St & 2nd Ave").
            *   **Category:** e.g., "Streetlight Out"
            *   **Author:** "Posted by: Anónimo" or "Posted by: MockUser123"
            *   **Status:** e.g., "Nuevo" or "Verificado"
            *   **Timestamp:** e.g., "2 days ago"
            *   **Support Count:** e.g., "5 Supports"

5.  **Access Comments Section:**
    *   **User Action:** Scrolls down the 'Report Detail' screen to the comments section.
    *   **System Response (Mock Data):** A list of predefined mock comments is displayed (e.g., 2-3 comments like "I've noticed this too!" by "MockUser2", "Thanks for reporting." by "Anónimo"). Each comment shows mock commenter display name and text.

6.  **Initiate Adding a Comment:**
    *   **User Action:** Taps on the `CommentInput` field, which might look like a text input with a "Post" button.
    *   **System Response:** The keyboard appears, and the `CommentInput` field gains focus.

7.  **Type a Comment:**
    *   **User Action:** Types a comment into the `CommentInput` field (e.g., "Hope this gets fixed soon!").
    *   **System Response:** The typed text appears in the input field.

8.  **Post Comment:**
    *   **User Action:** Taps the "Post Comment" or "Send" button associated with the `CommentInput`.
    *   **System Response (Mock Data Phase):**
        *   The app simulates the comment being successfully submitted.
        *   The keyboard dismisses.
        *   The input field is cleared.
        *   The UI of the comments section updates optimistically to include the new (mock) comment at the end of the list, displaying the typed text and a mock current user display name (e.g., "You" or the logged-in mock user's name).
        *   No actual data is sent to a backend; the new comment is only added to the local component state for the duration of the session on that screen.

---

These flows, using mock data, allow for the development and testing of the UI and user experience for core functionalities before full backend integration is complete.
