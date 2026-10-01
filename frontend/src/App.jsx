import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import SmartInsights from './pages/SmartInsights';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import ExpenseDetails from './pages/ExpenseDetails';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UploadBill from './pages/UploadBill';

const App = () => {
  return (
    <Routes>
      {/* Auth Routes - no Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes with Navbar */}
      <Route path="/" element={<Navbar />}>
        <Route index element={<Dashboard />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="expenses/:id" element={<ExpenseDetails />} />
        <Route path="expenses/:id/edit" element={<EditExpense />} />
        <Route path="add-expense" element={<AddExpense />} />
        <Route path="insights" element={<SmartInsights />} />
        <Route path="settings" element={<Settings />} />
        <Route path="/upload-bill" element={<UploadBill />} />
      </Route>
    </Routes>
  );
};

export default App;
