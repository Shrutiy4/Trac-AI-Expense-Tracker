# Trac — AI Expense Tracker

Trac is a full-stack expense management application that helps users track spending, manage expenses, monitor budgets, analyze spending patterns, and receive AI-powered financial suggestions.

## Features

* **User Authentication**

  * User registration and login
  * JWT-based authentication
  * Protected API routes
  * Password hashing with bcrypt

* **Expense Management**

  * Add, edit, view, and delete expenses
  * Categorize expenses
  * View expense history and details
  * Search and manage personal expenses

* **Dashboard**

  * Spending summaries
  * Recent expenses
  * Category-based spending information
  * Weekly and monthly spending views

* **Analytics**

  * Category-wise expense analysis
  * Daily spending trends
  * Monthly spending analysis
  * Interactive data visualization

* **Budget Management**

  * Set spending budgets
  * Track spending against budgets
  * Monitor budget progress
  * Budget-related notifications and warnings

* **AI-Powered Insights**

  * Analyzes recent expense data
  * Generates personalized spending suggestions
  * Uses OpenRouter with Mistral 7B Instruct
  * Provides concise recommendations based on spending patterns

* **Receipt OCR**

  * Upload expense receipts
  * Extract information from receipts automatically
  * Uses the Mindee Expense Receipt API
  * Reduces manual expense entry

* **Multi-Currency Support**

  * Supports displaying expenses using the selected currency

* **Group Expenses**

  * Supports managing expenses associated with groups

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* DaisyUI
* Recharts
* Axios
* React Dropzone
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Axios
* Multer
* dotenv

### AI & External APIs

* OpenRouter
* Mistral 7B Instruct
* Mindee Expense Receipt OCR API

---

## Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │  Dashboard          │
                    │  Expenses           │
                    │  Analytics          │
                    │  Budgets            │
                    │  AI Insights        │
                    │  Receipt Upload     │
                    └──────────┬──────────┘
                               │
                          REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │  Authentication     │
                    │  Expense APIs       │
                    │  Dashboard APIs     │
                    │  Analytics APIs     │
                    │  Budget APIs        │
                    │  AI APIs            │
                    │  OCR APIs           │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
             ┌─────────────┐      ┌─────────────┐
             │   MongoDB   │      │ External APIs│
             │             │      │             │
             │ Users       │      │ OpenRouter  │
             │ Expenses    │      │ Mindee OCR  │
             │ Categories  │      │             │
             │ Groups      │      └─────────────┘
             └─────────────┘
```

---

## Project Structure

```text
Trac-AI-Expense-Tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   ├── analyticsController.js
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── expenseController.js
│   │   │   ├── metaController.js
│   │   │   ├── ocrController.js
│   │   │   ├── reportController.js
│   │   │   └── userSettingsController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── models/
│   │   │   ├── Category.js
│   │   │   ├── Expense.js
│   │   │   ├── Group.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── expenseRoutes.js
│   │   │   ├── metaRoutes.js
│   │   │   ├── ocrRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   └── userSettingsRoutes.js
│   │   │
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── lib/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
└── package.json
```

---

## AI-Powered Spending Suggestions

Trac includes an AI-powered spending analysis feature.

The application takes recent expense data and sends it to an OpenRouter-hosted language model. The model analyzes the spending patterns and generates specific suggestions for saving money.

### AI Workflow

```text
User Expenses
      │
      ▼
Recent Expense Data
      │
      ▼
AI Prompt Generation
      │
      ▼
OpenRouter API
      │
      ▼
Mistral 7B Instruct
      │
      ▼
Personalized Suggestions
      │
      ▼
Trac Dashboard
```

The AI service is configured to generate a small number of concise recommendations based on the user's recent spending data.

---

## Receipt OCR

Trac supports automatic receipt processing.

Users can upload a receipt, which is processed by the backend and sent to the Mindee Expense Receipt API for extraction.

### OCR Workflow

```text
Receipt Image
      │
      ▼
Frontend Upload
      │
      ▼
Express + Multer
      │
      ▼
Mindee Expense Receipt API
      │
      ▼
Extracted Receipt Data
      │
      ▼
Expense Workflow
```

This feature helps reduce the amount of manual information users need to enter when recording expenses.

---

## Analytics

Trac provides multiple ways to analyze spending data, including:

* Category-wise spending
* Daily spending trends
* Monthly spending
* Spending summaries
* Interactive charts

The frontend uses chart components to visualize financial data and make spending patterns easier to understand.

---

## Authentication & Security

The backend uses JWT-based authentication to protect user-specific functionality.

Security-related functionality includes:

* JWT authentication
* Password hashing using bcrypt
* Protected API routes
* User-specific expense access
* Environment variables for sensitive credentials
* Authentication middleware

---

## API Modules

The backend is organized into separate route and controller modules.

| Module         | Purpose                                  |
| -------------- | ---------------------------------------- |
| Authentication | User registration and login              |
| Expenses       | Create, read, update and delete expenses |
| Dashboard      | Spending summaries and dashboard data    |
| Analytics      | Spending analysis and statistics         |
| AI             | AI-generated spending suggestions        |
| OCR            | Receipt processing                       |
| Reports        | Expense reporting                        |
| Categories     | Expense categorization                   |
| Groups         | Group expense functionality              |
| User Settings  | User preferences and settings            |

---

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB or a MongoDB Atlas database

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shrutiy4/Trac-AI-Expense-Tracker.git
cd Trac-AI-Expense-Tracker
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open another terminal or return to the project root:

```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
MINDEE_API_KEY=your_mindee_api_key
```

Use your own credentials for each service.

**Never commit real API keys, database credentials, or secrets to GitHub.**

---

## Running the Application

### Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend can also be started in production mode with:

```bash
npm start
```

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

## Production Build

To create a production build of the frontend:

```bash
npm run build
```

---

## Future Improvements

Potential extensions for Trac include:

* Bank account integration
* Automatic transaction synchronization
* CSV transaction import
* Automated expense categorization
* Recurring expense detection
* Spending anomaly detection
* Financial forecasting
* Advanced AI-based financial analysis
* Mobile application
* Automated financial reports

---

## License

This project is licensed under the ISC License.

---

## Author

**Shruti**

GitHub: [@Shrutiy4](https://github.com/Shrutiy4)

