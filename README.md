# Personal Expense Tracker (Frontend)

A modern, user-friendly web application for tracking personal expenses, managing budgets, and visualizing spending analytics. Built with React and Material-UI, this app helps users and admins monitor and control financial activities efficiently.

## Features

- **User Authentication**: Secure login and registration for users and admins.
- **Expense Tracking**: Add, edit, delete, and filter expenses by category, payment method, and search.
- **Budget Management**: Set and update category-wise budgets, view spending against budgets.
- **Analytics Dashboard**: Visualize spending trends, top categories, and payment methods with charts (admin and user dashboards).
- **Admin Panel**: Admins can view analytics for all users, including total and category-wise spending.
- **Reports**: (Planned) Visual reports and charts for deeper insights.
- **Responsive UI**: Clean, mobile-friendly interface using Material-UI.
- **Notifications**: Real-time feedback for actions (add, update, delete) using React Toastify.

## User Walkthrough

### 1. Sign Up / Login

- New users can register by providing their name, email, and password.
- Existing users and admins can log in with their credentials.
- After login, users are redirected to their dashboard; admins are redirected to the admin dashboard.

### 2. Dashboard & Navigation

- Users see a summary of their expenses, budgets, and analytics.
- The navigation bar allows access to Expenses, Budgets, and Reports pages.

### 3. Adding & Managing Expenses

- On the **Expenses** page, users can:
  - Add new expenses by entering amount, category, date, payment method, and notes.
  - Edit or delete existing expenses.
  - Filter expenses by category, payment method, or search by keyword.
  - View category-wise spending and compare with set budgets.

### 4. Setting Budgets

- On the **Budgets** page, users can:
  - Set or update monthly budgets for each expense category.
  - View a table of all categories and their assigned budgets.

### 5. Viewing Analytics & Reports

- The dashboard displays:
  - Total expenses for the current month and all time.
  - Top spending categories and payment methods.
  - Visual charts (pie, bar, line) for spending trends.
- The **Reports** page (planned) will provide additional charts and downloadable reports.

### 6. Admin Features

- Admins can:
  - View analytics for all users, including total and category-wise spending.
  - Access a dedicated admin dashboard with advanced charts and user management features.

### 7. Logout

- Users and admins can securely log out from any page using the logout button in the navigation bar.

## Tech Stack

- **React** (v19+)
- **Material-UI (MUI)** for UI components
- **Formik & Yup** for forms and validation
- **Axios** for API requests
- **React Router v7** for routing
- **Chart.js & Recharts** for data visualization
- **React Toastify** for notifications

## Getting Started

### Prerequisites

- Node.js (v16 or above recommended)
- npm (v8 or above)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd frontend
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Start the development server:**

   ```bash
   npm start
   ```

   The app will run at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

The optimized build will be in the `build/` directory.

## Project Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components (ExpenseForm, ExpenseList, etc.)
│   ├── context/           # React context (AuthContext)
│   ├── pages/             # Main pages (Login, Signup, Expenses, Budgets, AdminDashboard, Reports)
│   ├── utils/             # Utility functions (API setup, helpers)
│   ├── App.js             # Main app and routing
│   └── index.js           # Entry point
├── package.json           # Project metadata and scripts
└── ...
```

## Usage

- **Login/Signup**: Register as a new user or login with existing credentials.
- **Track Expenses**: Add new expenses, filter by category/payment, edit or delete entries.
- **Set Budgets**: Define monthly budgets for each category.
- **View Analytics**: See charts and summaries of your spending.
- **Admin Access**: Admins can view analytics for all users.
