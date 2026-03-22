// Layout.jsx
import { Outlet } from 'react-router-dom';
import HomeHeader from '../compomets/Header/HomeHeader';
import Sidebar from '../compomets/Sidebar/Sidebar';
import { useState } from 'react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem('role');
  const isUser = role === 'User' || role === null; 

  return (
    <div>
      <HomeHeader onMenuOpen={isUser ? () => setSidebarOpen(true) : null} />
      
      {isUser && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <main>
        <Outlet />
      </main>
    </div>
  );
}