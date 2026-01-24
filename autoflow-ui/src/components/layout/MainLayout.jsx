import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import WalletConnect from '../shared/WalletConnect';
import { Bell, Menu } from 'lucide-react';
import Toast from '../shared/Toast';
import { useToast } from '../../hooks/useToast';

const Header = ({ collapsed, onMenuClick }) => {
  const getHeaderClass = () => {
    const base = "fixed top-0 right-0 h-16 bg-dark-900/80 backdrop-blur-md border-b border-dark-800 z-30 transition-all duration-300 flex items-center justify-between px-4 md:px-8 ";
    // On large screens, account for sidebar width. On mobile, full width (left-0)
    return base + "left-0 lg:" + (collapsed ? 'left-20' : 'left-64');
  };

  return (
    <header className={getHeaderClass()}>
      <div className="flex items-center gap-2 md:gap-4">
        {/* Hamburger menu for mobile */}
        <button
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        <h1 className="text-sm md:text-lg font-medium text-gray-200 truncate">Task Orchestration Network</h1>
        <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-mono border border-primary-500/20">
          v1.0.0-beta
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-300">Monad Mainnet</span>
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

  const getMainClass = () => {
    const base = "pt-20 md:pt-24 pb-12 px-4 md:px-8 transition-all duration-300 min-h-screen ";
    // On large screens, add left margin for sidebar. On mobile, no margin
    return base + "lg:" + (collapsed ? 'ml-20' : 'ml-64');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 font-sans selection:bg-primary-500/30">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <Header collapsed={collapsed} onMenuClick={() => setMobileOpen(true)} />

      <main className={getMainClass()}>
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet context={{ showToast }} />
        </div>
      </main>

      <Toast toasts={toasts} dismissToast={dismissToast} />
    </div>
  );
};

export default MainLayout;
