import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutTemplate, 
  Award, 
  Briefcase, 
  GraduationCap,
  Eye,
  Download
} from 'lucide-react';

const Templates = () => {
  const templates = [
    {
      id: 1,
      name: 'Professional',
      category: 'Corporate',
      description: 'Clean and professional design for corporate roles',
      color: 'from-blue-500 to-cyan-500',
      icon: <Briefcase className="w-8 h-8" />
    },
    {
      id: 2,
      name: 'Creative',
      category: 'Design',
      description: 'Modern design for creative professionals',
      color: 'from-purple-500 to-pink-500',
      icon: <Award className="w-8 h-8" />
    },
    {
      id: 3,
      name: 'Academic',
      category: 'Education',
      description: 'Traditional layout for academic positions',
      color: 'from-green-500 to-emerald-500',
      icon: <GraduationCap className="w-8 h-8" />
    },
    {
      id: 4,
      name: 'Minimal',
      category: 'Tech',
      description: 'Minimalist design for tech industry',
      color: 'from-gray-500 to-gray-700',
      icon: <LayoutTemplate className="w-8 h-8" />
    },
    {
      id: 5,
      name: 'Executive',
      category: 'Leadership',
      description: 'Elegant design for executive positions',
      color: 'from-indigo-500 to-purple-500',
      icon: <Briefcase className="w-8 h-8" />
    },
    {
      id: 6,
      name: 'Modern',
      category: 'Startup',
      description: 'Contemporary design for startups',
      color: 'from-orange-500 to-red-500',
      icon: <Award className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Resume Templates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Choose from professionally designed templates and customize with AI
          </motion.p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group"
            >
              {/* Template Preview */}
              <div className={`h-48 bg-gradient-to-br ${template.color} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white">
                    {template.icon}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {template.description}
                </p>

                <div className="flex justify-between">
                  <button className="flex items-center text-blue-600 hover:text-blue-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Use Template
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Can't Find Your Perfect Template?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Let our AI create a custom template based on your industry and experience level.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
              Generate Custom Template
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Templates;