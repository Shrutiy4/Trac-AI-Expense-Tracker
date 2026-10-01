import React, { useEffect, useState } from 'react'
import PieChartComponent from '../components/charts/PieChartComponent'
import LineChartComponent from '../components/charts/LineChartComponent'
import BarChartComponent from '../components/charts/BarChartComponent'
import InsightsPanel from '../components/InsightsPanel'
import api from '../lib/axios'
import { useNavigate } from 'react-router-dom'

const SmartInsights = () => {
  const navigate = useNavigate()

  const tips = [
    "💡 Tip: Setting a weekly budget can help curb impulse purchases.",
    "💡 Tip: Group similar expenses to spot overspending patterns.",
    "💡 Tip: Avoid emotional purchases by waiting 24 hours before buying.",
    "💡 Tip: Log your cash expenses too — they add up silently.",
    "💡 Tip: Categorize expenses to improve your saving strategy.",
    "💡 Tip: Compare monthly trends to evaluate progress over time.",
  ];


  const [randomTip] = useState(() => {
    const index = Math.floor(Math.random() * tips.length);
    return tips[index];
  });


  const [pieData, setPieData] = useState([])
  const [lineData, setLineData] = useState([])
  const [barData, setBarData] = useState([])
  const [insights, setInsights] = useState('Loading AI suggestions...')

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [pieYear, setPieYear] = useState(currentYear);
  const [lineMonth, setLineMonth] = useState(currentMonth);
  const [lineYear, setLineYear] = useState(currentYear);
  const [barYear, setBarYear] = useState(currentYear);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [pieRes, lineRes, barRes, allExpensesRes] = await Promise.all([
          api.get(`/analytics/category-this-year?year=${pieYear}`, { headers }),
          api.get(`/analytics/daily-this-month?month=${lineMonth}&year=${lineYear}`, { headers }),
          api.get(`/analytics/monthly-this-year?year=${barYear}`, { headers }),
          api.get('/expenses', { headers })
        ]);


        setPieData(pieRes.data);
        setLineData(lineRes.data);
        setBarData(barRes.data);

        generateAISuggestions(allExpensesRes.data, headers);
      } catch (err) {
        console.error('Error fetching analytics or expenses:', err);
        setInsights(['Error fetching data. Please try again later.']);
      }
    };

    const generateAISuggestions = async (expenses, headers) => {
      try {
        const res = await api.post('/ai/suggestions', { expenses }, { headers });
        const text = res.data.suggestions || 'No insights available.';

        const suggestionsArray = text.split('\n').filter(line =>
          line.trim() && (line.startsWith('-') || line.startsWith('•') || line.startsWith('🔹') || line.match(/^\d+[.)]/))
        );

        setInsights(suggestionsArray.length > 0 ? suggestionsArray : [text]);
      } catch (err) {
        console.error('Error generating AI suggestions:', err);
        setInsights(['Failed to generate AI suggestions.']);
      }
    };

    fetchData();
  }, [navigate, pieYear, lineMonth, lineYear, barYear]);


  return (
    <div className="p-6 bg-base-200 min-h-full space-y-6">
      {/* Page Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">SMART INSIGHTS</h1>
        <p className="text-sm text-base-content/80 mt-1">
          Visualize your expenses and gain actionable AI suggestions to save more.
        </p>
      </div>

      {/* Tip Box */}
      <div className="bg-warning text-warning-content px-4 py-2 rounded-md text-center font-medium shadow">
        {randomTip}
      </div>

      {/* Graph Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="bg-base-100 p-4 rounded-xl shadow w-full lg:w-1/3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-base">Spending by Category</h2>
            <select className="select select-sm" value={pieYear} onChange={(e) => setPieYear(parseInt(e.target.value))}>
              {[...Array(5)].map((_, idx) => {
                const y = currentYear - idx;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>

          <PieChartComponent data={pieData} />
        </div>

        <div className="bg-base-100 p-4 rounded-xl shadow w-full lg:w-1/3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-base">Daily Expense Trend</h2>
            <div className="flex gap-0">
              <select className="select select-sm" value={lineMonth} onChange={(e) => setLineMonth(parseInt(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                ))}
              </select>
              <select className="select select-sm" value={lineYear} onChange={(e) => setLineYear(parseInt(e.target.value))}>
                {[...Array(5)].map((_, idx) => {
                  const y = currentYear - idx;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
            </div>
          </div>

          <LineChartComponent data={lineData} />
        </div>

        <div className="bg-base-100 p-4 rounded-xl shadow w-full lg:w-1/3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-base">Monthly Overview</h2>
            <select className="select select-sm" value={barYear} onChange={(e) => setBarYear(parseInt(e.target.value))}>
              {[...Array(5)].map((_, idx) => {
                const y = currentYear - idx;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>

          <BarChartComponent data={barData} />
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-base-100 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-primary mb-4">AI-Powered Suggestions 💡</h2>
        <InsightsPanel suggestions={insights} />
      </div>
    </div>
  )
}

export default SmartInsights
