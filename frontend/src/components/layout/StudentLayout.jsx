import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#080E1C] transition-colors">
      <Sidebar role="student" />
      <div className="pl-64 flex flex-col min-h-screen">
        <TopNav currentRole="student" />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
