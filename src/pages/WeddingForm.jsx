import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '../contexts/FormContext';
import SafeIcon from '../components/common/SafeIcon';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiArrowRight, FiSave, FiCheck } = FiIcons;

const WeddingForm = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const { 
    formData, 
    updateField, 
    updateSection, 
    saveFormData, 
    loading, 
    completionPercentage,
    getFormSections 
  } = useForm();

  const [currentSection, setCurrentSection] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  const sections = getFormSections();

  useEffect(() => {
    if (section) {
      const sectionIndex = sections.findIndex(s => s.id === section);
      if (sectionIndex !== -1) {
        setCurrentSection(sectionIndex);
      }
    }
  }, [section, sections]);

  // Auto-save indication
  useEffect(() => {
    setAutoSaveStatus('Saving...');
    const timer = setTimeout(() => {
      setAutoSaveStatus('Saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      const nextSection = sections[currentSection + 1];
      setCurrentSection(currentSection + 1);
      navigate(`/form/${nextSection.id}`, { replace: true });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      const prevSection = sections[currentSection - 1];
      setCurrentSection(currentSection - 1);
      navigate(`/form/${prevSection.id}`, { replace: true });
    }
  };

  const handleSectionJump = (index) => {
    setCurrentSection(index);
    navigate(`/form/${sections[index].id}`, { replace: true });
  };

  const renderFormSection = () => {
    const sectionId = sections[currentSection]?.id;
    
    switch (sectionId) {
      case 'basic':
        return <BasicInformationForm />;
      case 'getting-ready':
        return <GettingReadyForm />;
      case 'ceremony':
        return <CeremonyForm />;
      case 'reception':
        return <ReceptionForm />;
      case 'groups':
        return <GroupPhotosForm />;
      case 'special':
        return <SpecialRequestsForm />;
      default:
        return <BasicInformationForm />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your form..." />
      </div>
    );
  }

  const currentSectionData = sections[currentSection];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-oswald text-3xl md:text-4xl font-bold text-sage-800 mb-2">
          Wedding Planning Form
        </h1>
        <p className="text-sage-600">
          Share your vision with us - every detail helps create your perfect day
        </p>
        
        {/* Auto-save status */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          {autoSaveStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-1 text-sm text-sage-600"
            >
              <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500" />
              <span>{autoSaveStatus}</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <ProgressBar percentage={completionPercentage} />
        <div className="flex justify-between mt-2 text-xs text-sage-500">
          <span>Section {currentSection + 1} of {sections.length}</span>
          <span>{currentSectionData?.title}</span>
        </div>
      </motion.div>

      {/* Section Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {sections.map((section, index) => {
            const isCompleted = section.fields.some(field => 
              formData[field] && formData[field].toString().trim() !== ''
            );
            const isCurrent = index === currentSection;

            return (
              <button
                key={section.id}
                onClick={() => handleSectionJump(index)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  isCurrent
                    ? 'bg-sky-600 text-white'
                    : isCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                }`}
              >
                <span className="mr-1">{section.icon}</span>
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="section-card mb-8"
        >
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">{currentSectionData?.icon}</span>
              <div>
                <h2 className="font-oswald text-2xl font-semibold text-sage-800">
                  {currentSectionData?.title}
                </h2>
                <p className="text-sage-600">
                  {currentSectionData?.description}
                </p>
              </div>
            </div>
          </div>

          {renderFormSection()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentSection === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiArrowLeft} className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-4">
          <button
            onClick={saveFormData}
            disabled={loading}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="h-4 w-4" />
            <span>Save Progress</span>
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              onClick={handleNext}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Next</span>
              <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/client')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <SafeIcon icon={FiCheck} className="h-4 w-4" />
              <span>Complete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Form Components
const BasicInformationForm = () => {
  const { formData, updateField } = useForm();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Bride's Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.bride_name || ''}
            onChange={(e) => updateField('bride_name', e.target.value)}
            placeholder="Enter bride's full name"
          />
        </div>
        <div>
          <label className="form-label">Groom's Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.groom_name || ''}
            onChange={(e) => updateField('groom_name', e.target.value)}
            placeholder="Enter groom's full name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Wedding Date *</label>
          <input
            type="date"
            className="form-input"
            value={formData.wedding_date || ''}
            onChange={(e) => updateField('wedding_date', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Contact Phone *</label>
          <input
            type="tel"
            className="form-input"
            value={formData.contact_phone || ''}
            onChange={(e) => updateField('contact_phone', e.target.value)}
            placeholder="+44 123 456 7890"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Venue Name *</label>
        <input
          type="text"
          className="form-input"
          value={formData.venue_name || ''}
          onChange={(e) => updateField('venue_name', e.target.value)}
          placeholder="Enter venue name"
        />
      </div>

      <div>
        <label className="form-label">Venue Address</label>
        <textarea
          className="form-input"
          rows={3}
          value={formData.venue_address || ''}
          onChange={(e) => updateField('venue_address', e.target.value)}
          placeholder="Enter full venue address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Ceremony Time</label>
          <input
            type="time"
            className="form-input"
            value={formData.ceremony_time || ''}
            onChange={(e) => updateField('ceremony_time', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Reception Time</label>
          <input
            type="time"
            className="form-input"
            value={formData.reception_time || ''}
            onChange={(e) => updateField('reception_time', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const GettingReadyForm = () => {
  const { formData, updateField } = useForm();

  return (
    <div className="space-y-6">
      <div className="bg-sky-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-sky-800 mb-2">Getting Ready Photos</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.getting_ready_photos || false}
            onChange={(e) => updateField('getting_ready_photos', e.target.checked)}
            className="rounded border-sky-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sky-700">
            Yes, we'd like getting ready photos included
          </span>
        </label>
      </div>

      {formData.getting_ready_photos && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Bride's Getting Ready Location</label>
              <input
                type="text"
                className="form-input"
                value={formData.bride_getting_ready_location || ''}
                onChange={(e) => updateField('bride_getting_ready_location', e.target.value)}
                placeholder="Hotel, home address, etc."
              />
            </div>
            <div>
              <label className="form-label">Bride's Getting Ready Time</label>
              <input
                type="time"
                className="form-input"
                value={formData.bride_getting_ready_time || ''}
                onChange={(e) => updateField('bride_getting_ready_time', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Groom's Getting Ready Location</label>
              <input
                type="text"
                className="form-input"
                value={formData.groom_getting_ready_location || ''}
                onChange={(e) => updateField('groom_getting_ready_location', e.target.value)}
                placeholder="Hotel, home address, etc."
              />
            </div>
            <div>
              <label className="form-label">Groom's Getting Ready Time</label>
              <input
                type="time"
                className="form-input"
                value={formData.groom_getting_ready_time || ''}
                onChange={(e) => updateField('groom_getting_ready_time', e.target.value)}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const CeremonyForm = () => {
  const { formData, updateField } = useForm();

  return (
    <div className="space-y-6">
      <div>
        <label className="form-label">Ceremony Style</label>
        <select
          className="form-input"
          value={formData.ceremony_style || ''}
          onChange={(e) => updateField('ceremony_style', e.target.value)}
        >
          <option value="">Select ceremony style</option>
          <option value="traditional">Traditional</option>
          <option value="religious">Religious</option>
          <option value="civil">Civil</option>
          <option value="outdoor">Outdoor</option>
          <option value="destination">Destination</option>
          <option value="elopement">Elopement</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="form-label">Estimated Ceremony Duration</label>
        <select
          className="form-input"
          value={formData.ceremony_duration || ''}
          onChange={(e) => updateField('ceremony_duration', e.target.value)}
        >
          <option value="">Select duration</option>
          <option value="15-30">15-30 minutes</option>
          <option value="30-45">30-45 minutes</option>
          <option value="45-60">45-60 minutes</option>
          <option value="60+">60+ minutes</option>
        </select>
      </div>

      <div>
        <label className="form-label">Special Traditions or Customs</label>
        <textarea
          className="form-input"
          rows={4}
          value={formData.special_traditions || ''}
          onChange={(e) => updateField('special_traditions', e.target.value)}
          placeholder="Describe any special traditions, cultural customs, or unique elements we should capture..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.ring_bearer || false}
              onChange={(e) => updateField('ring_bearer', e.target.checked)}
              className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sage-700">Ring Bearer</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.flower_girl || false}
              onChange={(e) => updateField('flower_girl', e.target.checked)}
              className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sage-700">Flower Girl</span>
          </label>
        </div>
      </div>
    </div>
  );
};

const ReceptionForm = () => {
  const { formData, updateField } = useForm();

  return (
    <div className="space-y-6">
      <div>
        <label className="form-label">First Dance Song</label>
        <input
          type="text"
          className="form-input"
          value={formData.first_dance_song || ''}
          onChange={(e) => updateField('first_dance_song', e.target.value)}
          placeholder="Song title and artist"
        />
      </div>

      <div>
        <label className="form-label">Special Dances</label>
        <textarea
          className="form-input"
          rows={3}
          value={formData.special_dances || ''}
          onChange={(e) => updateField('special_dances', e.target.value)}
          placeholder="Father-daughter dance, mother-son dance, etc."
        />
      </div>

      <div>
        <label className="form-label">Cake Cutting Time</label>
        <input
          type="time"
          className="form-input"
          value={formData.cake_cutting_time || ''}
          onChange={(e) => updateField('cake_cutting_time', e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.bouquet_toss || false}
            onChange={(e) => updateField('bouquet_toss', e.target.checked)}
            className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sage-700">Bouquet Toss</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.confetti_shot || false}
            onChange={(e) => updateField('confetti_shot', e.target.checked)}
            className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sage-700">Confetti Shot</span>
        </label>

        {formData.confetti_shot && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="ml-6"
          >
            <label className="form-label">What type of confetti?</label>
            <select
              className="form-input"
              value={formData.confetti_type || ''}
              onChange={(e) => updateField('confetti_type', e.target.value)}
            >
              <option value="">Select confetti type</option>
              <option value="biodegradable">Biodegradable confetti</option>
              <option value="flower-petals">Flower petals</option>
              <option value="rice">Rice</option>
              <option value="bubbles">Bubbles</option>
              <option value="sparklers">Sparklers</option>
              <option value="other">Other</option>
            </select>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const GroupPhotosForm = () => {
  const { formData, updateField } = useForm();

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-yellow-800 mb-2">💡 Pro Tip</h3>
        <p className="text-yellow-700 text-sm">
          Group photos are most efficient when planned ahead. 
          Consider appointing family members to help gather people for photos.
        </p>
      </div>

      <div>
        <label className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={formData.family_photos || false}
            onChange={(e) => updateField('family_photos', e.target.checked)}
            className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sage-700 font-medium">
            Yes, we'd like formal family photos
          </span>
        </label>
      </div>

      {formData.family_photos && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6"
        >
          <div>
            <label className="form-label">Bridal Party Size</label>
            <select
              className="form-input"
              value={formData.bridal_party_count || ''}
              onChange={(e) => updateField('bridal_party_count', e.target.value)}
            >
              <option value="">Select size</option>
              <option value="0">No bridal party</option>
              <option value="1-3">1-3 people each side</option>
              <option value="4-6">4-6 people each side</option>
              <option value="7-10">7-10 people each side</option>
              <option value="10+">More than 10 each side</option>
            </select>
          </div>

          <div>
            <label className="form-label">Family Photo List</label>
            <textarea
              className="form-input"
              rows={6}
              value={formData.family_photo_list || ''}
              onChange={(e) => updateField('family_photo_list', e.target.value)}
              placeholder="Please list the specific family combinations you'd like:

Example:
- Bride + Groom with both sets of parents
- Bride with her immediate family
- Groom with his immediate family
- All grandparents with couple
- Bride + Groom with all siblings
- Extended family group (everyone)"
            />
          </div>

          <div>
            <label className="form-label">Special Group Photo Requests</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.special_group_requests || ''}
              onChange={(e) => updateField('special_group_requests', e.target.value)}
              placeholder="Any special group photos? Friends from university, work colleagues, sports teams, etc."
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SpecialRequestsForm = () => {
  const { formData, updateField } = useForm();

  return (
    <div className="space-y-6">
      <div>
        <label className="form-label">Must-Have Shots</label>
        <textarea
          className="form-input"
          rows={4}
          value={formData.must_have_shots || ''}
          onChange={(e) => updateField('must_have_shots', e.target.value)}
          placeholder="Tell us about specific moments, details, or shots that are absolutely essential to capture..."
        />
      </div>

      <div>
        <label className="form-label">Please Do NOT Photograph</label>
        <textarea
          className="form-input"
          rows={3}
          value={formData.do_not_photograph || ''}
          onChange={(e) => updateField('do_not_photograph', e.target.value)}
          placeholder="Any specific people, situations, or moments we should avoid photographing..."
        />
      </div>

      <div>
        <label className="form-label">Surprise Plans</label>
        <textarea
          className="form-input"
          rows={3}
          value={formData.surprise_plans || ''}
          onChange={(e) => updateField('surprise_plans', e.target.value)}
          placeholder="Any surprises planned during the day? We'll keep it confidential and make sure we're ready to capture the moment!"
        />
      </div>

      <div>
        <label className="form-label">Special Considerations</label>
        <textarea
          className="form-input"
          rows={4}
          value={formData.special_considerations || ''}
          onChange={(e) => updateField('special_considerations', e.target.value)}
          placeholder="Anything else we should know? Mobility considerations, weather backup plans, cultural sensitivities, etc."
        />
      </div>

      <div className="bg-sage-50 rounded-lg p-4">
        <h3 className="font-medium text-sage-800 mb-3">Additional Services</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.engagement_photos || false}
              onChange={(e) => updateField('engagement_photos', e.target.checked)}
              className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sage-700">Interested in engagement photos</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.bridal_portraits || false}
              onChange={(e) => updateField('bridal_portraits', e.target.checked)}
              className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sage-700">Interested in bridal portraits</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.album_interest || false}
              onChange={(e) => updateField('album_interest', e.target.checked)}
              className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sage-700">Interested in wedding albums</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.print_packages || false}
              onChange={(e) => updateField('print_packages', e.target.checked)}
              className="rounded border-sage-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sage-700">Interested in print packages</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default WeddingForm;