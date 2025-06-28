import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from '../../pages/AdminDashboard';
import ClientManagement from './ClientManagement';
import EmailManagement from './EmailManagement';
import FAQManagement from './FAQManagement';
import MeetingScheduling from './MeetingScheduling';
import FormDrafting from './FormDrafting';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="emails" element={<EmailManagement />} />
          <Route path="faqs" element={<FAQManagement />} />
          <Route path="meetings" element={<MeetingScheduling />} />
          <Route path="forms" element={<FormDrafting />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;