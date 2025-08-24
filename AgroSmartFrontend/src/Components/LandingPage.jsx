import React, { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Text } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Cloud, 
  Monitor, 
  Wifi, 
  ArrowRight, 
  Leaf, 
  Github,
  Shield,
  Mail,
  FileText,
  Menu,
  X
} from 'lucide-react';
import '../styles/landing.css';

// 3D Animated Globe Component
function AnimatedGlobe() {
  const meshRef = useRef();
  const groupRef = useRef();

  // Animate the globe rotation
  React.useEffect(() => {
    if (meshRef.current && groupRef.current) {
      const animate = () => {
        meshRef.current.rotation.y += 0.005;
        groupRef.current.rotation.y += 0.002;
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main Globe */}
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#22c55e"
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Inner glow */}
      <Sphere args={[2.1, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.1}
        />
      </Sphere>
      
      {/* Farm Points */}
      {[...Array(12)].map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        
        return (
          <group key={i}>
            <Sphere
              args={[0.08, 8, 8]}
              position={[
                2.3 * Math.sin(phi) * Math.cos(theta),
                2.3 * Math.cos(phi),
                2.3 * Math.sin(phi) * Math.sin(theta),
              ]}
            >
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#fbbf24"
                emissiveIntensity={0.8}
              />
            </Sphere>
            
            {/* Pulsing rings around farm points */}
            <Sphere
              args={[0.15, 16, 16]}
              position={[
                2.3 * Math.sin(phi) * Math.cos(theta),
                2.3 * Math.cos(phi),
                2.3 * Math.sin(phi) * Math.sin(theta),
              ]}
            >
              <meshBasicMaterial
                color="#fbbf24"
                transparent
                opacity={0.3}
                wireframe
              />
            </Sphere>
          </group>
        );
      })}
      
      {/* Orbiting satellites */}
      {[...Array(3)].map((_, i) => (
        <Sphere
          key={`satellite-${i}`}
          args={[0.05, 8, 8]}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 3.5,
            Math.sin((i / 3) * Math.PI) * 0.5,
            Math.sin((i / 3) * Math.PI * 2) * 3.5,
          ]}
        >
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Floating Particles Component
function FloatingParticles() {
  const particlesRef = useRef();
  
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
        ],
        speed: Math.random() * 0.01 + 0.005,
      });
    }
    return temp;
  }, []);

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <Sphere
          key={i}
          args={[0.02, 4, 4]}
          position={particle.position}
        >
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.4}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Navigation Component
function LandingNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">AgroSmart</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              About
            </a>
            <Link to="/privacy-policy" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Privacy
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                About
              </a>
              <Link to="/privacy-policy" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Contact Us
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
function ThreeLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-green-600 font-medium">Loading 3D Experience...</p>
      </div>
    </div>
  );
}
function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1 
      }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Suspense fallback={<ThreeLoader />}>
        <AnimatedGlobe />
        <FloatingParticles />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(34, 197, 94, 0.2)"
      }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-green-200 transition-all duration-300"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  const features = [
    {
      icon: BarChart3,
      title: "Crop Insights",
      description: "Monitor crop growth and get AI-driven suggestions for optimal yield and health management."
    },
    {
      icon: Cloud,
      title: "Weather Forecast",
      description: "Stay ahead with real-time weather predictions and climate data for better planning."
    },
    {
      icon: Monitor,
      title: "Smart Dashboard",
      description: "Visualize farm data in one comprehensive dashboard with intuitive analytics."
    },
    {
      icon: Wifi,
      title: "IoT Sensor Data",
      description: "Track soil, water, and temperature with live sensors for precision farming."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
      {/* Navigation */}
      <LandingNavigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-16">
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-20">
          <ThreeScene />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-blue-900/10 z-10"></div>
        
        {/* Hero Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center mb-6"
          >
            <Leaf className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-blue-600 bg-clip-text text-transparent">
              AgroSmart
            </h1>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6"
          >
            Precision Farming for a Smarter Future
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Optimize crops, monitor sensors, and forecast weather – all in one dashboard.
            Transform your farming with cutting-edge technology and data-driven insights.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:shadow-xl"
              >
                Login
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-full shadow-lg border-2 border-green-600 hover:bg-green-50 transition-all duration-300 hover:shadow-xl"
              >
                Register
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 scroll-indicator">
          <div className="w-6 h-10 border-2 border-green-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-green-600 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose AgroSmart?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful features that make AgroSmart the leading platform for modern agriculture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-white"
            >
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Farms Connected</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white"
            >
              <div className="text-4xl font-bold mb-2">50M+</div>
              <div className="text-green-100">Data Points Analyzed</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white"
            >
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-green-100">Average Yield Increase</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-white"
            >
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-green-100">Countries Worldwide</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3D Visualization Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-green-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={<ThreeLoader />}>
              <group rotation={[0, 0, 0]}>
                <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
                  <MeshDistortMaterial
                    color="#4ade80"
                    attach="material"
                    distort={0.4}
                    speed={1.5}
                    roughness={0}
                  />
                </Sphere>
              </group>
              <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Experience the Future of Farming
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Our interactive platform brings your farm data to life with cutting-edge 3D visualizations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              What Our Farmers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied farmers who have transformed their operations with AgroSmart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Organic Farm Owner",
                content: "AgroSmart has revolutionized how I manage my 500-acre farm. The real-time data and AI insights have increased my yield by 30%.",
                avatar: "SJ"
              },
              {
                name: "Mike Chen",
                role: "Precision Agriculture Specialist",
                content: "The weather forecasting accuracy is incredible. I can now plan my planting and harvesting with complete confidence.",
                avatar: "MC"
              },
              {
                name: "Emma Rodriguez",
                role: "Sustainable Farming Advocate",
                content: "The IoT sensor integration is seamless. I monitor soil health and irrigation needs from anywhere, saving time and resources.",
                avatar: "ER"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Join AgroSmart today and take your farming to the next level!
            </h2>
            <p className="text-xl text-green-100 mb-10">
              Start your precision farming journey with our comprehensive platform. 
              Transform your farm with data-driven insights and smart technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center px-10 py-5 bg-white text-green-600 font-bold text-lg rounded-full shadow-2xl hover:bg-green-50 transition-all duration-300 hover:shadow-3xl"
                >
                  Register Now
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-full border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-300"
                >
                  Sign In
                </Link>
              </motion.div>
            </div>
            
            <p className="text-green-100 mt-6 text-sm">
              ✨ Free trial available • No credit card required • Setup in 5 minutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Leaf className="w-8 h-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-white">AgroSmart</span>
              </div>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                Empowering farmers worldwide with cutting-edge precision agriculture technology 
                for sustainable and profitable farming.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="https://github.com/mr-baraiya"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  title="View our code on GitHub"
                >
                  <Github className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="mailto:vvbaraiya32@gmail.com"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  title="Send us an email"
                >
                  <Mail className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-green-400 transition-colors">About</a></li>
                <li><Link to="/login" className="hover:text-green-400 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-green-400 transition-colors">Register</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="flex items-center hover:text-green-400 transition-colors">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="flex items-center hover:text-green-400 transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="flex items-center hover:text-green-400 transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2025 AgroSmart. All Rights Reserved.
            </div>
            <div className="text-gray-400 text-sm">
              Made with ❤️ for sustainable farming
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
