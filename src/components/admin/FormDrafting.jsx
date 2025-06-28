import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbHelpers } from '../../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit3, FiTrash2, FiSend, FiFileText, FiEye, FiCopy, FiCheck, FiClock } = FiIcons;

const FormDrafting = () => {
  const [customForms, setCustomForms] = useState([]);
  const [formRequests, setFormRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forms');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    category: 'supplier',
    fields: [
      {
        type: 'text',
        label: '',
        placeholder: '',
        required: false,
        options: []
      }
    ]
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'file', label: 'File Upload' }
  ];

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [formsData, requestsData] = await Promise.all([
        dbHelpers.getCustomForms(),
        dbHelpers.getFormRequests()
      ]);
      setCustomForms(formsData || []);
      setFormRequests(requestsData || []);
    } catch (error) {
      console.error('Failed to load form data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filter out empty fields
      const validFields = newForm.fields.filter(field => field.label.trim());
      
      if (editingForm) {
        await dbHelpers.updateCustomForm(editingForm.id, { ...newForm, fields: validFields });
      } else {
        await dbHelpers.createCustomForm({ ...newForm, fields: validFields });
      }
      
      resetForm();
      loadFormData();
    } catch (error) {
      console.error('Failed to save form:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewForm({
      name: '',
      description: '',
      category: 'supplier',
      fields: [
        {
          type: 'text',
          label: '',
          placeholder: '',
          required: false,
          options: []
        }
      ]
    });
    setEditingForm(null);
    setShowFormModal(false);
  };

  const addField = () => {
    setNewForm({
      ...newForm,
      fields: [
        ...newForm.fields,
        {
          type: 'text',
          label: '',
          placeholder: '',
          required: false,
          options: []
        }
      ]
    });
  };

  const removeField = (index) => {
    const updatedFields = newForm.fields.filter((_, i) => i !== index);
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const updateField = (index, field, value) => {
    const updatedFields = newForm.fields.map((f, i) => 
      i === index ? { ...f, [field]: value } : f
    );
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const handleSendForm = async (formId, clientIds) => {
    try {
      await dbHelpers.sendFormToClients(formId, clientIds);
      alert('Form sent to selected clients!');
      loadFormData();
    } catch (error) {
      console.error('Failed to send form:', error);
    }
  };

  const duplicateForm = async (form) => {
    try {
      const duplicatedForm = {
        ...form,
        name: `${form.name} (Copy)`,
        id: undefined
      };
      await dbHelpers.createCustomForm(duplicatedForm);
      loadFormData();
    } catch (error) {
      console.error('Failed to duplicate form:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading form management..." />
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
          <h1 className="font-oswald text-3xl font-bold text-sage-800">Form Drafting & Management</h1>
          <p className="text-sage-600">Create custom forms and track completion status</p>
        </div>
        <button
          onClick={() => setShowFormModal(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>Create Form</span>
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
            onClick={() => setActiveTab('forms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'forms'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Custom Forms
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Form Requests
          </button>
        </nav>
      </motion.div>

      {/* Custom Forms Tab */}
      {activeTab === 'forms' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {customForms.map((form, index) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="section-card"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiFileText} className="h-6 w-6 text-sky-600" />
                  <div>
                    <h3 className="font-medium text-sage-800">{form.name}</h3>
                    <p className="text-sm text-sage-600 capitalize">{form.category}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => duplicateForm(form)}
                    className="p-2 text-sage-500 hover:text-blue-600 transition-colors"
                    title="Duplicate"
                  >
                    <SafeIcon icon={FiCopy} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingForm(form);
                      setNewForm(form);
                      setShowFormModal(true);
                    }}
                    className="p-2 text-sage-500 hover:text-sky-600 transition-colors"
                    title="Edit"
                  >
                    <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => dbHelpers.deleteCustomForm(form.id)}
                    className="p-2 text-sage-500 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-sage-600 mb-2">{form.description}</p>
                <p className="text-xs text-sage-500">
                  {form.fields?.length || 0} fields
                </p>
              </div>

              <div className="space-y-2">
                <button className="w-full btn-secondary text-sm inline-flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiEye} className="h-3 w-3" />
                  <span>Preview</span>
                </button>
                <button 
                  onClick={() => handleSendForm(form.id, [])}
                  className="w-full btn-primary text-sm inline-flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSend} className="h-3 w-3" />
                  <span>Send to Clients</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Form Requests Tab */}
      {activeTab === 'requests' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {formRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="section-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SafeIcon 
                    icon={request.status === 'completed' ? FiCheck : FiClock} 
                    className={`h-5 w-5 ${request.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`} 
                  />
                  <div>
                    <h3 className="font-medium text-sage-800">{request.form_name}</h3>
                    <p className="text-sm text-sage-600">
                      To: {request.client_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      request.status === 'completed' ? 'text-green-600' :
                      request.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {request.status === 'completed' ? 'Completed' :
                       request.status === 'pending' ? 'Pending' : 'Overdue'}
                    </p>
                    <p className="text-sm text-sage-500">
                      Sent: {new Date(request.sent_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="btn-secondary text-sm">
                    Resend
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Form Builder Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-oswald text-xl font-semibold text-sage-800 mb-4">
              {editingForm ? 'Edit Form' : 'Create New Form'}
            </h2>

            <form onSubmit={handleSaveForm} className="space-y-6">
              {/* Form Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Form Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newForm.name}
                    onChange={(e) => setNewForm({...newForm, name: e.target.value})}
                    placeholder="e.g., Vendor Contact Information"
                  />
                </div>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    required
                    className="form-input"
                    value={newForm.category}
                    onChange={(e) => setNewForm({...newForm, category: e.target.value})}
                  >
                    <option value="supplier">Supplier Information</option>
                    <option value="timeline">Timeline Details</option>
                    <option value="contact">Contact Information</option>
                    <option value="preferences">Preferences</option>
                    <option value="logistics">Logistics</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={newForm.description}
                  onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                  placeholder="Brief description of this form's purpose..."
                />
              </div>

              {/* Form Fields */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="form-label">Form Fields</label>
                  <button
                    type="button"
                    onClick={addField}
                    className="btn-secondary text-sm inline-flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="h-3 w-3" />
                    <span>Add Field</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {newForm.fields.map((field, index) => (
                    <div key={index} className="border border-sage-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-sage-800">Field {index + 1}</h4>
                        {newForm.fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-1">
                            Field Type *
                          </label>
                          <select
                            required
                            className="form-input"
                            value={field.type}
                            onChange={(e) => updateField(index, 'type', e.target.value)}
                          >
                            {fieldTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-1">
                            Label *
                          </label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={field.label}
                            onChange={(e) => updateField(index, 'label', e.target.value)}
                            placeholder="e.g., Caterer Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-1">
                            Placeholder
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={field.placeholder}
                            onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                            placeholder="Enter placeholder text..."
                          />
                        </div>
                      </div>

                      {(field.type === 'select' || field.type === 'radio') && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-sage-700 mb-1">
                            Options (one per line)
                          </label>
                          <textarea
                            rows={3}
                            className="form-input"
                            value={field.options?.join('\n') || ''}
                            onChange={(e) => updateField(index, 'options', e.target.value.split('\n').filter(opt => opt.trim()))}
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                          />
                        </div>
                      )}

                      <div className="mt-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.required || false}
                            onChange={(e) => updateField(index, 'required', e.target.checked)}
                            className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
                          />
                          <span className="text-sm text-sage-700">Required field</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingForm ? 'Update Form' : 'Create Form'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FormDrafting;