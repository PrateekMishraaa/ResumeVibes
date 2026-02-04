import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Loader2, 
  Clock, 
  Zap,
  Target,
  FileText
} from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md',
  message = 'Loading...',
  type = 'spinner',
  fullScreen = false,
  color = 'blue',
  showLogo = false
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  const spinnerTypes = {
    spinner: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-current border-t-transparent rounded-full`}
      />
    ),
    dots: (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
            className={`w-2 h-2 ${colorClasses[color]} bg-current rounded-full`}
          />
        ))}
      </div>
    ),
    pulse: (
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Zap className="w-full h-full" />
      </motion.div>
    ),
    clock: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Clock className="w-full h-full" />
      </motion.div>
    ),
    sparkles: (
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Sparkles className="w-full h-full" />
      </motion.div>
    ),
    target: (
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`${sizeClasses[size]} ${colorClasses[color]} opacity-30`}
        >
          <Target className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]}`}
        >
          <Loader2 className="w-full h-full" />
        </motion.div>
      </div>
    ),
    resume: (
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <FileText className="w-full h-full" />
      </motion.div>
    )
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 z-50'
    : 'flex flex-col items-center justify-center';

  return (
    <div className={containerClasses}>
      {/* Background Animation for full screen */}
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* Logo for full screen */}
      {showLogo && fullScreen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">RV</span>
          </div>
        </motion.div>
      )}

      {/* Spinner */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {spinnerTypes[type]}
      </motion.div>

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-4 font-medium ${fullScreen ? 'text-gray-700' : 'text-gray-600'}`}
        >
          {message}
        </motion.p>
      )}

      {/* Progress Bar for longer loads */}
      {fullScreen && (
        <div className="mt-8 w-64">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      {/* Tips for full screen */}
      {fullScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center max-w-md"
        >
          <p className="text-sm text-gray-500 italic">
            "Great resumes are built with patience and precision"
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Loading Overlay Component
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  ...props 
}) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
        <LoadingSpinner {...props} />
      </div>
    </div>
  );
};

// Skeleton Loader Component
export const SkeletonLoader = ({ 
  type = 'card',
  count = 1,
  className = ''
}) => {
  const skeletonTypes = {
    card: (
      <div className="bg-white rounded-xl shadow p-6 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="mt-6 h-2 bg-gray-200 rounded"></div>
      </div>
    ),
    line: (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    ),
    list: (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    ),
    table: (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    ),
    dashboard: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    )
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={index > 0 ? 'mt-4' : ''}>
          {skeletonTypes[type]}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;