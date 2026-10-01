import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function LineChartComponent({ data }) {
  if (!data || data.length === 0)
    return <p className="text-sm text-center text-primary">No daily trend data available.</p>;

  // Sort data by date ascending
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <ReLineChart data={sortedData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line dataKey="amount" stroke="#3B82F6" />
      </ReLineChart>
    </ResponsiveContainer>
  );
}
