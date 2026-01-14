# AccountSys: Formal Methods Banking Application

## 📘 Introduction
**AccountSys** is a robust, full-stack Banking Web Application developed as the practical implementation phase of a **Formal Methods & Software Engineering** project. 

The core objective of this system is to demonstrate the application of **Z Notation** and **VDM (Vienna Development Method)** principles in a real-world software environment. Unlike standard banking apps, AccountSys strictly enforces mathematical invariants and pre-conditions at the code level to ensure system integrity and correctness.

This project bridges the gap between abstract formal specifications and concrete Java/Spring Boot implementation, providing a verified environment for managing accounts, balances, and financial transactions.

---

## 🛠 Technology Stack

### Backend (Core Logic)
*   **Language**: Java 17 (OpenJDK)
*   **Framework**: Spring Boot 3.2.1
*   **Database**: H2 In-Memory Database (for persistence during runtime)
*   **Build Tool**: Maven
*   **Key Dependencies**: Spring Web, Spring Data JPA, Lombok.

### Frontend (User Interface)
*   **Framework**: React 18 (Vite)
*   **Styling**: Tailwind CSS (Modern, utility-first styling)
*   **HTTP Client**: Native Fetch API
*   **Design**: Responsive, clean dashboard with Admin and User views.

---

## 📐 Formal Methods Implementation

The system is built around strict mathematical constraints defined in the project's Z specifications:

### 1. The Safety Invariant
**Constraint**: The available funds (Balance + Overdraft Limit) must **never** be less than zero.
*   *Formal Spec*: `∀ a ∈ Accounts • a.balance + a.overdraftLimit ≥ 0`
*   *Implementation*: The `withdraw()` and `changeLimit()` methods in `AccountService.java` explicitly check this invariant locally before committing any change to the database.

### 2. Operation Pre-Conditions (Guards)
Every state-changing operation is guarded by strict checks:
*   **Deposit**: Amount must be strictly positive (`amount > 0`).
*   **Withdraw**: 
    1. Account must exist.
    2. Amount must be positive.
    3. Resulting state must satisfy the Safety Invariant.
*   **Add Account**: Account ID is uniquely generated (UUID) to avoid domain collisions.

---

## 🚀 Features

### 🛡 Admin Panel
*   **System Overview**: View the total liquidity (Sum of all balances) in the system.
*   **Account Management**: Create new customer accounts with:
    *   Full Name
    *   Address
    *   Email
    *   Overdraft Limit
*   **Auditing**: View a list of all active accounts and their current standing.
*   **Deletion**: Remove accounts (atomically deletes associated transactions).

### 👤 User Dashboard
*   **Account Access**: Secure login via unique **Account ID**.
*   **Real-time Balance**: View current balance and assigned overdraft limit.
*   **Transactions**:
    *   **Deposit Funds**: Add money to the account.
    *   **Withdraw Funds**: Remove money (subject to formal constraints).
*   **History**: A chronological log of all deposits and withdrawals with timestamps.

---

## ⚙️ Installation & Setup Guide

### Prerequisites
*   **Java 17+** (JDK must be in PATH)
*   **Node.js** (v18 or higher)
*   **Maven** (Optional, wrapper included or use system maven)

### Step 1: Start the Backend server
The backend runs on port `8080`.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *Note: If `mvn` is not in your path, use `./mvnw spring-boot:run` (Mac/Linux) or `mvnw spring-boot:run` (Windows).*

### Step 2: Start the Frontend Client
The frontend runs on port `5173`.

1.  Open a new terminal window.
2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm start
    ```
    *(Or `npm run dev`)*

### Step 3: Access the Application
Open your web browser and navigate to:
👉 **http://localhost:5173**

---

## 📂 Project Structure

```
FMSE/
├── backend/                 # Spring Boot Server
│   ├── src/main/java/       # Source Code
│   │   ├── model/           # Entities (Account, Transaction)
│   │   ├── repository/      # JPA Repositories
│   │   ├── service/         # Business Logic & Formal Constraints
│   │   ├── controller/      # REST API Endpoints
│   │   └── config/          # CORS & Web Config
│   └── pom.xml              # Maven Dependencies
│
├── frontend/                # React Client
│   ├── src/
│   │   ├── components/      # React Components (AdminPanel, UserDashboard)
│   │   ├── api.js           # API Connector Service
│   │   └── App.jsx          # Main Router
│   ├── tailwind.config.js   # Style Configuration
│   └── package.json         # Node Dependencies
│
└── README.md                # Documentation
```

## 🧪 Testing the Limits
To verify the **Formal Constraints**:
1.  Create an account with a `$100` Overdraft Limit.
2.  Deposit `$50` (Balance: $50, Limit: $100, Total Available: $150).
3.  Try to withdraw `$160`.
4.  **Result**: The system will **reject** the transaction with an invariant violation error, demonstrating the safety properties in action.

---
*Built for the Formal Methods & Software Engineering Assignment.*
