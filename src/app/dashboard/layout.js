'use client';

import Sidebar from '@/components/ui/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 transition-all duration-300 ml-64">
        {children}
      </main>
    </div>
  );
}
