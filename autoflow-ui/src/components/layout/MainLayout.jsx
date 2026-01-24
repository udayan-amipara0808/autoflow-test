import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import WalletConnect from '../shared/WalletConnect';
import { Bell } from 'lucide-react';
import Toast from '../shared/Toast';
import { useToast } from '../../hooks/useToast';

const Header = ({ collapsed }) => {
  const getHeaderClass = () => {
    const base = "fixed top-0 right-0 h-16 bg-dark-900/80 backdrop-blur-md border-b border-dark-800 z-30 transition-all duration-300 flex items-center justify-between px-8 ";
    return base + (collapsed ? 'left-20' : 'left-64');
  };

  return (
    <header className={getHeaderClass()}>
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium text-gray-200">Task Orchestration Network</h1>
        <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-mono border border-primary-500/20">
          v1.0.0-beta
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-300">Monad Mainnet</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-dark-900"></span>
        </button>

        <div className="h-8 w-px bg-dark-700"></div>

        <WalletConnect />
      </div>
    </header>
  );
};

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();

  const getMainClass = () => {
    const base = "pt-24 pb-12 px-8 transition-all duration-300 min-h-screen ";
    return base + (collapsed ? 'ml-20' : 'ml-64');
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 font-sans selection:bg-primary-500/30">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Header collapsed={collapsed} />

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
