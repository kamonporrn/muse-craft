'use client';

import Topbar from '@/components/artist+writer/Topbar';
import Sidebar from '@/components/artist+writer/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6e9ff]">
      <Topbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}