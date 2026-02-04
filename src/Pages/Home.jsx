import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/Animations/ParticleBackground';
import { Sparkles, Zap, Shield, Rocket, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Optimization",
      description: "Get personalized suggestions using advanced AI algorithms",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Smart ATS Scanning",
      description: "Optimize for Applicant Tracking Systems automatically",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Fast Results",
      description: "Get optimized resumes in seconds, not hours",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const steps = [
    "Upload your resume",
    "Paste job description",
    "Get AI suggestions",
    "Download optimized resume"
  ];

  return (
    <div className="min-h-screen">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="text-gray-900">Resume</span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Vibe
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Transform your resume with AI-powered optimization. 
              <span className="font-semibold text-gray-900"> Get more interviews.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to={isAuthenticated ? "/optimize" : "/register"}
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
              >
                <span>Start Optimizing</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/templates"
                className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-2xl border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                View Templates
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { value: "10K+", label: "Resumes Optimized" },
                { value: "95%", label: "Success Rate" },
                { value: "5min", label: "Average Time" },
                { value: "4.9", label: "User Rating" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your resume in four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step}</h3>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-3/4 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create the perfect resume
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who landed their dream jobs with ResumeVibe
            </p>
            <Link
              to={isAuthenticated ? "/optimize" : "/register"}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-2xl hover:bg-blue-50 transition-colors"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;