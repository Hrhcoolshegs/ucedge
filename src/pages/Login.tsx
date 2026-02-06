import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, ShieldCheck, ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { DEMO_USERS } from '@/types/user';
import { cn } from '@/lib/utils';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  campaign_manager: 'Campaign Manager',
  analyst: 'Data Analyst',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'from-red-500 to-red-600',
  campaign_manager: 'from-amber-500 to-amber-600',
  analyst: 'from-sky-500 to-sky-600',
};

const ROLE_RING: Record<string, string> = {
  admin: 'ring-red-500/40',
  campaign_manager: 'ring-amber-500/40',
  analyst: 'ring-sky-500/40',
};

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { login, verifyOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUserSelect = (userEmail: string) => {
    setSelectedUser(userEmail);
    setEmail(userEmail);
    setPassword('optimusaidemo1234');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
      } else if (result.requiresOTP) {
        setShowOTP(true);
      } else {
        navigate('/overview');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const result = await verifyOTP(otp);
      if (result.success) {
        navigate('/overview');
      } else {
        setError(result.error || 'Invalid OTP code');
        setOtp('');
      }
    } catch {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDemoUser = DEMO_USERS.find((u) => u.email === selectedUser);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Animated mesh gradient background */}
      <div className="login-bg-mesh" />
      <div className="login-bg-grid" />

      {/* Floating orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Prototype badge */}
      <div className={cn(
        'absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full',
        'bg-white/5 backdrop-blur-md border border-white/10 text-white/60 text-xs tracking-widest uppercase',
        'transition-all duration-700',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      )}>
        Prototype Demo
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className={cn(
          'w-full max-w-md transition-all duration-700',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25 mb-4 login-float">
              <span className="text-white font-bold text-2xl">UC</span>
            </div>
            <h1 className="text-2xl font-bold text-white">UC-Edge</h1>
            <p className="text-white/40 text-sm mt-1">Financial Services Intelligence Platform</p>
          </div>

          {/* Glass card */}
          <div className="login-glass rounded-2xl p-6 sm:p-8">
            {!showOTP ? (
              <div className={cn(
                'transition-all duration-500',
                showOTP ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              )}>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Sign in to your account</h2>
                  <p className="text-white/40 text-sm mt-1">Choose a profile or enter credentials</p>
                </div>

                {/* User selector cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {DEMO_USERS.map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => handleUserSelect(u.email)}
                      className={cn(
                        'group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300',
                        'bg-white/[0.03] border hover:bg-white/[0.06]',
                        selectedUser === u.email
                          ? `border-white/20 ring-2 ${ROLE_RING[u.role]} bg-white/[0.06]`
                          : 'border-white/[0.06] hover:border-white/10'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white',
                        'bg-gradient-to-br transition-all duration-300',
                        ROLE_COLORS[u.role],
                        selectedUser === u.email ? 'scale-110 shadow-lg' : 'group-hover:scale-105'
                      )}>
                        {u.avatarInitials}
                      </div>
                      <div className="text-center min-w-0 w-full">
                        <p className="text-xs font-medium text-white/80 truncate">{u.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-white/30 truncate">{ROLE_LABELS[u.role]}</p>
                      </div>
                      {selectedUser === u.email && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0a0f] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.06]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 text-white/30 bg-[#12121a]">or enter manually</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-medium text-white/50 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (selectedUser && e.target.value !== selectedUser) setSelectedUser(null);
                        }}
                        placeholder="your.email@unitedcapital.com"
                        required
                        className="h-11 pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-xs font-medium text-white/50 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-11 pl-10 pr-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={cn(
                      'w-full h-11 font-medium text-sm transition-all duration-300 mt-2',
                      'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
                      'shadow-lg shadow-red-500/20 hover:shadow-red-500/30',
                      loading && 'opacity-80'
                    )}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </form>

                {selectedDemoUser && (
                  <p className="text-center text-[11px] text-white/20 mt-4">
                    Signing in as {selectedDemoUser.name} ({ROLE_LABELS[selectedDemoUser.role]})
                  </p>
                )}
              </div>
            ) : (
              <div className="login-otp-enter">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 mb-4">
                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Two-factor authentication</h2>
                  <p className="text-white/40 text-sm mt-1">
                    Enter the 6-digit code to verify your identity
                  </p>
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-14 w-12 text-lg font-mono border-white/[0.08] bg-white/[0.04] text-white rounded-lg focus:border-white/20 focus:ring-1 focus:ring-white/10"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Demo verification code</p>
                    <p className="text-2xl text-white/60 font-mono font-semibold tracking-[0.3em]">123456</p>
                  </div>

                  <Button
                    type="submit"
                    className={cn(
                      'w-full h-11 font-medium text-sm transition-all duration-300',
                      'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
                      'shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30',
                      loading && 'opacity-80'
                    )}
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      'Verify Identity'
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOTP(false);
                      setOtp('');
                      setError('');
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to sign in
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 space-y-1">
            <p className="text-[11px] text-white/15">
              Protected by enterprise security protocols
            </p>
            <p className="text-[11px] text-white/15">
              &copy; {new Date().getFullYear()} United Capital Plc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
