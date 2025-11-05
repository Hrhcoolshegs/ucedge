import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<{ requiresOTP: boolean; error?: string }>;
  verifyOTP: (otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEMO_EMAIL = 'demo@optimusai.ai';
const DEMO_PASSWORD = 'optimusaidemo1234';
const DEMO_OTP = '123456';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('uc-edge-auth') === 'true';
  });
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const email = localStorage.getItem('uc-edge-user');
    return email ? { email } : null;
  });
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    return new Promise<{ requiresOTP: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        // Check for demo credentials
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          setPendingEmail(email);
          resolve({ requiresOTP: true });
        } else if (email === DEMO_EMAIL || password === DEMO_PASSWORD) {
          resolve({ requiresOTP: false, error: 'Invalid credentials' });
        } else {
          // Accept any other email/password without OTP
          setIsAuthenticated(true);
          setUser({ email });
          localStorage.setItem('uc-edge-auth', 'true');
          localStorage.setItem('uc-edge-user', email);
          resolve({ requiresOTP: false });
        }
      }, 800);
    });
  };

  const verifyOTP = async (otp: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        if (otp === DEMO_OTP && pendingEmail) {
          setIsAuthenticated(true);
          setUser({ email: pendingEmail });
          localStorage.setItem('uc-edge-auth', 'true');
          localStorage.setItem('uc-edge-user', pendingEmail);
          setPendingEmail(null);
          resolve({ success: true });
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
