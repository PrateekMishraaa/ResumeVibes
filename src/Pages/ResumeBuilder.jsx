// src/pages/ResumeBuilder.js
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import { 
  Save,
  Eye,
  Download,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Calendar,
  Check,
  Sparkles,
  Template,
  User as UserIcon
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { formatDate } from '../utils/formatters';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [resumeData, setResumeData] = useState(null);

  const { register, control, handleSubmit, watch, formState: { errors, isDirty }, reset } = useForm({
    defaultValues: {
      title: 'My Resume',
      personalInfo: {
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
        summary: ''
      },
      experience: [
        {
          id: Date.now(),
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: []
        }
      ],
      education: [
        {
          id: Date.now(),
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
          achievements: []
        }
      ],
      skills: [
        {
          id: Date.now(),
          category: 'Technical',
          items: ['JavaScript', 'React', 'Node.js']
        }
      ],
      projects: [
        {
          id: Date.now(),
          title: '',
          description: '',
          technologies: [],
          link: '',
          startDate: '',
          endDate: ''
        }
      ],
      certifications: [],
      languages: []
    }
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience'
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects'
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: 'certifications'
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languages'
  });

  const formValues = watch();

  const templates = [
    { id: 'professional', name: 'Professional', color: 'from-blue-500 to-cyan-500', icon: <Briefcase className="w-6 h-6" /> },
    { id: 'modern', name: 'Modern', color: 'from-purple-500 to-pink-500', icon: <Sparkles className="w-6 h-6" /> },
    { id: 'creative', name: 'Creative', color: 'from-green-500 to-emerald-500', icon: <Award className="w-6 h-6" /> },
    { id: 'minimal', name: 'Minimal', color: 'from-gray-500 to-gray-700', icon: <Template className="w-6 h-6" /> },
    { id: 'academic', name: 'Academic', color: 'from-indigo-500 to-purple-500', icon: <GraduationCap className="w-6 h-6" /> },
    { id: 'executive', name: 'Executive', color: 'from-orange-500 to-red-500', icon: <Briefcase className="w-6 h-6" /> }
  ];

  const sampleData = {
    title: 'Professional Resume',
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      portfolio: 'johndoe.dev',
      summary: 'Senior Full Stack Developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and team collaboration.'
    },
    experience: [
      {
        id: 1,
        title: 'Senior Full Stack Developer',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        startDate: '2020-03-01',
        endDate: '',
        current: true,
        description: [
          'Led team of 5 developers in building a scalable microservices architecture',
          'Reduced application load time by 40% through performance optimization',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
          'Mentored 3 junior developers and conducted code reviews'
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Stanford University',
        location: 'Stanford, CA',
        startDate: '2014-09-01',
        endDate: '2018-05-30',
        gpa: '3.8',
        achievements: ['Magna Cum Laude', 'Dean\'s List']
      }
    ],
    skills: [
      {
        id: 1,
        category: 'Frontend',
        items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']
      },
      {
        id: 2,
        category: 'Backend',
        items: ['Node.js', 'Express', 'Python', 'PostgreSQL']
      }
    ],
    projects: [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'Built a full-featured e-commerce platform with real-time inventory management and payment processing.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        link: 'github.com/johndoe/ecommerce',
        startDate: '2022-01-01',
        endDate: '2022-06-30'
      }
    ]
  };

  const steps = [
    { number: 1, title: 'Template', icon: <Template className="w-5 h-5" /> },
    { number: 2, title: 'Personal Info', icon: <UserIcon className="w-5 h-5" /> },
    { number: 3, title: 'Experience', icon: <Briefcase className="w-5 h-5" /> },
    { number: 4, title: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { number: 5, title: 'Skills', icon: <Code className="w-5 h-5" /> },
    { number: 6, title: 'Projects', icon: <Globe className="w-5 h-5" /> },
    { number: 7, title: 'Preview', icon: <Eye className="w-5 h-5" /> }
  ];

  useEffect(() => {
    if (user) {
      reset({
        ...formValues,
        personalInfo: {
          ...formValues.personalInfo,
          email: user.email || '',
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || ''
        }
      });
    }
  }, [user]);

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        title: data.title,
        originalContent: {
          personalInfo: {
            name: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim(),
            email: data.personalInfo.email,
            phone: data.personalInfo.phone,
            location: data.personalInfo.location,
            linkedin: data.personalInfo.linkedin,
            github: data.personalInfo.github,
            portfolio: data.personalInfo.portfolio,
            summary: data.personalInfo.summary
          },
          experience: data.experience.map(exp => ({
            ...exp,
            description: Array.isArray(exp.description) ? exp.description : [exp.description].filter(Boolean)
          })),
          education: data.education,
          skills: data.skills.map(skill => ({
            ...skill,
            items: Array.isArray(skill.items) ? skill.items : skill.items.split(',').map(item => item.trim()).filter(Boolean)
          })),
          projects: data.projects.map(proj => ({
            ...proj,
            technologies: Array.isArray(proj.technologies) ? proj.technologies : proj.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
          })),
          certifications: data.certifications,
          languages: data.languages
        }
      };

      const response = await resumeAPI.createResume(formattedData);
      
      setResumeData(response.data.data);
      toast.success('Resume saved successfully!');
      
      reset(data);
      setStep(7);
      setPreviewMode(true);
    } catch (error) {
      console.error('Save error:', error);
      
      // Fallback to localStorage
      const newResume = {
        _id: Date.now().toString(),
        title: data.title,
        optimizationScore: calculateScore(data),
        updatedAt: new Date().toISOString(),
        optimizedContent: false,
        parsedData: {
          name: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
          email: data.personalInfo.email,
          phone: data.personalInfo.phone,
          location: data.personalInfo.location,
          summary: data.personalInfo.summary,
          education: data.education,
          experience: data.experience,
          skills: data.skills.flatMap(skill => skill.items),
          certifications: data.certifications,
          languages: data.languages
        }
      };
      
      const localResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      localResumes.unshift(newResume);
      localStorage.setItem('userResumes', JSON.stringify(localResumes));
      
      setResumeData(newResume);
      toast.success('Resume saved locally!');
      setStep(7);
      setPreviewMode(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (data) => {
    let score = 50;
    
    if (data.personalInfo.firstName && data.personalInfo.lastName) score += 10;
    if (data.personalInfo.email) score += 5;
    if (data.personalInfo.phone) score += 5;
    if (data.personalInfo.location) score += 5;
    if (data.personalInfo.summary?.length > 50) score += 10;
    if (data.experience?.length > 0) score += 10;
    if (data.education?.length > 0) score += 10;
    if (data.skills?.length > 0) score += 10;
    
    return Math.min(score, 100);
  };

  const handleLoadSample = () => {
    reset(sampleData);
    toast.success('Sample data loaded!');
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues)
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formValues.title || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume exported as PDF!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export resume');
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    toast.success(`${templates.find(t => t.id === templateId)?.name} template selected`);
  };

  const addDescription = (expIndex) => {
    const experiences = watch('experience');
    const currentDesc = experiences[expIndex]?.description || [];
    
    const updatedExperiences = experiences.map((exp, idx) => 
      idx === expIndex 
        ? { ...exp, description: [...currentDesc, ''] }
        : exp
    );
    
    reset({ ...formValues, experience: updatedExperiences });
  };

  const removeDescription = (expIndex, descIndex) => {
    const experiences = watch('experience');
    const currentDesc = experiences[expIndex]?.description || [];
    
    const updatedDesc = currentDesc.filter((_, idx) => idx !== descIndex);
    const updatedExperiences = experiences.map((exp, idx) => 
      idx === expIndex ? { ...exp, description: updatedDesc } : exp
    );
    
    reset({ ...formValues, experience: updatedExperiences });
  };

  const addSkillItem = (skillIndex) => {
    const skills = watch('skills');
    const currentItems = skills[skillIndex]?.items || [];
    
    const updatedSkills = skills.map((skill, idx) => 
      idx === skillIndex 
        ? { ...skill, items: [...currentItems, ''] }
        : skill
    );
    
    reset({ ...formValues, skills: updatedSkills });
  };

  const removeSkillItem = (skillIndex, itemIndex) => {
    const skills = watch('skills');
    const currentItems = skills[skillIndex]?.items || [];
    
    const updatedItems = currentItems.filter((_, idx) => idx !== itemIndex);
    const updatedSkills = skills.map((skill, idx) => 
      idx === skillIndex ? { ...skill, items: updatedItems } : skill
    );
    
    reset({ ...formValues, skills: updatedSkills });
  };

  const handleOptimizeWithAI = async () => {
    try {
      const jobDescription = prompt('Enter a job description to optimize for:');
      if (!jobDescription) return;
      
      toast.loading('Optimizing with AI...');
      
      const response = await aiAPI.generateResume(formValues, jobDescription);
      
      reset(response.data.data);
      toast.success('Resume optimized with AI!');
    } catch (error) {
      console.error('AI optimization error:', error);
      toast.error('Failed to optimize with AI');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Template</h2>
            <p className="text-gray-600 mb-8">Select a template that matches your style and industry</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`relative rounded-2xl p-6 text-left transition-all duration-300 ${
                    selectedTemplate === template.id
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className={`w-full h-32 ${template.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <div className="text-white">
                      {template.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">
                    {template.id === 'professional' && 'Clean and professional design for corporate roles'}
                    {template.id === 'modern' && 'Contemporary design with modern aesthetics'}
                    {template.id === 'creative' && 'Creative layout for design and marketing roles'}
                    {template.id === 'minimal' && 'Minimalist design focusing on content'}
                    {template.id === 'academic' && 'Traditional layout for academic positions'}
                    {template.id === 'executive' && 'Elegant design for leadership roles'}
                  </p>
                  
                  {selectedTemplate === template.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Start</h3>
              <p className="text-blue-700 mb-4">
                Want to see how it works? Load sample data to see a complete resume example.
              </p>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Load Sample Data
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register('personalInfo.firstName', { required: 'First name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John"
                />
                {errors.personalInfo?.firstName && (
                  <p className="mt-2 text-sm text-red-600">{errors.personalInfo.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register('personalInfo.lastName', { required: 'Last name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Doe"
                />
                {errors.personalInfo?.lastName && (
                  <p className="mt-2 text-sm text-red-600">{errors.personalInfo.lastName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    {...register('personalInfo.email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john.doe@example.com"
                  />
                </div>
                {errors.personalInfo?.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.personalInfo.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    {...register('personalInfo.phone')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
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
                    {...register('personalInfo.location')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                  <input
                    type="url"
                    {...register('personalInfo.linkedin')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Profile
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
                  <input
                    type="url"
                    {...register('personalInfo.github')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="github.com/username"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  {...register('personalInfo.portfolio')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="yourportfolio.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary *
              </label>
              <textarea
                {...register('personalInfo.summary', { required: 'Summary is required' })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Briefly describe your professional background, key achievements, and career objectives..."
              />
              {errors.personalInfo?.summary && (
                <p className="mt-2 text-sm text-red-600">{errors.personalInfo.summary.message}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Tip: Keep it concise (2-3 sentences) and focus on your most relevant achievements.
              </p>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
              <button
                type="button"
                onClick={() => appendExperience({
                  id: Date.now(),
                  title: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: []
                })}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </button>
            </div>
            
            <AnimatePresence>
              {experienceFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-8 p-6 border rounded-xl ${index > 0 ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Experience #{index + 1}
                    </h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        {...register(`experience.${index}.title`, { required: 'Job title is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Senior Developer"
                      />
                      {errors.experience?.[index]?.title && (
                        <p className="mt-2 text-sm text-red-600">{errors.experience[index].title.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company *
                      </label>
                      <input
                        {...register(`experience.${index}.company`, { required: 'Company is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tech Company Inc."
                      />
                      {errors.experience?.[index]?.company && (
                        <p className="mt-2 text-sm text-red-600">{errors.experience[index].company.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        {...register(`experience.${index}.location`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City, State"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          {...register(`experience.${index}.startDate`, { required: 'Start date is required' })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.experience?.[index]?.startDate && (
                          <p className="mt-2 text-sm text-red-600">{errors.experience[index].startDate.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            {...register(`experience.${index}.endDate`)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={watch(`experience.${index}.current`)}
                          />
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register(`experience.${index}.current`)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Current</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Responsibilities & Achievements
                      </label>
                      <button
                        type="button"
                        onClick={() => addDescription(index)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Bullet Point
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {(watch(`experience.${index}.description`) || []).map((_, descIndex) => (
                        <motion.div
                          key={descIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-start mb-3"
                        >
                          <span className="mt-2 mr-3 text-gray-500">•</span>
                          <div className="flex-1 flex items-center">
                            <textarea
                              {...register(`experience.${index}.description.${descIndex}`)}
                              rows={2}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Describe your responsibility or achievement..."
                            />
                            <button
                              type="button"
                              onClick={() => removeDescription(index, descIndex)}
                              className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {(!watch(`experience.${index}.description`) || watch(`experience.${index}.description`).length === 0) && (
                      <p className="text-sm text-gray-500 italic">
                        Add bullet points to describe your responsibilities and achievements.
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {experienceFields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No experience added yet</h3>
                <p className="text-gray-600 mb-6">Add your work experience to showcase your career journey.</p>
                <button
                  type="button"
                  onClick={() => appendExperience({
                    id: Date.now(),
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: []
                  })}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Your First Experience
                </button>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              <button
                type="button"
                onClick={() => appendEducation({
                  id: Date.now(),
                  degree: '',
                  institution: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  gpa: '',
                  achievements: []
                })}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </button>
            </div>
            
            <AnimatePresence>
              {educationFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-8 p-6 border rounded-xl ${index > 0 ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Education #{index + 1}
                    </h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degree *
                      </label>
                      <input
                        {...register(`education.${index}.degree`, { required: 'Degree is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Bachelor of Science in Computer Science"
                      />
                      {errors.education?.[index]?.degree && (
                        <p className="mt-2 text-sm text-red-600">{errors.education[index].degree.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution *
                      </label>
                      <input
                        {...register(`education.${index}.institution`, { required: 'Institution is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="University Name"
                      />
                      {errors.education?.[index]?.institution && (
                        <p className="mt-2 text-sm text-red-600">{errors.education[index].institution.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        {...register(`education.${index}.location`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City, State"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GPA
                      </label>
                      <input
                        {...register(`education.${index}.gpa`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3.8"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        {...register(`education.${index}.startDate`, { required: 'Start date is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.education?.[index]?.startDate && (
                        <p className="mt-2 text-sm text-red-600">{errors.education[index].startDate.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        {...register(`education.${index}.endDate`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
              <button
                type="button"
                onClick={() => appendSkill({
                  id: Date.now(),
                  category: '',
                  items: ['']
                })}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill Category
              </button>
            </div>
            
            <AnimatePresence>
              {skillFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-8 p-6 border rounded-xl ${index > 0 ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Skill Category #{index + 1}
                    </h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      {...register(`skills.${index}.category`, { required: 'Category name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Technical, Soft Skills, Tools"
                    />
                    {errors.skills?.[index]?.category && (
                      <p className="mt-2 text-sm text-red-600">{errors.skills[index].category.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Skills in this category
                      </label>
                      <button
                        type="button"
                        onClick={() => addSkillItem(index)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Skill
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {(watch(`skills.${index}.items`) || []).map((_, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center mb-3"
                        >
                          <input
                            {...register(`skills.${index}.items.${itemIndex}`)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., React, JavaScript, Python"
                          />
                          {(watch(`skills.${index}.items`) || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSkillItem(index, itemIndex)}
                              className="ml-3 p-3 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {(!watch(`skills.${index}.items`) || watch(`skills.${index}.items`).length === 0) && (
                      <p className="text-sm text-gray-500 italic">
                        Add skills to this category. Separate multiple skills with commas.
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <button
                type="button"
                onClick={() => appendProject({
                  id: Date.now(),
                  title: '',
                  description: '',
                  technologies: [],
                  link: '',
                  startDate: '',
                  endDate: ''
                })}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </button>
            </div>
            
            <AnimatePresence>
              {projectFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-8 p-6 border rounded-xl ${index > 0 ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Project #{index + 1}
                    </h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title *
                      </label>
                      <input
                        {...register(`projects.${index}.title`, { required: 'Project title is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="E-commerce Platform"
                      />
                      {errors.projects?.[index]?.title && (
                        <p className="mt-2 text-sm text-red-600">{errors.projects[index].title.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Link
                      </label>
                      <input
                        {...register(`projects.${index}.link`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="github.com/username/project"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        {...register(`projects.${index}.startDate`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        {...register(`projects.${index}.endDate`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register(`projects.${index}.description`, { required: 'Project description is required' })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the project, your role, technologies used, and outcomes..."
                    />
                    {errors.projects?.[index]?.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.projects[index].description.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technologies Used
                    </label>
                    <input
                      {...register(`projects.${index}.technologies`)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="React, Node.js, MongoDB, AWS (comma separated)"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Separate multiple technologies with commas
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Resume Preview</h2>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
            
            {previewMode ? (
              <div className="bg-white border rounded-xl p-8 shadow-lg">
                <div className="max-w-4xl mx-auto">
                  <div className="border-b-2 border-blue-600 pb-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {formValues.personalInfo.firstName} {formValues.personalInfo.lastName}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      {formValues.personalInfo.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {formValues.personalInfo.email}
                        </div>
                      )}
                      {formValues.personalInfo.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {formValues.personalInfo.phone}
                        </div>
                      )}
                      {formValues.personalInfo.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {formValues.personalInfo.location}
                        </div>
                      )}
                      {formValues.personalInfo.linkedin && (
                        <div className="flex items-center">
                          <Linkedin className="w-4 h-4 mr-2" />
                          {formValues.personalInfo.linkedin}
                        </div>
                      )}
                      {formValues.personalInfo.github && (
                        <div className="flex items-center">
                          <Github className="w-4 h-4 mr-2" />
                          {formValues.personalInfo.github}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {formValues.personalInfo.summary && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b">PROFESSIONAL SUMMARY</h2>
                      <p className="text-gray-700">{formValues.personalInfo.summary}</p>
                    </div>
                  )}
                  
                  {formValues.experience?.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">WORK EXPERIENCE</h2>
                      {formValues.experience.map((exp, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                              <p className="text-gray-700">{exp.company}</p>
                              {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-gray-700">
                                {formatDate(exp.startDate, 'month-year')} -{' '}
                                {exp.current ? 'Present' : formatDate(exp.endDate, 'month-year')}
                              </p>
                            </div>
                          </div>
                          {exp.description?.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {exp.description.map((desc, idx) => (
                                <li key={idx} className="text-gray-700 flex">
                                  <span className="mr-2">•</span>
                                  <span>{desc}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formValues.education?.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">EDUCATION</h2>
                      {formValues.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                              <p className="text-gray-700">{edu.institution}</p>
                              {edu.location && <p className="text-gray-600 text-sm">{edu.location}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-gray-700">
                                {formatDate(edu.startDate, 'year')} - {formatDate(edu.endDate, 'year')}
                              </p>
                              {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formValues.skills?.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">SKILLS</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formValues.skills.map((skillCategory, index) => (
                          <div key={index}>
                            <h3 className="font-semibold text-gray-800 mb-2">{skillCategory.category}</h3>
                            <div className="flex flex-wrap gap-2">
                              {skillCategory.items?.map((item, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formValues.projects?.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">PROJECTS</h2>
                      {formValues.projects.map((project, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                              {project.link && (
                                <a href={project.link} className="text-blue-600 hover:underline text-sm">
                                  {project.link}
                                </a>
                              )}
                            </div>
                            {project.startDate && (
                              <div className="text-right">
                                <p className="text-gray-700">
                                  {formatDate(project.startDate, 'month-year')} -{' '}
                                  {project.endDate ? formatDate(project.endDate, 'month-year') : 'Present'}
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 mt-2">{project.description}</p>
                          {project.technologies && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',')).map((tech, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Preview Mode</h3>
                <p className="text-gray-600 mb-6">
                  Click the Preview button to see how your resume will look with the selected template.
                </p>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Show Preview
                </button>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create a professional resume step by step. Save, export, or optimize with AI.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${step >= stepItem.number 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'}
                  `}>
                    {step > stepItem.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      stepItem.icon
                    )}
                  </div>
                  <span className={`
                    text-sm font-medium
                    ${step >= stepItem.number ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {stepItem.title}
                  </span>
                </motion.div>
                
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 bg-gray-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: step > stepItem.number ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSave)}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="My Professional Resume"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Resume
                      </>
                    )}
                  </button>

                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => reset()}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Discard Changes
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(Math.max(1, step - 1))}
                      disabled={step === 1}
                      className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(Math.min(7, step + 1))}
                      disabled={step === 7}
                      className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="w-full flex items-center justify-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Load Sample Data
                  </button>

                  <button
                    type="button"
                    onClick={handleExport}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF
                  </button>

                  <button
                    type="button"
                    onClick={handleOptimizeWithAI}
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Optimize with AI
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Completion</span>
                      <span className="text-sm font-medium text-blue-600">{Math.round((step / 7) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 7) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: 'Personal Info', completed: step >= 2 },
                      { label: 'Experience', completed: step >= 3 },
                      { label: 'Education', completed: step >= 4 },
                      { label: 'Skills', completed: step >= 5 },
                      { label: 'Projects', completed: step >= 6 }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                          {item.completed && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isDirty && <span className="text-yellow-600">• You have unsaved changes</span>}
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Start Over
            </button>
            <button
              type="button"
              onClick={handleSubmit(handleSave)}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;