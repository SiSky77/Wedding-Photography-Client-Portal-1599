import { dbHelpers as baseHelpers } from './supabase';

// Extended database helpers for admin functionality
export const adminHelpers = {
  ...baseHelpers,

  // Client Management
  async addClient(clientData) {
    if (!supabase) throw new Error('Demo mode: Cannot add clients');
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: clientData.email,
        full_name: clientData.full_name,
        phone: clientData.phone,
        role: 'client'
      })
      .select()
      .single();

    if (error) throw error;

    // Create initial wedding form if wedding data provided
    if (clientData.wedding_date || clientData.bride_name || clientData.groom_name) {
      await this.saveWeddingForm(data.id, {
        bride_name: clientData.bride_name || '',
        groom_name: clientData.groom_name || '',
        wedding_date: clientData.wedding_date || '',
        venue_name: clientData.venue_name || '',
        contact_phone: clientData.phone || ''
      });
    }

    return data;
  },

  async updateClient(clientId, updates) {
    if (!supabase) throw new Error('Demo mode: Cannot update clients');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteClient(clientId) {
    if (!supabase) throw new Error('Demo mode: Cannot delete clients');
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
  },

  // Email Templates
  async getEmailTemplates() {
    if (!supabase) {
      return [
        {
          id: '1',
          name: 'Wedding Form Reminder',
          subject: 'Complete Your Wedding Form - {{bride_name}} & {{groom_name}}',
          template: 'Dear {{bride_name}} and {{groom_name}},\n\nWe hope you\'re excited for your upcoming wedding on {{wedding_date}}!\n\nPlease complete your wedding form at your earliest convenience.',
          type: 'reminder',
          created_at: new Date().toISOString()
        }
      ];
    }

    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createEmailTemplate(template) {
    if (!supabase) throw new Error('Demo mode: Cannot create templates');
    
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEmailTemplate(templateId, updates) {
    if (!supabase) throw new Error('Demo mode: Cannot update templates');
    
    const { data, error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEmailTemplate(templateId) {
    if (!supabase) throw new Error('Demo mode: Cannot delete templates');
    
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;
  },

  // Scheduled Emails
  async getScheduledEmails() {
    if (!supabase) {
      return [
        {
          id: '1',
          template_name: 'Wedding Form Reminder',
          recipient_count: 3,
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled'
        }
      ];
    }

    const { data, error } = await supabase
      .from('scheduled_emails')
      .select(`
        *,
        email_templates(name)
      `)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;
    return data;
  },

  async scheduleEmail(templateId, clientIds, sendDate) {
    if (!supabase) throw new Error('Demo mode: Cannot schedule emails');
    
    const { data, error } = await supabase
      .from('scheduled_emails')
      .insert({
        template_id: templateId,
        client_ids: clientIds,
        scheduled_for: sendDate,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // FAQ Management
  async getFAQSets() {
    if (!supabase) {
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
            }
          ],
          created_at: new Date().toISOString()
        }
      ];
    }

    const { data, error } = await supabase
      .from('faq_sets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createFAQSet(faqSet) {
    if (!supabase) throw new Error('Demo mode: Cannot create FAQ sets');
    
    const { data, error } = await supabase
      .from('faq_sets')
      .insert(faqSet)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFAQSet(setId, updates) {
    if (!supabase) throw new Error('Demo mode: Cannot update FAQ sets');
    
    const { data, error } = await supabase
      .from('faq_sets')
      .update(updates)
      .eq('id', setId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFAQSet(setId) {
    if (!supabase) throw new Error('Demo mode: Cannot delete FAQ sets');
    
    const { error } = await supabase
      .from('faq_sets')
      .delete()
      .eq('id', setId);

    if (error) throw error;
  },

  async sendFAQToClients(setId, clientIds) {
    if (!supabase) throw new Error('Demo mode: Cannot send FAQs');
    
    // Create notification records
    const notifications = clientIds.map(clientId => ({
      client_id: clientId,
      faq_set_id: setId,
      sent_at: new Date().toISOString(),
      status: 'sent'
    }));

    const { data, error } = await supabase
      .from('faq_notifications')
      .insert(notifications);

    if (error) throw error;
    return data;
  },

  // Meeting Management
  async getMeetings() {
    if (!supabase) {
      return [
        {
          id: '1',
          client_name: 'Sarah & Michael',
          meeting_type: 'consultation',
          scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          meet_id: 'abc-def-ghi',
          status: 'scheduled'
        }
      ];
    }

    const { data, error } = await supabase
      .from('meetings')
      .select(`
        *,
        profiles(full_name, email)
      `)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAvailabilitySlots() {
    if (!supabase) {
      return [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          start_time: '10:00',
          end_time: '11:00',
          duration: 60,
          meeting_type: 'consultation',
          is_booked: false
        }
      ];
    }

    const { data, error } = await supabase
      .from('availability_slots')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createAvailabilitySlot(slot) {
    if (!supabase) throw new Error('Demo mode: Cannot create availability');
    
    const { data, error } = await supabase
      .from('availability_slots')
      .insert(slot)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getIntegrationSettings() {
    if (!supabase) {
      return {
        google_calendar_enabled: false,
        zoom_enabled: false,
        meet_enabled: true,
        default_duration: 60,
        buffer_time: 15
      };
    }

    const { data, error } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'integration_settings')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.setting_value || {
      google_calendar_enabled: false,
      zoom_enabled: false,
      meet_enabled: true,
      default_duration: 60,
      buffer_time: 15
    };
  },

  async updateIntegrationSettings(settings) {
    if (!supabase) throw new Error('Demo mode: Cannot update settings');
    
    const { data, error } = await supabase
      .from('admin_settings')
      .upsert({
        setting_key: 'integration_settings',
        setting_value: settings
      });

    if (error) throw error;
    return data;
  },

  // Custom Forms
  async getCustomForms() {
    if (!supabase) {
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
            }
          ],
          created_at: new Date().toISOString()
        }
      ];
    }

    const { data, error } = await supabase
      .from('custom_forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createCustomForm(form) {
    if (!supabase) throw new Error('Demo mode: Cannot create forms');
    
    const { data, error } = await supabase
      .from('custom_forms')
      .insert(form)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCustomForm(formId, updates) {
    if (!supabase) throw new Error('Demo mode: Cannot update forms');
    
    const { data, error } = await supabase
      .from('custom_forms')
      .update(updates)
      .eq('id', formId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCustomForm(formId) {
    if (!supabase) throw new Error('Demo mode: Cannot delete forms');
    
    const { error } = await supabase
      .from('custom_forms')
      .delete()
      .eq('id', formId);

    if (error) throw error;
  },

  async getFormRequests() {
    if (!supabase) {
      return [
        {
          id: '1',
          form_name: 'Vendor Contact Information',
          client_name: 'Sarah Johnson',
          status: 'pending',
          sent_at: new Date().toISOString()
        }
      ];
    }

    const { data, error } = await supabase
      .from('form_requests')
      .select(`
        *,
        custom_forms(name),
        profiles(full_name)
      `)
      .order('sent_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async sendFormToClients(formId, clientIds) {
    if (!supabase) throw new Error('Demo mode: Cannot send forms');
    
    const requests = clientIds.map(clientId => ({
      form_id: formId,
      client_id: clientId,
      status: 'sent',
      sent_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('form_requests')
      .insert(requests);

    if (error) throw error;
    return data;
  }
};

// Re-export everything for convenience
export { supabase, isSupabaseConfigured } from './supabase';
export const dbHelpers = adminHelpers;