import { createContext, useContext, useState, ReactNode } from 'react';
import { PlatformUser, DEMO_USERS } from '@/types/user';
import { UserRole } from '@/types/rbac';

interface AuthUser extends PlatformUser {}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ requiresOTP: boolean; error?: string }>;
  verifyOTP: (otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEMO_PASSWORD = 'optimusaidemo1234';
const DEMO_OTP = '123456';
const VALID_EMAILS = DEMO_USERS.map((u) => u.email);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function findDemoUser(email: string): PlatformUser | undefined {
  return DEMO_USERS.find((u) => u.email === email);
}

function hydrateUser(stored: string | null): AuthUser | null {
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    const demo = findDemoUser(parsed.email);
    if (demo) return { ...demo, lastActive: new Date() };
    return null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('uc-edge-auth') === 'true';
  });
  const [user, setUser] = useState<AuthUser | null>(() => {
    return hydrateUser(localStorage.getItem('uc-edge-user'));
  });
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    return new Promise<{ requiresOTP: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        const isValidEmail = VALID_EMAILS.includes(email);
        const isValidPassword = password === DEMO_PASSWORD;

        if (isValidEmail && isValidPassword) {
          setPendingEmail(email);
          resolve({ requiresOTP: true });
        } else {
          resolve({ requiresOTP: false, error: 'Invalid credentials' });
        }
      }, 800);
    });
  };

  const verifyOTP = async (otp: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        if (otp === DEMO_OTP && pendingEmail) {
          const demoUser = findDemoUser(pendingEmail);
          if (demoUser) {
            const authUser: AuthUser = { ...demoUser, lastActive: new Date() };
            setIsAuthenticated(true);
            setUser(authUser);
            localStorage.setItem('uc-edge-auth', 'true');
            localStorage.setItem('uc-edge-user', JSON.stringify(authUser));
            setPendingEmail(null);
            resolve({ success: true });
          } else {
            resolve({ success: false, error: 'User not found' });
          }
        } else {
          resolve({ success: false, error: 'Invalid OTP code' });
        }
      }, 800);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('uc-edge-auth');
    localStorage.removeItem('uc-edge-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, verifyOTP, logout }}>
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
