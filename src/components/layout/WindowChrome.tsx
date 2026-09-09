import React from 'react';

export const WindowChromeDots: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="traffic-dot bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs" title="Close" />
      <span className="traffic-dot bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs" title="Minimize" />
      <span className="traffic-dot bg-[#27c93f] border border-[#1aab29]/40 shadow-xs" title="Expand" />
    </div>
  );
};
