import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Server, CreditCard, BarChart3, Settings, ChevronLeft, ChevronRight, X } from 'lucide-react';
import logo from '../../assets/logo.png';

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ListTodo, label: 'Tasks', path: '/tasks' },
    { icon: Server, label: 'Nodes', path: '/nodes' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const getSidebarClass = () => {
    const base = "fixed left-0 top-0 h-screen bg-dark-900 border-r border-dark-800 transition-all duration-300 z-40 flex flex-col ";
    const width = collapsed ? 'w-20' : 'w-64';
    // Mobile: hidden by default, shown when mobileOpen is true
    const mobileVisibility = mobileOpen ? 'translate-x-0' : '-translate-x-full';
    return base + width + " lg:translate-x-0 " + mobileVisibility;
  };

  const getLinkClass = (isActive) => {
    const base = "flex items-center px-3 py-3 rounded-lg transition-all group ";
    return base + (isActive ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:bg-dark-800 hover:text-white');
  };

  const handleNavClick = () => {
    // Close mobile menu when a link is clicked
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={getSidebarClass()}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-dark-800">
          <div className="flex items-center">
            {/* Logo Image */}
            <img
              src={logo}
              alt="AutoFlow Logo"
              className="w-8 h-8 rounded-lg flex-shrink-0 object-cover"
            />
            {!collapsed && (
              <span className="ml-3 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                AutoFlow
              </span>
            )}
          </div>
          {/* Mobile close button */}
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <item.icon size={20} className={collapsed ? "mx-auto" : "mr-3"} />
              {!collapsed && <span className="font-medium">{item.label}</span>}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-20 bg-dark-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-dark-700 ml-2">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle - hidden on mobile */}
        <div className="p-4 border-t border-dark-800 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
