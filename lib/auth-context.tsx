'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  masterPassword: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [masterPassword, setMasterPassword] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedPassword = sessionStorage.getItem('masterPassword');
    if (storedUser && storedPassword) {
      setUser(JSON.parse(storedUser));
      setMasterPassword(storedPassword);
    }
  }, []);

  const signup = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
    };

    users.push({ ...newUser, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    sessionStorage.setItem('masterPassword', password);

    setUser(newUser);
    setMasterPassword(password);
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const user: User = {
      id: foundUser.id,
      email: foundUser.email,
    };

    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('masterPassword', password);

    setUser(user);
    setMasterPassword(password);
  };

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('masterPassword');
    setUser(null);
    setMasterPassword(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        masterPassword,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!masterPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
