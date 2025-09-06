import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Lock, 
  Trophy, 
  Star, 
  Target, 
  Sprout, 
  Droplets, 
  Sun, 
  Zap,
  Users,
  TrendingUp,
  BookOpen,
  Shield,
  X,
  CheckCircle,
  Calendar,
  BarChart3
} from 'lucide-react';

const KnowledgeBadgePage = () => {
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState('all');
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    // Mock data - replace with API calls
    const mockBadges = [
      {
        id: 1,
        name: 'First Harvest',
        description: 'Complete your first successful harvest',
        icon: Sprout,
        color: 'green',
        category: 'farming',
        isEarned: true,
        earnedDate: '2025-08-15',
        criteria: 'Harvest at least 100kg of any crop',
        progress: 100,
        rarity: 'common',
        xpReward: 100
      },
      {
        id: 2,
        name: 'Water Wise',
        description: 'Optimize irrigation and save 1000L of water',
        icon: Droplets,
        color: 'blue',
        category: 'sustainability',
        isEarned: true,
        earnedDate: '2025-08-20',
        criteria: 'Reduce water usage by 20% compared to previous month',
        progress: 100,
        rarity: 'uncommon',
        xpReward: 250
      },
      {
        id: 3,
        name: 'Tech Pioneer',
        description: 'Use AI insights to increase crop yield',
        icon: Zap,
        color: 'purple',
        category: 'technology',
        isEarned: false,
        earnedDate: null,
        criteria: 'Apply 5 AI recommendations and see yield improvement',
        progress: 60,
        rarity: 'rare',
        xpReward: 500
      },
      {
        id: 4,
        name: 'Perfect Season',
        description: 'Achieve 95%+ success rate for entire growing season',
        icon: Trophy,
        color: 'yellow',
        category: 'achievement',
        isEarned: false,
        earnedDate: null,
        criteria: 'Maintain 95% crop success rate for full season',
        progress: 78,
        rarity: 'epic',
        xpReward: 1000
      },
      {
        id: 5,
        name: 'Solar Champion',
        description: 'Use renewable energy for 30 consecutive days',
        icon: Sun,
        color: 'orange',
        category: 'sustainability',
        isEarned: true,
        earnedDate: '2025-09-01',
        criteria: 'Power farm operations with 80% renewable energy',
        progress: 100,
        rarity: 'uncommon',
        xpReward: 300
      },
      {
        id: 6,
        name: 'Community Leader',
        description: 'Share knowledge with 10 other farmers',
        icon: Users,
        color: 'indigo',
        category: 'community',
        isEarned: false,
        earnedDate: null,
        criteria: 'Help 10 farmers through mentoring program',
        progress: 30,
        rarity: 'rare',
        xpReward: 750
      },
      {
        id: 7,
        name: 'Data Master',
        description: 'Track farm metrics for 100 consecutive days',
        icon: BarChart3,
        color: 'teal',
        category: 'technology',
        isEarned: false,
        earnedDate: null,
        criteria: 'Log daily farm data for 100 days straight',
        progress: 85,
        rarity: 'uncommon',
        xpReward: 400
      },
      {
        id: 8,
        name: 'Pest Detective',
        description: 'Identify and treat pest issues early 5 times',
        icon: Shield,
        color: 'red',
        category: 'farming',
        isEarned: true,
        earnedDate: '2025-08-28',
        criteria: 'Successfully prevent pest damage through early detection',
        progress: 100,
        rarity: 'common',
        xpReward: 150
      },
      {
        id: 9,
        name: 'Knowledge Seeker',
        description: 'Complete 20 learning modules',
        icon: BookOpen,
        color: 'pink',
        category: 'education',
        isEarned: false,
        earnedDate: null,
        criteria: 'Finish educational content in farming academy',
        progress: 65,
        rarity: 'uncommon',
        xpReward: 350
      },
      {
        id: 10,
        name: 'Efficiency Expert',
        description: 'Reduce operational costs by 25%',
        icon: TrendingUp,
        color: 'cyan',
        category: 'business',
        isEarned: false,
        earnedDate: null,
        criteria: 'Lower farm expenses while maintaining quality',
        progress: 40,
        rarity: 'rare',
        xpReward: 600
      }
    ];

    const mockUserProgress = {
      totalBadges: mockBadges.length,
      earnedBadges: mockBadges.filter(b => b.isEarned).length,
      totalXP: mockBadges.filter(b => b.isEarned).reduce((sum, b) => sum + b.xpReward, 0),
      currentLevel: 5,
      nextLevelXP: 2500
    };

    setBadges(mockBadges);
    setUserProgress(mockUserProgress);
  }, []);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50';
      case 'uncommon':
        return 'border-green-300 bg-green-50';
      case 'rare':
        return 'border-blue-300 bg-blue-50';
      case 'epic':
        return 'border-purple-300 bg-purple-50';
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getColorClasses = (color, isEarned) => {
    if (!isEarned) {
      return 'text-gray-400 bg-gray-100';
    }
    
    const colorMap = {
      green: 'text-green-600 bg-green-100',
      blue: 'text-blue-600 bg-blue-100',
      purple: 'text-purple-600 bg-purple-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      orange: 'text-orange-600 bg-orange-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      teal: 'text-teal-600 bg-teal-100',
      red: 'text-red-600 bg-red-100',
      pink: 'text-pink-600 bg-pink-100',
      cyan: 'text-cyan-600 bg-cyan-100'
    };
    
    return colorMap[color] || 'text-gray-600 bg-gray-100';
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === 'earned') return badge.isEarned;
    if (filter === 'locked') return !badge.isEarned;
    if (filter === 'all') return true;
    return badge.category === filter;
  });

  const categories = ['all', 'earned', 'locked', 'farming', 'sustainability', 'technology', 'community', 'education', 'business', 'achievement'];

  const BadgeModal = ({ badge, onClose }) => {
    if (!badge) return null;

    const IconComponent = badge.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{badge.name}</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getColorClasses(badge.color, badge.isEarned)}`}>
              <IconComponent className="w-12 h-12" />
            </div>
            
            {badge.isEarned && (
              <div className="absolute -mt-20 ml-16">
                <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
              </div>
            )}
            
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getRarityColor(badge.rarity)}`}>
              {badge.rarity}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{badge.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Criteria</h3>
              <p className="text-gray-600">{badge.criteria}</p>
            </div>
            
            {!badge.isEarned && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Progress</h3>
                  <span className="text-sm text-gray-600">{badge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${badge.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {badge.isEarned && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Earned on {new Date(badge.earnedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">+{badge.xpReward} XP</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-yellow-600 rounded-xl text-white">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Knowledge Badges</h1>
              <p className="text-gray-600">Earn badges by mastering farming skills</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {userProgress.earnedBadges}/{userProgress.totalBadges}
              </div>
              <div className="text-gray-600">Badges Earned</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(userProgress.earnedBadges / userProgress.totalBadges) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                Level {userProgress.currentLevel}
              </div>
              <div className="text-gray-600">Current Level</div>
              <div className="text-sm text-gray-500 mt-1">
                {userProgress.totalXP} / {userProgress.nextLevelXP} XP
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {userProgress.totalXP}
              </div>
              <div className="text-gray-600">Total XP</div>
              <div className="flex items-center justify-center mt-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-500">Experience Points</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {badges.filter(b => b.rarity === 'rare' && b.isEarned).length}
              </div>
              <div className="text-gray-600">Rare Badges</div>
              <div className="text-sm text-gray-500 mt-1">Special Achievements</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Badges' : category.replace('-', ' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Badges Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-200 ${
                    badge.isEarned ? 'hover:shadow-xl' : 'opacity-75'
                  } border-2 ${getRarityColor(badge.rarity)}`}
                  onClick={() => setSelectedBadge(badge)}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 relative ${getColorClasses(badge.color, badge.isEarned)}`}>
                      <IconComponent className="w-8 h-8" />
                      {badge.isEarned && (
                        <div className="absolute -top-1 -right-1">
                          <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                        </div>
                      )}
                      {!badge.isEarned && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-full">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className={`font-semibold mb-2 ${badge.isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </h3>
                    
                    <p className={`text-sm mb-4 ${badge.isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {badge.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </span>
                      
                      {badge.isEarned ? (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">{badge.xpReward}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          {badge.progress}% complete
                        </div>
                      )}
                    </div>
                    
                    {!badge.isEarned && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                            style={{ width: `${badge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredBadges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No badges found</h3>
            <p className="text-gray-500">Try selecting a different filter.</p>
          </motion.div>
        )}

        {/* Badge Detail Modal */}
        <AnimatePresence>
          {selectedBadge && (
            <BadgeModal 
              badge={selectedBadge} 
              onClose={() => setSelectedBadge(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KnowledgeBadgePage;
