import React, { createContext, useContext, useState, useEffect } from 'react';
import { appwriteService } from '../services/appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ phone: '', address: '', fullName: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const currentUser = await appwriteService.auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Fetch user profile doc
        const userProfile = await appwriteService.profile.get(currentUser.$id);
        setProfile(userProfile);
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await appwriteService.auth.login(email, password);
      setUser(loggedUser);
      const userProfile = await appwriteService.profile.get(loggedUser.$id);
      setProfile(userProfile);
      return loggedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const createdUser = await appwriteService.auth.signup(email, password, name);
      setUser(createdUser);
      setProfile({ phone: '', address: '', fullName: name });
      return createdUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await appwriteService.auth.logout();
      setUser(null);
      setProfile({ phone: '', address: '', fullName: '' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) return;
    try {
      const updated = await appwriteService.profile.update(user.$id, profileData);
      setProfile(prev => ({ ...prev, ...updated }));
      return updated;
    } catch (err) {
      console.error('Profile update failed:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        isMock: appwriteService.isMock
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
