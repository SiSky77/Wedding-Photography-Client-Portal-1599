import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../contexts/FormContext';
import SafeIcon from '../components/common/SafeIcon';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiCheckCircle, FiClock, FiCalendar, FiMapPin, FiPhone } = FiIcons;

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { formData, completionPercentage, getFormSections, loading } = useForm();
  const [showConfetti, setShowConfetti] = useState(false);
  const [previousPercentage, setPreviousPercentage] = useState(0);

  useEffect(() => {
    if (completionPercentage === 100 && previousPercentage < 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    setPreviousPercentage(completionPercentage);
  }, [completionPercentage, previousPercentage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your wedding details..." />
      </div>
    );
  }

  const sections = getFormSections();
  const completedSections = sections.filter(section => {
    const sectionFields = section.fields;
    return sectionFields.some(field => formData[field] && formData[field].toString().trim() !== '');
  });

  const getMotivationalMessage = () => {
    if (completionPercentage === 100) {
      return "🎉 Perfect! Your wedding details are complete. We're ready to capture your special day!";
    } else if (completionPercentage >= 75) {
      return "✨ Almost there! Just a few more details and we'll have everything we need.";
    } else if (completionPercentage >= 50) {
      return "💫 Great progress! You're halfway through sharing your wedding vision with us.";
    } else if (completionPercentage >= 25) {
      return "🌟 Nice start! Keep going - each detail helps us capture your perfect day.";
    } else {
      return "💑 Welcome! Let's start gathering the details to make your wedding photography perfect.";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-sage-800 mb-4">
          Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-lg text-sage-600 max-w-2xl mx-auto">
          Your wedding planning portal - where we gather all the beautiful details 
          to make your photography perfect.
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="section-card mb-8"
      >
        <div className="text-center mb-6">
          <h2 className="font-oswald text-2xl font-semibold text-sage-800 mb-2">
            Your Progress
          </h2>
          <p className="text-sage-600 mb-4">
            {getMotivationalMessage()}
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <ProgressBar percentage={completionPercentage} size="lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-center">
          <div className="bg-sky-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-sky-600">{completedSections.length}</div>
            <div className="text-sm text-sky-700">Sections Started</div>
          </div>
          <div className="bg-sage-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-sage-600">{sections.length}</div>
            <div className="text-sm text-sage-700">Total Sections</div>
          </div>
          <div className="bg-cream-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-cream-700">
              {formData.wedding_date ? new Date(formData.wedding_date).toLocaleDateString() : 'TBD'}
            </div>
            <div className="text-sm text-cream-800">Wedding Date</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Info */}
      {(formData.bride_name || formData.groom_name || formData.venue_name) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="section-card mb-8"
        >
          <h3 className="font-oswald text-xl font-semibold text-sage-800 mb-4">
            Quick Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.bride_name && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-500" />
                <span className="text-sm text-sage-700">Bride: {formData.bride_name}</span>
              </div>
            )}
            {formData.groom_name && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="h-4 w-4 text-green-500" />
                <span className="text-sm text-sage-700">Groom: {formData.groom_name}</span>
              </div>
            )}
            {formData.wedding_date && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCalendar} className="h-4 w-4 text-sky-500" />
                <span className="text-sm text-sage-700">
                  {new Date(formData.wedding_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {formData.venue_name && (
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMapPin} className="h-4 w-4 text-sage-500" />
                <span className="text-sm text-sage-700">{formData.venue_name}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Form Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="font-oswald text-2xl font-semibold text-sage-800 mb-6">
          Wedding Planning Sections
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const isCompleted = section.fields.some(field => 
              formData[field] && formData[field].toString().trim() !== ''
            );
            const hasData = section.fields.some(field => formData[field]);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`section-card transition-all duration-300 hover:scale-105 ${
                  isCompleted ? 'ring-2 ring-green-200 bg-green-50/50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-2xl">{section.icon}</div>
                  {isCompleted ? (
                    <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-500" />
                  ) : hasData ? (
                    <SafeIcon icon={FiClock} className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <SafeIcon icon={FiEdit3} className="h-5 w-5 text-sage-400" />
                  )}
                </div>
                
                <h4 className="font-oswald text-lg font-semibold text-sage-800 mb-2">
                  {section.title}
                </h4>
                <p className="text-sm text-sage-600 mb-4">
                  {section.description}
                </p>
                
                <Link
                  to={`/form/${section.id}`}
                  className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isCompleted 
                      ? 'text-green-600 hover:text-green-700'
                      : hasData
                      ? 'text-yellow-600 hover:text-yellow-700'
                      : 'text-sky-600 hover:text-sky-700'
                  }`}
                >
                  <span>
                    {isCompleted ? 'Review & Edit' : hasData ? 'Continue' : 'Get Started'}
                  </span>
                  <SafeIcon icon={FiEdit3} className="h-3 w-3" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center space-y-4"
      >
        <Link
          to="/form"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiEdit3} className="h-4 w-4" />
          <span>Continue Wedding Form</span>
        </Link>
        
        {completionPercentage < 100 && (
          <p className="text-sm text-sage-600">
            💡 Tip: Your progress is automatically saved as you go. 
            Feel free to come back anytime!
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;