# SpendWise 💳

## Modern Expense Tracker & Financial Analytics

SpendWise is a responsive web application for tracking personal expenses, managing transactions, and visualizing spending habits through interactive dashboards and analytics.

The application uses **React** for the frontend and **Firebase** for authentication and cloud data storage, with user-specific Firestore security rules to keep financial data private.

---

## ✨ Features

### 🔐 Authentication & User Accounts

* User registration and login with Firebase Authentication
* Email and password authentication
* Form validation
* Protected application routes
* User-specific data isolation
* Profile management
* Secure email change with password re-authentication
* Account deletion

### 💰 Expense Management

* Add new expenses
* Edit existing expenses
* Delete expenses with confirmation
* Expense categories
* Expense date and description
* Real-time data synchronization with Firestore
* CSV export for transactions

### 📊 Dashboard

* Total expenses
* Current month's expenses
* Today's expenses
* Total transaction count
* Recent transactions
* Quick expense management actions

### 🔎 Search, Filter & Sort

* Search expenses by name or description
* Filter by category
* Filter by date
* Sort by:

  * Newest to oldest
  * Oldest to newest
  * Highest amount
  * Lowest amount
* Reset filters

### 📈 Analytics

* Monthly spending chart
* Category distribution chart
* Spending percentage by category
* Transaction count by category
* Average spending per category
* Automatically updated charts when expenses change

### 🌐 English & Arabic

* English and Arabic interface
* Full RTL support for Arabic
* Dynamic LTR/RTL layout
* Persistent language preference
* Arabic-friendly typography

### 🎨 UI/UX

* Modern SaaS-inspired interface
* Responsive design
* Dark and light themes
* Responsive navigation
* Reusable React components
* Interactive modals and notifications

---

## 🛠️ Technologies

| Technology              | Purpose                                |
| ----------------------- | -------------------------------------- |
| React                   | Frontend UI and component architecture |
| JavaScript (ES6+)       | Application logic                      |
| Vite                    | Frontend development and build tooling |
| React Router            | Client-side routing                    |
| Firebase Authentication | User authentication                    |
| Cloud Firestore         | Cloud database and real-time data      |
| Chart.js                | Interactive data visualization         |
| react-chartjs-2         | React integration for Chart.js         |
| Lucide React            | UI icons                               |
| CSS3                    | Responsive styling and themes          |

---

## 📁 Project Structure

```text
expense-tracker/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── styles/
├── .env.example
├── .gitignore
├── firestore.rules
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔒 Firestore Security

SpendWise uses Firestore Security Rules to ensure that authenticated users can only access their own data.

User data is organized using the following structure:

```text
users/{userId}
└── expenses/{expenseId}
```

The security rules verify that the authenticated user's UID matches the requested user ID.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;

      match /expenses/{expenseId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## ⚙️ Firebase Setup

To run SpendWise with your own Firebase project:

### 1. Create a Firebase Project

Create a project using the Firebase Console.

### 2. Enable Authentication

Enable:

```text
Authentication
→ Sign-in method
→ Email/Password
```

### 3. Create Firestore Database

Create a Firestore database and deploy the security rules provided in:

```text
firestore.rules
```

### 4. Register a Web App

In Firebase:

```text
Project Settings
→ General
→ Your apps
→ Web App
```

Copy the Firebase configuration values.

### 5. Configure Environment Variables

Create a `.env` file in the project root based on `.env.example`.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Never commit your `.env` file to GitHub.

---

## 🚀 Installation

### Prerequisites

* Node.js 18+
* npm

### Clone the Repository

```bash
git clone https://github.com/sajabj/spendwise.git
cd spendwise
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

---

## 🔮 Future Improvements

* [ ] Monthly budget management
* [ ] Budget limit notifications
* [ ] Receipt image uploads
* [ ] Recurring expenses
* [ ] Monthly financial reports
* [ ] PDF report generation
* [ ] Multi-currency support

---

## 📌 Project Highlights

SpendWise demonstrates practical experience with:

* React component-based development
* Firebase Authentication
* Cloud Firestore
* CRUD operations
* Real-time data synchronization
* Protected routes
* Firestore security rules
* Data visualization
* Responsive UI design
* Internationalization and RTL layouts
* Environment variable configuration

---

## 📄 License

This project is licensed under the MIT License.
