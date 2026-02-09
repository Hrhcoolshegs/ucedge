import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PLATFORM_USERS } from '@/types/user';
import { ROLE_DEFINITIONS } from '@/types/rbac';
import { Shield, BarChart3, Megaphone, ArrowRight, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import bannerImage from '@/assets/image.png';

const ROLE_ICONS: Record<string, typeof Shield> = {
  admin: Shield,
  campaign_manager: Megaphone,
  analyst: BarChart3,
};

const ROLE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  admin: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20 hover:border-emerald-500/50',
    text: 'text-emerald-600',
  },
  campaign_manager: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20 hover:border-amber-500/50',
    text: 'text-amber-600',
  },
  analyst: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20 hover:border-sky-500/50',
    text: 'text-sky-600',
  },
};

export const Login = () => {
  const { pendingUser, selectUser, verifyOtp, cancelOtp } = useAuth();
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSelect = (userId: string) => {
    setOtpValue('');
    setOtpError(false);
    selectUser(userId);
  };

  const handleBack = () => {
    setOtpValue('');
    setOtpError(false);
    cancelOtp();
  };

  const handleVerify = () => {
    setOtpError(false);
    setVerifying(true);

    setTimeout(() => {
      const success = verifyOtp(otpValue);
      setVerifying(false);
      if (success) {
        navigate('/overview');
      } else {
        setOtpError(true);
        setOtpValue('');
      }
    }, 600);
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setOtpError(false);
  };

  const showOtp = !!pendingUser;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col">
      <div className="flex-1 w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-card/50 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-10">
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

            {!showOtp ? (
              <ProfileSelector onSelect={handleSelect} />
            ) : (
              <OtpStep
                user={pendingUser}
                otpValue={otpValue}
                otpError={otpError}
                verifying={verifying}
                onOtpChange={handleOtpChange}
                onVerify={handleVerify}
                onBack={handleBack}
              />
            )}

            <div className="space-y-4 pt-8 border-t border-border text-center lg:text-left">
              <p className="text-xs text-muted-foreground">
                Protected by United Capital enterprise security protocols
              </p>
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Optimus AI Labs. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={bannerImage}
              alt="United Capital Financial Services - Africa's Foremost Financial Services Group"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function ProfileSelector({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-bold text-foreground tracking-tight">Welcome</h2>
        <p className="text-muted-foreground text-base">Select your profile to continue</p>
      </div>

      <div className="space-y-4">
        {PLATFORM_USERS.map((u) => {
          const roleDef = ROLE_DEFINITIONS[u.role];
          const colors = ROLE_COLORS[u.role] ?? ROLE_COLORS.analyst;
          const Icon = ROLE_ICONS[u.role] ?? BarChart3;

          return (
            <button
              key={u.id}
              onClick={() => onSelect(u.id)}
              className={`w-full group flex items-center gap-4 p-5 rounded-xl border-2 ${colors.border} bg-card transition-all duration-200 hover:shadow-lg cursor-pointer text-left`}
            >
              <div className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-6 w-6 ${colors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground text-base">{u.name}</p>
                  <span className={`text-xs ${colors.bg} ${colors.text} px-2 py-0.5 rounded-full font-medium`}>
                    {roleDef.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{roleDef.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface OtpStepProps {
  user: { name: string; email: string; avatarInitials: string; role: string };
  otpValue: string;
  otpError: boolean;
  verifying: boolean;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onBack: () => void;
}

function OtpStep({ user, otpValue, otpError, verifying, onOtpChange, onVerify, onBack }: OtpStepProps) {
  const colors = ROLE_COLORS[user.role] ?? ROLE_COLORS.analyst;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h2 className="text-4xl font-bold text-foreground tracking-tight">Verify Identity</h2>
        <p className="text-muted-foreground text-base">
          Enter the 6-digit code to continue as <span className="font-medium text-foreground">{user.name}</span>
        </p>
      </div>

      <div className={`flex items-center gap-4 p-4 rounded-xl border ${colors.border.split(' ')[0]} bg-card`}>
        <div className={`h-11 w-11 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
          <span className={`text-sm font-bold ${colors.text}`}>{user.avatarInitials}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>Two-Factor Authentication</span>
          </div>
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={onOtpChange}
            onComplete={onVerify}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className={otpError ? 'border-destructive' : ''} />
              <InputOTPSlot index={1} className={otpError ? 'border-destructive' : ''} />
              <InputOTPSlot index={2} className={otpError ? 'border-destructive' : ''} />
              <InputOTPSlot index={3} className={otpError ? 'border-destructive' : ''} />
              <InputOTPSlot index={4} className={otpError ? 'border-destructive' : ''} />
              <InputOTPSlot index={5} className={otpError ? 'border-destructive' : ''} />
            </InputOTPGroup>
          </InputOTP>

          {otpError && (
            <p className="text-sm text-destructive font-medium">Invalid code. Please try again.</p>
          )}
        </div>

        <button
          onClick={onVerify}
          disabled={otpValue.length !== 6 || verifying}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {verifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify & Sign In'
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            OTP Code: <span className="font-mono font-semibold text-foreground">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
}
