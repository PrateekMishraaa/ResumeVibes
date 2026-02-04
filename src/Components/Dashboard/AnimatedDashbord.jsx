import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { resumeAPI } from '../../services/api';
import StatsCard, { StatsGrid } from './StatsCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import { 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Users,
  Target,
  Zap,
  Calendar,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { fadeInUp, staggerContainer, scaleUp } from '../../utils/animations';
import { formatDate, formatNumber, formatScore } from '../../utils/formatters';

const AnimatedDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch resumes
      const resumesResponse = await resumeAPI.getResumes();
      const resumesData = resumesResponse.data.data || [];
      
      // For demo, add some sample data if empty
      if (resumesData.length === 0) {
        resumesData.push(...generateSampleResumes());
      }
      
      setResumes(resumesData);
      
      // Calculate stats
      const calculatedStats = calculateStats(resumesData);
      setStats(calculatedStats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set fallback data
      setResumes(generateSampleResumes());
      setStats(calculateStats(generateSampleResumes()));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateSampleResumes = () => {
    return [
      {
        _id: '1',
        title: 'Software Developer Resume',
        optimizationScore: 85,
        updatedAt: new Date().toISOString(),
        views: 42,
        downloads: 8,
        status: 'optimized',
        template: 'professional'
      },
      {
        _id: '2',
        title: 'Senior Developer Resume',
        optimizationScore: 92,
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        views: 68,
        downloads: 12,
        status: 'optimized',
        template: 'modern'
      },
      {
        _id: '3',
        title: 'Project Manager Resume',
        optimizationScore: 78,
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        views: 24,
        downloads: 3,
        status: 'draft',
        template: 'executive'
      },
      {
        _id: '4',
        title: 'Frontend Developer Resume',
        optimizationScore: 88,
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
        views: 56,
        downloads: 9,
        status: 'optimized',
        template: 'creative'
      }
    ];
  };

  const calculateStats = (resumesData) => {
    const totalResumes = resumesData.length;
    const avgScore = totalResumes > 0 
      ? Math.round(resumesData.reduce((acc, r) => acc + (r.optimizationScore || 0), 0) / totalResumes)
      : 0;
    const optimizedResumes = resumesData.filter(r => r.optimizationScore >= 80).length;
    const totalViews = resumesData.reduce((acc, r) => acc + (r.views || 0), 0);
    const totalDownloads = resumesData.reduce((acc, r) => acc + (r.downloads || 0), 0);
    const recentActivity = resumesData.filter(r => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(r.updatedAt) > weekAgo;
    }).length;

    return {
      totalResumes,
      avgScore,
      optimizedResumes,
      totalViews,
      totalDownloads,
      recentActivity,
      conversionRate: totalViews > 0 ? ((totalDownloads / totalViews) * 100).toFixed(1) : 0
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleResumeAction = (action, resume) => {
    switch (action) {
      case 'view':
        toast.success(`Viewing ${resume.title}`);
        break;
      case 'edit':
        toast.success(`Editing ${resume.title}`);
        break;
      case 'optimize':
        toast.success(`Optimizing ${resume.title}`);
        break;
      case 'delete':
        setResumes(resumes.filter(r => r._id !== resume._id));
        toast.success('Resume deleted');
        break;
      case 'download':
        toast.success(`Downloading ${resume.title}`);
        break;
    }
  };

  const filteredResumes = resumes.filter(resume => {
    if (filter === 'optimized' && resume.optimizationScore < 80) return false;
    if (filter === 'draft' && resume.status !== 'draft') return false;
    if (filter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(resume.updatedAt) > weekAgo;
    }
    if (searchQuery && !resume.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const performanceData = [65, 78, 85, 92, 88, 95, 90];
  const activityData = [12, 19, 15, 25, 22, 30, 28];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your resumes today
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0"
          >
            <button
              onClick={() => toast.success('Creating new resume...')}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Resume
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 90 days</option>
                <option value="year">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <StatsGrid cols={4}>
            <StatsCard
              title="Total Resumes"
              value={stats.totalResumes}
              icon="file"
              color="blue"
              trend={12}
              subtitle={`${stats.optimizedResumes} optimized`}
            />
            
            <StatsCard
              title="Avg. Score"
              value={`${stats.avgScore}/100`}
              icon="award"
              color="purple"
              trend={8}
              subtitle={`${stats.optimizedResumes}/${stats.totalResumes} optimized`}
            />
            
            <StatsCard
              title="Total Views"
              value={formatNumber(stats.totalViews)}
              icon="activity"
              color="green"
              trend={24}
              subtitle={`${stats.totalDownloads} downloads`}
            />
            
            <StatsCard
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              icon="trendUp"
              color="orange"
              trend={15}
              subtitle="Downloads per view"
            />
          </StatsGrid>
        </motion.div>

        {/* Performance Charts */}
        <motion.div
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
                <LineChart className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="h-64">
                <svg width="100%" height="100%" className="text-blue-500">
                  <defs>
                    <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area Chart */}
                  <path
                    d={`M 0,100 ${performanceData.map((point, i) => {
                      const x = (i / (performanceData.length - 1)) * 100;
                      const y = 100 - (point * 0.8); // Scale to fit
                      return `L ${x}% ${y}`;
                    }).join(' ')} L 100,100 Z`}
                    fill="url(#performanceGradient)"
                  />
                  
                  {/* Line Chart */}
                  <path
                    d={`M 0,${100 - (performanceData[0] * 0.8)} ${performanceData.slice(1).map((point, i) => {
                      const x = ((i + 1) / (performanceData.length - 1)) * 100;
                      const y = 100 - (point * 0.8);
                      return `L ${x}% ${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data Points */}
                  {performanceData.map((point, i) => {
                    const x = (i / (performanceData.length - 1)) * 100;
                    const y = 100 - (point * 0.8);
                    return (
                      <g key={i}>
                        <circle
                          cx={`${x}%`}
                          cy={y}
                          r="4"
                          fill="currentColor"
                          className="opacity-0 hover:opacity-100 transition-opacity"
                        />
                        <text
                          x={`${x}%`}
                          y={y - 10}
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                        >
                          {point}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              
              <div className="h-64 flex items-end space-x-2">
                {activityData.map((value, i) => {
                  const height = (value / Math.max(...activityData)) * 100;
                  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-10 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg relative group"
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {value} activities
                        </div>
                      </motion.div>
                      <span className="mt-2 text-sm text-gray-600">{days[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resume List */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
                <p className="text-gray-600">Manage and track your resume performance</p>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Resumes</option>
                    <option value="optimized">Optimized</option>
                    <option value="draft">Drafts</option>
                    <option value="recent">Recent</option>
                  </select>
                  
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredResumes.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try a different search term' : 'Create your first resume to get started'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                  toast.success('Creating new resume...');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
              >
                Create New Resume
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredResumes.map((resume, index) => (
                  <motion.div
                    key={resume._id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                              {resume.title}
                            </h3>
                            {resume.status === 'optimized' && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Optimized
                              </span>
                            )}
                            {resume.status === 'draft' && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                Draft
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>Updated {formatDate(resume.updatedAt, 'relative')}</span>
                            {resume.template && (
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                {resume.template}
                              </span>
                            )}
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {resume.views || 0} views
                            </span>
                            <span className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              {resume.downloads || 0} downloads
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Score Display */}
                        {resume.optimizationScore && (
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${formatScore(resume.optimizationScore).color}`}>
                              {resume.optimizationScore}
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleResumeAction('view', resume)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleResumeAction('edit', resume)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleResumeAction('optimize', resume)}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Optimize"
                          >
                            <Sparkles className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleResumeAction('download', resume)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleResumeAction('delete', resume)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={fadeInUp}
          className="mt-8"
        >
          <StatsGrid cols={3}>
            <StatsCard
              title="AI Suggestions"
              value="24"
              icon="sparkles"
              color="purple"
              trend={18}
              subtitle="Improvements suggested"
            />
            
            <StatsCard
              title="Time Saved"
              value="8.5 hrs"
              icon="clock"
              color="green"
              trend={32}
              subtitle="Compared to manual editing"
            />
            
            <StatsCard
              title="Success Rate"
              value="94%"
              icon="target"
              color="orange"
              trend={5}
              subtitle="Interview conversion"
            />
          </StatsGrid>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedDashboard;