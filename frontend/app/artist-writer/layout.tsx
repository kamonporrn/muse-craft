'use client';

import Topbar from '@/components/artist+writer/Topbar';
import Sidebar from '@/components/artist+writer/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6e9ff]">
      <Topbar />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 ml-8 px-16 pt-8 pb-2">
          {children}
        </main>
      </div>
    </div>
  );
}
