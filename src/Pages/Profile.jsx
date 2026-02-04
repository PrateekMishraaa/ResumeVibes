import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  Award,
  Calendar,
  Edit,
  Save,
  Camera,
  Lock,
  Bell,
  Shield,
  Download,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  FileText,
  Clock,
  Settings
} from 'lucide-react';
import ParticleBackground from '../components/Animations/ParticleBackground';
import { fadeInUp, staggerContainer, scaleUp } from '../utils/animations';
import { formatDate, formatNumber, formatScore } from '../utils/formatters';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      linkedin: user?.linkedin || '',
      github: user?.github || '',
      portfolio: user?.portfolio || '',
      jobTitle: user?.jobTitle || '',
      company: user?.company || '',
      bio: user?.bio || '',
      
      // Password change
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      
      // Preferences
      notifications: user?.preferences?.notifications || true,
      newsletter: user?.preferences?.newsletter || true,
      darkMode: user?.preferences?.darkMode || false,
      autoSave: user?.preferences?.autoSave || true,
      
      // Privacy
      profileVisibility: user?.privacy?.profileVisibility || 'public',
      resumeVisibility: user?.privacy?.resumeVisibility || 'private',
      showEmail: user?.privacy?.showEmail || false,
      showPhone: user?.privacy?.showPhone || false
    }
  });

  // Watch password for validation
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    fetchUserResumes();
    fetchUserStats();
  }, []);

  const fetchUserResumes = async () => {
    try {
      const response = await resumeAPI.getResumes();
      setResumes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      // For demo, create sample resumes
      setResumes([
        {
          _id: '1',
          title: 'Software Developer Resume',
          optimizationScore: 85,
          updatedAt: new Date().toISOString(),
          template: 'professional'
        },
        {
          _id: '2',
          title: 'Senior Developer Resume',
          optimizationScore: 92,
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          template: 'modern'
        },
        {
          _id: '3',
          title: 'Project Manager Resume',
          optimizationScore: 78,
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          template: 'executive'
        }
      ]);
    }
  };

  const fetchUserStats = async () => {
    // In a real app, fetch user stats from API
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'resumes', label: 'My Resumes', icon: <FileText className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings className="w-5 h-5" /> },
    { id: 'activity', label: 'Activity', icon: <Clock className="w-5 h-5" /> }
  ];

  const userStats = {
    totalResumes: resumes.length,
    avgScore: resumes.length > 0 
      ? Math.round(resumes.reduce((acc, r) => acc + (r.optimizationScore || 0), 0) / resumes.length)
      : 0,
    optimizedResumes: resumes.filter(r => r.optimizationScore >= 80).length,
    recentActivity: 3
  };

  const activityLog = [
    {
      id: 1,
      action: 'Resume Created',
      description: 'Created "Software Developer Resume"',
      timestamp: new Date().toISOString(),
      icon: <FileText className="w-5 h-5 text-blue-600" />
    },
    {
      id: 2,
      action: 'Resume Optimized',
      description: 'Optimized "Senior Developer Resume" (Score: 92)',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      icon: <Sparkles className="w-5 h-5 text-purple-600" />
    },
    {
      id: 3,
      action: 'Profile Updated',
      description: 'Updated contact information',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      icon: <User className="w-5 h-5 text-green-600" />
    }
  ];

  const handleProfileUpdate = async (data) => {
    setLoading(true);
    try {
      const profileData = {
        name: data.name,
        phone: data.phone,
        location: data.location,
        linkedin: data.linkedin,
        github: data.github,
        portfolio: data.portfolio,
        jobTitle: data.jobTitle,
        company: data.company,
        bio: data.bio
      };

      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Update local user context
        updateProfile(profileData);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      if (result.success) {
        toast.success('Password changed successfully!');
        reset({
          ...watch(),
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(result.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSave = async (data) => {
    setLoading(true);
    try {
      const preferences = {
        notifications: data.notifications,
        newsletter: data.newsletter,
        darkMode: data.darkMode,
        autoSave: data.autoSave
      };

      const result = await authService.savePreferences(preferences);
      
      if (result.success) {
        toast.success('Preferences saved!');
      } else {
        toast.error(result.error || 'Failed to save preferences');
      }
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setLoading(true);
    try {
      // In real app, prompt for password
      const result = await authService.deleteAccount('currentPassword');
      
      if (result.success) {
        toast.success('Account deleted successfully');
        logout();
      } else {
        toast.error(result.error || 'Failed to delete account');
        setDeleteConfirm(false);
      }
    } catch (error) {
      toast.error('Failed to delete account');
      setDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeAction = (action, resumeId) => {
    switch (action) {
      case 'view':
        toast.success('Opening resume...');
        break;
      case 'edit':
        toast.success('Editing resume...');
        break;
      case 'delete':
        toast.success('Deleting resume...');
        setResumes(resumes.filter(r => r._id !== resumeId));
        break;
      case 'optimize':
        toast.success('Redirecting to optimizer...');
        break;
    }
  };

  const renderProfileTab = () => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />
        
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-blue-600" />
                )}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(handleProfileUpdate)}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          {...register('phone')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          {...register('location')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          {...register('jobTitle')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          {...register('company')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                        <input
                          type="url"
                          {...register('linkedin')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub
                      </label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
                        <input
                          type="url"
                          {...register('github')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="url"
                          {...register('portfolio')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h1>
                    {(watch('jobTitle') || user?.jobTitle) && (
                      <p className="text-xl text-gray-600 mb-4">
                        {watch('jobTitle') || user?.jobTitle}
                        {(watch('company') || user?.company) && ` at ${watch('company') || user?.company}`}
                      </p>
                    )}
                    
                    <p className="text-gray-700">
                      {watch('bio') || user?.bio || 'No bio added yet.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                      
                      {watch('email') || user?.email ? (
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700">{watch('email') || user?.email}</span>
                        </div>
                      ) : null}
                      
                      {watch('phone') || user?.phone ? (
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700">{watch('phone') || user?.phone}</span>
                        </div>
                      ) : null}
                      
                      {watch('location') || user?.location ? (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-700">{watch('location') || user?.location}</span>
                        </div>
                      ) : null}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Links</h3>
                      
                      {watch('linkedin') || user?.linkedin ? (
                        <a href={watch('linkedin') || user?.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700">
                          <Linkedin className="w-5 h-5 mr-3" />
                          LinkedIn Profile
                        </a>
                      ) : null}
                      
                      {watch('github') || user?.github ? (
                        <a href={watch('github') || user?.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-800 hover:text-gray-900">
                          <Github className="w-5 h-5 mr-3" />
                          GitHub Profile
                        </a>
                      ) : null}
                      
                      {watch('portfolio') || user?.portfolio ? (
                        <a href={watch('portfolio') || user?.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-gray-900">
                          <Globe className="w-5 h-5 mr-3" />
                          Portfolio Website
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Total Resumes</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{userStats.totalResumes}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Average Score</span>
                  </div>
                  <span className={`text-2xl font-bold ${formatScore(userStats.avgScore).color}`}>
                    {userStats.avgScore}/100
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">Optimized</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{userStats.optimizedResumes}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-orange-600 mr-3" />
                    <span className="text-gray-700">Member Since</span>
                  </div>
                  <span className="text-gray-700">
                    {formatDate(user?.createdAt || new Date(), 'month-year')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Verified</span>
                  <div className="flex items-center">
                    {user?.isVerified ? (
                      <>
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-700">Verified</span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5 text-red-600 mr-2" />
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          Verify Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Account Type</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {user?.subscription || 'Free'}
                  </span>
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderResumesTab = () => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{userStats.totalResumes}</div>
          <div className="text-blue-100">Total Resumes</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{userStats.optimizedResumes}</div>
          <div className="text-purple-100">Optimized</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{userStats.avgScore}/100</div>
          <div className="text-green-100">Avg Score</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{formatNumber(userStats.recentActivity)}</div>
          <div className="text-orange-100">Recent Activity</div>
        </div>
      </div>

      {/* Resume List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
          <button
            onClick={() => toast.success('Creating new resume...')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
            <button
              onClick={() => toast.success('Creating new resume...')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {resumes.map((resume) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {resume.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Updated {formatDate(resume.updatedAt, 'relative')}</span>
                        {resume.template && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {resume.template}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {resume.optimizationScore && (
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${formatScore(resume.optimizationScore).color}`}>
                          {resume.optimizationScore}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleResumeAction('view', resume._id)}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResumeAction('edit', resume._id)}
                        className="p-2 text-gray-600 hover:text-green-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResumeAction('optimize', resume._id)}
                        className="p-2 text-gray-600 hover:text-purple-600"
                        title="Optimize"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResumeAction('delete', resume._id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderSecurityTab = () => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Password Change */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
        
        <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('currentPassword', { required: 'Current password is required' })}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                {...register('newPassword', { 
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' }
                })}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', { 
                  required: 'Please confirm password',
                  validate: value => value === newPassword || 'Passwords do not match'
                })}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Enable 2FA
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Login Sessions</h3>
              <p className="text-sm text-gray-600">Manage your active login sessions</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              View Sessions
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">API Access</h3>
              <p className="text-sm text-gray-600">Manage API keys and access</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Manage API Keys
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Danger Zone</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Delete Account</h3>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleAccountDelete}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium ${
                deleteConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'border border-red-600 text-red-600 hover:bg-red-50'
              }`}
            >
              {deleteConfirm ? 'Confirm Delete' : 'Delete Account'}
            </button>
          </div>
          
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 mb-3">
                ⚠️ Are you sure you want to delete your account? All your data will be permanently removed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccountDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderPreferencesTab = () => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(handlePreferencesSave)}>
        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <Bell className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">Email Notifications</span>
                <p className="text-sm text-gray-600">Receive email updates about your account</p>
              </div>
              <input
                type="checkbox"
                {...register('notifications')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">Newsletter</span>
                <p className="text-sm text-gray-600">Receive tips and updates about ResumeVibe</p>
              </div>
              <input
                type="checkbox"
                {...register('newsletter')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">Resume Optimization Alerts</span>
                <p className="text-sm text-gray-600">Get notified when new optimization features are available</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Display Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">Dark Mode</span>
                <p className="text-sm text-gray-600">Use dark theme across the application</p>
              </div>
              <input
                type="checkbox"
                {...register('darkMode')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">Auto-save</span>
                <p className="text-sm text-gray-600">Automatically save changes while editing</p>
              </div>
              <input
                type="checkbox"
                {...register('autoSave')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Resume Template
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="professional">Professional</option>
                <option value="modern">Modern</option>
                <option value="creative">Creative</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select {...register('profileVisibility')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="connections">Connections Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Visibility
              </label>
              <select {...register('resumeVisibility')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="private">Private (Only Me)</option>
                <option value="public">Public</option>
                <option value="shareable">Shareable with Link</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">Show Email Publicly</span>
                  <p className="text-sm text-gray-600">Allow others to see your email address</p>
                </div>
                <input
                  type="checkbox"
                  {...register('showEmail')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">Show Phone Number</span>
                  <p className="text-sm text-gray-600">Allow others to see your phone number</p>
                </div>
                <input
                  type="checkbox"
                  {...register('showPhone')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderActivityTab = () => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
          <div className="text-gray-600">Resumes Created</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl font-bold text-gray-900 mb-2">8</div>
          <div className="text-gray-600">Resumes Optimized</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl font-bold text-gray-900 mb-2">4</div>
          <div className="text-gray-600">Exports</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        
        <div className="space-y-6">
          {activityLog.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(activity.timestamp, 'relative')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Export History</h2>
        
        <div className="space-y-4">
          {[
            { id: 1, name: 'Software Developer Resume.pdf', date: '2024-01-15', size: '1.2 MB' },
            { id: 2, name: 'Senior Developer Resume.docx', date: '2024-01-10', size: '0.8 MB' },
            { id: 3, name: 'Project Manager Resume.pdf', date: '2024-01-05', size: '1.5 MB' }
          ].map((exportItem) => (
            <div key={exportItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <FileText className="w-6 h-6 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{exportItem.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(exportItem.date, 'medium')} • {exportItem.size}
                  </p>
                </div>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ParticleBackground />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, security, and preferences</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="mr-3">{tab.icon}</div>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
              
              {/* Upgrade Card */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-gray-600 mb-3">Unlock advanced features and unlimited resumes</p>
                <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'resumes' && renderResumesTab()}
              {activeTab === 'security' && renderSecurityTab()}
              {activeTab === 'preferences' && renderPreferencesTab()}
              {activeTab === 'activity' && renderActivityTab()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;