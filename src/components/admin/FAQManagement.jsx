import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbHelpers } from '../../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit3, FiTrash2, FiHelpCircle, FiEye, FiSend } = FiIcons;

const FAQManagement = () => {
  const [faqSets, setFaqSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSetModal, setShowSetModal] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [newSet, setNewSet] = useState({
    name: '',
    description: '',
    category: 'general',
    faqs: [{ question: '', answer: '' }]
  });

  useEffect(() => {
    loadFAQSets();
  }, []);

  const loadFAQSets = async () => {
    try {
      const data = await dbHelpers.getFAQSets();
      setFaqSets(data || []);
    } catch (error) {
      console.error('Failed to load FAQ sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filter out empty FAQs
      const validFaqs = newSet.faqs.filter(faq => faq.question.trim() && faq.answer.trim());
      
      if (editingSet) {
        await dbHelpers.updateFAQSet(editingSet.id, { ...newSet, faqs: validFaqs });
      } else {
        await dbHelpers.createFAQSet({ ...newSet, faqs: validFaqs });
      }
      
      setNewSet({
        name: '',
        description: '',
        category: 'general',
        faqs: [{ question: '', answer: '' }]
      });
      setEditingSet(null);
      setShowSetModal(false);
      loadFAQSets();
    } catch (error) {
      console.error('Failed to save FAQ set:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSet = async (setId) => {
    if (window.confirm('Are you sure you want to delete this FAQ set?')) {
      try {
        await dbHelpers.deleteFAQSet(setId);
        loadFAQSets();
      } catch (error) {
        console.error('Failed to delete FAQ set:', error);
      }
    }
  };

  const addFAQ = () => {
    setNewSet({
      ...newSet,
      faqs: [...newSet.faqs, { question: '', answer: '' }]
    });
  };

  const removeFAQ = (index) => {
    const updatedFaqs = newSet.faqs.filter((_, i) => i !== index);
    setNewSet({ ...newSet, faqs: updatedFaqs });
  };

  const updateFAQ = (index, field, value) => {
    const updatedFaqs = newSet.faqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    );
    setNewSet({ ...newSet, faqs: updatedFaqs });
  };

  const sendFAQToClients = async (setId, clientIds) => {
    try {
      await dbHelpers.sendFAQToClients(setId, clientIds);
      alert('FAQ set sent to selected clients!');
    } catch (error) {
      console.error('Failed to send FAQ:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading FAQ management..." />
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
          <h1 className="font-oswald text-3xl font-bold text-sage-800">FAQ Management</h1>
          <p className="text-sage-600">Create and manage FAQ sets for your clients</p>
        </div>
        <button
          onClick={() => setShowSetModal(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>New FAQ Set</span>
        </button>
      </motion.div>

      {/* FAQ Sets Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {faqSets.map((set, index) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="section-card"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiHelpCircle} className="h-6 w-6 text-sky-600" />
                <div>
                  <h3 className="font-medium text-sage-800">{set.name}</h3>
                  <p className="text-sm text-sage-600 capitalize">{set.category}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingSet(set);
                    setNewSet(set);
                    setShowSetModal(true);
                  }}
                  className="p-2 text-sage-500 hover:text-sky-600 transition-colors"
                >
                  <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSet(set.id)}
                  className="p-2 text-sage-500 hover:text-red-600 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-sage-600 mb-2">{set.description}</p>
              <p className="text-xs text-sage-500">
                {set.faqs?.length || 0} questions
              </p>
            </div>

            <div className="space-y-2">
              <button className="w-full btn-secondary text-sm inline-flex items-center justify-center space-x-2">
                <SafeIcon icon={FiEye} className="h-3 w-3" />
                <span>Preview</span>
              </button>
              <button 
                onClick={() => sendFAQToClients(set.id, [])}
                className="w-full btn-primary text-sm inline-flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiSend} className="h-3 w-3" />
                <span>Send to Clients</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Set Modal */}
      {showSetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-oswald text-xl font-semibold text-sage-800 mb-4">
              {editingSet ? 'Edit FAQ Set' : 'Create New FAQ Set'}
            </h2>

            <form onSubmit={handleSaveSet} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Set Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newSet.name}
                    onChange={(e) => setNewSet({...newSet, name: e.target.value})}
                    placeholder="e.g., Wedding Day Timeline FAQ"
                  />
                </div>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    required
                    className="form-input"
                    value={newSet.category}
                    onChange={(e) => setNewSet({...newSet, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="timeline">Timeline</option>
                    <option value="photography">Photography</option>
                    <option value="venue">Venue</option>
                    <option value="pricing">Pricing</option>
                    <option value="planning">Planning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={newSet.description}
                  onChange={(e) => setNewSet({...newSet, description: e.target.value})}
                  placeholder="Brief description of what this FAQ set covers..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="form-label">Frequently Asked Questions</label>
                  <button
                    type="button"
                    onClick={addFAQ}
                    className="btn-secondary text-sm inline-flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="h-3 w-3" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {newSet.faqs.map((faq, index) => (
                    <div key={index} className="border border-sage-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-sage-800">Question {index + 1}</h4>
                        {newSet.faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFAQ(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-1">
                            Question *
                          </label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={faq.question}
                            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                            placeholder="What time should we arrive for getting ready photos?"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-1">
                            Answer *
                          </label>
                          <textarea
                            rows={3}
                            required
                            className="form-input"
                            value={faq.answer}
                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                            placeholder="We recommend starting getting ready photos 2-3 hours before the ceremony..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSetModal(false);
                    setEditingSet(null);
                    setNewSet({
                      name: '',
                      description: '',
                      category: 'general',
                      faqs: [{ question: '', answer: '' }]
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingSet ? 'Update FAQ Set' : 'Create FAQ Set'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;