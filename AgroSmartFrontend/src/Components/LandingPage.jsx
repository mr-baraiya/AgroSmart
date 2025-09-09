import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Cylinder, Sphere, OrbitControls, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { adminUserService } from '../services/adminUserService';
import { farmService } from '../services/farmService';
import { 
  Menu, 
  X, 
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
  Cloud
} from 'lucide-react';

// Custom hook for responsive canvas settings
const useResponsiveCamera = () => {
  const [cameraSettings, setCameraSettings] = useState({
    position: [8, 6, 8],
    fov: 50,
    minDistance: 5,
    maxDistance: 15,
    autoRotateSpeed: 0.3
  });

  useEffect(() => {
    const updateSettings = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      
      setCameraSettings({
        position: isMobile ? [12, 10, 12] : isTablet ? [10, 8, 10] : [8, 6, 8],
        fov: isMobile ? 70 : isTablet ? 60 : 50,
        minDistance: isMobile ? 8 : isTablet ? 6 : 5,
        maxDistance: isMobile ? 25 : isTablet ? 20 : 15,
        autoRotateSpeed: isMobile ? 0.5 : 0.3
      });
    };

    updateSettings();
    window.addEventListener('resize', updateSettings);
    return () => window.removeEventListener('resize', updateSettings);
  }, []);

  return cameraSettings;
};

// Responsive Canvas Component
const ResponsiveCanvas = ({ children }) => {
  const cameraSettings = useResponsiveCamera();
  
  return (
    <Canvas 
      camera={{ 
        position: cameraSettings.position, 
        fov: cameraSettings.fov 
      }}
      shadows
      style={{ 
        background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)' 
      }}
    >
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />
      
      {/* Farm Scene */}
      <FarmField />
      
      {/* Camera Controls */}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={cameraSettings.minDistance}
        maxDistance={cameraSettings.maxDistance}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={cameraSettings.autoRotateSpeed}
        enableZoom={true}
        enablePan={false}
        touches={{
          ONE: 2, // ROTATE
          TWO: 1 // DOLLY (zoom)
        }}
      />
      {children}
    </Canvas>
  );
};

// Enhanced 3D Farm Components with more animations
const FarmField = () => {
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const fieldRef = useRef();

  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  // Enhanced farm data with more variety
  const farmPlots = [
    { id: 1, x: -2, z: -2, crop: 'corn', health: 'healthy', moisture: 78, temp: 24, growth: 'vegetative', yield: '85%' },
    { id: 2, x: 0, z: -2, crop: 'wheat', health: 'alert', moisture: 45, temp: 28, growth: 'flowering', yield: '72%' },
    { id: 3, x: 2, z: -2, crop: 'rice', health: 'excellent', moisture: 85, temp: 22, growth: 'ripening', yield: '92%' },
    { id: 4, x: -2, z: 0, crop: 'corn', health: 'healthy', moisture: 72, temp: 25, growth: 'mature', yield: '88%' },
    { id: 5, x: 0, z: 0, crop: 'wheat', health: 'excellent', moisture: 68, temp: 23, growth: 'vegetative', yield: '95%' },
    { id: 6, x: 2, z: 0, crop: 'rice', health: 'alert', moisture: 40, temp: 30, growth: 'seedling', yield: '65%' },
    { id: 7, x: -2, z: 2, crop: 'corn', health: 'healthy', moisture: 75, temp: 24, growth: 'flowering', yield: '82%' },
    { id: 8, x: 0, z: 2, crop: 'wheat', health: 'excellent', moisture: 70, temp: 26, growth: 'ripening', yield: '90%' },
    { id: 9, x: 2, z: 2, crop: 'rice', health: 'healthy', moisture: 82, temp: 23, growth: 'mature', yield: '87%' }
  ];

  return (
    <group ref={fieldRef}>
      {/* Enhanced Ground Grid with texture-like appearance */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[8, 0.1, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>

      {/* Farm boundary markers */}
      {[-3, 3].map((x) => 
        [-3, 3].map((z) => (
          <mesh key={`marker-${x}-${z}`} position={[x, 0, z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))
      ).flat()}

      {/* Farm Plots with enhanced animations */}
      {farmPlots.map((plot, index) => (
        <motion.group
          key={plot.id}
          initial={{ scale: 0, y: -2 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.8, type: "spring" }}
        >
          <FarmPlot 
            plot={plot} 
            onSelect={setSelectedPlot}
            onTooltip={setTooltipData}
          />
        </motion.group>
      ))}

      {/* Enhanced Weather Station */}
      <motion.group
        initial={{ scale: 0, y: 5 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, type: "spring" }}
      >
        <WeatherStation position={[3.5, 0, 3.5]} />
      </motion.group>

      {/* Flying particles for atmosphere */}
      <FlyingParticles />

      {/* Enhanced Tooltip Display */}
      <AnimatePresence>
        {tooltipData && (
          <EnhancedTooltip 
            position={tooltipData.position} 
            data={tooltipData.data}
            onClose={() => setTooltipData(null)}
          />
        )}
      </AnimatePresence>
    </group>
  );
};

const FarmPlot = ({ plot, onSelect, onTooltip }) => {
  const plotRef = useRef();
  const [hovered, setHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(plot);
    onTooltip({
      position: [plot.x, 1, plot.z],
      data: plot
    });
  };

  return (
    <group position={[plot.x, 0, plot.z]}>
      {/* Plot Base */}
      <mesh 
        ref={plotRef}
        position={[0, -0.4, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.5, 0.2, 1.5]} />
        <meshStandardMaterial 
          color={hovered ? "#654321" : "#8B4513"} 
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Crops */}
      <CropDisplay crop={plot.crop} />

      {/* IoT Sensor */}
      <IoTSensor 
        position={[0.6, 0, 0.6]} 
        health={plot.health}
        onClick={handleClick}
      />
    </group>
  );
};

const CropDisplay = ({ crop }) => {
  const cropRef = useRef();
  
  useFrame((state) => {
    if (cropRef.current) {
      cropRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const getCropColor = () => {
    switch (crop) {
      case 'corn': return '#FFD700';
      case 'wheat': return '#DEB887';
      case 'rice': return '#90EE90';
      default: return '#32CD32';
    }
  };

  const getCropHeight = () => {
    switch (crop) {
      case 'corn': return 0.8;
      case 'wheat': return 0.6;
      case 'rice': return 0.4;
      default: return 0.5;
    }
  };

  return (
    <group ref={cropRef}>
      {/* Main crop stems */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 1.2,
            getCropHeight() / 2 - 0.3,
            (Math.random() - 0.5) * 1.2
          ]}
        >
          <cylinderGeometry args={[0.02, 0.03, getCropHeight(), 6]} />
          <meshStandardMaterial color={getCropColor()} />
        </mesh>
      ))}
      
      {/* Crop heads/grains */}
      {crop === 'corn' && Array.from({ length: 4 }, (_, i) => (
        <mesh 
          key={`corn-${i}`}
          position={[
            (Math.random() - 0.5) * 0.8,
            0.3,
            (Math.random() - 0.5) * 0.8
          ]}
        >
          <cylinderGeometry args={[0.06, 0.04, 0.2, 8]} />
          <meshStandardMaterial color="#FF8C00" />
        </mesh>
      ))}
    </group>
  );
};

const IoTSensor = ({ position, health, onClick }) => {
  const sensorRef = useRef();
  
  useFrame((state) => {
    if (sensorRef.current) {
      const intensity = health === 'healthy' ? 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3 : 1;
      sensorRef.current.children[1].material.emissiveIntensity = intensity;
    }
  });

  return (
    <group ref={sensorRef} position={position}>
      {/* Sensor Pole */}
      <mesh position={[0, 0.3, 0]} onClick={onClick}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Sensor Head with Status Indicator */}
      <mesh position={[0, 0.65, 0]} onClick={onClick}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial 
          color={health === 'healthy' ? '#00ff00' : '#ff0000'}
          emissive={health === 'healthy' ? '#004400' : '#440000'}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Small antenna */}
      <mesh position={[0, 0.75, 0]} onClick={onClick}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

const WeatherStation = ({ position }) => {
  const stationRef = useRef();
  
  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.children[2].rotation.y = state.clock.elapsedTime * 2; // Wind vane rotation
    }
  });

  return (
    <group ref={stationRef} position={position}>
      {/* Main pole */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      
      {/* Solar panel */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.4]} />
        <meshStandardMaterial color="#001122" />
      </mesh>
      
      {/* Wind vane */}
      <group position={[0, 1.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 6]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        <mesh position={[0.1, 0, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.08]} />
          <meshStandardMaterial color="#ff6600" />
        </mesh>
      </group>
    </group>
  );
};

const FlyingParticles = () => {
  const particlesRef = useRef();
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.children.forEach((particle, index) => {
        particle.position.y += Math.sin(state.clock.elapsedTime * 2 + index) * 0.002;
        particle.position.x += Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.001;
      });
    }
  });

  const particles = Array.from({ length: 20 }, (_, i) => (
    <mesh 
      key={i} 
      position={[
        (Math.random() - 0.5) * 12,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 12
      ]}
    >
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial 
        color={i % 4 === 0 ? "#FFD700" : i % 4 === 1 ? "#FF6347" : i % 4 === 2 ? "#32CD32" : "#87CEEB"} 
        transparent 
        opacity={0.6}
      />
    </mesh>
  ));

  return <group ref={particlesRef}>{particles}</group>;
};

const EnhancedTooltip = ({ position, data, onClose }) => {
  const tooltipRef = useRef();
  
  useFrame((state) => {
    if (tooltipRef.current) {
      tooltipRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      tooltipRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const getHealthColor = () => {
    switch (data.health) {
      case 'excellent': return '#00ff00';
      case 'healthy': return '#32cd32';
      case 'alert': return '#ff6347';
      default: return '#ffff00';
    }
  };

  return (
    <group ref={tooltipRef} position={position}>
      {/* Animated background */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.95}
          emissive="#f0f0f0"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Health status indicator */}
      <mesh position={[0.8, 0.8, 0.06]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color={getHealthColor()}
          emissive={getHealthColor()}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Floating data points */}
      <mesh position={[-0.5, 0.3, 0.06]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [totalAcres, setTotalAcres] = useState(0);
  const [isLoadingAcres, setIsLoadingAcres] = useState(true);

  // Fetch total user count and total acres
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user count
        setIsLoadingUsers(true);
        const userResponse = await adminUserService.countAllUsers();
        if (userResponse.data && userResponse.data.totalUsers !== undefined) {
          setTotalUsers(userResponse.data.totalUsers);
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      } finally {
        setIsLoadingUsers(false);
      }

      try {
        // Fetch total acres
        setIsLoadingAcres(true);
        const acresResponse = await farmService.getTotalAcres();
        if (acresResponse.data && acresResponse.data.totalAcres !== undefined) {
          setTotalAcres(acresResponse.data.totalAcres);
        }
      } catch (error) {
        console.error('Error fetching total acres:', error);
      } finally {
        setIsLoadingAcres(false);
      }
    };

    fetchStats();
  }, []);

  // Auto-cycle testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Smart Crop Management",
      description: "AI-powered crop monitoring and management system for optimal yield"
    },
    {
      icon: <Cloud className="w-8 h-8 text-sky-600" />,
      title: "Real-Time Weather",
      description: "Access live weather data and forecasts to make informed farming decisions"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Data Analytics",
      description: "Advanced analytics and insights for data-driven farming decisions"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Farm Collaboration",
      description: "Connect and collaborate with farmers, experts, and agricultural professionals"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Secure Platform",
      description: "Enterprise-grade security to protect your agricultural data and insights"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Patel",
      role: "Commercial Farmer",
      content: "AgroSmart transformed our farming operations. The crop monitoring system helped increase our yield by 30%.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Agricultural Consultant",
      content: "The analytics dashboard provides incredible insights. It's like having an agricultural expert available 24/7.",
      rating: 5
    },
    {
      name: "Amit Desai",
      role: "Cooperative Manager",
      content: "Managing multiple farms has never been easier. AgroSmart streamlined our entire operation.",
      rating: 5
    }
  ];

  // Format user count for display
  const formatUserCount = (count) => {
    if (isLoadingUsers) return "Loading...";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K+`;
    }
    return count.toString();
  };

  // Format acres count for display
  const formatAcresCount = (acres) => {
    if (isLoadingAcres) return "Loading...";
    if (acres >= 1000) {
      return `${(acres / 1000).toFixed(acres >= 10000 ? 0 : 1)}K+`;
    }
    return acres.toString();
  };

  const stats = [
    { number: formatUserCount(totalUsers), label: "Active Farmers" },
    { number: formatAcresCount(totalAcres), label: "Acres Managed" },
    { number: "30%", label: "Yield Increase" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-white transition-colors duration-500">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Leaf className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AgroSmart
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-gray-700 hover:text-green-600 transition-colors duration-200 relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors duration-200 relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link to="/weather" className="text-gray-700 hover:text-green-600 transition-colors duration-200 relative group">
                Weather
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition-colors duration-200 relative group">
                Testimonials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link to="/contact" className="text-gray-700 hover:text-green-600 transition-colors duration-200 relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/auth/login" 
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                className="text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden py-4 border-t border-gray-100"
              >
                <div className="flex flex-col space-y-4">
                  {[
                    { to: "/features", label: "Features", icon: <Sparkles className="w-4 h-4" /> },
                    { href: "#about", label: "About", icon: <Eye className="w-4 h-4" /> },
                    { to: "/weather", label: "Weather", icon: <Cloud className="w-4 h-4" /> },
                    { href: "#testimonials", label: "Testimonials", icon: <Star className="w-4 h-4" /> },
                    { to: "/contact", label: "Contact", icon: <Mail className="w-4 h-4" /> }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.href ? (
                        <a 
                          href={item.href} 
                          className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <Link 
                          to={item.to} 
                          className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link 
                      to="/auth/login" 
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-center flex items-center justify-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Zap className="w-4 h-4" />
                      <span>Get Started</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-green-200/30"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <motion.h1 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Smart Farming for
                <motion.span 
                  className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block mt-1 lg:mt-2"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Sustainable Future
                </motion.span>
              </motion.h1>

              <motion.p 
                className="text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 leading-relaxed text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Revolutionize your agricultural operations with AI-powered insights, 
                real-time monitoring, and data-driven decision making. Join thousands 
                of farmers who trust AgroSmart for better yields and sustainable farming.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-3 lg:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/auth/register"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 border-2 border-green-600 font-semibold rounded-lg transition-all duration-300 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>

              {/* Feature highlights */}
              <motion.div 
                className="mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {[
                  { icon: <TrendingUp className="w-5 h-5" />, label: "30% Yield ↑", color: "text-green-500" },
                  { icon: <Shield className="w-5 h-5" />, label: "100% Secure", color: "text-blue-500" },
                  { icon: <Users className="w-5 h-5" />, label: `${formatUserCount(totalUsers)} Farmers`, color: "text-purple-500" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className={item.color}>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-64 sm:h-80 lg:h-96 order-1 lg:order-2"
            >
              {/* Mobile: Show 3D component image */}
              <div className="block lg:hidden w-full h-full rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-200 relative">
                <img 
                  src="/mobile-farm-view.png" 
                  alt="3D Farm Component Preview"
                  className="w-full h-full object-cover"
                />
                {/* Overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent flex items-end justify-center pb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
                  >
                    <div className="text-green-600 font-semibold text-sm">3D Farm View</div>
                    <div className="text-gray-600 text-xs">Full experience on desktop</div>
                  </motion.div>
                </div>
              </div>

              {/* Desktop: Show 3D Scene */}
              <div className="hidden lg:block w-full h-full rounded-xl lg:rounded-2xl overflow-hidden shadow-xl lg:shadow-2xl ring-1 lg:ring-2 ring-gray-200">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                    <div className="text-center">
                      <motion.div 
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-green-600"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                      <div className="text-green-600 font-medium">
                        Loading 3D Farm Experience...
                      </div>
                    </div>
                  </div>
                }>
                  <ResponsiveCanvas />
                </Suspense>
                
                {/* Floating interaction hint - only on desktop */}
                <motion.div
                  className="absolute bottom-4 right-4 px-3 py-2 rounded-lg text-sm bg-white/90 text-gray-600 border border-gray-200 backdrop-blur-sm"
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👆 Click & Drag to Explore
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-1 lg:mb-2">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About AgroSmart
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                AgroSmart is a revolutionary agricultural technology platform designed to 
                empower farmers with cutting-edge tools and insights. Founded with the vision 
                of making farming more efficient, sustainable, and profitable.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Leaf className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Our Mission</h3>
                    <p className="text-gray-600">Transforming agriculture through innovative technology and data-driven solutions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Our Vision</h3>
                    <p className="text-gray-600">Creating a sustainable future where technology and agriculture work hand in hand.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Our Community</h3>
                    <p className="text-gray-600">Connecting farmers, experts, and innovators in a collaborative ecosystem.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Our Commitment</h3>
                    <p className="text-gray-600">Ensuring data security, reliability, and continuous innovation for our users.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Smart Technology</h3>
                    <p className="text-sm text-gray-600">AI-powered solutions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Data Analytics</h3>
                    <p className="text-sm text-gray-600">Actionable insights</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Community</h3>
                    <p className="text-sm text-gray-600">Connected farmers</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Security</h3>
                    <p className="text-sm text-gray-600">Protected data</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
              Powerful Features for Modern Farming
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover how AgroSmart's comprehensive suite of tools can transform 
              your agricultural operations and boost productivity.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
              What Our Farmers Say
            </h2>
            <p className="text-lg lg:text-xl text-gray-600">
              Join thousands of satisfied farmers who trust AgroSmart
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-6 lg:p-8 rounded-xl lg:rounded-2xl relative"
              >
                <Quote className="w-8 h-8 text-green-600 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join the agricultural revolution today. Start your free trial and 
              experience the power of smart farming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-all duration-300"
              >
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
                <li className="flex items-center">
                  <Leaf className="w-3 h-3 text-gray-400 mr-2" />
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                </li>
                <li className="flex items-center">
                  <Users className="w-3 h-3 text-gray-400 mr-2" />
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
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

export default LandingPage;
