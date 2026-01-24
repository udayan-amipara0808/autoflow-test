import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import WalletConnect from '../shared/WalletConnect';
import { Bell, Menu } from 'lucide-react';
import Toast from '../shared/Toast';
import { useToast } from '../../hooks/useToast';

const Header = ({ onMenuClick }) => {
  // Header is now sticky at top of the main content column
  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-md border-b border-dark-800 h-16 flex items-center justify-between px-4 md:px-8 w-full">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Hamburger menu for mobile */}
        <button
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        <h1 className="text-sm md:text-lg font-bold text-white truncate">AutoFlow</h1>
        <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-mono border border-primary-500/20">
          v1.0.0-beta
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-300">Monad Testnet</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-dark-900"></span>
        </button>

        <div className="hidden md:block h-8 w-px bg-dark-700"></div>

        <WalletConnect />
      </div>
    </header>
  );
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();

  return (
    // Outer container is a Flex Row
    <div className="flex h-screen bg-dark-950 text-gray-100 font-sans selection:bg-primary-500/30 overflow-hidden">

      {/* Sidebar is a flex item on desktop (static), fixed overlay on mobile */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Column - Flex Grow */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fade-in pb-12">
            <Outlet context={{ showToast }} />
          </div>
        </main>
      </div>

      <Toast toasts={toasts} dismissToast={dismissToast} />
    </div>
  );
};

export default MainLayout;
