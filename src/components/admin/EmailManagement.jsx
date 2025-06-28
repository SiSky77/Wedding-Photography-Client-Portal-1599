import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbHelpers } from '../../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit3, FiTrash2, FiSend, FiClock, FiMail, FiEye, FiCalendar } = FiIcons;

const EmailManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    template: '',
    type: 'reminder',
    merge_fields: []
  });

  const mergeFieldOptions = [
    '{{bride_name}}',
    '{{groom_name}}',
    '{{wedding_date}}',
    '{{venue_name}}',
    '{{contact_phone}}',
    '{{photographer_name}}',
    '{{company_name}}'
  ];

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      const [templatesData, scheduledData] = await Promise.all([
        dbHelpers.getEmailTemplates(),
        dbHelpers.getScheduledEmails()
      ]);
      setTemplates(templatesData || []);
      setScheduledEmails(scheduledData || []);
    } catch (error) {
      console.error('Failed to load email data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTemplate) {
        await dbHelpers.updateEmailTemplate(editingTemplate.id, newTemplate);
      } else {
        await dbHelpers.createEmailTemplate(newTemplate);
      }
      setNewTemplate({
        name: '',
        subject: '',
        template: '',
        type: 'reminder',
        merge_fields: []
      });
      setEditingTemplate(null);
      setShowTemplateModal(false);
      loadEmailData();
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await dbHelpers.deleteEmailTemplate(templateId);
        loadEmailData();
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handleScheduleEmail = async (templateId, clientIds, sendDate) => {
    try {
      await dbHelpers.scheduleEmail(templateId, clientIds, sendDate);
      loadEmailData();
    } catch (error) {
      console.error('Failed to schedule email:', error);
    }
  };

  const insertMergeField = (field) => {
    setNewTemplate({
      ...newTemplate,
      template: newTemplate.template + field
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading email management..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="font-oswald text-3xl font-bold text-sage-800">Email Management</h1>
          <p className="text-sage-600">Create templates and schedule automated emails</p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New Template</span>
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b border-sage-200 mb-8"
      >
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Email Templates
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scheduled'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Scheduled Emails
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Sent History
          </button>
        </nav>
      </motion.div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="section-card"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-sage-800">{template.name}</h3>
                  <p className="text-sm text-sage-600 capitalize">{template.type}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setNewTemplate(template);
                      setShowTemplateModal(true);
                    }}
                    className="p-2 text-sage-500 hover:text-sky-600 transition-colors"
                  >
                    <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-sage-500 hover:text-red-600 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-sage-700 mb-1">Subject:</p>
                <p className="text-sm text-sage-600">{template.subject}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-sage-600 line-clamp-3">
                  {template.template.substring(0, 150)}...
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.type === 'reminder' ? 'bg-yellow-100 text-yellow-700' :
                  template.type === 'welcome' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {template.type}
                </span>
                <button className="btn-secondary text-sm py-1 px-3">
                  <SafeIcon icon={FiSend} className="h-3 w-3 mr-1" />
                  Send
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Scheduled Emails Tab */}
      {activeTab === 'scheduled' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {scheduledEmails.map((email, index) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="section-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SafeIcon icon={FiClock} className="h-5 w-5 text-yellow-500" />
                  <div>
                    <h3 className="font-medium text-sage-800">{email.template_name}</h3>
                    <p className="text-sm text-sage-600">
                      To: {email.recipient_count} recipients
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-sage-800">
                      {new Date(email.scheduled_for).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-sage-600">
                      {new Date(email.scheduled_for).toLocaleTimeString()}
                    </p>
                  </div>
                  <button className="btn-secondary text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-oswald text-xl font-semibold text-sage-800 mb-4">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h2>
            
            <form onSubmit={handleSaveTemplate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Template Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">Type *</label>
                  <select
                    required
                    className="form-input"
                    value={newTemplate.type}
                    onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value})}
                  >
                    <option value="reminder">Reminder</option>
                    <option value="welcome">Welcome</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="form-request">Form Request</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="form-label">Subject Line *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                  placeholder="e.g., Wedding Form Reminder - {{bride_name}} & {{groom_name}}"
                />
              </div>
              
              <div>
                <label className="form-label">Email Template *</label>
                <div className="mb-2">
                  <p className="text-sm text-sage-600 mb-2">Available merge fields:</p>
                  <div className="flex flex-wrap gap-2">
                    {mergeFieldOptions.map((field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => insertMergeField(field)}
                        className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs hover:bg-sky-200"
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  rows={12}
                  className="form-input"
                  value={newTemplate.template}
                  onChange={(e) => setNewTemplate({...newTemplate, template: e.target.value})}
                  placeholder="Dear {{bride_name}} and {{groom_name}},&#10;&#10;We hope you're excited for your upcoming wedding on {{wedding_date}} at {{venue_name}}!&#10;&#10;..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                    setNewTemplate({
                      name: '',
                      subject: '',
                      template: '',
                      type: 'reminder',
                      merge_fields: []
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmailManagement;