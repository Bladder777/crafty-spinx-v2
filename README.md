<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Crafty Spinx v0.x

A delightful catalog to browse and select charming, hand-knitted teddy bears. Users can swipe through the collection, mark their favorites, and place an order inquiry.

## ✨ Features

*   **Dynamic Catalog Views:** Seamlessly switch between a modern "swipe" view for quick browsing and a traditional "grid" view for an overview of all items.
*   **Persistent Wishlist & Cart:** Add items to your wishlist and cart, with all selections saved locally in your browser for future visits.
*   **Live Admin Mode:** A password-protected administrative interface for managing the product catalog directly within the application (add, edit, delete items, reset catalog).
*   **Real-time Data Sync:** Utilizes Supabase Realtime to instantly reflect changes across all connected clients when items are added, updated, or deleted.
*   **Theme Customization:** Personalize your browsing experience with various color themes.
*   **Responsive Design:** Optimized for a smooth experience across all devices, from mobile to desktop.

## 🚀 Tech Stack

*   **React 19:** Modern JavaScript library for building user interfaces.
*   **TypeScript 5.x:** Enhances code quality and maintainability with static type checking.
*   **Tailwind CSS:** Utility-first CSS framework for rapid and responsive styling.
*   **Vite:** Fast and efficient build tool and development server.
*   **Supabase:** Backend-as-a-Service for database, authentication, and real-time capabilities.
*   **Google Gemini API (`@google/genai`):** Integrated for AI-powered features (future enhancements).
*   **Browser Local Storage:** Client-side data persistence for wishlist and cart.
*   **Custom Routing:** Simple, state-based routing within `App.tsx`.
*   **`lucide-react`:** A comprehensive set of beautiful and customizable open-source icons.

## 🛠️ Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd crafty-spinx-v0.x
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Set up Supabase Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase project details.
    ```env
    VITE_SUPABASE_URL="https://wzfwgsrtnoyzcqznbovi.supabase.co"
    VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Zndnc3J0bm95emNxem5ib3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTU5MzUsImV4cCI6MjA3OTQ5MTkzNX0.KyuCNt4RJfHGfXoQ4Mc83a_5JQxtRbaJ10sW6NZ6c8E"
    ```
    *Note: These keys are already hardcoded in `vite.config.ts` for AI Studio deployment, but for local development, using `.env.local` is a best practice.*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
    The application will be available at `http://localhost:3000`.

## ☁️ Supabase Integration

This application leverages Supabase for its backend needs, providing:
*   **Database:** Stores all craft item data and user profiles.
*   **Authentication:** Manages user sessions, including the admin login.
*   **Realtime:** Ensures that catalog updates are instantly reflected across all active user sessions.

**Supabase Project ID:** `wzfwgsrtnoyzcqznbovi`

## 🔒 Admin Mode

To access the administrative features (add, edit, delete items, reset catalog):
1.  Open the **Settings** modal (via the floating action menu).
2.  Enter the admin password: `08289737098`
3.  *Note:* This password is for demonstration purposes and local convenience. In a production environment, robust authentication and authorization would be implemented.

## 🤖 Built with Jaf-R

This application was built and refined with the assistance of **Jaf-R**, an AI editor designed to create and modify web applications in real-time. Jaf-R helped implement features, resolve issues, and ensure best practices were followed throughout the development process.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.