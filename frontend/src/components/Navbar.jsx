import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  CreditCard,
  BarChart3,
  Settings as SettingsIcon,
  LayoutDashboardIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import tracs from '../assets/tracs.png';
import tracs_dark from '../assets/tracs_dark.png';
import tracs_short from '../assets/tracs_short.png';

const navItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboardIcon size={20} /> },
  { name: "Expenses", path: "/expenses", icon: <CreditCard size={20} /> },
  { name: "Smart Insights", path: "/insights", icon: <BarChart3 size={20} /> },
  { name: "Settings", path: "/settings", icon: <SettingsIcon size={20} /> },
];

const Navbar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'autumn'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const logo = theme === 'halloween' ? tracs_dark : tracs;

  return (
    <div className="flex lg:flex-row h-screen w-full">
      {/* Sidebar */}
      <div
        className={`hidden lg:flex flex-col h-screen bg-base-100 shadow-md transition-all duration-300 ${
          collapsed ? "w-20 items-center px-4" : "w-60 items-start px-4"
        }`}
      >
        {/* Toggle Button */}
        <div className="w-full flex justify-end py-2">
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Logo */}
        <div className="mb-6 w-full flex justify-center">
          {!collapsed ? (
            <img src={logo} alt="App Logo" className="w-25 mx-auto" />
          ) : (
            <img src={tracs_short} alt="App Logo" className="w-24" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 w-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  collapsed ? "justify-center" : "justify-start gap-3"
                } w-full px-2 py-2 rounded-lg transition-all font-medium ${
                  isActive ? "bg-primary text-primary-content" : "text-base-content hover:bg-base-300"
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-base-200">

        {/* Mobile Topbar */}
        <div className="lg:hidden bg-base-100 shadow-md p-2 border-b sticky top-0 z-40 text-center">
          <img src={logo} alt="App Logo" className="w-24 mx-auto" />
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 pb-20 lg:pb-4">
          <Outlet />
        </div>

        {/* Bottom Navbar for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 shadow-inner border-t p-1 flex justify-around z-50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`btn btn-ghost flex flex-col items-center gap-1 text-xs ${
                  isActive ? "bg-primary text-primary-content" : "text-base-content"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
