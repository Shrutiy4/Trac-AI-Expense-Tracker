import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency.js';

const ExpenseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "INR");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchExpense = async () => {
      try {
        const response = await api.get(`/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        const rawDate = new Date(data.date);
        const formattedDate = rawDate.toLocaleDateString('en-GB');

        setExpense({ ...data, date: formattedDate });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expense:', error);
        navigate('/dashboard');
      }
    };

    fetchExpense();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/expenses/${id}/edit`);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Expense deleted!');
      navigate(-1);
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense.');
    } finally {
      setShowModal(false);
    }
  };

  if (loading) {
    return <div className="text-center text-lg py-10">Loading expense details...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-ghost mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-primary">Expense Details</h2>
      <p className="text-sm sm:text-base text-base-content/80 mb-6">
        Review your expense information
      </p>

      <div className="bg-base-100 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem label="Title" value={expense.title} />
          <DetailItem label="Amount" value={formatCurrency(expense.amount, currency)} />
          <DetailItem label="Date" value={expense.date} />
          <DetailItem label="Merchant" value={expense.merchant || '—'} />
          <DetailItem label="Payment Method" value={expense.paymentMethod || '—'} />
          <DetailItem label="Category" value={expense.category} />
          <DetailItem label="Group" value={expense.group || 'Ungrouped'} />
          <DetailItem label="Input Mode" value={expense.inputMode || '—'} />
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={handleEdit} className="btn btn-outline btn-primary flex gap-2">
            <Pencil size={18} /> Edit
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-outline btn-error flex gap-2">
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-lg p-6 w-[90%] max-w-md space-y-4">
            <h3 className="text-xl font-bold text-error">Confirm Deletion</h3>
            <p>Are you sure you want to delete this expense?</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="btn btn-sm btn-error"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-base-content/60">{label}</span>
    <span className="text-base font-medium">{value}</span>
  </div>
);

export default ExpenseDetails;
