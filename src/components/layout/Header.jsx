import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiLogOut, FiMenu, FiX, FiAlertCircle, FiCamera } = FiIcons;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut, isAdmin, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/client', icon: FiUser, adminOnly: false },
    { name: 'Wedding Form', href: '/form', icon: FiCamera, adminOnly: false },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: FiUser, adminOnly: true }] : [])
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-sage-100">
      {/* Configuration Warning */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-yellow-800 text-sm">
            <SafeIcon icon={FiAlertCircle} className="h-4 w-4" />
            <span>Demo Mode: Configure Supabase environment variables for full functionality</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/client" className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Sky Photography Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <SafeIcon 
              icon={FiCamera} 
              className="h-8 w-8 text-sky-600 hidden" 
            />
            <span className="font-oswald text-xl font-semibold text-sage-800">
              Sky Photography
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.href || location.pathname.startsWith(item.href)
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-sage-600 hover:text-sky-600 hover:bg-sky-50'
                }`}
              >
                <SafeIcon icon={item.icon} className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-sage-700">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-sage-500">
                    {profile?.role === 'admin' ? 'Administrator' : 'Client'}
                    {!isSupabaseConfigured && ' (Demo)'}
                  </p>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 text-sage-500 hover:text-sky-600 transition-colors"
                  title="Sign out"
                >
                  <SafeIcon icon={FiLogOut} className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-sage-600 hover:text-sky-600 transition-colors"
            >
              <SafeIcon icon={mobileMenuOpen ? FiX : FiMenu} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-sage-100"
        >
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.href || location.pathname.startsWith(item.href)
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-sage-600 hover:text-sky-600 hover:bg-sky-50'
                }`}
              >
                <SafeIcon icon={item.icon} className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}

            {user && (
              <div className="pt-4 border-t border-sage-100 mt-4">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-sage-700">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-sage-500">
                    {profile?.role === 'admin' ? 'Administrator' : 'Client'}
                    {!isSupabaseConfigured && ' (Demo)'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-sage-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;