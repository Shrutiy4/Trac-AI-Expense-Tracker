import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Info } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const AddExpense = () => {
  const today = new Date().toISOString().split('T')[0];
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
    customGroup: '',
  });

  const [groups, setGroups] = useState(['Ungrouped']);
  const [categories, setCategories] = useState(['Custom']);
  const [billImage, setBillImage] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'INR');
  const [fromOCR, setFromOCR] = useState(false);


  // 🔁 Pre-fill from localStorage OCR data
  useEffect(() => {
  const saved = localStorage.getItem('ocrData');
  if (saved) {
    const parsed = JSON.parse(saved);
    // console.log(`PARSED: ${parsed.category}`)
    const detectedCategory = parsed.category || '';
    const availableCategories = JSON.parse(localStorage.getItem('allCategories') || '[]');
    const isExistingCategory = availableCategories.includes(detectedCategory);

    setForm((prev) => ({
        ...prev,
        title: parsed.title || '',
        amount: parsed.amount || '',
        date: parsed.date || '',
        merchant: parsed.merchant || '',
        category: isExistingCategory ? detectedCategory : 'Custom',
        customCategory: isExistingCategory ? '' : parsed.customCategory,
      }));

      setOcrText(
        `Detected: ${parsed.title || ''} - AMT:${parsed.amount || ''} at ${parsed.merchant || ''} on ${parsed.date || ''} under ${parsed.category || ''}`
      );

      setFromOCR(true);
      localStorage.removeItem('ocrData');
      toast.success('Auto-filled Fields!');
    }
  }, []);


  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await api.get('/meta/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter(Boolean); // filter out empty/null strings
        setCategories([...filtered, 'Custom']);
        localStorage.setItem('allCategories', JSON.stringify(filtered)); // 🔄 For OCR logic
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

        const res = await api.get('/meta/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter(Boolean); // Remove any nulls
        setGroups(['Ungrouped', ...filtered.sort(), 'Custom']);
      } catch (err) {
        console.error('Failed to fetch groups', err);
      }
    };
    fetchGroups();
  }, []);



  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const finalCategory = form.category === 'Custom' ? form.customCategory : form.category;
    let finalGroup = form.group === 'Custom' ? form.customGroup : form.group;
    if (finalGroup === 'Ungrouped') finalGroup = null;

    if (form.category === 'Custom' && form.customCategory) {
      try {
        await api.post('/meta/categories', { name: form.customCategory }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Category already exists or failed to add');
      }
    }

    if (form.group === 'Custom' && form.customGroup) {
      try {
        await api.post('/meta/groups', { name: form.customGroup }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Group already exists or failed to add');
      }
    }


    const expenseData = {
      ...form,
      category: finalCategory,
      group: finalGroup,
      inputMode: fromOCR ? 'Image Upload' : 'Manual Entry',
      amount: Number(form.amount),
    };

    setLoading(true);
    try {
      await api.post('/expenses', expenseData);
      toast.success('Expense added successfully!');
      navigate('/expenses');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <button onClick={() => navigate(-1)} className="btn btn-sm btn-ghost mb-6 flex items-center gap-2">
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-primary text-center">Add Expense</h2>
      <p className="text-sm text-center sm:text-base text-base-content/80 mb-6">
        Fill manually or upload a bill to auto-fill the details
      </p>

      <div className="flex flex-col lg:flex-row gap-6 bg-base-200 p-6 rounded-xl shadow-sm">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="lg:w-2/3 w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="title" value={form.title} onChange={handleInputChange} placeholder="Title" className="input input-bordered w-full" required />
            <input type="number" name="amount" value={form.amount} onChange={handleInputChange} placeholder={`Amount (${currency})`} className="input input-bordered w-full" required />
            <input type="date" name="date" value={form.date} onChange={handleInputChange} className="input input-bordered w-full" required max={today} />
            <input type="text" name="merchant" value={form.merchant} onChange={handleInputChange} placeholder="Merchant" className="input input-bordered w-full" />
            <input type="text" name="paymentMethod" value={form.paymentMethod} onChange={handleInputChange} placeholder="Payment Method" className="input input-bordered w-full" />

            <div>
              <select name="category" value={form.category} onChange={handleInputChange} className="select select-bordered w-full" required>
                <option value="" disabled>Select Category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {form.category === 'Custom' && (
                <input type="text" name="customCategory" value={form.customCategory} onChange={handleInputChange} placeholder="Enter custom category" className="input input-bordered w-full mt-2" required />
              )}
            </div>

            <div>
              <div className="flex justify-end items-center gap-1 mb-1">
                <label className="label-text">Group</label>
                <div className="tooltip tooltip-left md:tooltip-top z-50 tooltip-info" data-tip="Groups let you organize related categories together — e.g., combine Food, Travel, and Stay into a 'Trip' group.">
                  <Info size={16} className="text-info cursor-pointer" />
                </div>
              </div>
              <select name="group" value={form.group} onChange={handleInputChange} className="select select-bordered w-full">
                {groups.map((g) => <option key={g} value={g}>{g === 'Ungrouped' ? 'No Group (Optional)' : g}</option>)}
              </select>
              {form.group === 'Custom' && (
                <input type="text" name="customGroup" value={form.customGroup} onChange={handleInputChange} placeholder="Enter custom group" className="input input-bordered w-full mt-2" />
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>{loading ? 'Adding...' : 'Add Expense'}</button>
        </form>

        {/* Divider */}
        <div className="hidden lg:divider lg:divider-horizontal">OR</div>
        <div className="lg:hidden divider">OR</div>

        {/* OCR Upload Section */}
        <div className="lg:w-1/3 w-full flex flex-col gap-4 justify-center">
          <label className="text-sm font-medium text-base-content">Upload Bill Image</label>
          <button className="btn btn-outline btn-primary w-full" onClick={() => navigate('/upload-bill')} type="button">
            Upload Bill
          </button>
          {previewURL && (
            <div className="rounded border p-2 bg-base-100">
              <img src={previewURL} alt="Bill Preview" className="w-full max-h-48 object-contain rounded" />
            </div>
          )}
          {ocrText && (
            <div className="text-sm bg-base-100 p-3 rounded flex gap-2 items-start text-base-content/80">
              <FileText size={18} className="mt-1 text-info" />
              <span>{ocrText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExpense;