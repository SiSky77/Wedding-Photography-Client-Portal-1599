import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dbHelpers } from '../../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiClock, FiVideo, FiUser, FiSettings, FiPlus, FiEdit3, FiTrash2 } = FiIcons;

const MeetingScheduling = () => {
  const [meetings, setMeetings] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [integrationSettings, setIntegrationSettings] = useState({
    google_calendar_enabled: false,
    zoom_enabled: false,
    meet_enabled: true,
    default_duration: 60,
    buffer_time: 15
  });
  const [newSlot, setNewSlot] = useState({
    date: '',
    start_time: '',
    end_time: '',
    duration: 60,
    meeting_type: 'consultation'
  });

  useEffect(() => {
    loadMeetingData();
  }, []);

  const loadMeetingData = async () => {
    try {
      const [meetingsData, slotsData, settingsData] = await Promise.all([
        dbHelpers.getMeetings(),
        dbHelpers.getAvailabilitySlots(),
        dbHelpers.getIntegrationSettings()
      ]);
      setMeetings(meetingsData || []);
      setAvailabilitySlots(slotsData || []);
      setIntegrationSettings({...integrationSettings, ...settingsData});
    } catch (error) {
      console.error('Failed to load meeting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAvailability = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dbHelpers.createAvailabilitySlot(newSlot);
      setNewSlot({
        date: '',
        start_time: '',
        end_time: '',
        duration: 60,
        meeting_type: 'consultation'
      });
      setShowSlotModal(false);
      loadMeetingData();
    } catch (error) {
      console.error('Failed to create availability slot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (settings) => {
    try {
      await dbHelpers.updateIntegrationSettings(settings);
      setIntegrationSettings(settings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const generateMeetingLink = (meeting) => {
    if (integrationSettings.zoom_enabled && meeting.zoom_link) {
      return meeting.zoom_link;
    }
    return `https://meet.google.com/${meeting.meet_id || 'new'}`;
  };

  const upcomingMeetings = meetings.filter(m => new Date(m.scheduled_for) >= new Date());
  const pastMeetings = meetings.filter(m => new Date(m.scheduled_for) < new Date());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading meeting scheduling..." />
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
          <h1 className="font-oswald text-3xl font-bold text-sage-800">Meeting Scheduling</h1>
          <p className="text-sage-600">Manage client meetings and availability</p>
        </div>
        <button
          onClick={() => setShowSlotModal(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>Add Availability</span>
        </button>
      </motion.div>

      {/* Integration Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="section-card mb-8"
      >
        <h2 className="font-oswald text-lg font-semibold text-sage-800 mb-4">Integration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiCalendar} className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium text-sage-800">Google Calendar</p>
              <p className={`text-sm ${integrationSettings.google_calendar_enabled ? 'text-green-600' : 'text-sage-500'}`}>
                {integrationSettings.google_calendar_enabled ? 'Connected' : 'Not Connected'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiVideo} className="h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium text-sage-800">Zoom</p>
              <p className={`text-sm ${integrationSettings.zoom_enabled ? 'text-green-600' : 'text-sage-500'}`}>
                {integrationSettings.zoom_enabled ? 'Connected' : 'Not Connected'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiVideo} className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium text-sage-800">Google Meet</p>
              <p className={`text-sm ${integrationSettings.meet_enabled ? 'text-green-600' : 'text-sage-500'}`}>
                {integrationSettings.meet_enabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-b border-sage-200 mb-8"
      >
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Upcoming Meetings
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'availability'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Availability Slots
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Past Meetings
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            Settings
          </button>
        </nav>
      </motion.div>

      {/* Upcoming Meetings */}
      {activeTab === 'upcoming' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {upcomingMeetings.length === 0 ? (
            <div className="section-card text-center py-12">
              <SafeIcon icon={FiCalendar} className="h-12 w-12 text-sage-300 mx-auto mb-4" />
              <h3 className="font-medium text-sage-600 mb-2">No Upcoming Meetings</h3>
              <p className="text-sage-500">Your schedule is clear!</p>
            </div>
          ) : (
            upcomingMeetings.map((meeting, index) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="section-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sage-800">
                        {meeting.client_name || 'Client Meeting'}
                      </h3>
                      <p className="text-sm text-sage-600">{meeting.meeting_type}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-sage-500">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiCalendar} className="h-3 w-3" />
                          <span>{new Date(meeting.scheduled_for).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="h-3 w-3" />
                          <span>{new Date(meeting.scheduled_for).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href={generateMeetingLink(meeting)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm inline-flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiVideo} className="h-3 w-3" />
                      <span>Join</span>
                    </a>
                    <button className="btn-primary text-sm">
                      Reschedule
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Availability Slots */}
      {activeTab === 'availability' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {availabilitySlots.map((slot, index) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="section-card"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-sage-800">
                    {new Date(slot.date).toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-sage-600 capitalize">{slot.meeting_type}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-sage-500 hover:text-sky-600 transition-colors">
                    <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-sage-500 hover:text-red-600 transition-colors">
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-sage-600">
                  <SafeIcon icon={FiClock} className="h-3 w-3" />
                  <span>{slot.start_time} - {slot.end_time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-sage-600">
                  <SafeIcon icon={FiCalendar} className="h-3 w-3" />
                  <span>{slot.duration} minutes</span>
                </div>
              </div>
              
              <div className="mt-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slot.is_booked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {slot.is_booked ? 'Booked' : 'Available'}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="section-card"
        >
          <h2 className="font-oswald text-lg font-semibold text-sage-800 mb-6">
            <SafeIcon icon={FiSettings} className="h-5 w-5 inline mr-2" />
            Meeting Settings
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-sage-800 mb-4">Default Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Default Meeting Duration (minutes)</label>
                  <select
                    className="form-input"
                    value={integrationSettings.default_duration}
                    onChange={(e) => setIntegrationSettings({
                      ...integrationSettings,
                      default_duration: parseInt(e.target.value)
                    })}
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Buffer Time Between Meetings (minutes)</label>
                  <select
                    className="form-input"
                    value={integrationSettings.buffer_time}
                    onChange={(e) => setIntegrationSettings({
                      ...integrationSettings,
                      buffer_time: parseInt(e.target.value)
                    })}
                  >
                    <option value={0}>No buffer</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sage-800 mb-4">Video Conferencing</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={integrationSettings.meet_enabled}
                    onChange={(e) => setIntegrationSettings({
                      ...integrationSettings,
                      meet_enabled: e.target.checked
                    })}
                    className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sage-700">Enable Google Meet integration</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={integrationSettings.zoom_enabled}
                    onChange={(e) => setIntegrationSettings({
                      ...integrationSettings,
                      zoom_enabled: e.target.checked
                    })}
                    className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sage-700">Enable Zoom integration</span>
                </label>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => handleUpdateSettings(integrationSettings)}
                className="btn-primary"
              >
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Availability Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="font-oswald text-xl font-semibold text-sage-800 mb-4">
              Add Availability Slot
            </h2>
            
            <form onSubmit={handleCreateAvailability} className="space-y-4">
              <div>
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Start Time *</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">End Time *</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Meeting Type *</label>
                <select
                  required
                  className="form-input"
                  value={newSlot.meeting_type}
                  onChange={(e) => setNewSlot({...newSlot, meeting_type: e.target.value})}
                >
                  <option value="consultation">Initial Consultation</option>
                  <option value="planning">Wedding Planning</option>
                  <option value="engagement">Engagement Session</option>
                  <option value="follow-up">Follow-up</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Slot
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduling;