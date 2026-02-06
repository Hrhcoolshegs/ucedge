import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PLATFORM_USERS } from '@/types/user';
import { ROLE_DEFINITIONS } from '@/types/rbac';
import { Shield, BarChart3, Megaphone, ArrowRight } from 'lucide-react';
import ucHero from '@/assets/uc-hero.png';

const ROLE_ICONS: Record<string, typeof Shield> = {
  admin: Shield,
  campaign_manager: Megaphone,
  analyst: BarChart3,
};

const ROLE_COLORS: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  admin: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20 hover:border-emerald-500/50',
    text: 'text-emerald-600',
    accent: 'bg-emerald-500',
  },
  campaign_manager: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20 hover:border-amber-500/50',
    text: 'text-amber-600',
    accent: 'bg-amber-500',
  },
  analyst: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20 hover:border-sky-500/50',
    text: 'text-sky-600',
    accent: 'bg-sky-500',
  },
};

export const Login = () => {
  const { loginAsUser } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (userId: string) => {
    loginAsUser(userId);
    navigate('/overview');
  };

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
                      onClick={() => handleSelect(u.id)}
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
