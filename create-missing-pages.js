const fs = require('fs');
const path = require('path');

const pages = [
  { route: 'bulk-messages', title: 'Bulk messages', icon: 'MessageCircle' },
  { route: 'comment-replies', title: 'Comment replies', icon: 'MessageSquare' },
  { route: 'story-replies', title: 'Story replies', icon: 'ImageIcon' },
  { route: 'keywords', title: 'Keyword triggers', icon: 'Key' },
  { route: 'settings', title: 'Settings', icon: 'Settings' },
  { route: 'campaigns', title: 'Campaigns', icon: 'Megaphone' },
  { route: 'flows', title: 'Visual flows', icon: 'GitBranch' }
];

const dashboardDir = path.join(__dirname, 'src', 'app', 'dashboard');

pages.forEach(({ route, title, icon }) => {
  const dirPath = path.join(dashboardDir, route);
  const filePath = path.join(dirPath, 'page.tsx');
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  if (!fs.existsSync(filePath)) {
    const importIcon = icon === 'ImageIcon' ? 'Image as ImageIcon' : icon;
    
    const content = `"use client";

import React from "react";
import { ${importIcon} } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col h-full bg-[#f5f3ef]">
      <header className="hidden md:flex items-center justify-between px-[24px] py-[16px] bg-white border-b border-[#e8e5de]">
        <div>
          <h1 className="text-[14px] font-medium text-[#1a1a18]">${title}</h1>
          <p className="text-[11.5px] text-[#888] mt-[1px]">Manage your ${title.toLowerCase()}</p>
        </div>
      </header>
      
      <div className="flex-1 p-[20px] md:px-[24px] flex flex-col items-center justify-center text-center">
         <div className="w-[48px] h-[48px] rounded-[12px] bg-[#fff7ed] text-[#ea580c] flex items-center justify-center mb-[16px]">
            <${icon} className="w-[24px] h-[24px]" />
         </div>
         <h2 className="text-[16px] font-semibold text-[#1a1a18] mb-[8px]">Coming Soon</h2>
         <p className="text-[13px] text-[#888] max-w-[300px]">We are actively building the ${title} functionality. Check back later!</p>
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created ${filePath}`);
  } else {
    console.log(`Skipped ${filePath} (already exists)`);
  }
});
