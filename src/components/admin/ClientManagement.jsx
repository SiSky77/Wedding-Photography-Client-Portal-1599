import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbHelpers } from '../../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiEdit3, FiTrash2, FiMail, FiCalendar, FiUser, FiPhone, FiMapPin } = FiIcons;

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [newClient, setNewClient] = useState({
    email: '',
    full_name: '',
    phone: '',
    wedding_date: '',
    bride_name: '',
    groom_name: '',
    venue_name: '',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientData = await dbHelpers.getAllClients();
      setClients(clientData || []);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dbHelpers.addClient(newClient);
      setNewClient({
        email: '',
        full_name: '',
        phone: '',
        wedding_date: '',
        bride_name: '',
        groom_name: '',
        venue_name: '',
        notes: ''
      });
      setShowAddModal(false);
      loadClients();
    } catch (error) {
      console.error('Failed to add client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = async (clientId, updatedData) => {
    setLoading(true);
    try {
      await dbHelpers.updateClient(clientId, updatedData);
      setEditingClient(null);
      loadClients();
    } catch (error) {
      console.error('Failed to update client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      setLoading(true);
      try {
        await dbHelpers.deleteClient(clientId);
        loadClients();
      } catch (error) {
        console.error('Failed to delete client:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.wedding_forms?.[0]?.form_data?.bride_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.wedding_forms?.[0]?.form_data?.groom_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading clients..." />
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
          <h1 className="font-oswald text-3xl font-bold text-sage-800">Client Management</h1>
          <p className="text-sage-600">Manage your wedding photography clients</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>Add Client</span>
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="section-card mb-8"
      >
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
          <input
            type="text"
            placeholder="Search clients by name, email, or couple names..."
            className="form-input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Client List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredClients.map((client, index) => {
          const formData = client.wedding_forms?.[0]?.form_data || {};
          const completionPercentage = dbHelpers.calculateCompletionPercentage(formData);
          
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="section-card"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sage-800">
                      {formData.bride_name && formData.groom_name 
                        ? `${formData.bride_name} & ${formData.groom_name}`
                        : client.full_name || client.email
                      }
                    </h3>
                    <p className="text-sm text-sage-600">{client.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="p-2 text-sage-500 hover:text-sky-600 transition-colors"
                  >
                    <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-2 text-sage-500 hover:text-red-600 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {client.phone && (
                  <div className="flex items-center space-x-2 text-sm text-sage-600">
                    <SafeIcon icon={FiPhone} className="h-3 w-3" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {formData.wedding_date && (
                  <div className="flex items-center space-x-2 text-sm text-sage-600">
                    <SafeIcon icon={FiCalendar} className="h-3 w-3" />
                    <span>{new Date(formData.wedding_date).toLocaleDateString()}</span>
                  </div>
                )}
                {formData.venue_name && (
                  <div className="flex items-center space-x-2 text-sm text-sage-600">
                    <SafeIcon icon={FiMapPin} className="h-3 w-3" />
                    <span className="truncate">{formData.venue_name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  completionPercentage === 100 
                    ? 'bg-green-100 text-green-700' 
                    : completionPercentage > 0 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-sage-100 text-sage-600'
                }`}>
                  {completionPercentage}% Complete
                </div>
                <button className="p-2 text-sage-500 hover:text-sky-600 transition-colors">
                  <SafeIcon icon={FiMail} className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="font-oswald text-xl font-semibold text-sage-800 mb-4">Add New Client</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newClient.full_name}
                  onChange={(e) => setNewClient({...newClient, full_name: e.target.value})}
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Bride's Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newClient.bride_name}
                    onChange={(e) => setNewClient({...newClient, bride_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">Groom's Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newClient.groom_name}
                    onChange={(e) => setNewClient({...newClient, groom_name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Wedding Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newClient.wedding_date}
                  onChange={(e) => setNewClient({...newClient, wedding_date: e.target.value})}
                />
              </div>
              <div>
                <label className="form-label">Venue</label>
                <input
                  type="text"
                  className="form-input"
                  value={newClient.venue_name}
                  onChange={(e) => setNewClient({...newClient, venue_name: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Client
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;