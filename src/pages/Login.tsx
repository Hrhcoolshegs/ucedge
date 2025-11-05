import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, ShieldCheck } from 'lucide-react';
import ucHero from '@/assets/uc-hero.png';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, verifyOTP } = useAuth();
  const navigate = useNavigate();

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
    } catch (error) {
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
    } catch (error) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          {/* Logo & Branding */}
          <div className="text-center mb-8">
            <div className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-3xl mb-3 shadow-lg">
              UC-Edge
            </div>
            <p className="text-sm text-muted-foreground font-medium">Powered by United Capital Plc</p>
            <p className="text-xs text-muted-foreground mt-1">Financial Services Intelligence Platform</p>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-2xl shadow-2xl border border-border p-8">
            {!showOTP ? (
              <>
                <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
                <p className="text-sm text-muted-foreground mb-6">Sign in to access your dashboard</p>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Demo Credentials Info */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs font-medium text-foreground mb-2">Demo Credentials:</p>
                    <p className="text-xs text-muted-foreground font-mono">demo@optimusai.ai</p>
                    <p className="text-xs text-muted-foreground font-mono">optimusaidemo1234</p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Two-Factor Authentication</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code to verify your identity
                  </p>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  {/* OTP Input */}
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="h-14 w-14 text-lg" />
                        <InputOTPSlot index={1} className="h-14 w-14 text-lg" />
                        <InputOTPSlot index={2} className="h-14 w-14 text-lg" />
                        <InputOTPSlot index={3} className="h-14 w-14 text-lg" />
                        <InputOTPSlot index={4} className="h-14 w-14 text-lg" />
                        <InputOTPSlot index={5} className="h-14 w-14 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {/* Demo OTP Info */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                    <p className="text-xs font-medium text-foreground mb-1">Demo OTP Code:</p>
                    <p className="text-lg text-primary font-mono font-bold">123456</p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOTP(false);
                      setOtp('');
                      setError('');
                    }}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to login
                  </button>
                </form>
              </>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Protected by United Capital security protocols
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            © 2024 United Capital Plc. All rights reserved.
          </p>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
            <img 
              src={ucHero} 
              alt="United Capital Financial Services" 
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
