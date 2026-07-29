import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';

export default function ProjectionChart({ data }) {
  if (!data || data.length === 0) return <div className="p-4 text-center text-slate-500">No data</div>;

  const formatXAxis = (tickItem) => {
    return new Date(tickItem).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
          <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip 
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          
          {/* Confidence Band */}
          <Area type="monotone" dataKey="upper" stroke="none" fill="#E84B1E" fillOpacity={0.15} />
          <Area type="monotone" dataKey="lower" stroke="none" fill="#1e293b" fillOpacity={1} />

          {/* Lines */}
          <Line type="monotone" dataKey="actual" stroke="#ffffff" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="projected" stroke="#E84B1E" strokeWidth={2} strokeDasharray="6 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}