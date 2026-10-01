import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Accepting both "Jan", "Feb", ..., "Dec" format
const MONTH_ORDER = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export default function BarChartComponent({ data }) {
  if (!data || data.length === 0)
    return <p className="text-sm text-center text-primary">No monthly data available.</p>;

  const sortedData = [...data].sort((a, b) => {
    const [aMonthAbbrev] = a.month.split(" ");
    const [bMonthAbbrev] = b.month.split(" ");
    return MONTH_ORDER[aMonthAbbrev] - MONTH_ORDER[bMonthAbbrev];
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <ReBarChart data={sortedData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#F97316" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
