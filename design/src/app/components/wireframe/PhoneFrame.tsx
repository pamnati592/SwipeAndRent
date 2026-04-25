import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  title: string;
  active?: boolean;
}

export default function PhoneFrame({ children, title, active = true }: PhoneFrameProps) {
  return (
    <div className="flex flex-col">
      {/* Title */}
      <div className={`text-sm mb-3 font-medium ${active ? 'text-neutral-300' : 'text-neutral-500'}`}>
        {title}
      </div>
      
      {/* Phone Container - iPhone 14 size (390x844) */}
      <div className={`relative bg-neutral-800 rounded-[40px] p-3 border-4 ${active ? 'border-neutral-700' : 'border-neutral-800'} transition-colors`}
           style={{ width: '390px', height: '844px' }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-neutral-900 rounded-b-3xl z-10" />
        
        {/* Screen */}
        <div className="relative w-full h-full bg-neutral-800 rounded-[32px] overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 z-20">
            <div className="text-xs text-neutral-500">9:41</div>
            <div className="flex items-center gap-1">
              <div className="text-xs text-neutral-500">●●●●</div>
              <div className="w-4 h-3 border border-neutral-500 rounded-sm" />
            </div>
          </div>

          {/* Content */}
          <div className="pt-12 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
