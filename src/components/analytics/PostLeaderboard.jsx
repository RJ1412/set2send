import React, { useState } from 'react';

export default function PostLeaderboard({ posts }) {
  const [tab, setTab] = useState('top');

  if (!posts || posts.length === 0) return <div className="text-gray-500 py-4 text-center">No post data available.</div>;

  // Assuming posts are already sorted by leadsGenerated DESC.
  // We'll create top 5 and bottom 5 (sorted by conversion rate ASC)
  const topPosts = [...posts].slice(0, 5);
  const bottomPosts = [...posts].sort((a, b) => a.conversionRate - b.conversionRate).slice(0, 5);

  const displayPosts = tab === 'top' ? topPosts : bottomPosts;

  const renderBadge = (index, tab) => {
    if (tab === 'bottom') return <span className="text-xl">⚠️</span>;
    if (index === 0) return <span className="text-xl">🥇</span>;
    if (index === 1) return <span className="text-xl">🥈</span>;
    if (index === 2) return <span className="text-xl">🥉</span>;
    return <span className="text-gray-400 font-bold">#{index + 1}</span>;
  };

  return (
    <div className="w-full">
      <div className="flex border-b border-white/10 mb-4">
        <button 
          className={`px-4 py-3 font-semibold text-sm transition-colors ${tab === 'top' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTab('top')}
        >
          Top Performing
        </button>
        <button 
          className={`px-4 py-3 font-semibold text-sm transition-colors ${tab === 'bottom' ? 'text-red-400 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setTab('bottom')}
        >
          Needs Attention
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-black/20 text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3 min-w-[200px]">Post</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Leads</th>
              <th className="px-4 py-3">Open Rate</th>
              <th className="px-4 py-3">Conversion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayPosts.map((p, i) => (
              <tr key={p.postId} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 text-center">{renderBadge(i, tab)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/30 rounded flex items-center justify-center shrink-0">
                      {p.postThumbnail ? <img src={p.postThumbnail} alt="" className="w-full h-full object-cover rounded" /> : <span className="text-xs text-gray-500">Img</span>}
                    </div>
                    <div>
                      <div className="text-white font-medium line-clamp-1">{p.caption || `Post ${p.postId}`}</div>
                      <a href={p.postUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:underline">View on Instagram →</a>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-semibold">Reel</span>
                </td>
                <td className="px-4 py-4 font-bold text-white text-lg">{p.leadsGenerated}</td>
                <td className="px-4 py-4">{(p.openRate * 100).toFixed(1)}%</td>
                <td className={`px-4 py-4 font-semibold ${tab === 'bottom' ? 'text-red-400' : 'text-green-400'}`}>
                  {(p.conversionRate * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {tab === 'bottom' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-200">
          These posts generated leads but converted poorly. Consider editing their DM flow or adjusting the follow-up timing.
        </div>
      )}
    </div>
  );
}
