import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../Components/common/Header';
import { 
  Cloud,
  Cpu,
  Brain,
  Map,
  Calendar,
  Bell,
  GraduationCap,
  Shield,
  BarChart3,
  Leaf,
  Droplets,
  Thermometer,
  Wifi,
  AlertTriangle,
  Target,
  Award,
  Lock,
  TrendingUp,
  Globe,
  Sprout,
  Sun,
  CloudRain,
  Zap,
  Sparkles,
  Eye,
  Star,
  Mail,
  Phone,
  MapPin,
  Github,
  Users
} from 'lucide-react';

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const interactiveRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true });
  const isInteractiveInView = useInView(interactiveRef, { once: true });
  const isCtaInView = useInView(ctaRef, { once: true });

  const features = [
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Real-Time Weather Monitoring",
      description: "Live weather updates with forecasts tailored for farm locations.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "IoT Sensor Integration",
      description: "Soil moisture, temperature, humidity, and crop health sensors linked directly.",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Insights & Recommendations",
      description: "AI-driven alerts for irrigation, fertilization, and pest control.",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/20",
      iconColor: "text-pink-400"
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Farm & Field Management",
      description: "Visual dashboard to manage multiple farms, fields, and crops.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "Automated irrigation, planting, and harvesting reminders.",
      color: "from-orange-500 to-yellow-500",
      bgColor: "bg-orange-500/20",
      iconColor: "text-orange-400"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notifications & Alerts",
      description: "Critical alerts for weather risks, low soil moisture, or equipment failures.",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/20",
      iconColor: "text-red-400"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Knowledge Hub & Badges",
      description: "Learn sustainable practices and earn badges for eco-friendly actions.",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-500/20",
      iconColor: "text-teal-400"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Data & Privacy",
      description: "Role-based access, encrypted storage, and user control.",
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-500/20",
      iconColor: "text-gray-400"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights Dashboard",
      description: "Charts showing crop performance, soil health, and yield predictions.",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-500/20",
      iconColor: "text-violet-400"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainability Focus",
      description: "Track eco-points for water conservation & smart resource usage.",
      color: "from-lime-500 to-green-500",
      bgColor: "bg-lime-500/20",
      iconColor: "text-lime-400"
    }
  ];

  const interactiveElements = [
    { icon: <Cloud className="w-6 h-6" />, label: "Weather Data", delay: 0 },
    { icon: <Wifi className="w-6 h-6" />, label: "IoT Sensors", delay: 0.2 },
    { icon: <Brain className="w-6 h-6" />, label: "AI Processing", delay: 0.4 },
    { icon: <Target className="w-6 h-6" />, label: "Smart Insights", delay: 0.6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <Header />

      {/* Add top padding to account for fixed header */}
      <div className="pt-20"></div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-blue-600/90 to-purple-600/90">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 text-white/20"
          >
            <Cloud className="w-16 h-16" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-20 text-white/20"
          >
            <Sprout className="w-12 h-12" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-1/4 text-white/20"
          >
            <Sun className="w-14 h-14" />
          </motion.div>
        </div>

        <div className="relative container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Empowering Smart Farming
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                with Technology
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              All-in-one precision agriculture platform for farmers, researchers, and agri-businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/auth/register"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/weather"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg border border-white/30"
              >
                Explore Features
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section ref={featuresRef} className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Modern Agriculture
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how AgroSmart transforms traditional farming with cutting-edge technology and intelligent insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6`}
                    whileHover={{ 
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={feature.iconColor}>
                      {feature.icon}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Learn More Button */}
                  <motion.button
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
                  >
                    Learn More →
                  </motion.button>

                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Section */}
      <section ref={interactiveRef} className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInteractiveInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How AgroSmart
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Integrates Everything
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              See how our platform seamlessly connects weather data, IoT sensors, and AI insights to deliver actionable recommendations.
            </p>
          </motion.div>

          {/* Interactive Flow Diagram */}
          <div className="relative max-w-7xl mx-auto">
            {/* Main Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center relative z-10">
              {interactiveElements.map((element, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInteractiveInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: element.delay }}
                  className="text-center relative"
                >
                  {/* Connection Line - Only show on larger screens */}
                  {index < interactiveElements.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={isInteractiveInView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.8, delay: element.delay + 0.3 }}
                      className="hidden lg:block absolute top-1/2 left-full w-12 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 transform -translate-y-1/2 origin-left z-0"
                    />
                  )}

                  {/* Element */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: element.delay
                    }}
                    className="inline-flex flex-col items-center relative z-10"
                  >
                    <div className="p-6 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="text-white">
                        {element.icon}
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-lg">
                      {element.label}
                    </h3>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Central Processing Animation - Only on very large screens */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInteractiveInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden xl:block z-0"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-2 border-dashed border-green-400/30 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -360]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-3 bg-gradient-to-r from-green-500/80 to-blue-500/80 rounded-full"
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full"
          />
          <motion.div
            animate={{ 
              rotate: [360, 0],
              scale: [1.1, 1, 1.1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/20 rounded-full"
          />
        </div>

        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isCtaInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Start Your Journey with
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                AgroSmart Today!
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of farmers who are already transforming their agriculture with smart technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link
                to="/auth/register"
                className="group relative px-10 py-4 bg-white text-gray-800 rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  Get Started Free
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </Link>
              
              <Link
                to="/contact"
                className="px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-bold text-lg border-2 border-white/30 flex items-center gap-2 justify-center"
              >
                <Globe className="w-5 h-5" />
                Schedule Demo
              </Link>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-full">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-medium">Completely Free</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-full">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/20 rounded-full">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="font-medium">Proven Results</span>
              </div>
            </motion.div>
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
                <li className="flex items-center">
                  <Leaf className="w-3 h-3 text-gray-400 mr-2" />
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                </li>
                <li className="flex items-center">
                  <Sparkles className="w-3 h-3 text-gray-400 mr-2" />
                  <Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
                </li>
                <li className="flex items-center">
                  <Cloud className="w-3 h-3 text-gray-400 mr-2" />
                  <Link to="/weather" className="text-gray-400 hover:text-white transition-colors">Weather</Link>
                </li>
                <li className="flex items-center">
                  <Mail className="w-3 h-3 text-gray-400 mr-2" />
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                </li>
                <li className="flex items-center">
                  <Shield className="w-3 h-3 text-gray-400 mr-2" />
                  <Link to="/auth/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Shield className="w-3 h-3 text-gray-400 mr-2" />
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li className="flex items-center">
                  <Users className="w-3 h-3 text-gray-400 mr-2" />
                  <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                </li>
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

export default FeaturesPage;
