import React from 'react';

export default function FunnelChart({ data }) {
  if (!data || data.length === 0) return <div className="text-gray-500 text-center py-10">No funnel data available</div>;

  const maxCount = data[0].count || 1;
  const colors = ["#E84B1E", "#F07A57", "#F5A623", "#F5C842", "#4ADE80", "#1A7A4A"];

  return (
    <div className="flex flex-col items-center justify-center w-full h-[320px] py-4 relative">
      {data.map((stage, i) => {
        const widthPercent = Math.max((stage.count / maxCount) * 100, 5); // min 5% width
        const isLast = i === data.length - 1;
        
        return (
          <React.Fragment key={stage.stage}>
            <div 
              className="relative flex items-center justify-center transition-all duration-500 ease-in-out group"
              style={{ 
                width: `${widthPercent}%`, 
                height: '40px',
                backgroundColor: colors[i % colors.length],
                clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)',
                marginBottom: isLast ? '0' : '4px'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-between px-8 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="whitespace-nowrap bg-black/40 px-2 py-0.5 rounded">{stage.stage}</span>
                <span className="bg-black/40 px-2 py-0.5 rounded">{stage.count}</span>
              </div>
            </div>
            
            {!isLast && stage.dropOffPercent > 0 && (
              <div className="z-10 -my-2 bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                ▼ {stage.dropOffPercent.toFixed(1)}% drop ({stage.dropOffCount})
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}