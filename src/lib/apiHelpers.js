// API helpers for external integrations and admin workflows

export const emailAPI = {
  async sendEmail(templateId, clientData, customData = {}) {
    // Mock email sending in demo mode
    if (!window.SUPABASE_CONFIGURED) {
      console.log('Demo: Email would be sent', { templateId, clientData, customData });
      return { success: true, messageId: 'demo-message-id' };
    }

    // Implement actual email sending logic here
    // This could integrate with services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Postmark
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id: templateId,
        client_data: clientData,
        custom_data: customData
      })
    });

    return response.json();
  },

  async scheduleEmail(templateId, clientIds, sendDate) {
    if (!window.SUPABASE_CONFIGURED) {
      console.log('Demo: Email would be scheduled', { templateId, clientIds, sendDate });
      return { success: true, jobId: 'demo-job-id' };
    }

    const response = await fetch('/api/schedule-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id: templateId,
        client_ids: clientIds,
        send_date: sendDate
      })
    });

    return response.json();
  },

  mergePlaceholders(template, clientData) {
    let mergedTemplate = template;
    
    const mergeFields = {
      '{{bride_name}}': clientData.bride_name || '',
      '{{groom_name}}': clientData.groom_name || '',
      '{{wedding_date}}': clientData.wedding_date ? new Date(clientData.wedding_date).toLocaleDateString() : '',
      '{{venue_name}}': clientData.venue_name || '',
      '{{contact_phone}}': clientData.contact_phone || '',
      '{{photographer_name}}': 'Sky Photography Team',
      '{{company_name}}': 'Sky Photography'
    };

    Object.entries(mergeFields).forEach(([placeholder, value]) => {
      mergedTemplate = mergedTemplate.replace(new RegExp(placeholder, 'g'), value);
    });

    return mergedTemplate;
  }
};

export const calendarAPI = {
  async createGoogleCalendarEvent(eventData) {
    if (!window.SUPABASE_CONFIGURED) {
      console.log('Demo: Google Calendar event would be created', eventData);
      return { 
        success: true, 
        eventId: 'demo-event-id',
        meetLink: 'https://meet.google.com/demo-meeting'
      };
    }

    // Implement Google Calendar API integration
    const response = await fetch('/api/calendar/create-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    return response.json();
  },

  async createZoomMeeting(meetingData) {
    if (!window.SUPABASE_CONFIGURED) {
      console.log('Demo: Zoom meeting would be created', meetingData);
      return { 
        success: true, 
        meetingId: 'demo-zoom-id',
        joinUrl: 'https://zoom.us/j/demo-meeting'
      };
    }

    // Implement Zoom API integration
    const response = await fetch('/api/zoom/create-meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData)
    });

    return response.json();
  },

  generateGoogleMeetLink() {
    // Generate a random Google Meet link
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const segments = Array.from({ length: 3 }, () => 
      Array.from({ length: 4 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    );
    
    return `https://meet.google.com/${segments.join('-')}`;
  }
};

export const exportAPI = {
  generateCSV(data, filename = 'export.csv') {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  async generatePDF(data, template = 'default') {
    if (!window.SUPABASE_CONFIGURED) {
      console.log('Demo: PDF would be generated', { data, template });
      return { success: true, url: 'demo-pdf-url' };
    }

    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, template })
    });

    return response.json();
  }
};

export const webhookAPI = {
  async registerWebhook(url, events) {
    if (!window.SUPABASE_CONFIGURED) {
      console.log('Demo: Webhook would be registered', { url, events });
      return { success: true, webhookId: 'demo-webhook-id' };
    }

    const response = await fetch('/api/webhooks/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, events })
    });

    return response.json();
  },

  async triggerWebhook(event, data) {
    if (!window.SUPABASE_CONFIGURED) {
      console.log('Demo: Webhook would be triggered', { event, data });
      return { success: true };
    }

    const response = await fetch('/api/webhooks/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data })
    });

    return response.json();
  }
};

// Validation helpers
export const validationAPI = {
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
  },

  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
  }
};