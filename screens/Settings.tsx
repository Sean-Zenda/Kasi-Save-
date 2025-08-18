import { useState } from 'react';
import { ArrowLeft, User, Smartphone, Shield, Globe, Moon, Sun, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ThemeToggle } from '../components/ThemeToggle';
import { QuickLanguageSwitch } from '../components/LanguageSelector';
import { useLanguage } from '../components/LanguageContext';
import { useTheme } from '../components/ThemeProvider';

interface SettingsProps {
  user: {
    name?: string;
    phoneNumber: string;
    biometricEnabled?: boolean;
  };
  onBack: () => void;
  onLogout: () => void;
  onBiometricToggle: (enabled: boolean) => void;
  onRecoverySetup?: () => void;
}

export const Settings = ({ 
  user, 
  onBack, 
  onLogout, 
  onBiometricToggle,
  onRecoverySetup 
}: SettingsProps) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleBiometricChange = (enabled: boolean) => {
    onBiometricToggle(enabled);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  const getLanguageDisplay = () => {
    switch (language) {
      case 'zu': return 'isiZulu';
      case 'st': return 'Sesotho';
      default: return 'English';
    }
  };

  const getThemeDisplay = () => {
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">{t('settings.title') || 'Settings'}</h1>
            <p className="text-sm text-muted-foreground">
              {t('settings.subtitle') || 'Manage your account and preferences'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{user.name || t('settings.profile.unnamed_user') || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
            </div>
          </div>
        </Card>

        {/* Security Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">{t('settings.security.title') || 'Security'}</h2>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{t('settings.security.biometric.title') || 'Biometric Authentication'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.security.biometric.description') || 'Use fingerprint or face ID to secure your account'}
                  </p>
                </div>
              </div>
              <Switch
                checked={user.biometricEnabled || false}
                onCheckedChange={handleBiometricChange}
              />
            </div>
          </Card>

          {onRecoverySetup && (
            <Card className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-0"
                onClick={onRecoverySetup}
              >
                <div className="flex items-center gap-3 text-left">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{t('settings.security.recovery.title') || 'Account Recovery'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.security.recovery.description') || 'Set up recovery methods in case you lose your phone'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
            </Card>
          )}
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">{t('settings.preferences.title') || 'Preferences'}</h2>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{t('settings.preferences.language.title') || 'Language'}</h4>
                  <p className="text-sm text-muted-foreground">{getLanguageDisplay()}</p>
                </div>
              </div>
              <QuickLanguageSwitch />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <h4 className="font-medium">{t('settings.preferences.theme.title') || 'Theme'}</h4>
                  <p className="text-sm text-muted-foreground">{getThemeDisplay()}</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">{t('settings.preferences.notifications.title') || 'Push Notifications'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.preferences.notifications.description') || 'Get notified about savings milestones and updates'}
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>

        {/* Support Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">{t('settings.support.title') || 'Support'}</h2>
          
          <Card className="p-4">
            <Button variant="ghost" className="w-full justify-start h-auto p-0">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <h4 className="font-medium">{t('settings.support.help.title') || 'Help & Support'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.support.help.description') || 'Get help with your account and app features'}
                  </p>
                </div>
              </div>
            </Button>
          </Card>
        </div>

        <Separator />

        {/* Logout Section */}
        {!showLogoutConfirm ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {t('settings.logout') || 'Sign Out'}
          </Button>
        ) : (
          <Alert>
            <AlertDescription>
              <div className="space-y-4">
                <p>{t('settings.logout.confirm') || 'Are you sure you want to sign out?'}</p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={confirmLogout}
                    className="flex-1"
                  >
                    {t('settings.logout') || 'Sign Out'}
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>KasiSave v1.0.0</p>
          <p>{t('settings.app_info') || 'Your trusted savings companion'}</p>
        </div>
      </div>
    </div>
  );
};