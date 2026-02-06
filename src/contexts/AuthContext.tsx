import { createContext, useContext, useState, ReactNode } from 'react';
import { PlatformUser, PLATFORM_USERS } from '@/types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: PlatformUser | null;
  loginAsUser: (userId: string) => void;
  logout: () => void;
}

function findUser(id: string): PlatformUser | undefined {
  return PLATFORM_USERS.find((u) => u.id === id);
}

function hydrateUser(stored: string | null): PlatformUser | null {
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    const user = findUser(parsed.id);
    if (user) return { ...user, lastActive: new Date() };
    return null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('uc-edge-auth') === 'true';
  });
  const [user, setUser] = useState<PlatformUser | null>(() => {
    return hydrateUser(localStorage.getItem('uc-edge-user'));
  });

  const loginAsUser = (userId: string) => {
    const platformUser = findUser(userId);
    if (!platformUser) return;

    const authUser: PlatformUser = { ...platformUser, lastActive: new Date() };
    setIsAuthenticated(true);
    setUser(authUser);
    localStorage.setItem('uc-edge-auth', 'true');
    localStorage.setItem('uc-edge-user', JSON.stringify(authUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('uc-edge-auth');
    localStorage.removeItem('uc-edge-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginAsUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
