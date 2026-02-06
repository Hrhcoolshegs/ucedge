import { createContext, useContext, useState, ReactNode } from 'react';
import { PlatformUser, PLATFORM_USERS } from '@/types/user';
import { activityLogger } from '@/services/activityLogger';

const VALID_OTP = '123456';

interface AuthContextType {
  isAuthenticated: boolean;
  user: PlatformUser | null;
  pendingUser: PlatformUser | null;
  selectUser: (userId: string) => void;
  verifyOtp: (code: string) => boolean;
  cancelOtp: () => void;
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
  const [pendingUser, setPendingUser] = useState<PlatformUser | null>(null);

  const selectUser = (userId: string) => {
    const platformUser = findUser(userId);
    if (!platformUser) return;
    setPendingUser({ ...platformUser, lastActive: new Date() });
  };

  const verifyOtp = (code: string): boolean => {
    if (code !== VALID_OTP || !pendingUser) return false;

    setIsAuthenticated(true);
    setUser(pendingUser);
    localStorage.setItem('uc-edge-auth', 'true');
    localStorage.setItem('uc-edge-user', JSON.stringify(pendingUser));
    setPendingUser(null);

    activityLogger.logLogin(pendingUser.id, pendingUser.name, pendingUser.role);

    return true;
  };

  const cancelOtp = () => {
    setPendingUser(null);
  };

  const logout = () => {
    if (user) {
      activityLogger.logLogout(user.id, user.name, user.role);
    }

    setIsAuthenticated(false);
    setUser(null);
    setPendingUser(null);
    localStorage.removeItem('uc-edge-auth');
    localStorage.removeItem('uc-edge-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, pendingUser, selectUser, verifyOtp, cancelOtp, logout }}>
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
