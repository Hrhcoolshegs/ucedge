import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application preferences and configuration</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Profile Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Admin User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="admin@ucedge.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" defaultValue="+234 123 456 7890" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="africa-lagos">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="africa-lagos">Africa/Lagos</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="america-ny">America/New York</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="mt-6">Save Profile</Button>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Email notifications for new campaigns', key: 'email-campaigns' },
            { label: 'Alert me when customers are at risk', key: 'risk-alerts' },
            { label: 'Weekly performance reports', key: 'weekly-reports' },
            { label: 'Real-time churn notifications', key: 'churn-notify' },
            { label: 'Campaign completion alerts', key: 'campaign-complete' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <Label htmlFor={item.key} className="cursor-pointer">{item.label}</Label>
              <Switch id={item.key} defaultChecked />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <Label htmlFor="2fa">Two-factor authentication</Label>
            <Switch id="2fa" />
          </div>
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Data & Privacy</h2>
        </div>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Export customer data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Download reports history
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            Delete all data
          </Button>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="light">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};