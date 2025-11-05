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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col">
      {/* Prototype Banner */}
      <div className="w-full bg-primary text-primary-foreground py-4 px-6 text-center border-b-4 border-primary/80">
        <p className="text-lg font-bold uppercase tracking-wide">
          ⚠️ PROTOTYPE - FOR DEMO PURPOSES ONLY
        </p>
        <p className="text-sm font-semibold mt-1">
          © {new Date().getFullYear()} Optimus AI Labs. All Rights Reserved.
        </p>
      </div>

      <div className="flex-1 w-full flex flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-card/50 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-10">
            {/* Logo & Branding */}
            <div className="space-y-4 text-center lg:text-left">
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="h-14 w-14 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-2xl">UC</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">UC-Edge</h1>
                  <p className="text-sm text-muted-foreground">United Capital Plc</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Financial Services Intelligence Platform</p>
            </div>

            {/* Login Card */}
            <div className="space-y-8">
              {!showOTP ? (
                <>
                  <div className="space-y-3">
                    <h2 className="text-4xl font-bold text-foreground tracking-tight">Welcome Back</h2>
                    <p className="text-muted-foreground text-base">Enter your credentials to access your dashboard</p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-5 py-4 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-3">
                      <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@unitedcapital.com"
                        required
                        className="h-14 text-base bg-background border-border focus:border-primary transition-all"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-3">
                      <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-14 text-base bg-background border-border focus:border-primary transition-all"
                      />
                    </div>

                    {/* Demo Credentials Info */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Demo Credentials</p>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Email:</span>{" "}
                          <span className="font-mono">demo@optimusai.ai</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Password:</span>{" "}
                          <span className="font-mono">optimusaidemo1234</span>
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all mt-8"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In to Dashboard'
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-2xl">
                      <ShieldCheck className="h-12 w-12 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold text-foreground">Two-Factor Authentication</h2>
                      <p className="text-base text-muted-foreground max-w-md mx-auto">
                        Enter the 6-digit verification code to secure your account
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-5 py-4 rounded-xl text-sm font-medium text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleOTPSubmit} className="space-y-8">
                    {/* OTP Input */}
                    <div className="flex justify-center py-6">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup className="gap-3">
                          <InputOTPSlot index={0} className="h-16 w-16 text-xl border-2 rounded-xl" />
                          <InputOTPSlot index={1} className="h-16 w-16 text-xl border-2 rounded-xl" />
                          <InputOTPSlot index={2} className="h-16 w-16 text-xl border-2 rounded-xl" />
                          <InputOTPSlot index={3} className="h-16 w-16 text-xl border-2 rounded-xl" />
                          <InputOTPSlot index={4} className="h-16 w-16 text-xl border-2 rounded-xl" />
                          <InputOTPSlot index={5} className="h-16 w-16 text-xl border-2 rounded-xl" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {/* Demo OTP Info */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center space-y-2">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Demo OTP Code</p>
                      <p className="text-3xl text-primary font-mono font-bold tracking-wider">123456</p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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
                      className="w-full text-base text-muted-foreground hover:text-foreground transition-colors font-medium mt-4"
                    >
                      ← Back to login
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-4 pt-8 border-t border-border text-center lg:text-left">
              <p className="text-xs text-muted-foreground">
                Protected by United Capital enterprise security protocols
              </p>
              <p className="text-xs text-muted-foreground">
                © 2024 United Capital Plc. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
          <div className="relative max-w-3xl w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/30 rounded-3xl blur-3xl opacity-50" />
            <img 
              src={ucHero} 
              alt="United Capital Financial Services" 
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover ring-1 ring-primary/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
