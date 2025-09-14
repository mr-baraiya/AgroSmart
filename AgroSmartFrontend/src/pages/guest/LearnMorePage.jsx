import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Leaf, 
  Users, 
  BarChart3, 
  Shield,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Github,
  Sparkles,
  Zap,
  Eye,
  TrendingUp,
  Cloud,
  Cpu,
  Smartphone,
  Wifi,
  Database,
  CheckCircle,
  Target,
  Globe,
  Award,
  BookOpen,
  Lightbulb,
  Calendar,
  MessageSquare,
  FileText
} from 'lucide-react';
import Header from '../../Components/common/Header';

const LearnMorePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Platform capabilities
  const capabilities = [
    {
      icon: <Cpu className="w-12 h-12 text-blue-600" />,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze your farm data to provide actionable insights and predictions.",
      features: ["Crop health prediction", "Disease detection", "Yield forecasting", "Optimal planting times"]
    },
    {
      icon: <Smartphone className="w-12 h-12 text-green-600" />,
      title: "Mobile-First Design",
      description: "Access your farm data anywhere, anytime with our responsive mobile application.",
      features: ["Real-time notifications", "Offline data sync", "GPS field mapping", "Photo documentation"]
    },
    {
      icon: <Wifi className="w-12 h-12 text-purple-600" />,
      title: "IoT Integration",
      description: "Connect with modern farming equipment and sensors for comprehensive monitoring.",
      features: ["Soil moisture sensors", "Weather stations", "Drone integration", "Automated irrigation"]
    },
    {
      icon: <Database className="w-12 h-12 text-orange-600" />,
      title: "Data Management",
      description: "Secure cloud storage with advanced analytics and reporting capabilities.",
      features: ["Historical data tracking", "Custom reports", "Data export", "API integration"]
    }
  ];

  // Success metrics
  const metrics = [
    { number: "30%", label: "Average Yield Increase", icon: <TrendingUp className="w-8 h-8 text-green-600" /> },
    { number: "50%", label: "Water Usage Reduction", icon: <Cloud className="w-8 h-8 text-blue-600" /> },
    { number: "25%", label: "Cost Savings", icon: <Target className="w-8 h-8 text-purple-600" /> },
    { number: "99.9%", label: "Platform Uptime", icon: <Shield className="w-8 h-8 text-red-600" /> }
  ];

  // Process steps
  const processSteps = [
    {
      step: "01",
      title: "Setup & Configuration",
      description: "Quick onboarding process to configure your farm profile and connect your devices.",
      icon: <Smartphone className="w-10 h-10 text-blue-600" />
    },
    {
      step: "02",
      title: "Data Collection",
      description: "Our platform begins collecting data from your sensors, weather stations, and manual inputs.",
      icon: <Database className="w-10 h-10 text-green-600" />
    },
    {
      step: "03",
      title: "AI Analysis",
      description: "Advanced algorithms analyze your data to identify patterns and generate insights.",
      icon: <Cpu className="w-10 h-10 text-purple-600" />
    },
    {
      step: "04",
      title: "Actionable Insights",
      description: "Receive personalized recommendations and alerts to optimize your farming operations.",
      icon: <Lightbulb className="w-10 h-10 text-orange-600" />
    }
  ];

  // Technology stack
  const techStack = [
    { name: "Machine Learning", description: "TensorFlow & PyTorch for crop prediction models" },
    { name: "Cloud Computing", description: "AWS infrastructure for scalable data processing" },
    { name: "IoT Integration", description: "MQTT protocol for real-time sensor communication" },
    { name: "Mobile Apps", description: "React Native for cross-platform compatibility" },
    { name: "Data Analytics", description: "Advanced algorithms for pattern recognition" },
    { name: "Security", description: "End-to-end encryption and secure data storage" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Add top padding to account for fixed header */}
      <div className="pt-20"></div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn More About{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AgroSmart
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover how our cutting-edge agricultural technology platform is revolutionizing 
              farming practices worldwide with AI-powered insights and data-driven solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a 
                href="/Materials/AgroSmart_pdf.pdf"
                download="AgroSmart_Presentation.pdf"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-green-600 hover:text-green-600 transition-all duration-200"
              >
                <FileText className="w-5 h-5 mr-2" />
                Download PDF
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Platform Overview', icon: <Eye className="w-4 h-4" /> },
              { id: 'capabilities', label: 'Capabilities', icon: <Cpu className="w-4 h-4" /> },
              { id: 'process', label: 'How It Works', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'technology', label: 'Technology', icon: <Zap className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Success Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="flex justify-center mb-4">
                        {metric.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">{metric.number}</div>
                      <div className="text-gray-600">{metric.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Mission Statement */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 lg:p-12 text-white mb-16">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                      <p className="text-lg mb-6">
                        To empower farmers worldwide with intelligent technology that makes agriculture 
                        more sustainable, profitable, and efficient. We believe in the power of data-driven 
                        decisions to transform traditional farming practices.
                      </p>
                      <div className="space-y-3">
                        {['Increase crop yields', 'Reduce environmental impact', 'Optimize resource usage', 'Enable precision agriculture'].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                        <Globe className="w-16 h-16 text-white mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
                        <p className="text-green-100">
                          Supporting sustainable agriculture across 50+ countries with 10,000+ active farms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'capabilities' && (
              <motion.div
                key="capabilities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-16"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Capabilities</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover the comprehensive suite of tools and features that make AgroSmart 
                    the ultimate farming companion.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {capabilities.map((capability, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {capability.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            {capability.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {capability.description}
                          </p>
                          <ul className="space-y-2">
                            {capability.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'process' && (
              <motion.div
                key="process"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-16"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">How AgroSmart Works</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our streamlined process makes it easy to get started and see results quickly.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-green-600 to-blue-600 hidden lg:block"></div>
                  
                  <div className="space-y-12">
                    {processSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="relative flex items-start space-x-6"
                      >
                        <div className="flex-shrink-0 relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {step.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {step.title}
                              </h3>
                              <p className="text-gray-600">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'technology' && (
              <motion.div
                key="technology"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-16"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Built on cutting-edge technologies to ensure reliability, scalability, and performance.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {techStack.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.name}</h3>
                      <p className="text-gray-600 text-sm">{tech.description}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Enterprise-Grade Infrastructure</h3>
                    <p className="text-lg mb-8 max-w-3xl mx-auto">
                      Our platform is built to handle millions of data points daily with 99.9% uptime 
                      guarantee and bank-level security protocols.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                        <h4 className="font-semibold mb-2">Secure</h4>
                        <p className="text-blue-100 text-sm">End-to-end encryption</p>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                        <h4 className="font-semibold mb-2">Scalable</h4>
                        <p className="text-blue-100 text-sm">Auto-scaling infrastructure</p>
                      </div>
                      <div className="text-center">
                        <Zap className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                        <h4 className="font-semibold mb-2">Fast</h4>
                        <p className="text-blue-100 text-sm">Real-time data processing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Farm?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of farmers who are already using AgroSmart to increase yields, 
              reduce costs, and farm more sustainably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">AgroSmart</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering farmers with smart technology for sustainable agriculture.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">vvbaraiya32@gmail.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Github className="w-4 h-4 mr-2" />
                  <a 
                    href="https://github.com/mr-baraiya/AgroSmart" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors"
                  >
                    github.com/mr-baraiya/AgroSmart
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/weather" className="text-gray-400 hover:text-white transition-colors">Weather</Link></li>
                <li><Link to="/learn-more" className="text-gray-400 hover:text-white transition-colors">Learn More</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">+91 73833 59679</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">Gujarat, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 AgroSmart. All rights reserved. Empowering sustainable agriculture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMorePage;
