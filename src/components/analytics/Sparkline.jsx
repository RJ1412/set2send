import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function Sparkline({ data, positive }) {
  if (!data || data.length === 0) return null;

  const color = positive ? '#4ade80' : '#f87171'; // Tailwind green-400 and red-400

  return (
    <div className="h-6 w-16 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5} 
            dot={false} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
