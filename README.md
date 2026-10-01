# Trac — AI Expense Tracker

Trac is a full-stack AI-powered expense management platform designed to simplify personal finance tracking. It combines expense management, budgeting, analytics, receipt OCR, group expenses, and AI-generated spending insights in a single application.

## Features

* **User Authentication**

  * User registration and login
  * JWT-based authentication
  * Protected API routes
  * Password hashing with bcrypt

* **Expense Management**

  * Add, edit, view, and delete expenses
  * Categorize expenses
  * Search and manage expense history
  * Support for multiple currencies

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

  * Create weekly and monthly budgets
  * Track spending against budgets
  * Monitor budget progress
  * Budget warnings and notifications

* **AI-Powered Insights**

  * Analyzes recent spending data
  * Generates personalized spending suggestions
  * Uses OpenRouter with Mistral 7B Instruct
  * Provides recommendations based on spending patterns

* **Receipt OCR**

  * Upload expense receipts
  * Automatically extract receipt information
  * Uses the Mindee Expense Receipt API
  * Reduces manual expense entry

* **Group Expenses**

  * Manage expenses associated with groups
  * Support for shared expense management

---

## Key Highlights

* Full-stack React and Node.js architecture
* REST API-based frontend/backend communication
* JWT authentication and protected APIs
* MongoDB and Mongoose for persistent data storage
* AI-powered spending analysis
* Automated receipt information extraction
* Interactive financial analytics
* Weekly and monthly budget tracking
* Multi-currency expense management
* External API integration for AI and OCR services

---

## Tech Stack

### Frontend

* React 19
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
* Multer
* Axios
* dotenv

### AI & External Services

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
             ┌─────────────┐      ┌──────────────┐
             │   MongoDB   │      │External APIs │
             │             │      │              │
             │ Users       │      │ OpenRouter   │
             │ Expenses    │      │ Mindee OCR   │
             │ Categories  │      │              │
             │ Groups      │      └──────────────┘
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
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
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
├── package.json
└── README.md
```

---

## AI-Powered Spending Suggestions

Trac uses AI to convert raw spending data into personalized financial suggestions.

### AI Workflow

```text
User Expenses
      │
      ▼
Recent Expense Data
      │
      ▼
Prompt Generation
      │
      ▼
Backend AI Service
      │
      ▼
OpenRouter
      │
      ▼
Mistral 7B Instruct
      │
      ▼
Spending Suggestions
      │
      ▼
Trac Dashboard
```

The application analyzes recent expense information and generates concise recommendations based on observed spending patterns.

---

## Receipt OCR

Trac reduces manual expense entry through receipt processing.

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
Mindee OCR API
      │
      ▼
Extracted Receipt Information
      │
      ▼
Expense Workflow
```

The OCR integration allows relevant information to be extracted from uploaded receipts before being used in the expense workflow.

---

## Analytics

Trac provides multiple views of financial activity:

* Category-wise spending
* Daily spending trends
* Monthly spending
* Spending summaries
* Interactive charts

The frontend uses Recharts to visualize financial information and make spending patterns easier to identify.

---

## Authentication & Security

The backend uses JWT-based authentication to protect user-specific functionality.

Security-related functionality includes:

* JWT authentication
* Password hashing using bcrypt
* Protected API routes
* User-specific data access
* Authentication middleware
* Environment variables for sensitive credentials
* Backend-controlled external API integrations

Sensitive credentials such as database passwords and API keys should never be committed to the repository.

---

## API Modules

| Module         | Purpose                                  |
| -------------- | ---------------------------------------- |
| Authentication | Registration and login                   |
| Expenses       | Create, read, update and delete expenses |
| Dashboard      | Spending summaries and dashboard data    |
| Analytics      | Spending analysis and statistics         |
| Budgets        | Budget creation and tracking             |
| AI             | AI-generated spending suggestions        |
| OCR            | Receipt processing                       |
| Reports        | Expense reporting                        |
| Categories     | Expense categorization                   |
| Groups         | Group expense functionality              |
| User Settings  | User preferences and settings            |

---

## API Overview

The backend exposes REST APIs for the main application modules.

| Endpoint             | Method | Purpose                        |
| -------------------- | ------ | ------------------------------ |
| `/api/auth/register` | POST   | Register a new user            |
| `/api/auth/login`    | POST   | Authenticate a user            |
| `/api/expenses`      | GET    | Retrieve expenses              |
| `/api/expenses`      | POST   | Create an expense              |
| `/api/expenses/:id`  | PUT    | Update an expense              |
| `/api/expenses/:id`  | DELETE | Delete an expense              |
| `/api/analytics/*`   | GET    | Retrieve analytics data        |
| `/api/dashboard/*`   | GET    | Retrieve dashboard information |
| `/api/ai/*`          | POST   | Generate AI spending insights  |
| `/api/ocr/*`         | POST   | Process receipt information    |

All user-specific endpoints require authentication.

---

## Development Architecture

The project separates frontend responsibilities from backend business logic.

### Frontend

Responsible for:

* User interface
* Routing
* Form handling
* Data visualization
* API communication
* User interaction

### Backend

Responsible for:

* Authentication
* Authorization
* Business logic
* Database operations
* Expense management
* Analytics
* AI integration
* OCR integration
* API responses

### Database

MongoDB stores application data including:

* Users
* Expenses
* Categories
* Groups
* User settings

### External Services

The backend communicates with external services for:

* AI-powered spending analysis
* Receipt OCR

---

## Challenges & Solutions

### Reducing Manual Expense Entry

Manually entering information from receipts can be time-consuming.

**Solution:** Integrated receipt OCR so that information can be extracted from uploaded receipts and incorporated into the expense workflow.

### Converting Raw Expenses into Insights

Simply storing transactions does not provide meaningful financial insight.

**Solution:** Added daily, monthly, and category-based analytics along with AI-generated spending suggestions.

### Protecting Financial Data

Financial information requires controlled access between users.

**Solution:** Implemented JWT authentication, password hashing, protected routes, and user-specific data access.

### Integrating External Services Securely

AI and OCR services require external API credentials.

**Solution:** External service communication is handled by the backend, keeping sensitive API credentials away from the frontend.

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB or MongoDB Atlas

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shrutiy4/Trac-AI-Expense-Tracker.git
cd Trac-AI-Expense-Tracker
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

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

Replace the placeholder values with your own credentials.

**Never commit real API keys, database credentials, or secrets to GitHub.**

---

## Running the Application

### Start the Backend

From the `backend` directory:

```bash
npm run dev
```

For production:

```bash
npm start
```

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

## Production Build

To create a production build:

```bash
npm run build
```

---

## Roadmap

* [ ] Bank account / Account Aggregator integration
* [ ] CSV transaction import
* [ ] Automatic transaction categorization
* [ ] Recurring expense detection
* [ ] Spending anomaly detection
* [ ] Financial forecasting
* [ ] Advanced AI financial analysis
* [ ] Mobile application
* [ ] Automated financial reports

---

## Author

**Shruti**

GitHub: **@Shrutiy4**
