# Mithai Wala - Sweet Shop Management System 🍬

A modern, full-stack capable Single Page Application (SPA) designed to manage inventory and sales for a local Indian sweet shop. Built with **React**, **TypeScript**, and **Tailwind CSS**.

![Mithai Wala App](https://placehold.co/800x400/fff7ed/ea580c?text=Mithai+Wala+Preview)

## 🚀 Features

### 🛍️ Customer Storefront
*   **Visual Menu:** Beautiful grid layout displaying sweets with images, descriptions, and prices.
*   **Advanced Filtering:** Search by name, filter by category (e.g., Bengali Sweets, Ghee Sweets), and filter by budget.
*   **Stock Status:** Real-time visual indicators for availability (e.g., "Sold Out" or "5 left").
*   **Purchase Simulation:** "Add to Box" functionality that updates inventory in real-time (Mock Mode).

### 🛡️ Admin Dashboard
*   **Secure Access:** Protected route accessible only to users with the 'admin' role.
*   **Business Intelligence:** Summary cards showing Total Items, Total Inventory Value (₹), and Low Stock Alerts.
*   **Inventory Management:** 
    *   **Add:** Create new sweets with image URLs and details.
    *   **Edit:** Update prices, descriptions, or names.
    *   **Delete:** Remove items permanently from the catalog.
    *   **Restock:** One-click functionality to add specific quantities to stock.

### 🔐 Authentication & State
*   **Role-Based Access Control (RBAC):** Distinction between standard users and admins.
*   **Session Persistence:** Login state and Mock Data are persisted via `localStorage`, so data survives page refreshes.
*   **Mock Service Layer:** A toggleable service layer that allows the app to run without a backend for demonstration purposes, or connect to a REST API by changing one constant.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM v7
*   **Icons:** Lucide React
*   **State Management:** React Context API

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js (LTS version recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/mithai-wala.git
    cd mithai-wala
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🔑 Demo Credentials (Mock Mode)

The application is currently configured to run in **Mock Mode**. You can use these credentials to test the different roles:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| **Admin** | `admin@mithaiwala.com` | `admin` | Full Dashboard Access, Edit/Delete Sweets |
| **User** | `vikram@test.com` | `12345` | Can Browse and Purchase |

*Note: In Mock Mode, any password will work as long as the email matches the hardcoded demo users.*

## ⚙️ Configuration

To switch from Mock Mode to a real Backend API:

1.  Open `src/constants.ts`
2.  Set `USE_MOCK_SERVICE = false`
3.  Update `API_BASE_URL` to your backend server URL (e.g., your Mongo/Express backend).

```typescript
// src/constants.ts
export const API_BASE_URL = 'http://localhost:3000/api';
export const USE_MOCK_SERVICE = false; // Set to false to use real API
```

## 🤖 My AI Usage

As part of the development process for this assignment, I utilized AI tools to accelerate development and refactor code.

**AI Tool Used:** Google Gemini

**How it was used:**
1.  **Boilerplate Generation:** I used Gemini to generate the initial project structure, including the `tsconfig` setup and Vite configuration for React + TypeScript.
2.  **Component Architecture:** I asked the AI to help design the `SweetCard` and `AdminDashboard` components to ensure they were responsive and followed Tailwind CSS best practices.
3.  **Service Layer Abstraction:** The `src/services/api.ts` file was co-authored with AI to create a seamless switch between "Mock Data" (localStorage) and real HTTP fetch calls. This allows the frontend to be tested independently of the backend.
4.  **Debugging:** When encountering Vite import errors (specifically regarding `api.ts` paths), I used AI to analyze the stack trace and correct the file structure.

**Reflection:**
Using AI significantly speeded up the "boilerplate" phase, allowing me to focus on the business logic (like the restocking algorithm and budget filters) rather than writing CSS from scratch. It acted as a pair programmer, catching type errors in TypeScript before I even ran the code.

---
*Submitted by Yash Chaudhary*
