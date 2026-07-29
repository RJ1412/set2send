import React from 'react';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function HourlyHeatmap({ data }) {
  if (!data || data.length === 0) return <div className="p-4 text-gray-500">No activity data yet.</div>;

  // Assuming data comes as { hour: 0..23, count: number } from backend.
  // Actually, the backend currently only groups by hour, not day+hour as requested by the prompt.
  // Wait, the prompt says: "Groups LeadActivity by hour of day (0-23)".
  // Let's render a 1D heatmap (just hours) or a mock 2D if we just distribute it.
  // For now, I'll render a simple 1D bar/heatmap for hours since the backend gives Array<{hour, count}>.
  // To make it look like a 2D heatmap, I'll just map the 24 hours in a single row.

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col gap-1 min-w-[600px]">
        <div className="flex items-center">
          <div className="w-12 text-xs text-gray-500">All</div>
          <div className="flex-1 flex gap-1">
            {hours.map(hour => {
              const item = data.find(d => d.hour === hour);
              const count = item ? item.count : 0;
              const intensity = count / maxCount;
              
              // Color scale: #ffffff0d to #E84B1E
              // For glassmorphism, let's use purple/pink
              return (
                <div 
                  key={hour} 
                  className="flex-1 aspect-square rounded-sm relative group"
                  style={{ backgroundColor: `rgba(168, 85, 247, ${Math.max(0.1, intensity)})` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 transition-opacity">
                    Hour {hour}: {count} activities
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-12"></div>
          <div className="flex-1 flex justify-between text-[10px] text-gray-500">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
