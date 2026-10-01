import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Pencil, Trash2, ArrowUpDown, Wallet } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/Table';
import { formatCurrency } from '../utils/formatCurrency';

const monthNames = ['All', ...Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString('default', { month: 'long' })
)];

const Expenses = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState(localStorage.getItem('search') || '');
  const [categoryFilter, setCategoryFilter] = useState('All' || localStorage.getItem('categoryFilter'));
  const [monthFilter, setMonthFilter] = useState(new Date().toLocaleString('default', { month: 'long' }) || localStorage.getItem('monthFilter'));
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString() || localStorage.getItem('yearFilter'));
  const [groupFilter, setGroupFilter] = useState('All' || localStorage.getItem('groupFilter'));
  const [itemsPerPage, setItemsPerPage] = useState(Number(localStorage.getItem('itemsPerPage')) || 10);

  const [sortKey, setSortKey] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'INR');
  const [currentPage, setCurrentPage] = useState(1);

  const [categories, setCategories] = useState(['All']);
  const [groups, setGroups] = useState(['All']);
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const headers = { Authorization: `Bearer ${token}` };
        const [expRes] = await Promise.all([api.get('/expenses', { headers })]);

        const expensesData = Array.isArray(expRes.data) ? expRes.data : [];

        const usedCategories = Array.from(new Set(expensesData.map(exp => exp.category).filter(Boolean))).sort();
        const usedGroups = Array.from(new Set(expensesData.map(exp => exp.group?.trim() || 'Ungrouped'))).sort();

        setExpenses(expensesData);
        setCategories(['All', ...usedCategories]);
        setGroups(['All', ...usedGroups]);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('search', search);
    localStorage.setItem('categoryFilter', categoryFilter);
    localStorage.setItem('monthFilter', monthFilter);
    localStorage.setItem('yearFilter', yearFilter);
    localStorage.setItem('groupFilter', groupFilter);
    localStorage.setItem('itemsPerPage', itemsPerPage);
  }, [search, categoryFilter, monthFilter, yearFilter, groupFilter, itemsPerPage]);

  const formatDate = (d) => {
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getUploadDateFromId = (id) => formatDate(new Date(parseInt(id.substring(0, 8), 16) * 1000));
  const getUploadTimestamp = (id) => parseInt(id.substring(0, 8), 16) * 1000;

  const handleSort = (key, e) => {
    e?.stopPropagation();
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const toggleSelect = (id) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPageIds = paginated.map((exp) => exp._id);
    const allSelected = currentPageIds.every((id) => selectedExpenses.includes(id));
    setSelectedExpenses((prev) =>
      allSelected
        ? prev.filter((id) => !currentPageIds.includes(id))
        : [...new Set([...prev, ...currentPageIds])]
    );
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (expenseToDelete === 'bulk') {
        await Promise.all(
          selectedExpenses.map((id) =>
            api.delete(`/expenses/${id}`, { headers })
          )
        );
        toast.success(`Deleted ${selectedExpenses.length} expenses`);
        setExpenses((prev) => prev.filter((e) => !selectedExpenses.includes(e._id)));
        setSelectedExpenses([]);
      } else {
        await api.delete(`/expenses/${expenseToDelete._id}`, { headers });
        toast.success('Expense deleted');
        setExpenses((prev) => prev.filter((e) => e._id !== expenseToDelete._id));
      }

      setExpenseToDelete(null);
    } catch {
      toast.error('Failed to delete expense(s)');
    }

    setTimeout(() => {
      navigate(0);
    }, 1000);

  };

  const filtered = useMemo(() => {
    return expenses
      .filter(exp => {
        const date = new Date(exp.date);
        return (
          exp.title.toLowerCase().includes(search.toLowerCase()) &&
          (categoryFilter === 'All' || exp.category === categoryFilter) &&
          (monthFilter === 'All' || date.toLocaleString('default', { month: 'long' }) === monthFilter) &&
          (yearFilter === 'All' || date.getFullYear().toString() === yearFilter) &&
          (groupFilter === 'All' || (exp.group?.trim() || 'Ungrouped') === groupFilter)
        );
      })
      .sort((a, b) => {
        if (sortKey === 'amount') return sortAsc ? a.amount - b.amount : b.amount - a.amount;
        if (sortKey === 'title') return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        if (sortKey === 'upload') return sortAsc ? getUploadTimestamp(a._id) - getUploadTimestamp(b._id) : getUploadTimestamp(b._id) - getUploadTimestamp(a._id);
        return sortAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      });
  }, [expenses, search, categoryFilter, monthFilter, yearFilter, groupFilter, sortKey, sortAsc]);

  useEffect(() => { setCurrentPage(1); }, [search, categoryFilter, monthFilter, yearFilter, groupFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRowClick = (e, id) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.type === 'checkbox') return;
    navigate(`/expenses/${id}`);
  };

  const years = useMemo(() => {
    const yearsSet = new Set(expenses.map(exp => new Date(exp.date).getFullYear()));
    return ['All', ...Array.from(yearsSet).sort((a, b) => b - a).map(String)];
  }, [expenses]);

  return (
    <div className="min-h-full bg-base-200 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">EXPENSES</h1>
        <Link to="/add-expense" className="btn lg:btn-wide btn-primary">
          <span className="text-md lg:text-lg font-bold">+ Add Expense</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-2 sticky top-16 bg-base-200 z-10 py-2">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-sm input-bordered w-auto md:w-[20%]"
        />

        <div className="grid grid-cols-2 md:flex gap-2 flex-wrap">
          {[{
            label: 'Group',
            value: groupFilter,
            onChange: setGroupFilter,
            options: groups
          }, {
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: categories
          }, {
            label: 'Month',
            value: monthFilter,
            onChange: setMonthFilter,
            options: monthNames
          }, {
            label: 'Year',
            value: yearFilter,
            onChange: setYearFilter,
            options: years
          }].map(({ label, value, onChange, options }) => (
            <div className="dropdown dropdown-hover" key={label}>
              <div tabIndex={0} className="btn btn-sm btn-outline btn-primary w-full">
                {label}: {value}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 max-h-60 overflow-auto z-20 whitespace-nowrap"
              >
                {options.map((o) => (
                  <li key={o}>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => {
                        onChange(o);
                        setTimeout(() => {
                          if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                          }
                        }, 0);
                      }}
                    >
                      {o}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-sm font-semibold bg-success text-base-100 px-3 py-2 rounded shadow text-center">
          Total: {formatCurrency(filtered.reduce((sum, e) => sum + e.amount, 0), currency)}
        </div>
      </div>

      <div className='flex flex-row justify-between items-center'>

        {/* Items per page */}
        <div className="flex justify-end items-center mb-2 mt-1">
          <label className="mr-2 text-sm">Rows:</label>
          <select className="select select-sm select-bordered w-20"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 15, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        {/* Bulk Delete Button */}
        {selectedExpenses.length > 0 && (
          <div className="flex justify-end mt-1">
            <button
              onClick={() => setExpenseToDelete('bulk')}
              className="btn btn-sm btn-error mb-2"
            >
              🗑 Delete Selected ({selectedExpenses.length})
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-base-100 shadow rounded overflow-x-auto">
        <Table className="table text-sm">
          <TableHeader className="bg-warning text-base-100 sticky top-0 z-10">
            <TableRow>
              <TableHead><input type="checkbox" checked={paginated.every((exp) => selectedExpenses.includes(exp._id))} onChange={toggleSelectAll} /></TableHead>
              <TableHead><button onClick={(e) => handleSort('title', e)} className="flex items-center md:w-[150px]">TITLE <ArrowUpDown className="ml-1 w-4 h-4" /></button></TableHead>
              <TableHead><button onClick={(e) => handleSort('amount', e)} className="flex items-center">AMT <ArrowUpDown className="ml-1 w-4 h-4" /></button></TableHead>
              <TableHead><button onClick={(e) => handleSort('date', e)} className="flex items-center">DATE <ArrowUpDown className="ml-1 w-4 h-4" /></button></TableHead>
              <TableHead><button onClick={(e) => handleSort('upload', e)} className="flex items-center">UPLOADED <ArrowUpDown className="ml-1 w-4 h-4" /></button></TableHead>
              <TableHead className="hidden sm:table-cell">CATEGORY</TableHead>
              <TableHead className="hidden sm:table-cell">GROUP</TableHead>
              <TableHead className="text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <tr>
                <td colSpan="8">
                  <div className="flex flex-col items-center justify-center h-60 text-neutral opacity-70 gap-2">
                    <span className="loading loading-spinner text-primary w-10 h-10"></span>
                    <p className="text-primary text-md lg:text-lg">Loading expenses...</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              paginated.map(exp => (
                <TableRow key={exp._id} onClick={(e) => handleRowClick(e, exp._id)} className="hover:bg-base-200 cursor-pointer">
                  <TableCell>
                    <input type="checkbox" checked={selectedExpenses.includes(exp._id)} onClick={(e) => e.stopPropagation()} onChange={() => toggleSelect(exp._id)} />
                  </TableCell>
                  <TableCell>{exp.title}</TableCell>
                  <TableCell className="text-success font-medium">{formatCurrency(exp.amount, currency)}</TableCell>
                  <TableCell>{formatDate(exp.date)}</TableCell>
                  <TableCell>{getUploadDateFromId(exp._id)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{exp.category}</TableCell>
                  <TableCell className="hidden sm:table-cell">{exp.group || '---'}</TableCell>
                  <TableCell className="flex gap-1 justify-center" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/expenses/${exp._id}/edit`} className="btn btn-xs btn-outline btn-info"><Pencil size={14} /></Link>
                    <button onClick={() => setExpenseToDelete(exp)} className="btn btn-xs btn-outline btn-error"><Trash2 size={14} /></button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="flex flex-col items-center justify-center h-60 text-neutral opacity-70">
                    <Wallet className="h-10 w-10 mb-2 text-primary" />
                    <p className="text-primary text-md lg:text-lg">No expenses found</p>
                  </div>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join">
            <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="join-item btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>Next</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-base-100 p-6 rounded-lg shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-error">Confirm Deletion</h2>
            {expenseToDelete === 'bulk' ? (
              <p className="mb-4">Are you sure you want to delete <strong>{selectedExpenses.length}</strong> selected expenses?</p>
            ) : (
              <p className="mb-4">Are you sure you want to delete <strong>{expenseToDelete.title}</strong>?</p>
            )}
            <div className="flex justify-end gap-2">
              <button className="btn btn-sm btn-ghost" onClick={() => setExpenseToDelete(null)}>Cancel</button>
              <button className="btn btn-sm btn-error" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
