import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#F97316', '#10B981', '#3B82F6', '#EAB308', '#8B5CF6', '#EF4444'];

export default function PieChartComponent({ data }) {
  if (!data || data.length === 0) return <p className="text-sm text-center text-primary">No category data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RePieChart>
        <Pie data={data} dataKey="amount" nameKey="category" outerRadius={90} fill="#8884d8" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
}
