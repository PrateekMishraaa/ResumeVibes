// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Eye,
  Upload,
  X
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getResumes();
      const apiResumes = response.data.data || [];
      
      const localResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      
      const allResumes = [...apiResumes, ...localResumes];
      
      const uniqueResumes = Array.from(new Map(
        allResumes.map(resume => [resume._id || resume.id || Date.now().toString(), resume])
      ).values());
      
      setResumes(uniqueResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      
      const localResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      if (localResumes.length > 0) {
        setResumes(localResumes);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      
      // Try to upload to API first
      try {
        const response = await resumeAPI.uploadResume(formData);
        const uploadedResume = response.data.data;
        
        const newResume = {
          _id: uploadedResume._id,
          title: uploadFile.name,
          optimizationScore: 0,
          updatedAt: new Date().toISOString(),
          optimizedContent: false,
          originalContent: uploadedResume.originalContent,
          parsedData: extractResumeData(uploadedResume.originalContent)
        };
        
        setResumes([newResume, ...resumes]);
        toast.success('Resume uploaded successfully!');
        
      } catch (apiError) {
        console.warn('API upload failed, using local storage:', apiError);
        
        // Fallback to localStorage
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          const parsedData = parseResumeText(text);
          
          const newResume = {
            _id: Date.now().toString(),
            title: uploadFile.name,
            optimizationScore: calculateOptimizationScore(parsedData),
            updatedAt: new Date().toISOString(),
            optimizedContent: false,
            parsedData: parsedData
          };
          
          const localResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
          localResumes.unshift(newResume);
          localStorage.setItem('userResumes', JSON.stringify(localResumes));
          
          setResumes([newResume, ...resumes]);
          toast.success('Resume uploaded locally!');
        };
        
        reader.readAsText(uploadFile);
      }
      
      setShowUpload(false);
      setUploadFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading resume');
    } finally {
      setUploading(false);
    }
  };

  const parseResumeText = (text) => {
    const lines = text.split('\n');
    const parsedData = {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      education: [],
      experience: [],
      skills: [],
      certifications: []
    };
    
    lines.forEach(line => {
      line = line.trim();
      
      if (!parsedData.name && /^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(line)) {
        parsedData.name = line;
      }
      
      if (!parsedData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)) {
        parsedData.email = line;
      }
      
      if (!parsedData.phone && /[\+]?[1-9][\d]{0,15}/.test(line.replace(/\D/g, ''))) {
        parsedData.phone = line;
      }
    });
    
    return parsedData;
  };

  const extractResumeData = (originalContent) => {
    if (!originalContent) return {};
    
    return {
      name: originalContent.personalInfo?.name || 
            `${originalContent.personalInfo?.firstName || ''} ${originalContent.personalInfo?.lastName || ''}`.trim(),
      email: originalContent.personalInfo?.email || '',
      phone: originalContent.personalInfo?.phone || '',
      location: originalContent.personalInfo?.location || '',
      summary: originalContent.personalInfo?.summary || '',
      education: originalContent.education || [],
      experience: originalContent.experience || [],
      skills: originalContent.skills?.flatMap(skill => 
        Array.isArray(skill.items) ? skill.items : [skill.items]
      ) || [],
      certifications: originalContent.certifications || []
    };
  };

  const calculateOptimizationScore = (data) => {
    let score = 50;
    
    if (data.name) score += 10;
    if (data.email) score += 5;
    if (data.phone) score += 5;
    if (data.location) score += 5;
    if (data.summary && data.summary.length > 50) score += 10;
    if (data.education && data.education.length > 0) score += 10;
    if (data.experience && data.experience.length > 0) score += 10;
    if (data.skills && data.skills.length > 3) score += 10;
    
    return Math.min(score, 100);
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      // Try to delete from API
      try {
        await resumeAPI.deleteResume(resumeId);
      } catch (apiError) {
        console.warn('API delete failed, removing from local storage only');
      }
      
      // Remove from localStorage
      const localResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      const filteredResumes = localResumes.filter(r => r._id !== resumeId);
      localStorage.setItem('userResumes', JSON.stringify(filteredResumes));
      
      // Update state
      setResumes(resumes.filter(r => r._id !== resumeId));
      
      toast.success('Resume deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resume');
    }
  };

  const handleOptimizeResume = async (resumeId) => {
    const jobDescription = prompt('Enter a job description to optimize for:');
    if (!jobDescription) return;
    
    try {
      toast.loading('Optimizing resume...');
      const response = await resumeAPI.optimizeResume(resumeId, jobDescription);
      
      const optimizedResume = response.data.data;
      
      // Update the resume in state
      setResumes(resumes.map(r => 
        r._id === resumeId ? {
          ...r,
          optimizationScore: optimizedResume.score || 0,
          optimizedContent: true,
          aiSuggestions: optimizedResume.suggestions || [],
          keywords: optimizedResume.keywords || []
        } : r
      ));
      
      toast.success('Resume optimized successfully!');
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Failed to optimize resume');
    }
  };

  const stats = [
    {
      label: 'Total Resumes',
      value: resumes.length,
      icon: <FileText className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Avg Score',
      value: resumes.length > 0 
        ? Math.round(resumes.reduce((acc, r) => acc + (r.optimizationScore || 0), 0) / resumes.length)
        : 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Optimized',
      value: resumes.filter(r => r.optimizedContent).length,
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Skills Found',
      value: resumes.reduce((acc, r) => 
        acc + (r.parsedData?.skills?.length || 0), 0),
      icon: <Award className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const ResumeDetailsCard = ({ resume }) => {
    if (!resume.parsedData && !resume.originalContent) return null;

    const data = resume.parsedData || extractResumeData(resume.originalContent);
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="bg-gray-50 rounded-xl p-6 mt-4"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
          Resume Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.name && (
            <div>
              <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Personal Information
              </h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-600 min-w-24">Name:</span>
                  <span className="font-medium">{data.name}</span>
                </div>
                {data.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{data.phone}</span>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{data.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {data.summary && (
            <div>
              <h5 className="font-medium text-gray-700 mb-3">Summary</h5>
              <p className="text-gray-600 text-sm">{data.summary}</p>
            </div>
          )}

          {data.education?.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
              </h5>
              <div className="space-y-3">
                {data.education.slice(0, 2).map((edu, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg">
                    <div className="font-medium">{edu.degree || edu.field_of_study}</div>
                    <div className="text-sm text-gray-600">{edu.institution || edu.school}</div>
                    <div className="text-sm text-gray-500">
                      {edu.year && `Graduated: ${edu.year}`}
                      {edu.period && `Period: ${edu.period}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.experience?.length > 0 && (
            <div className="md:col-span-2">
              <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Experience
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.experience.slice(0, 3).map((exp, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg">
                    <div className="font-medium">{exp.job_title || exp.position || exp.title}</div>
                    <div className="text-sm text-gray-600">{exp.company || exp.employer}</div>
                    <div className="text-sm text-gray-500">
                      {exp.duration || (exp.start_date && exp.end_date ? 
                        `${exp.start_date} - ${exp.end_date}` : '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.skills?.length > 0 && (
            <div className="md:col-span-2">
              <h5 className="font-medium text-gray-700 mb-3">Skills</h5>
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, 10).map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {typeof skill === 'string' ? skill : skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your resumes and view extracted details
          </p>
        </div>

        {showUpload && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Upload Resume</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <input
                type="file"
                id="resume-upload"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.rtf"
                className="hidden"
              />
              
              {uploadFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{uploadFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setUploadFile(null)}
                      className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload Resume'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag & drop your resume file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, DOC, DOCX, TXT, RTF
                  </p>
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Select File
                  </label>
                </>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </button>
              <Link
                to="/builder"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Resume
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No resumes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first resume or upload an existing one
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowUpload(true)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume
                </button>
                <Link
                  to="/builder"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {resumes.map((resume, index) => (
                <div key={resume._id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {resume.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Updated {new Date(resume.updatedAt).toLocaleDateString()}
                              {resume.optimizedContent && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  ✓ Optimized
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {resume.optimizationScore > 0 && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {resume.optimizationScore}
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          {!resume.optimizedContent && (
                            <button
                              onClick={() => handleOptimizeResume(resume._id)}
                              className="p-2 text-purple-600 hover:text-purple-700"
                              title="Optimize with AI"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            to={`/resume/${resume._id}/edit`}
                            state={{ resumeData: resume }}
                            className="p-2 text-gray-600 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-2 text-gray-600 hover:text-red-600"
                            title="Delete"
                            onClick={() => handleDeleteResume(resume._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <ResumeDetailsCard resume={resume} />
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/optimize"
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Optimizer</h4>
              <p className="text-gray-600">Optimize your resume for specific job descriptions</p>
            </Link>
            
            <Link
              to="/builder"
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Resume Builder</h4>
              <p className="text-gray-600">Create a new resume from scratch</p>
            </Link>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h4>
              <p className="text-gray-600">View resume performance and insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;