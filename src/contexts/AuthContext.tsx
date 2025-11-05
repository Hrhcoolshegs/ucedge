import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('uc-edge-auth') === 'true';
  });
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const email = localStorage.getItem('uc-edge-user');
    return email ? { email } : null;
  });

  const login = async (email: string, password: string) => {
    // Mock authentication - accepts any email/password
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(true);
        setUser({ email });
        localStorage.setItem('uc-edge-auth', 'true');
        localStorage.setItem('uc-edge-user', email);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('uc-edge-auth');
    localStorage.removeItem('uc-edge-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
