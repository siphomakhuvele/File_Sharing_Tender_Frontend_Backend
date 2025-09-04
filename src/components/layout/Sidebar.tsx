import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  FileText, 
  Users, 
  Gavel, 
  Bell, 
  Settings, 
  LogOut,
  BarChart3,
  Search,
  Upload,
  Download,
  Eye
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import clsx from 'clsx';

const getNavigationItems = (role: string) => {
  const baseItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
  ];

  switch (role) {
    case 'admin':
      return [
        ...baseItems,
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: FileText, label: 'All Tenders', path: '/admin/tenders' },
        { icon: Gavel, label: 'All Bids', path: '/admin/bids' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: Eye, label: 'Audit Logs', path: '/admin/audit' },
      ];
    case 'bidder':
      return [
        ...baseItems,
        { icon: Search, label: 'Browse Tenders', path: '/bidder/tenders' },
        { icon: Gavel, label: 'My Bids', path: '/bidder/bids' },
        { icon: Download, label: 'Downloads', path: '/bidder/downloads' },
      ];
    case 'issuer':
      return [
        ...baseItems,
        { icon: FileText, label: 'My Tenders', path: '/issuer/tenders' },
        { icon: Upload, label: 'Create Tender', path: '/issuer/create' },
        { icon: Gavel, label: 'Received Bids', path: '/issuer/bids' },
      ];
    default:
      return baseItems;
  }
};

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navigationItems = getNavigationItems(user.role);

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">TenderPro</h1>
        <p className="text-sm text-gray-600 mt-1">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings and Logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};