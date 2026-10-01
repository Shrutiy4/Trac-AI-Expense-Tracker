import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts'
import api from '../lib/axios'
import { toast } from 'react-hot-toast'
import { formatCurrency } from '../utils/formatCurrency.js'

const COLORS = [
  '#4E79A7', '#F28E2B', '#76B7B2', '#E15759',
  '#59A14F', '#EDC949', '#AF7AA1', '#FF9DA7'
]

const Dashboard = () => {
  const navigate = useNavigate()
  const [monthlyBudget, setMonthlyBudget] = useState(null)
  const [weeklyBudget, setWeeklyBudget] = useState(null)
  const [showModal, setShowModal] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [todaySpent, setTodaySpent] = useState(0)
  const [thisMonthSpent, setThisMonthSpent] = useState(0)
  const [thisWeekSpent, setThisWeekSpent] = useState(0)
  const [recentExpenses, setRecentExpenses] = useState([])
  const [pieData, setPieData] = useState([])
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "INR")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/login')

    const fetchData = async () => {
      try {
        const [summaryRes, pieRes, budgetRes] = await Promise.all([
          api.get('/dashboard/summary', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/dashboard/category-breakdown', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/user/budget', { headers: { Authorization: `Bearer ${token}` } })
        ])
        setTodaySpent(summaryRes.data.today)
        setThisWeekSpent(summaryRes.data.thisWeek)
        setThisMonthSpent(summaryRes.data.thisMonth)
        setRecentExpenses(summaryRes.data.recent)
        setPieData(pieRes.data)
        setWeeklyBudget(budgetRes.data.weeklyBudget)
        setMonthlyBudget(budgetRes.data.monthlyBudget)
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const saveBudget = async () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) return toast.error('Please enter a valid number')

    const field = showModal === 'monthly' ? 'monthlyBudget' : 'weeklyBudget'

    try {
      const res = await api.put('/user/budget', {
        [field]: value
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      if (field === 'monthlyBudget') setMonthlyBudget(res.data.monthlyBudget)
      else setWeeklyBudget(res.data.weeklyBudget)

      setShowModal(null)
      setInputValue('')
      toast.success(`${showModal === 'monthly' ? 'Monthly' : 'Weekly'} budget saved!`)
    } catch (err) {
      console.error('Failed to save budget:', err)
      toast.error('Failed to save budget')
    }
  }

  const handleRemove = async (field) => {
    try {
      await api.put('/user/budget', {
        [field]: null
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (field === 'monthlyBudget') setMonthlyBudget(null)
      else setWeeklyBudget(null)
      toast.success(`${field === 'monthlyBudget' ? 'Monthly' : 'Weekly'} budget removed!`)
    } catch (err) {
      console.error('Failed to remove budget:', err)
      toast.error('Failed to remove budget')
    }
  }

  const getBudgetStatus = (spent, budget) => {
    if (!budget) return null
    const percent = (spent / budget) * 100
    if (percent >= 100) return 'over'
    if (percent >= 80) return 'warning'
    return 'ok'
  }

  const monthlyStatus = getBudgetStatus(thisMonthSpent, monthlyBudget)
  const weeklyStatus = getBudgetStatus(thisWeekSpent, weeklyBudget)

  return (
    <div className="min-h-full bg-base-200 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">DASHBOARD</h1>
        <Link to="/add-expense" className="btn lg:btn-wide btn-primary">
          <span className="text-md lg:text-lg font-bold">+ Add Expense</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {loading ? (
          Array(3).fill(0).map((_, idx) => (
            <div key={idx} className="card bg-base-100 shadow-sm p-4">
              <div className="space-y-2">
                <div className="skeleton h-4 w-1/3"></div>
                <div className="skeleton h-6 w-1/2"></div>
              </div>
            </div>
          ))
        ) : ([
          { title: 'Today', amount: formatCurrency(todaySpent, currency), color: 'text-warning' },
          { title: 'This Week', amount: formatCurrency(thisWeekSpent, currency), color: 'text-accent' },
          { title: 'This Month', amount: formatCurrency(thisMonthSpent, currency), color: 'text-primary' },
        ].map((item, idx) => (
          <div key={idx} className="card bg-base-100 shadow-sm p-2">
            <div className="card-body p-4">
              <h2 className="text-md font-semibold">{item.title}</h2>
              <p className={`text-xl font-bold ${item.color}`}>{item.amount}</p>
            </div>
          </div>
        )))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetCard
          title="Weekly Budget"
          budget={weeklyBudget}
          spent={thisWeekSpent}
          status={weeklyStatus}
          onEdit={() => setShowModal('weekly')}
          onRemove={() => handleRemove('weeklyBudget')}
          currency={currency}
        />

        <BudgetCard
          title="Monthly Budget"
          budget={monthlyBudget}
          spent={thisMonthSpent}
          status={monthlyStatus}
          onEdit={() => setShowModal('monthly')}
          onRemove={() => handleRemove('monthlyBudget')}
          currency={currency}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center mb-2">
              <h2 className="card-title text-accent">Categories this Month</h2>
              <Link to="/insights" className="link link-hover text-sm text-primary">Smart Insights→</Link>
            </div>
            <div className="h-[270px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="skeleton h-48 w-48 rounded-full"></div>
                </div>
              ) : pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-sm md:text-lg text-base-content/70">
                  No expense data available for this month.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center mb-2">
              <h2 className="card-title text-accent">Recent Expenses</h2>
              <Link to="/expenses" className="link link-hover text-sm text-primary">Expenses→</Link>
            </div>
            {loading ? (
              <ul className="space-y-2">
                {Array(4).fill(0).map((_, i) => (
                  <li key={i} className="skeleton h-10 rounded-md"></li>
                ))}
              </ul>
            ) : recentExpenses.length > 0 ? (
              <ul className="divide-y divide-accent">
                {recentExpenses.map(exp => (
                  <li key={exp.id}>
                    <Link
                      to={`/expenses/${exp.id}`}
                      className="py-2 flex justify-between items-center hover:bg-base-300 px-4 rounded-lg transition-colors duration-150"
                    >
                      <div className="flex flex-col">
                        <p className="font-medium text-base-content">{exp.title}</p>
                        <p className="text-sm text-primary">{exp.date}</p>
                      </div>
                      <p className="text-right text-warning font-semibold min-w-fit">{formatCurrency(exp.amount, currency)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex items-center justify-center text-sm md:text-lg text-base-content/70">
                No recent expenses found.
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Set {showModal === 'weekly' ? 'Weekly' : 'Monthly'} Budget</h3>
            <input
              type="number"
              className="input input-bordered w-full mt-4"
              placeholder={`Enter ${showModal} budget in ${currency}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn btn-primary" onClick={saveBudget}>Save</button>
              <button className="btn" onClick={() => setShowModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const BudgetCard = ({ title, budget, spent, status, onEdit, onRemove, currency }) => (
  <div className="card bg-base-100 shadow-sm p-4 h-full">
    <div className="flex flex-col h-full">
      <div>
        <h2 className="text-lg font-semibold text-primary mb-2">{title}</h2>
        {budget ? (
          <>
            <p>
              You've spent <span className="font-semibold">{formatCurrency(spent, currency)}</span> out of <span className="font-semibold">{formatCurrency(budget, currency)}</span>
            </p>
            <progress
              className={`progress w-full mt-1 ${
                status === 'over' ? 'progress-error' :
                status === 'warning' ? 'progress-warning' :
                'progress-success'
              }`}
              value={spent}
              max={budget}
            />
            {status === 'warning' && (
              <p className="mt-1 text-warning text-sm">⚠️ You're nearing your budget!</p>
            )}
            {status === 'over' && (
              <p className="mt-1 text-error text-sm">😬💸 You've exceeded your budget!</p>
            )}
          </>
        ) : (
          <p className="text-base-content/80">No budget set.</p>
        )}
      </div>

      <div className="mt-auto flex gap-2 pt-2 self-end">
        <button className="btn btn-sm btn-outline btn-accent" onClick={onEdit}>
          {budget ? 'Edit Budget' : 'Set Budget'}
        </button>
        {budget && (
          <button className="btn btn-sm btn-outline btn-error" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
    </div>
  </div>
)

export default Dashboard
