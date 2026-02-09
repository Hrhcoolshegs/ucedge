import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PLATFORM_USERS } from '@/types/user';
import {
  Eye,
  TrendingUp,
  BarChart3,
  Handshake,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Shield,
} from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import bannerImage from '@/assets/ucap-corporate-brochure-1.jpg';

const WORKSPACE_CONFIG: Record<string, { icon: typeof Shield; color: string; bgColor: string; borderColor: string }> = {
  'Group Oversight': {
    icon: Eye,
    color: 'text-rose-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-200 hover:border-rose-400',
  },
  'Customer Growth': {
    icon: TrendingUp,
    color: 'text-teal-600',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-200 hover:border-teal-400',
  },
  'Analytics & Insights': {
    icon: BarChart3,
    color: 'text-sky-600',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-200 hover:border-sky-400',
  },
  'Relationship & Deals': {
    icon: Handshake,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-200 hover:border-amber-400',
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-[52%] min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white relative">
        <div className="w-full max-w-[480px] space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 bg-[#C8102E] rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg tracking-tight">UC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">UC-Edge</h1>
                <p className="text-xs text-gray-500 font-medium">United Capital Plc</p>
              </div>
            </div>
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

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Protected by United Capital enterprise security
              </p>
              <p className="text-[11px] text-gray-400">
                &copy; {new Date().getFullYear()} Optimus AI Labs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[48%] relative overflow-hidden">
        <img
          src={bannerImage}
          alt="United Capital - Africa's Foremost Financial Services Group"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-white/80 text-sm font-medium tracking-wide">
            Financial Services Intelligence Platform
          </p>
        </div>
      </div>
    </div>
  );
};

function ProfileSelector({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Welcome back</h2>
        <p className="text-gray-500 text-sm">Select your workspace to continue</p>
      </div>

      <div className="space-y-3">
        {PLATFORM_USERS.map((u) => {
          const config = WORKSPACE_CONFIG[u.workspace] ?? WORKSPACE_CONFIG['Group Oversight'];
          const Icon = config.icon;

          return (
            <button
              key={u.id}
              onClick={() => onSelect(u.id)}
              className={`w-full group flex items-center gap-4 p-4 rounded-xl border ${config.borderColor} bg-white transition-all duration-200 hover:shadow-md cursor-pointer text-left`}
            >
              <div className={`h-11 w-11 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-[15px]">{u.name}</p>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs font-medium ${config.color}`}>{u.workspace}</span>
                  <span className="text-gray-300 text-xs">--</span>
                  <span className="text-xs text-gray-400 truncate">{u.workspaceDescription}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface OtpStepProps {
  user: { name: string; email: string; avatarInitials: string; role: string; workspace: string };
  otpValue: string;
  otpError: boolean;
  verifying: boolean;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onBack: () => void;
}

function OtpStep({ user, otpValue, otpError, verifying, onOtpChange, onVerify, onBack }: OtpStepProps) {
  const config = WORKSPACE_CONFIG[user.workspace] ?? WORKSPACE_CONFIG['Group Oversight'];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Verify identity</h2>
        <p className="text-gray-500 text-sm">
          Enter the 6-digit code to continue as <span className="font-medium text-gray-900">{user.name}</span>
        </p>
      </div>

      <div className={`flex items-center gap-3.5 p-3.5 rounded-xl border ${config.borderColor.split(' ')[0]} bg-gray-50/50`}>
        <div className={`h-10 w-10 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
          <span className={`text-sm font-bold ${config.color}`}>{user.avatarInitials}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.workspace} -- {user.email}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
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
          className="w-full h-11 rounded-xl bg-[#C8102E] text-white font-semibold text-sm hover:bg-[#A00D24] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
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
          <p className="text-xs text-gray-400">
            OTP Code: <span className="font-mono font-semibold text-gray-700">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
}
