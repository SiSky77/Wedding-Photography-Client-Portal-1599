import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiCamera, FiMail, FiPhone } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-sage-800 text-sage-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Sky Photography Logo" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <SafeIcon 
                icon={FiCamera} 
                className="h-6 w-6 text-sky-400 hidden" 
              />
              <span className="font-oswald text-lg font-semibold">
                Sky Photography
              </span>
            </div>
            <p className="text-sage-300 text-sm leading-relaxed">
              Capturing your perfect moments with artistry and passion. Creating timeless 
              memories that tell your unique love story.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-oswald text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sage-300">
                <SafeIcon icon={FiMail} className="h-4 w-4" />
                <span className="text-sm">hello@skyphotography.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sage-300">
                <SafeIcon icon={FiPhone} className="h-4 w-4" />
                <span className="text-sm">+44 123 456 7890</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-oswald text-lg font-semibold">Support</h3>
            <div className="space-y-2 text-sm text-sage-300">
              <p>Need help with your wedding form?</p>
              <p>Contact us anytime for assistance.</p>
              <p className="text-xs text-sage-400 mt-4">
                Your data is secure and GDPR compliant.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-sage-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sage-400 text-sm">
            © 2024 Sky Photography. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sage-400 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <SafeIcon icon={FiHeart} className="h-4 w-4 text-red-400" />
            <span>for capturing love</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;