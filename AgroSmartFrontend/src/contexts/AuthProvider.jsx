import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth on app start
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = authService.getToken();
      const currentUser = authService.getCurrentUser();
      
      if (token && currentUser) {
        // Try to fetch fresh user data to get profile image
        try {
          const profileResponse = await userService.getUserProfile(currentUser.userId);
          const updatedUser = {
            ...currentUser,
            profileImage: profileResponse.data.profileImage || null,
            fullName: profileResponse.data.fullName || currentUser.name
          };
          
          setUser(updatedUser);
          setIsAuthenticated(true);
          authService.initializeAuth();
          
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (profileError) {
          console.warn('Could not fetch fresh profile data, using cached data:', profileError);
          // Use cached user data if profile fetch fails
          setUser(currentUser);
          setIsAuthenticated(true);
          authService.initializeAuth();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear invalid auth data
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      console.log('🔑 Login response received:', response);
      
      // First, use data from login response
      const basicUserData = {
        userId: response.userId,
        name: response.name,
        fullName: response.fullName || response.name,
        email: response.email,
        phone: response.phone,
        role: response.role,
        profileImage: response.profileImage || null
      };
      
      console.log('👤 Basic user data constructed:', basicUserData);
      
      // If login response has profileImage, use it; otherwise try to fetch complete profile
      if (response.profileImage) {
        console.log('✅ Profile image found in login response:', response.profileImage);
        setUser(basicUserData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(basicUserData));
        console.log('💾 User data saved to localStorage:', basicUserData);
        return response;
      }
      
      console.log('❌ No profile image in login response, fetching complete profile...');
      
      // Fetch complete user profile only if no profileImage in login response
      try {
        const profileResponse = await userService.getUserProfile(response.userId);
        console.log('📋 Profile fetch response:', profileResponse.data);
        
        const completeUserData = {
          ...basicUserData,
          profileImage: profileResponse.data.profileImage || null,
          fullName: profileResponse.data.fullName || response.name
        };
        
        console.log('👤 Complete user data constructed:', completeUserData);
        
        setUser(completeUserData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(completeUserData));
        console.log('💾 Complete user data saved to localStorage:', completeUserData);
        return response;
      } catch (profileError) {
        console.warn('Could not fetch complete profile, using basic data:', profileError);
        setUser(basicUserData);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshUserProfile = async () => {
    if (!user?.userId) return;
    
    try {
      const profileResponse = await userService.getUserProfile(user.userId);
      const updatedUser = {
        ...user,
        profileImage: profileResponse.data.profileImage || null,
        fullName: profileResponse.data.fullName || user.name
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      return user;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUserProfile,
    initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
