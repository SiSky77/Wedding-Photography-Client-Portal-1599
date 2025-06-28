// Utility functions

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const calculateDaysUntilWedding = (weddingDate) => {
  const today = new Date();
  const wedding = new Date(weddingDate);
  const diffTime = wedding - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const generateWeddingTimeline = (formData) => {
  const timeline = [];
  
  if (formData.bride_getting_ready_time) {
    timeline.push({
      time: formData.bride_getting_ready_time,
      event: 'Bride getting ready photos',
      location: formData.bride_getting_ready_location
    });
  }
  
  if (formData.groom_getting_ready_time) {
    timeline.push({
      time: formData.groom_getting_ready_time,
      event: 'Groom getting ready photos',
      location: formData.groom_getting_ready_location
    });
  }
  
  if (formData.ceremony_time) {
    timeline.push({
      time: formData.ceremony_time,
      event: 'Ceremony',
      location: formData.venue_name
    });
  }
  
  if (formData.reception_time) {
    timeline.push({
      time: formData.reception_time,
      event: 'Reception',
      location: formData.venue_name
    });
  }
  
  if (formData.cake_cutting_time) {
    timeline.push({
      time: formData.cake_cutting_time,
      event: 'Cake cutting',
      location: formData.venue_name
    });
  }
  
  return timeline.sort((a, b) => a.time.localeCompare(b.time));
};