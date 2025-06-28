import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, 
  FiUsers, 
  FiMail, 
  FiHelpCircle, 
  FiCalendar, 
  FiFileText,
  FiSettings,
  FiBarChart3
} = FiIcons;

const AdminSidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Client Management', href: '/admin/clients', icon: FiUsers },
    { name: 'Email Management', href: '/admin/emails', icon: FiMail },
    { name: 'FAQ Management', href: '/admin/faqs', icon: FiHelpCircle },
    { name: 'Meeting Scheduling', href: '/admin/meetings', icon: FiCalendar },
    { name: 'Form Drafting', href: '/admin/forms', icon: FiFileText },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sage-800 pt-20">
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="flex items-center px-6 py-4 border-b border-sage-700">
          <img 
            src="/logo.png" 
            alt="Sky Photography Logo" 
            className="h-8 w-8 object-contain mr-3"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <SafeIcon icon={FiHome} className="h-8 w-8 text-sky-400 mr-3 hidden" />
          <div>
            <h2 className="text-white font-oswald font-semibold">Admin Portal</h2>
            <p className="text-sage-300 text-sm">Sky Photography</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-lg'
                    : 'text-sage-300 hover:bg-sage-700 hover:text-white'
                }`}
              >
                <SafeIcon 
                  icon={item.icon} 
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-white' : 'text-sage-400 group-hover:text-white'
                  }`} 
                />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-sky-300 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sage-700">
          <p className="text-sage-400 text-xs">
            © 2024 Sky Photography
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;