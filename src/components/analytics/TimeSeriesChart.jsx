import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TimeSeriesChart({ data }) {
  if (!data || data.length === 0) return <div className="p-4 text-center text-slate-500">No data</div>;

  const formatXAxis = (tickItem) => {
    return new Date(tickItem).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E84B1E" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#E84B1E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis dataKey="date" tickFormatter={formatXAxis} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
          <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip 
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="value" stroke="#E84B1E" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={false} activeDot={{r: 4}} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}