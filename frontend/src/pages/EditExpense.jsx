import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: '',
    merchant: '',
    paymentMethod: '',
    category: '',
    customCategory: '',
    group: 'Ungrouped',
    customGroup: ''
  });

  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchExpense = async () => {
      try {
        const res = await axios.get(`/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = res.data;

        // Format date and amount
        const rawDate = new Date(data.date);
        const formattedDate = rawDate.toLocaleDateString('en-GB');
        const formattedAmount = new Intl.NumberFormat('en-IN', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(data.amount);

        setForm({
          ...data,
          date: formattedDate,
          amount: formattedAmount,
          customCategory: '',
          group: data.group || 'Ungrouped',
          customGroup: ''
        });
      } catch (err) {
        console.error('Error fetching expense:', err);
        alert('Failed to fetch expense');
        navigate('/');
      }
    };

    fetchExpense();
  }, [id, navigate]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('/meta/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const sorted = res.data
          .filter(c => c !== 'Custom')
          .sort((a, b) => a.localeCompare(b));

        setCategories([...sorted, 'Custom']);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);


  // Fetch groups from backend
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('/meta/groups', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const sorted = res.data
          .filter(g => g !== 'Ungrouped' && g !== 'Custom')
          .sort((a, b) => a.localeCompare(b));

        setGroups(['Ungrouped', ...sorted, 'Custom']);
      } catch (err) {
        console.error('Failed to fetch groups', err);
      }
    };

    fetchGroups();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const convertToISO = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const finalCategory = form.category === 'Custom' ? form.customCategory : form.category;
    const finalGroup = form.group === 'Custom' ? form.customGroup : form.group;

    const updatedExpense = {
      ...form,
      amount: parseFloat(form.amount),
      category: finalCategory,
      group: finalGroup === 'Ungrouped' ? null : finalGroup,
      date: convertToISO(form.date)
    };

    try {
      await axios.put(`/expenses/${id}`, updatedExpense, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Expense updated!');
      navigate(-1);
    } catch (err) {
      console.error('Error updating expense:', err);
      alert('Update failed!');
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-ghost mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-primary text-center">Edit Expense</h2>
      <p className="text-sm sm:text-base text-base-content/80 mb-6 text-center">
        Make changes and save the expense
      </p>

      <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-xl space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="input input-bordered w-full"
            required
          />

          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleInputChange}
            placeholder="Amount (₹)"
            className="input input-bordered w-full"
            required
          />

          <input
            type="text"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            placeholder="dd/mm/yyyy"
            className="input input-bordered w-full"
            required
          />

          <input
            type="text"
            name="merchant"
            value={form.merchant}
            onChange={handleInputChange}
            placeholder="Merchant"
            className="input input-bordered w-full"
          />

          <input
            type="text"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleInputChange}
            placeholder="Payment Method"
            className="input input-bordered w-full"
          />

          <div>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {form.category === 'Custom' && (
              <input
                type="text"
                name="customCategory"
                value={form.customCategory}
                onChange={handleInputChange}
                placeholder="Enter custom category"
                className="input input-bordered w-full mt-2"
                required
              />
            )}
          </div>
          
          <div>
            <select
              name="group"
              value={form.group}
              onChange={handleInputChange}
              className="select select-bordered w-full"
            >
              {groups.map((grp) => (
                <option key={grp} value={grp}>{grp === 'Ungrouped' ? 'No Group (Optional)' : grp}</option>
              ))}
            </select>

            {form.group === 'Custom' && (
              <input
                type="text"
                name="customGroup"
                value={form.customGroup}
                onChange={handleInputChange}
                placeholder="Enter custom group"
                className="input input-bordered w-full mt-2"
              />
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4 w-full sm:w-auto flex gap-2">
          <Save size={18} /> Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
