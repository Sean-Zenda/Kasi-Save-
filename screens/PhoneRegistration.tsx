import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { InputField } from '../components/InputField';
import { QuickLanguageSwitch } from '../components/LanguageSelector';
import { ThemeToggle } from '../components/ThemeToggle';
import { useLanguage } from '../components/LanguageContext';
import { toast } from 'sonner';
import { Shield, HelpCircle } from 'lucide-react';

interface PhoneRegistrationProps {
  onNext: (phone: string, isReturning?: boolean) => void;
  onReturningUser: (phone: string) => void;
  onDemoSkip: () => void;
  onAccountRecovery?: () => void;
}

export const PhoneRegistration = ({ 
  onNext, 
  onReturningUser, 
  onDemoSkip, 
  onAccountRecovery 
}: PhoneRegistrationProps) => {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isReturning, setIsReturning] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    // Remove spaces and special characters for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check if it's a valid South African number
    const saNumberRegex = /^(\+27|0)[0-9]{9}$/;
    return saNumberRegex.test(cleanPhone);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters except +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Format as +27 XX XXX XXXX
    if (cleaned.startsWith('+27')) {
      const number = cleaned.substring(3);
      if (number.length <= 2) return `+27 ${number}`;
      if (number.length <= 5) return `+27 ${number.substring(0, 2)} ${number.substring(2)}`;
      return `+27 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 9)}`;
    } else if (cleaned.startsWith('27')) {
      const number = cleaned.substring(2);
      if (number.length <= 2) return `+27 ${number}`;
      if (number.length <= 5) return `+27 ${number.substring(0, 2)} ${number.substring(2)}`;
      return `+27 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 9)}`;
    } else if (cleaned.startsWith('0')) {
      const number = cleaned.substring(1);
      if (number.length <= 2) return `+27 ${number}`;
      if (number.length <= 5) return `+27 ${number.substring(0, 2)} ${number.substring(2)}`;
      return `+27 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 9)}`;
    }
    
    return cleaned;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  };

  const handleSubmit = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error(t('error.invalid_phone'));
      return;
    }

    if (isReturning) {
      onReturningUser(phoneNumber);
    } else {
      onNext(phoneNumber);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Language Toggle */}
      <div className="flex justify-between items-center p-6">
        <div className="w-8" /> {/* Spacer */}
        <div className="flex items-center gap-2">
          <QuickLanguageSwitch />
          <ThemeToggle variant="minimal" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {/* KS Logo */}
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">KS</span>
              </div>
            </div>
            <h1 className="text-2xl font-medium mb-2">{t('registration.title')}</h1>
            <p className="text-muted-foreground">{t('registration.subtitle')}</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex mb-6 p-1 bg-muted rounded-lg">
            <Button
              variant={!isReturning ? "default" : "ghost"}
              className="flex-1 h-10"
              onClick={() => setIsReturning(false)}
            >
              {t('registration.new_user') || 'New User'}
            </Button>
            <Button
              variant={isReturning ? "default" : "ghost"}
              className="flex-1 h-10"
              onClick={() => setIsReturning(true)}
            >
              {t('registration.returning_user') || 'Returning User'}
            </Button>
          </div>

          {/* Phone Input */}
          <div className="space-y-4">
            <InputField
              label={t('registration.phone.label')}
              type="tel"
              placeholder={t('registration.phone.placeholder')}
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={17}
            />

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={!phoneNumber}
            >
              {t('common.continue')}
            </Button>
          </div>

          {/* Account Recovery Option */}
          {isReturning && onAccountRecovery && (
            <div className="mt-4">
              <Button
                variant="ghost"
                onClick={onAccountRecovery}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <Shield className="w-4 h-4 mr-2" />
                {t('registration.lost_phone') || 'Lost phone number? Recover account'}
              </Button>
            </div>
          )}

          {/* Demo Skip Button */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDemoSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              {t('demo.skip') || 'Skip for Demo'}
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                <span>{t('registration.need_help') || 'Need help?'}</span>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {t('registration.terms') || 'By continuing, you agree to our Terms of Service and Privacy Policy'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};