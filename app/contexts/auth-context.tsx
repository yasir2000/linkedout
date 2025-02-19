'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  verified: boolean;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isLoading: false,
  logout: () => {},
  login: async () => {},
  user: null
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log('Checking stored auth on mount:', {
    //   localStorage: localStorage.getItem('token'),
    //   cookie: Cookies.get('auth_token'),
    //   documentCookie: document.cookie
    // });
    
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        identity: email, 
        password 
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    setToken(data.token);
    setUser({
      id: data.record.id,
      email: data.record.email,
      verified: data.record.verified
    });
    
    localStorage.setItem('token', data.token);
    
    Cookies.set('auth_token', data.token, { 
      expires: 7,
      path: '/',
      domain: window.location.hostname,
      sameSite: 'lax',
      secure: false
    });
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isLoading, logout, login, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 