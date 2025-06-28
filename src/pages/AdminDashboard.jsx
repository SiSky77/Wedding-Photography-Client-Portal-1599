import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dbHelpers } from '../lib/supabase';
import SafeIcon from '../components/common/SafeIcon';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUsers, 
  FiMail, 
  FiCalendar, 
  FiFileText, 
  FiTrendingUp, 
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight
} = FiIcons;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    completedForms: 0,
    scheduledMeetings: 0,
    pendingEmails: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [clients, meetings, emails] = await Promise.all([
        dbHelpers.getAllClients(),
        dbHelpers.getMeetings(),
        dbHelpers.getScheduledEmails()
      ]);

      const completedForms = clients.filter(client => {
        const completion = client.wedding_forms?.[0] 
          ? dbHelpers.calculateCompletionPercentage(client.wedding_forms[0].form_data) 
          : 0;
        return completion === 100;
      }).length;

      const upcomingMeetings = meetings.filter(m => 
        new Date(m.scheduled_for) >= new Date()
      ).length;

      const pendingEmails = emails.filter(e => e.status === 'scheduled').length;

      // Generate recent activity
      const recentActivity = [
        {
          id: 1,
          type: 'form_completed',
          message: 'Sarah & Michael completed their wedding form',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          icon: FiCheckCircle,
          color: 'text-green-500'
        },
        {
          id: 2,
          type: 'meeting_scheduled',
          message: 'New consultation meeting scheduled',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          icon: FiCalendar,
          color: 'text-blue-500'
        },
        {
          id: 3,
          type: 'client_added',
          message: 'Emma Wilson added as new client',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          icon: FiUsers,
          color: 'text-purple-500'
        },
        {
          id: 4,
          type: 'email_sent',
          message: 'Wedding form reminder sent to 3 clients',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          icon: FiMail,
          color: 'text-sky-500'
        }
      ];

      setStats({
        totalClients: clients.length,
        completedForms,
        scheduledMeetings: upcomingMeetings,
        pendingEmails,
        recentActivity
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: 'Add New Client',
      href: '/admin/clients',
      icon: FiUsers,
      color: 'bg-blue-500',
      description: 'Manually add new wedding clients'
    },
    {
      name: 'Create Email Template',
      href: '/admin/emails',
      icon: FiMail,
      color: 'bg-green-500',
      description: 'Design automated email workflows'
    },
    {
      name: 'Schedule Meeting',
      href: '/admin/meetings',
      icon: FiCalendar,
      color: 'bg-purple-500',
      description: 'Set up client consultations'
    },
    {
      name: 'Create Custom Form',
      href: '/admin/forms',
      icon: FiFileText,
      color: 'bg-orange-500',
      description: 'Build supplier information forms'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-oswald text-4xl font-bold text-sage-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sage-600">
          Welcome to your Sky Photography admin portal
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="section-card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-sage-800">{stats.totalClients}</p>
              <p className="text-sage-600 text-sm">Total Clients</p>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiCheckCircle} className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-sage-800">{stats.completedForms}</p>
              <p className="text-sage-600 text-sm">Completed Forms</p>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiCalendar} className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-sage-800">{stats.scheduledMeetings}</p>
              <p className="text-sage-600 text-sm">Upcoming Meetings</p>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiClock} className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-sage-800">{stats.pendingEmails}</p>
              <p className="text-sage-600 text-sm">Pending Emails</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-card"
        >
          <h2 className="font-oswald text-xl font-semibold text-sage-800 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.name}
                to={action.href}
                className="group block p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <SafeIcon icon={action.icon} className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sage-800 group-hover:text-sky-600">
                      {action.name}
                    </h3>
                    <p className="text-sm text-sage-600">{action.description}</p>
                  </div>
                  <SafeIcon icon={FiArrowRight} className="h-5 w-5 text-sage-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="section-card"
        >
          <h2 className="font-oswald text-xl font-semibold text-sage-800 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color.replace('text-', 'bg-').replace('500', '100')}`}>
                  <SafeIcon icon={activity.icon} className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-sage-800">
                    {activity.message}
                  </p>
                  <p className="text-xs text-sage-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Demo Mode Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6"
      >
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiAlertCircle} className="h-6 w-6 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 mb-2">Demo Mode Active</h3>
            <p className="text-yellow-700 text-sm mb-4">
              You're currently viewing the admin portal in demo mode with sample data. 
              To access full functionality with real data persistence, configure your Supabase environment variables.
            </p>
            <div className="bg-yellow-100 rounded p-3 text-xs text-yellow-800 font-mono">
              <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
              <p>VITE_SUPABASE_ANON_KEY=your-anon-key</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;