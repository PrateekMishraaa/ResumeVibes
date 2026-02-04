import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  FileText, 
  Clock, 
  Award,
  Users,
  Target,
  Zap,
  DollarSign,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon = 'sparkles', 
  color = 'from-blue-500 to-cyan-500',
  trend = 0,
  subtitle = '',
  loading = false,
  onClick = null,
  className = ''
}) => {
  const icons = {
    sparkles: <Sparkles className="w-5 h-5" />,
    file: <FileText className="w-5 h-5" />,
    clock: <Clock className="w-5 h-5" />,
    award: <Award className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    target: <Target className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    dollar: <DollarSign className="w-5 h-5" />,
    check: <CheckCircle className="w-5 h-5" />,
    x: <XCircle className="w-5 h-5" />,
    bar: <BarChart3 className="w-5 h-5" />,
    pie: <PieChart className="w-5 h-5" />,
    line: <LineChart className="w-5 h-5" />,
    activity: <Activity className="w-5 h-5" />,
    trendUp: <TrendingUp className="w-5 h-5" />,
    trendDown: <TrendingDown className="w-5 h-5" />
  };

  const gradientColors = {
    'blue': 'from-blue-500 to-cyan-500',
    'purple': 'from-purple-500 to-pink-500',
    'green': 'from-green-500 to-emerald-500',
    'orange': 'from-orange-500 to-red-500',
    'indigo': 'from-indigo-500 to-purple-500',
    'teal': 'from-teal-500 to-green-500',
    'gray': 'from-gray-500 to-gray-700',
    'yellow': 'from-yellow-500 to-orange-500'
  };

  const selectedColor = gradientColors[color] || color;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Animated Background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${selectedColor} opacity-10`}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
      />
      
      {/* Main Content */}
      <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
                
                {trend !== 0 && (
                  <div className={`flex items-center text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(trend)}%
                  </div>
                )}
              </div>
            )}
            
            {subtitle && !loading && (
              <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
            )}
          </div>
          
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedColor} flex items-center justify-center`}>
            <div className="text-white">
              {icons[icon] || <Sparkles className="w-5 h-5" />}
            </div>
          </div>
        </div>
        
        {/* Progress Bar (if applicable) */}
        {typeof trend === 'number' && trend !== 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.abs(trend)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${trend > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(trend), 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Shine Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -inset-x-full -top-40 h-32 w-64 rotate-45 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </motion.div>
  );
};

// Enhanced StatsCard with Sparkline
export const StatsCardWithSparkline = ({ 
  title, 
  value, 
  data = [],
  color = 'blue',
  ...props 
}) => {
  const colors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600'
  };

  const maxValue = Math.max(...data, 1);
  const sparklineHeight = 40;

  return (
    <StatsCard
      title={title}
      value={value}
      color={color}
      {...props}
    >
      {data.length > 0 && (
        <div className="mt-4 h-16">
          <svg width="100%" height={sparklineHeight} className={colors[color]}>
            <path
              d={data.map((point, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = ((maxValue - point) / maxValue) * sparklineHeight;
                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`;
              }).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Dots at data points */}
            {data.map((point, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = ((maxValue - point) / maxValue) * sparklineHeight;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={y}
                  r="3"
                  fill="currentColor"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              );
            })}
          </svg>
        </div>
      )}
    </StatsCard>
  );
};

// StatsCard Grid Component
export const StatsGrid = ({ children, cols = 4 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-6`}>
      {children}
    </div>
  );
};

export default StatsCard;