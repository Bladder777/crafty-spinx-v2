# AI Development Rules for Crafty Spinx

This document outlines the technical stack and specific guidelines for using libraries within the Crafty Spinx application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Description

*   **React 19:** The core JavaScript library for building dynamic and interactive user interfaces.
*   **TypeScript 5.x:** Provides static type checking, enhancing code quality and developer experience.
*   **Tailwind CSS:** A utility-first CSS framework used for all styling, enabling rapid and responsive UI development.
*   **Vite:** The build tool and development server, chosen for its speed and efficiency.
*   **Custom Routing:** Application navigation is managed internally using React state and conditional rendering, rather than an external routing library.
*   **shadcn/ui:** A collection of accessible and customizable UI components built on Radix UI and styled with Tailwind CSS.
*   **Radix UI:** Low-level, unstyled UI primitives used for building highly accessible components when `shadcn/ui` doesn't offer a suitable option.
*   **lucide-react:** A library providing a comprehensive set of beautiful and customizable open-source icons.
*   **`model-viewer` Web Component:** Used for embedding and interacting with 3D models directly in the web application.
*   **Supabase:** Integrated for database, authentication, and real-time capabilities, handling catalog items, user profiles, wishlists, and shopping carts.

## Library Usage Rules

*   **UI Components:**
    *   **Prioritize `shadcn/ui`** for all common UI elements (buttons, modals, forms, etc.).
    *   If `shadcn/ui` does not offer a suitable component or if deep customization is required, use **Radix UI primitives** and style them with Tailwind CSS.
    *   All new components should be created in `src/components/` and kept small and focused.
*   **Styling:**
    *   **Always use Tailwind CSS** for all styling. Avoid custom CSS files or inline styles unless absolutely necessary for global overrides (e.g., in `index.html` or `index.css`).
    *   Ensure all designs are responsive by leveraging Tailwind's utility classes.
*   **Icons:**
    *   Use **`lucide-react`** for all icons throughout the application.
*   **State Management:**
    *   For component-specific state, use React's built-in `useState` and `useReducer` hooks.
    *   Global application view management should continue to use the `currentView` state in `App.tsx`.
*   **Data Persistence:**
    *   All application data (catalog items, user profiles, wishlists, cart items) should be persisted using **Supabase**.
    *   `window.localStorage` should only be used for non-critical, client-specific settings (e.g., theme preference, UI state).
*   **3D Models:**
    *   Integrate 3D models using the **`<model-viewer>`** web component. Ensure the `modelUrl` property is correctly utilized.
*   **AI Integration:**
    *   All AI-related functionalities must be implemented using the **Google Gemini API** via the `@google/genai` package.
*   **Routing:**
    *   Maintain the existing custom routing approach based on React state and conditional rendering in `App.tsx`. Do not introduce external routing libraries like `react-router-dom`.
*   **Error Handling:**
    *   Avoid explicit `try/catch` blocks unless specifically requested. Allow errors to propagate for centralized debugging.
*   **Toasts:**
    *   Use toast components to provide user feedback for important events (e.g., item added to cart, admin actions).