import { useMemo } from 'react';
import { MetricCard } from '@/components/common/MetricCard';
import { ChartCard } from '@/components/common/ChartCard';
import { useData } from '@/contexts/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Clock, RefreshCw, LogOut, Repeat } from 'lucide-react';

export const BehaviorTab = () => {
  const { customers } = useData();

  const engagementData = useMemo(() => {
    const data = [];
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    
    for (let i = 0; i < 6; i++) {
      data.push({
        month: months[i],
        dau: 2400 + Math.floor(Math.random() * 400),
        wau: 5600 + Math.floor(Math.random() * 800),
        mau: 8900 + Math.floor(Math.random() * 1100),
        reactivated: 30 + Math.floor(Math.random() * 20)
      });
    }
    return data;
  }, []);

  const featureUsage = [
    { feature: 'Check Balance', usage: 78, users: 9711 },
    { feature: 'Transfers', usage: 45, users: 5614 },
    { feature: 'Bill Payments', usage: 32, users: 3984 },
    { feature: 'Savings Goals', usage: 28, users: 3486 },
    { feature: 'Investments', usage: 18, users: 2242 },
    { feature: 'Loans', usage: 12, users: 1494 }
  ];

  return (
    <div className="space-y-6">
      {/* Session Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Session Duration"
          value="4m 32s"
          change={2.6}
          icon={Clock}
          iconColor="text-primary"
        />
        <MetricCard
          title="Avg Sessions per User"
          value="18/month"
          change={16.7}
          icon={RefreshCw}
          iconColor="text-success"
          borderColor="border-t-success"
        />
        <MetricCard
          title="Bounce Rate"
          value="12%"
          change={-2}
          icon={LogOut}
          iconColor="text-warning"
          borderColor="border-t-warning"
        />
        <MetricCard
          title="Return Rate"
          value="68%"
          change={5}
          icon={Repeat}
          iconColor="text-secondary"
          borderColor="border-t-secondary"
        />
      </div>

      {/* Engagement Trends */}
      <ChartCard title="User Engagement Trends" subtitle="Last 6 months">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="dau" stroke="hsl(var(--primary))" strokeWidth={2} name="DAU" />
            <Line type="monotone" dataKey="wau" stroke="hsl(var(--secondary))" strokeWidth={2} name="WAU" />
            <Line type="monotone" dataKey="mau" stroke="hsl(var(--accent))" strokeWidth={2} name="MAU" />
            <Line type="monotone" dataKey="reactivated" stroke="#9333EA" strokeWidth={2} strokeDasharray="5 5" name="Reactivated" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Feature Usage */}
      <ChartCard title="Feature Usage" subtitle="Weekly active users by feature">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={featureUsage} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="feature" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))'
              }}
            />
            <Bar dataKey="usage" fill="hsl(var(--primary))" name="Usage %" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Peak Activity Heatmap */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Peak Activity Times</h3>
        <div className="grid grid-cols-8 gap-2">
          <div className="text-xs text-muted-foreground"></div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-xs text-center text-muted-foreground font-medium">{day}</div>
          ))}
          
          {['12AM', '6AM', '12PM', '6PM'].map((time, timeIdx) => (
            <>
              <div key={time} className="text-xs text-muted-foreground">{time}</div>
              {[...Array(7)].map((_, dayIdx) => {
                const intensity = timeIdx === 2 || timeIdx === 3 ? 'high' : timeIdx === 1 ? 'medium' : 'low';
                return (
                  <div
                    key={`${timeIdx}-${dayIdx}`}
                    className={`h-12 rounded ${
                      intensity === 'high' ? 'bg-primary' :
                      intensity === 'medium' ? 'bg-primary/50' :
                      'bg-primary/20'
                    }`}
                  />
                );
              })}
            </>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Peak activity: 12-2 PM, 6-8 PM • Most active: Friday
        </p>
      </div>
    </div>
  );
};