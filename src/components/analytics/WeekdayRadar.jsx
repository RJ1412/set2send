import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function WeekdayRadar({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar name="New Leads" dataKey="count" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
          <Radar name="Conversions" dataKey="conversions" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
