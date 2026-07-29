import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DonutChart({ data, centerText, colors }) {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-500">No data available</div>;

  return (
    <div className="h-60 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="stage" // Can be 'stage' or 'source' based on data
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} 
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="text-2xl font-bold text-white">{centerText}</span>
          </div>
        </div>
      )}
      
      {/* Custom Legend */}
      <div className="flex flex-col gap-2 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></span>
              <span className="text-gray-300 capitalize">{entry.stage || entry.source}</span>
            </div>
            <div className="text-white font-medium">
              {entry.count} <span className="text-gray-500 ml-1">({entry.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
