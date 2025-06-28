import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCamera, FiHeart, FiCheck, FiArrowRight } = FiIcons;

const LandingPage = () => {
  const features = [
    {
      icon: FiCamera,
      title: 'Easy Form Management',
      description: 'Fill out your wedding details at your own pace with auto-save functionality'
    },
    {
      icon: FiHeart,
      title: 'Personalized Experience',
      description: 'Tailored questions based on your wedding style and preferences'
    },
    {
      icon: FiCheck,
      title: 'Progress Tracking',
      description: 'See your completion progress and never lose your information'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-sage-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <img 
                src="/logo.png" 
                alt="Sky Photography Logo" 
                className="h-20 w-20 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <SafeIcon 
                icon={FiCamera} 
                className="h-20 w-20 text-sky-600 hidden" 
              />
            </div>
            
            <h1 className="font-oswald text-5xl md:text-6xl font-bold text-sage-800 leading-tight">
              Sky Photography
            </h1>
            
            <p className="font-cormorant text-2xl md:text-3xl text-sage-600 italic">
              Wedding Planning Made Beautiful
            </p>
            
            <p className="text-lg text-sage-600 max-w-2xl mx-auto leading-relaxed">
              Welcome to your personalized wedding planning portal. Share your vision, 
              preferences, and special moments with us to ensure your perfect day is 
              captured exactly as you dreamed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="btn-primary inline-flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="font-oswald text-3xl md:text-4xl font-bold text-sage-800 mb-4">
              Why Choose Our Planning Portal?
            </h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Designed specifically for couples who want a seamless, stress-free way 
              to share their wedding vision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className="section-card text-center"
              >
                <div className="flex justify-center mb-4">
                  <SafeIcon icon={feature.icon} className="h-12 w-12 text-sky-600" />
                </div>
                <h3 className="font-oswald text-xl font-semibold text-sage-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sage-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-600 to-sky-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="font-oswald text-3xl md:text-4xl font-bold text-white">
              Ready to Start Planning?
            </h2>
            <p className="text-xl text-sky-100 max-w-2xl mx-auto">
              Join us in creating the perfect wedding photography experience tailored just for you.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center space-x-2 bg-white text-sky-700 font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Access Your Portal</span>
              <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;