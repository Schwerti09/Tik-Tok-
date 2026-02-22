import React from 'react';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeMap[size]} border-2 border-border border-t-primary rounded-full animate-spin`}
      />
      {text && <p className="text-muted text-sm">{text}</p>}
    </div>
  );
}
