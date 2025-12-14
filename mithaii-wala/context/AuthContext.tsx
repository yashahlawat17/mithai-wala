import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import * as client from '../services/api';

// Definition of what we provide to the app
interface AuthContextState {
  profile: UserProfile | null;
  hasAccess: boolean;
  isAdmin: boolean;
  onLogin: (token: string, user: UserProfile) => void;
  onLogout: () => void;
}

const Context = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Restore session on load
    try {
      const savedUser = localStorage.getItem('mw_user');
      const savedKey = localStorage.getItem('mw_key');
      
      if (savedUser && savedKey) {
        setProfile(JSON.parse(savedUser));
        client.setAuthToken(savedKey);
      }
    } catch (err) {
      console.error("Failed to restore session");
    }
  }, []);

  const onLogin = (key: string, user: UserProfile) => {
    localStorage.setItem('mw_key', key);
    localStorage.setItem('mw_user', JSON.stringify(user));
    client.setAuthToken(key);
    setProfile(user);
  };

  const onLogout = () => {
    localStorage.removeItem('mw_key');
    localStorage.removeItem('mw_user');
    client.setAuthToken(null);
    setProfile(null);
  };

  return (
    <Context.Provider value={{ 
      profile, 
      hasAccess: !!profile, 
      isAdmin: profile?.role === 'admin',
      onLogin, 
      onLogout 
    }}>
      {children}
    </Context.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Auth context missing');
  return ctx;
};