import { createClient } from '@supabase/supabase-js';

let supabase = null;
let isSupabaseConfigured = false;

// Initialize Supabase configuration
const initializeSupabase = () => {
  if (typeof window === 'undefined') return;

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

    // Check if we have real credentials
    isSupabaseConfigured = !supabaseUrl.includes('placeholder') && !supabaseAnonKey.includes('placeholder');

    if (isSupabaseConfigured) {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
    }
  } catch (error) {
    console.warn('Supabase initialization failed, running in demo mode:', error);
    isSupabaseConfigured = false;
  }
};

// Initialize immediately if we're in browser
initializeSupabase();

// Mock helper functions for demo mode
const createMockHelpers = () => ({
  async getWeddingForm(userId) {
    console.warn('Demo mode: Mock getWeddingForm');
    return {
      form_data: {
        bride_name: 'Sarah',
        groom_name: 'Michael',
        wedding_date: '2024-07-15',
        venue_name: 'Thornton Manor'
      }
    };
  },

  async saveWeddingForm(userId, formData) {
    console.warn('Demo mode: Mock saveWeddingForm');
    return {
      id: 'mock-id',
      user_id: userId,
      form_data: formData
    };
  },

  async autoSaveForm(userId, sectionData, section) {
    console.warn('Demo mode: Mock autoSaveForm');
    return true;
  },

  async getAllClients() {
    console.warn('Demo mode: Mock getAllClients');
    return [
      {
        id: 'mock-client-1',
        email: 'sarah.johnson@example.com',
        full_name: 'Sarah Johnson',
        phone: '+44 123 456 7890',
        created_at: new Date().toISOString(),
        wedding_forms: [{
          form_data: {
            bride_name: 'Sarah',
            groom_name: 'Michael',
            wedding_date: '2024-07-15',
            venue_name: 'Thornton Manor',
            contact_phone: '+44 123 456 7890'
          },
          updated_at: new Date().toISOString()
        }]
      },
      {
        id: 'mock-client-2',
        email: 'emma.wilson@example.com',
        full_name: 'Emma Wilson',
        phone: '+44 123 456 7891',
        created_at: new Date().toISOString(),
        wedding_forms: [{
          form_data: {
            bride_name: 'Emma',
            groom_name: 'James',
            wedding_date: '2024-09-20',
            venue_name: 'Cheshire Manor',
            contact_phone: '+44 123 456 7891'
          },
          updated_at: new Date().toISOString()
        }]
      }
    ];
  },

  async addClient(clientData) {
    console.warn('Demo mode: Mock addClient');
    return {
      id: 'mock-new-client',
      ...clientData,
      created_at: new Date().toISOString()
    };
  },

  async updateClient(clientId, updates) {
    console.warn('Demo mode: Mock updateClient');
    return { id: clientId, ...updates };
  },

  async deleteClient(clientId) {
    console.warn('Demo mode: Mock deleteClient');
    return true;
  },

  async getEmailTemplates() {
    console.warn('Demo mode: Mock getEmailTemplates');
    return [
      {
        id: '1',
        name: 'Wedding Form Reminder',
        subject: 'Complete Your Wedding Form - {{bride_name}} & {{groom_name}}',
        template: 'Dear {{bride_name}} and {{groom_name}},\n\nWe hope you\'re excited for your upcoming wedding on {{wedding_date}}!\n\nPlease complete your wedding form at your earliest convenience.\n\nBest regards,\nSky Photography Team',
        type: 'reminder',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Welcome Email',
        subject: 'Welcome to Sky Photography!',
        template: 'Dear {{bride_name}} and {{groom_name}},\n\nWelcome to Sky Photography! We\'re thrilled to be part of your special day.\n\nBest regards,\nSky Photography Team',
        type: 'welcome',
        created_at: new Date().toISOString()
      }
    ];
  },

  async createEmailTemplate(template) {
    console.warn('Demo mode: Mock createEmailTemplate');
    return { id: 'mock-template-id', ...template, created_at: new Date().toISOString() };
  },

  async updateEmailTemplate(templateId, updates) {
    console.warn('Demo mode: Mock updateEmailTemplate');
    return { id: templateId, ...updates };
  },

  async deleteEmailTemplate(templateId) {
    console.warn('Demo mode: Mock deleteEmailTemplate');
    return true;
  },

  async getScheduledEmails() {
    console.warn('Demo mode: Mock getScheduledEmails');
    return [
      {
        id: '1',
        template_name: 'Wedding Form Reminder',
        recipient_count: 3,
        scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled'
      }
    ];
  },

  async scheduleEmail(templateId, clientIds, sendDate) {
    console.warn('Demo mode: Mock scheduleEmail');
    return { id: 'mock-scheduled-email', template_id: templateId, scheduled_for: sendDate };
  },

  async getFAQSets() {
    console.warn('Demo mode: Mock getFAQSets');
    return [
      {
        id: '1',
        name: 'Wedding Day Timeline',
        description: 'Common questions about wedding day scheduling',
        category: 'timeline',
        faqs: [
          {
            question: 'What time should we start getting ready?',
            answer: 'We recommend starting 2-3 hours before the ceremony for optimal photo opportunities.'
          },
          {
            question: 'How long do group photos take?',
            answer: 'Group photos typically take 20-30 minutes, depending on the size of your families and bridal party.'
          }
        ],
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Photography Preparation',
        description: 'Tips for preparing for your photography session',
        category: 'photography',
        faqs: [
          {
            question: 'What should we wear for engagement photos?',
            answer: 'We recommend coordinating colors and avoiding busy patterns. Solid colors and textures work beautifully.'
          }
        ],
        created_at: new Date().toISOString()
      }
    ];
  },

  async createFAQSet(faqSet) {
    console.warn('Demo mode: Mock createFAQSet');
    return { id: 'mock-faq-set', ...faqSet, created_at: new Date().toISOString() };
  },

  async updateFAQSet(setId, updates) {
    console.warn('Demo mode: Mock updateFAQSet');
    return { id: setId, ...updates };
  },

  async deleteFAQSet(setId) {
    console.warn('Demo mode: Mock deleteFAQSet');
    return true;
  },

  async sendFAQToClients(setId, clientIds) {
    console.warn('Demo mode: Mock sendFAQToClients');
    return true;
  },

  async getMeetings() {
    console.warn('Demo mode: Mock getMeetings');
    return [
      {
        id: '1',
        client_name: 'Sarah & Michael',
        meeting_type: 'consultation',
        scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        meet_id: 'abc-def-ghi',
        status: 'scheduled'
      },
      {
        id: '2',
        client_name: 'Emma & James',
        meeting_type: 'planning',
        scheduled_for: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        meet_id: 'xyz-uvw-rst',
        status: 'scheduled'
      }
    ];
  },

  async getAvailabilitySlots() {
    console.warn('Demo mode: Mock getAvailabilitySlots');
    return [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        start_time: '10:00',
        end_time: '11:00',
        duration: 60,
        meeting_type: 'consultation',
        is_booked: false
      },
      {
        id: '2',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '14:00',
        end_time: '15:00',
        duration: 60,
        meeting_type: 'consultation',
        is_booked: true
      }
    ];
  },

  async createAvailabilitySlot(slot) {
    console.warn('Demo mode: Mock createAvailabilitySlot');
    return { id: 'mock-slot-id', ...slot, created_at: new Date().toISOString() };
  },

  async getIntegrationSettings() {
    console.warn('Demo mode: Mock getIntegrationSettings');
    return {
      google_calendar_enabled: false,
      zoom_enabled: false,
      meet_enabled: true,
      default_duration: 60,
      buffer_time: 15
    };
  },

  async updateIntegrationSettings(settings) {
    console.warn('Demo mode: Mock updateIntegrationSettings');
    return settings;
  },

  async getCustomForms() {
    console.warn('Demo mode: Mock getCustomForms');
    return [
      {
        id: '1',
        name: 'Vendor Contact Information',
        description: 'Collect contact details for all wedding vendors',
        category: 'supplier',
        fields: [
          {
            type: 'text',
            label: 'Vendor Name',
            placeholder: 'Enter vendor name',
            required: true
          },
          {
            type: 'email',
            label: 'Vendor Email',
            placeholder: 'vendor@example.com',
            required: true
          },
          {
            type: 'phone',
            label: 'Vendor Phone',
            placeholder: '+44 123 456 7890',
            required: false
          }
        ],
        created_at: new Date().toISOString()
      }
    ];
  },

  async createCustomForm(form) {
    console.warn('Demo mode: Mock createCustomForm');
    return { id: 'mock-form-id', ...form, created_at: new Date().toISOString() };
  },

  async updateCustomForm(formId, updates) {
    console.warn('Demo mode: Mock updateCustomForm');
    return { id: formId, ...updates };
  },

  async deleteCustomForm(formId) {
    console.warn('Demo mode: Mock deleteCustomForm');
    return true;
  },

  async getFormRequests() {
    console.warn('Demo mode: Mock getFormRequests');
    return [
      {
        id: '1',
        form_name: 'Vendor Contact Information',
        client_name: 'Sarah Johnson',
        status: 'pending',
        sent_at: new Date().toISOString()
      },
      {
        id: '2',
        form_name: 'Vendor Contact Information',
        client_name: 'Emma Wilson',
        status: 'completed',
        sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  },

  async sendFormToClients(formId, clientIds) {
    console.warn('Demo mode: Mock sendFormToClients');
    return true;
  },

  calculateCompletionPercentage(formData) {
    if (!formData) return 0;
    const requiredFields = [
      'bride_name',
      'groom_name',
      'wedding_date',
      'venue_name',
      'ceremony_time',
      'reception_time',
      'contact_phone'
    ];
    const completedFields = requiredFields.filter(field =>
      formData[field] && formData[field].toString().trim() !== ''
    );
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }
});

// Real helper functions for production mode
const createRealHelpers = () => ({
  async getWeddingForm(userId) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('wedding_forms')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async saveWeddingForm(userId, formData) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('wedding_forms')
      .upsert({
        user_id: userId,
        form_data: formData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async autoSaveForm(userId, sectionData, section) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { error } = await supabase
      .from('form_autosave')
      .upsert({
        user_id: userId,
        section,
        data: sectionData,
        updated_at: new Date().toISOString()
      });
    if (error) throw error;
  },

  async getAllClients() {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        wedding_forms (*)
      `)
      .eq('role', 'client');
    if (error) throw error;
    return data;
  },

  calculateCompletionPercentage(formData) {
    if (!formData) return 0;
    const requiredFields = [
      'bride_name',
      'groom_name',
      'wedding_date',
      'venue_name',
      'ceremony_time',
      'reception_time',
      'contact_phone'
    ];
    const completedFields = requiredFields.filter(field =>
      formData[field] && formData[field].toString().trim() !== ''
    );
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }
});

// Export the appropriate helpers and client
export const dbHelpers = isSupabaseConfigured ? createRealHelpers() : createMockHelpers();
export { supabase, isSupabaseConfigured };