# Essential Reusable Frontend Components - VozActiva Ciudadana

This document lists and describes essential reusable UI components for the 'VozActiva Ciudadana' Expo (React Native) frontend. These components are designed to be modular, promote consistency, and speed up development.

---

## 1. Component: `StyledButton`

*   **Purpose/Description:** A highly customizable button component used for various actions throughout the application (e.g., submit, cancel, navigate). It ensures a consistent look and feel for all buttons.
*   **Key Props (Inputs):**
    *   `title` (String): The text displayed on the button.
    *   `onPress` (Function): Callback function executed when the button is pressed.
    *   `variant` (Enum: 'primary', 'secondary', 'outline', 'danger', 'link', optional, default: 'primary'): Defines the button's visual style.
    *   `isLoading` (Boolean, optional, default: false): If true, displays a loading indicator instead of the title.
    *   `disabled` (Boolean, optional, default: false): If true, the button is non-interactive.
    *   `leftIcon` (ReactNode, optional): Icon to display to the left of the title.
    *   `rightIcon` (ReactNode, optional): Icon to display to the right of the title.
    *   `style` (Object, optional): Custom styles to override or extend default styling.
    *   `textStyle` (Object, optional): Custom styles for the button text.
*   **Key Emitted Events/Callbacks (Outputs):**
    *   `onPress`: Emitted when the button is pressed (passed via props).

---

## 2. Component: `StyledInput`

*   **Purpose/Description:** A customizable text input field for forms, ensuring consistent styling and behavior for data entry. Can include labels, error messages, and icons.
*   **Key Props (Inputs):**
    *   `value` (String): The current value of the input field.
    *   `onChangeText` (Function): Callback function executed when the text changes.
    *   `placeholder` (String, optional): Placeholder text for the input.
    *   `label` (String, optional): Text label displayed above or beside the input.
    *   `errorMessage` (String, optional): Error message displayed below the input if validation fails.
    *   `secureTextEntry` (Boolean, optional, default: false): For password inputs.
    *   `keyboardType` (Enum, optional, default: 'default'): Specifies the keyboard type (e.g., 'email-address', 'numeric').
    *   `leftIcon` (ReactNode, optional): Icon to display on the left side of the input.
    *   `rightIcon` (ReactNode, optional): Icon to display on the right side (e.g., clear button, password visibility toggle).
    *   `multiline` (Boolean, optional, default: false): Whether the input can span multiple lines.
    *   `numberOfLines` (Number, optional, default: 1): Number of lines if multiline.
    *   `containerStyle` (Object, optional): Custom styles for the container.
    *   `inputStyle` (Object, optional): Custom styles for the text input element itself.
*   **Key Emitted Events/Callbacks (Outputs):**
    *   `onChangeText`: Emitted when the text in the input field changes (passed via props).
    *   `onFocus` (Function, optional): Callback for when the input gains focus.
    *   `onBlur` (Function, optional): Callback for when the input loses focus.

---

## 3. Component: `ReportCard`

*   **Purpose/Description:** Displays a summarized view of an individual issue report. Used in lists or feeds (e.g., HomeScreen, MyReportsScreen). Tapping on the card would typically navigate to the `ReportDetailScreen`.
*   **Key Props (Inputs):**
    *   `reportData` (Object): An object containing the report details (e.g., `title`, `category`, `status`, `timestampCreated`, `creatorDisplayName`, `locationDescription`, `thumbnailUrl` for a preview image, `supportCount`).
    *   `onPress` (Function): Callback function executed when the card is pressed.
    *   `style` (Object, optional): Custom styles for the card container.
*   **Key Emitted Events/Callbacks (Outputs):**
    *   `onPress`: Emitted when the card is pressed, usually passing the `reportData.id` or the full `reportData` object.

---

## 4. Component: `MediaUploader`

*   **Purpose/Description:** Allows users to select photos or videos from their device library or capture new ones using the camera. Displays previews of selected media and handles the initial stage of the upload process.
*   **Key Props (Inputs):**
    *   `onMediaSelected` (Function): Callback function that receives an array of selected media objects (e.g., `{ uri: string, type: 'image' | 'video', fileName?: string }`).
    *   `maxFiles` (Number, optional, default: 5): Maximum number of files allowed.
    *   `mediaTypes` (Enum: 'Images', 'Videos', 'All', optional, default: 'Images'): Types of media allowed (uses `Expo-Image-Picker` options).
    *   `initialMedia` (Array, optional): Array of media items to display initially (e.g., when editing a report).
*   **Key Emitted Events/Callbacks (Outputs):**
    *   `onMediaSelected`: Emitted when the user confirms their media selection. Provides an array of local URIs and media types.
    *   `onMediaRemoved` (Function, optional): Emitted when a user removes a previously selected media item from the preview.

---

## 5. Component: `LocationPicker`

*   **Purpose/Description:** Enables users to specify a location for their report. This can be done by using the device's current GPS location, picking a point on an interactive map, or potentially searching for an address.
*   **Key Props (Inputs):**
    *   `onLocationSelected` (Function): Callback that receives the selected location data (e.g., `{ latitude: number, longitude: number, addressText?: string }`).
    *   `initialLocation` (Object, optional): An initial location to display on the map (e.g., `{ latitude: number, longitude: number }`).
    *   `mapHeight` (Number, optional, default: 300): Height of the map view.
    *   `showSearchBar` (Boolean, optional, default: false): Whether to include an address search bar.
*   **Key Emitted Events/Callbacks (Outputs):**
    *   `onLocationSelected`: Emitted when the user confirms a location selection.
    *   `onError` (Function, optional): Emitted if there's an error, e.g., location permissions denied.

---

## 6. Component: `CategorySelector`

*   **Purpose/Description:** Allows users to select a category for their report or social cause from a predefined list. Could be rendered as a dropdown, a list of chips, or a modal with options.
*   **Key Props (Inputs):**
    *   `categories` (Array of Objects): The list of available categories (e.g., `[{ id: 'pothole', name: 'Pothole' }, { id: 'streetlight', name: 'Streetlight Out' }]`).
    *   `selectedCategory` (String or Object, optional): The currently selected category ID or object.
    *   `onCategorySelect` (Function): Callback function executed when a category is selected.
    *   `label` (String, optional): A label for the selector.
    *   `placeholder` (String, optional, default: "Select a category"): Placeholder text.
*   **Key Emitted Events/Callbacks (Outputs):**
    *   `onCategorySelect`: Emitted when a user selects a category, passing the category ID or object.

---

## 7. Component: `ListItemWrapper` (or `EntityListItem`)

*   **Purpose/Description:** A generic wrapper component for displaying items in a list that share common characteristics, such as social causes or contract discussions. It handles common layout and touch interactions. The actual content rendering can be customized via children or render props.
*   **Key Props (Inputs):**
    *   `itemData` (Object): The data for the item to display (e.g., a social cause object or a contract discussion object).
    *   `onPress` (Function): Callback when the item is pressed.
    *   `title` (String): Main title of the item.
    *   `subtitle` (String, optional): Secondary text or description.
    *   `leftContent` (ReactNode, optional): Content to display on the left (e.g., an icon or image).
    *   `rightContent` (ReactNode, optional): Content to display on the right (e.g., a chevron, status badge, or support count).
    *   `style` (Object, optional): Custom styles for the item container.
*   **Key Emitted Events/Callbacks (Outputs):**
    *   `onPress`: Emitted when the item is pressed, usually passing the `itemData.id` or the full `itemData`.

---

This list provides a foundational set of reusable components. As the application develops, more components will be identified and created, potentially being variations or compositions of these core elements.
