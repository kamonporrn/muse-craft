'use client';

import React from 'react';
import Image from 'next/image';

const Topbar: React.FC = () => {
  return (
    <div className="h-16 bg-white shadow-[0_4px_4px_rgba(0,0,0,0.03)] w-full fixed top-0 left-0 z-50">
      <div className="h-full flex items-center justify-center">
        {/* Logo ตรงกลาง */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image 
              src="/logo.png" 
              alt="MuseCraft Logo" 
              width={100} 
              height={100} 
              className="object-contain" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;