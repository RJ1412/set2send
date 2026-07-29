import React from 'react';
import Sparkline from './Sparkline';

export default function MetricCard({ title, value, delta, suffix = '', sparklineData = [] }) {
  const isPositive = delta !== null && delta > 0;
  const isNegative = delta !== null && delta < 0;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-white">
            {value}{suffix}
          </div>
          {delta !== null ? (
            <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-500/20 text-green-400' : isNegative ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {isPositive ? '↑' : isNegative ? '↓' : ''} {Math.abs(delta).toFixed(1)}%
            </div>
          ) : (
            <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
              New
            </div>
          )}
        </div>
      </div>
      
      <Sparkline data={sparklineData} positive={!isNegative} />
    </div>
  );
}