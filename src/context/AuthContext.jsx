import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import {
  registerUser,
  loginUser,
  loginDemoUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changeUserEmail,
  deleteUserAccount
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          try {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile || {
              fullName: user.displayName || 'User',
              email: user.email,
              createdAt: user.metadata?.creationTime || new Date().toISOString()
            });
          } catch (err) {
            console.error('Failed to load user profile from Firestore:', err);
            setUserProfile({
              fullName: user.displayName || 'User',
              email: user.email,
              createdAt: new Date().toISOString()
            });
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
    } else {
      // Check if demo user is stored in localStorage
      const demoUser = localStorage.getItem('spendwise_demo_user');
      if (demoUser) {
        try {
          const parsed = JSON.parse(demoUser);
          setCurrentUser(parsed);
          setUserProfile(parsed);
        } catch {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const register = async (fullName, email, password) => {
    setLoading(true);
    try {
      const user = await registerUser(fullName, email, password);
      setCurrentUser(user);
      setUserProfile({
        fullName,
        email,
        createdAt: new Date().toISOString()
      });
      return user;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile || {
        fullName: user.displayName || 'User',
        email: user.email,
        createdAt: new Date().toISOString()
      });
      return user;
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = () => {
    const user = loginDemoUser();
    setCurrentUser(user);
    setUserProfile(user);
    return user;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileName = async (newFullName) => {
    if (!currentUser) return;
    const res = await updateUserProfile(currentUser, { fullName: newFullName });
    setUserProfile((prev) => ({ ...prev, fullName: newFullName }));
    setCurrentUser((prev) => ({ ...prev, displayName: newFullName }));
    return res;
  };

  const changeEmail = async (newEmail, currentPassword) => {
    if (!currentUser) return;
    const res = await changeUserEmail(currentUser, newEmail, currentPassword);
    setUserProfile((prev) => ({ ...prev, email: newEmail }));
    setCurrentUser((prev) => ({ ...prev, email: newEmail }));
    return res;
  };

  const deleteAccount = async (currentPassword) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await deleteUserAccount(currentUser, currentPassword);
      setCurrentUser(null);
      setUserProfile(null);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    isFirebaseConfigured,
    register,
    login,
    loginDemo,
    logout,
    updateProfileName,
    changeEmail,
    deleteAccount
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
