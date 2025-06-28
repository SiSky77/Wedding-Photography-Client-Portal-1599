import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { dbHelpers } from '../lib/supabase';

const FormContext = createContext({});

const initialFormState = {
  bride_name: '',
  groom_name: '',
  wedding_date: '',
  venue_name: '',
  venue_address: '',
  ceremony_time: '',
  reception_time: '',
  contact_phone: '',
  contact_email: '',
  bride_getting_ready_location: '',
  bride_getting_ready_time: '',
  groom_getting_ready_location: '',
  groom_getting_ready_time: '',
  getting_ready_photos: false,
  ceremony_style: '',
  ceremony_duration: '',
  special_traditions: '',
  ring_bearer: false,
  flower_girl: false,
  first_dance_song: '',
  special_dances: '',
  cake_cutting_time: '',
  bouquet_toss: false,
  confetti_shot: false,
  confetti_type: '',
  family_photos: false,
  bridal_party_count: 0,
  family_photo_list: '',
  special_group_requests: '',
  must_have_shots: '',
  do_not_photograph: '',
  surprise_plans: '',
  special_considerations: '',
  custom_timeline: '',
  timeline_notes: '',
  engagement_photos: false,
  bridal_portraits: false,
  album_interest: false,
  print_packages: false
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_FORM':
      return { ...state, ...action.payload };
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_SECTION':
      return { ...state, ...action.payload };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
};

// Simple debounce function
const debounce = (func, wait) => {
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

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);
  const [loading, setLoading] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const { user } = useAuth();

  // Auto-save debounced function
  const debouncedAutoSave = debounce(async (data) => {
    if (user?.id) {
      try {
        await dbHelpers.autoSaveForm(user.id, data, 'main');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  }, 2000);

  // Load form data on user change
  useEffect(() => {
    if (user?.id) {
      loadFormData();
    }
  }, [user?.id]);

  // Auto-save on form data change
  useEffect(() => {
    if (user?.id && Object.keys(formData).length > 0) {
      debouncedAutoSave(formData);
      updateCompletionPercentage();
    }
  }, [formData, user?.id]);

  const loadFormData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await dbHelpers.getWeddingForm(user.id);
      if (data?.form_data) {
        dispatch({ type: 'LOAD_FORM', payload: data.form_data });
      }
    } catch (error) {
      console.error('Failed to load form data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFormData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await dbHelpers.saveWeddingForm(user.id, formData);
      console.log('Form saved successfully!');
    } catch (error) {
      console.error('Failed to save form:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const updateSection = (sectionData) => {
    dispatch({ type: 'UPDATE_SECTION', payload: sectionData });
  };

  const updateCompletionPercentage = () => {
    const percentage = dbHelpers.calculateCompletionPercentage(formData);
    setCompletionPercentage(percentage);
  };

  const getFormSections = () => {
    return [
      {
        id: 'basic',
        title: 'Basic Information',
        description: 'Essential details about your wedding day',
        icon: '💑',
        fields: ['bride_name', 'groom_name', 'wedding_date', 'venue_name', 'contact_phone']
      },
      {
        id: 'getting-ready',
        title: 'Getting Ready',
        description: 'Where and when you\'ll be preparing',
        icon: '✨',
        fields: ['bride_getting_ready_location', 'groom_getting_ready_location']
      },
      {
        id: 'ceremony',
        title: 'Ceremony Details',
        description: 'Your ceremony preferences and traditions',
        icon: '💒',
        fields: ['ceremony_style', 'ceremony_time', 'special_traditions']
      },
      {
        id: 'reception',
        title: 'Reception Details',
        description: 'Reception timeline and special moments',
        icon: '🎉',
        fields: ['reception_time', 'first_dance_song', 'cake_cutting_time']
      },
      {
        id: 'groups',
        title: 'Group Photos',
        description: 'Family and group photo requirements',
        icon: '👨‍👩‍👧‍👦',
        fields: ['family_photos', 'bridal_party_count', 'family_photo_list']
      },
      {
        id: 'special',
        title: 'Special Requests',
        description: 'Must-have shots and special considerations',
        icon: '📸',
        fields: ['must_have_shots', 'special_considerations']
      }
    ];
  };

  const value = {
    formData,
    loading,
    completionPercentage,
    updateField,
    updateSection,
    saveFormData,
    loadFormData,
    getFormSections
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};