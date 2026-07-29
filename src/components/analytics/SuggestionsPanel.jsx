import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuggestionsPanel({ suggestions, onRegenerate, loading }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl border border-white/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Growth Opportunities
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/10 text-purple-300 border border-purple-500/30">
              ✦ Powered by Gemini
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Based on your recent performance data.</p>
        </div>
        <button 
          onClick={onRegenerate} 
          disabled={loading}
          className="text-sm px-4 py-2 bg-white/5 border border-white/10 rounded-lg shadow-sm font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Regenerate'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestions.map((sug, i) => (
          <div key={i} className="bg-black/20 backdrop-blur-md rounded-xl p-5 border border-white/5 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold uppercase text-purple-400 tracking-wider">{sug.category}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sug.estimatedImpact === 'high' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                {sug.estimatedImpact} impact
              </span>
            </div>
            <h3 className="font-bold text-white mb-2 leading-tight">{sug.title}</h3>
            <p className="text-sm text-gray-300 flex-1 mb-4 leading-relaxed">{sug.description}</p>
            <button 
              onClick={() => navigate(sug.actionRoute || '/dashboard')}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-colors text-sm shadow-md"
            >
              {sug.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}