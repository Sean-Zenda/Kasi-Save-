import { ArrowLeft, User, Phone, Shield, LogOut, Fingerprint, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface SettingsProps {
  user: {
    name?: string;
    phoneNumber: string;
    biometricEnabled?: boolean;
  };
  onBack: () => void;
  onLogout: () => void;
  onBiometricToggle: (enabled: boolean) => void;
}

export const Settings = ({ user, onBack, onLogout, onBiometricToggle }: SettingsProps) => {
  const handleBiometricChange = (enabled: boolean) => {
    if (enabled) {
      // Simulate biometric setup
      toast.success('Biometric authentication enabled');
    } else {
      toast.success('Biometric authentication disabled');
    }
    onBiometricToggle(enabled);
  };

  const handleChangePIN = () => {
    toast.info('PIN change feature coming soon');
  };

  const handleEditName = () => {
    toast.info('Name edit feature coming soon');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-medium">Settings</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Profile Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Profile</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.name || 'User Name'}</p>
                  <p className="text-sm text-muted-foreground">Display name</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleEditName}>
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{user.phoneNumber}</p>
                <p className="text-sm text-muted-foreground">Phone number</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Security</h3>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleChangePIN}
            >
              <Shield className="w-5 h-5 mr-3" />
              Change PIN
            </Button>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Biometric Login</p>
                  <p className="text-sm text-muted-foreground">
                    Use fingerprint or face ID to login
                  </p>
                </div>
              </div>
              <Switch
                checked={user.biometricEnabled || false}
                onCheckedChange={handleBiometricChange}
              />
            </div>
          </div>
        </Card>

        {/* Preferences Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about savings milestones
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Savings Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Daily reminders to save money
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">
                  Get weekly savings progress reports
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* App Info */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">About</h3>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>KasiSave v1.0.0</p>
            <p>Smart savings for everyone</p>
            <p>Made with ❤️ for South Africa</p>
          </div>
        </Card>

        {/* Support Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Support</h3>
          
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start h-auto p-3">
              <div className="text-left">
                <p className="font-medium">Help & Support</p>
                <p className="text-sm text-muted-foreground">Get help with your account</p>
              </div>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start h-auto p-3">
              <div className="text-left">
                <p className="font-medium">Terms of Service</p>
                <p className="text-sm text-muted-foreground">Read our terms and conditions</p>
              </div>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start h-auto p-3">
              <div className="text-left">
                <p className="font-medium">Privacy Policy</p>
                <p className="text-sm text-muted-foreground">How we protect your data</p>
              </div>
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Separator className="my-6" />
        
        <Button
          variant="destructive"
          onClick={onLogout}
          className="w-full justify-start"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};