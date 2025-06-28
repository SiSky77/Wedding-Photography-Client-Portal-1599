import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ percentage, showPercentage = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-sage-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-sage-600">Progress</span>
          <span className="text-xs font-medium text-sage-700">
            {percentage}% complete
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;